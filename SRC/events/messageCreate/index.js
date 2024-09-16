import { Events } from 'discord.js';
export const event = {
    name: Events.MessageCreate,
};

export const action = async (message) => {
    if (message.author.bot) return;

    const regex = /^r(\d+)\s*(.*)/; 
    const match = message.content.match(regex);

    if (match) {
        const number = match[1]; 
        const text = match[2];
        
        const hardScusses = Math.floor(number / 2);
        const extremeScusses = Math.floor(number / 4);
        
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        if (randomNumber < number) {
            if (randomNumber == 1) {
                await message.reply(`## 啊！大成功！<@${message.author.id}>\n${text} [ ${number} ] → ${randomNumber}`);
            } 
            else if (randomNumber < 4) {
                await message.reply(`## 大成功！<@${message.author.id}>\n${text} [ ${number} ] → ${randomNumber}`);
            }
            else if (randomNumber < extremeScusses) {
                await message.reply(`### 極限成功 <@${message.author.id}>\n${text} [ ${number} ] → ${randomNumber}`);
            }
            else if (randomNumber < hardScusses) {
                await message.reply(`### 困難成功 <@${message.author.id}>\n${text} [ ${number} ] → ${randomNumber}`);
            } else {
                await message.reply(`### 通常成功 <@${message.author.id}>\n${text} [ ${number} ] → ${randomNumber}`);
            }
        } else if (randomNumber == 100) {
            await message.reply(`## 啊！大失敗！<@${message.author.id}>\n${text} [ ${number} ] → ${randomNumber}`);
        } else if (randomNumber > 96) {
            await message.reply(`## 大失敗！<@${message.author.id}>\n${text} [ ${number} ] → ${randomNumber}`);
        }else {
            await message.reply(`### 失敗 <@${message.author.id}>\n${text} [ ${number} ] → ${randomNumber}`);
        }
    }
};
