const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const { token } = require('./token');

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю число от 0 до 9, ты должен его отгадать');
    const randNum = Math.floor(Math.random() * 10);
    chats[chatId] = `${randNum}`;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = async () => {
    bot.setMyCommands([
        { command: '/start', description: 'Приветствие' },
        { command: '/info', description: 'Получить иноформацию о пользователе' },
        { command: '/game', description: 'Игра угадай число' }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            return bot.sendMessage(chatId, 'Добро пожаловать в бота');
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю');
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId)
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chats[chatId]}!`, againOptions);
        } else if (data > chats[chatId]) {
            return bot.sendMessage(chatId, `Загаданное число меньше ${data}`);
        } else if (data < chats[chatId]) {
            return bot.sendMessage(chatId, `Загаданное число больше ${data}`);
        }
    })
}

start();