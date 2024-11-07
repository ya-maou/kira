// src/commands/search/index.js
import { SlashCommandBuilder } from 'discord.js';
import { getMenuItemsByName } from '../../core/databaseService.js';

export const command = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Search for menu items by name')
  .addStringOption(option => 
    option.setName('name')
    .setDescription('Name of the menu item to search for')
    .setRequired(true));

export const action = async (interaction) => {
  try {
    const searchName = interaction.options.getString('name');
    const items = await getMenuItemsByName(searchName);

    if (items.length > 0) {
      const result = items.map(item => `品項：${item.name}，價錢：${item.price}`).join('\n');
      await interaction.reply(`${result}`);
    } else {
      await interaction.reply(`No items found with the name: ${searchName}`);
    }
  } catch (error) {
    console.error('Database query error:', error);
    await interaction.reply('An error occurred while querying the database.');
  }
};
