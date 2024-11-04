// src/commands/ping/index.js

import { SlashCommandBuilder } from 'discord.js';

export const command = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Ping command to check bot status');

export const action = async (interaction) => {
  await interaction.reply('Pong!');
};
