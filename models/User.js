const Sequelize = require('sequelize');
const connection = require('../database/connection');

const User = connection.define('users',{
    email: {
        type: Sequelize.STRING, // campo text pequeno
        allowNull: false // campo não pode ser nulo
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

/* Cria tabela no banco de dados
   Após criado a tabela comentar ou remover a linha abaixo para não criar a tabela novamente */
//User.sync({force: true});

// exporta o model
module.exports = User;