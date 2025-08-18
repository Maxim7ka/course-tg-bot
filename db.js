const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    'course_tg_bot',
    'root',
    'root',
    {
        host: '77.223.106.53',
        port: '5432',
        dialect: 'postgres'
    }
);