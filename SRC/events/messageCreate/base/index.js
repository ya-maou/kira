import { Events } from 'discord.js';

export const event = {
    name: Events.MessageCreate,
};

export const action = async (message) => {
    if (message.author.bot) return;

    const keywords = ['快樂', '早安', '對吧琪菈'];

    for (const keyword of keywords) {
        if (message.content.includes(keyword)) {
            if (keyword === '快樂') {
                // 節日祝福的選項列表
                const holidayGreetings = [
                    '中秋節快樂！',
                    '聖誕節快樂！',
                    '新年快樂！',
                    '感恩節快樂！',
                    '端午節快樂！',
                    '情人節快樂！',
                    '生日快樂！',
                    '萬聖節快樂！'
                ];
                
                // 隨機選擇一個祝福
                const randomGreeting = holidayGreetings[Math.floor(Math.random() * holidayGreetings.length)];

                await message.reply(randomGreeting);
            } else if (keyword === '早安') {
                await message.reply('早安');
            } else if (keyword === '對吧琪菈') {
                await message.reply('是的沒錯。');
            }
            break;
        }
    }
};
