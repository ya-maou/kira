// main.js
import { Client, Events, GatewayIntentBits } from 'discord.js'
import vuelnit from '@/core/vue'
import dotenv from 'dotenv'
import {useAppStore} from '@/store/app'
import{ loadCommands, loadEvents }from '@/core/loader'
import fs from 'fs'

vuelnit()
dotenv.config()

loadCommands()

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const appStore = useAppStore()
appStore.client = client

loadEvents()

// Add a function to load voice recognition
const loadVoiceRecognition = () => {
    const voiceRecognitionPath = './src/events/voiceRecognition.js';
    if (fs.existsSync(voiceRecognitionPath)) {
        const voiceRecognition = require(voiceRecognitionPath);
        voiceRecognition(client);  // Initialize voice recognition event
    }
};

// Load voice recognition event
loadVoiceRecognition();

client.login(process.env.TOKEN)