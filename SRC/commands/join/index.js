// src/commands/join/index.js

import { SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
const { spawn } = require('child_process'); 
import path from 'path';

// Command definition
export const command = new SlashCommandBuilder()
  .setName('join')
  .setDescription('Join the voice channel and start speech recognition');

// Action to execute the command
export const action = async (interaction) => {
  const member = interaction.member;
  const channel = member.voice.channel;

  if (!channel) {
    return interaction.reply('You need to join a voice channel first!');
  }

  try {
    // Join the voice channel
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    connection.on('stateChange', (oldState, newState) => {
      //console.log(`Connection state change: ${oldState.status} => ${newState.status}`);
    });

    connection.on('ready', async () => {
      console.log('Connected to the voice channel.');
      await interaction.reply('開始進行語音辨識');

      // Path to your Python speech recognition script
      const pythonScriptPath = path.resolve(__dirname, 'speech.py');
      console.log(`Python script path: ${pythonScriptPath}`);

      // 使用 spawn 來即時讀取 Python 腳本的輸出
      const pythonProcess = spawn('python', [pythonScriptPath]);

      pythonProcess.stdout.on('data', (data) => {
          console.log(`${data}`);
          interaction.followUp(`${data.toString()}`);
      });

      pythonProcess.stderr.on('data', (data) => {
          console.error(`Python script stderr: ${data}`);
      });

      pythonProcess.on('close', (code) => {
          console.log(`Python script exited with code: ${code}`);
      });

      pythonProcess.on('error', (error) => {
          console.error(`Error executing Python script: ${error.message}`);
          interaction.followUp('Error occurred while starting speech recognition.');
      });
  });

  connection.on('error', (error) => {
      console.error('Error with the voice connection:', error);
      interaction.reply('Sorry, an error occurred while joining the voice channel.');
  });

  } catch (error) {
    console.error('Error joining the voice channel:', error);
    interaction.reply('Sorry, I could not join the voice channel.');
  }
};
