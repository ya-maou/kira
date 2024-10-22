const { SpeechClient } = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, AudioReceiveStream, EndBehaviorType } = require('@discordjs/voice');

module.exports = {
    event: {
        name: 'messageCreate',
        once: false,
    },
    action: async (message) => {
        const speechClient = new SpeechClient();

        if (message.content === '!join') {
            const channel = message.member.voice.channel;
            if (!channel) return message.reply('You need to join a voice channel first!');

            try {
                // Join the voice channel
                const connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });

                connection.on('stateChange', (oldState, newState) => {
                    console.log(`Connection state change: ${oldState.status} => ${newState.status}`);
                });

                // Check for ready connection
                connection.on('ready', () => {
                    console.log('Connected to the voice channel.');
                });

                // Error handling for voice connection
                connection.on('error', (error) => {
                    console.error('Error with the voice connection:', error);
                });

                // Set up a receiver for incoming audio
                const receiver = connection.receiver;

                const userId = message.member.user.id;
                const audioStream = receiver.subscribe(userId, {
                    end: {
                        behavior: EndBehaviorType.AfterSilence,
                        duration: 1000,
                    },
                    mode: 'pcm',
                });

                // Define where to save the audio file
                const filePath = path.join(__dirname, 'user_audio.pcm');
                const writeStream = fs.createWriteStream(filePath);
                audioStream.pipe(writeStream);

                audioStream.on('error', (error) => {
                    console.error('Audio stream error:', error);
                });

                writeStream.on('finish', async () => {
                    try {
                        console.log('Audio received and saved. Processing...');

                        // Read and encode the audio for Google Speech-to-Text
                        const audioBytes = fs.readFileSync(filePath).toString('base64');
                        const audio = { content: audioBytes };
                        const config = { encoding: 'LINEAR16', sampleRateHertz: 16000, languageCode: 'en-US' };
                        const request = { audio, config };

                        // Send the audio to Google Speech-to-Text for transcription
                        const [response] = await speechClient.recognize(request);
                        const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');

                        // Send the transcription back to the channel
                        message.channel.send(`Transcription: ${transcription}`);
                    } catch (error) {
                        console.error('Error processing audio:', error);
                        message.channel.send('Sorry, something went wrong while processing the audio.');
                    }
                });
            } catch (error) {
                console.error('Error joining the voice channel:', error);
                message.channel.send('Sorry, I could not join the voice channel.');
            }
        }
    },
};
