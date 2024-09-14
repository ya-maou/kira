import { SlashCommandBuilder } from 'discord.js';

export const command = new SlashCommandBuilder()
  .setName('remind')
  .setDescription('Set a reminder')
  .addStringOption(option =>
    option.setName('time')
    .setDescription('Time in minute(s) to wait before reminding')
    .setRequired(true))
  .addStringOption(option =>
    option.setName('message')
    .setDescription('The reminder message')
    .setRequired(true));

export const action = async (ctx) => {
  const time = ctx.options.getString('time');
  const message = ctx.options.getString('message');

  await ctx.reply(`I will remind you in ${time} minute(s).`);
  setTimeout(() => {
    ctx.followUp(`⏰ Reminder: ${message}`);
  }, parseInt(time)  * 60 * 1000);
};
