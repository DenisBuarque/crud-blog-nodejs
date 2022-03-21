const Sequelize = require('sequelize');
const connection = require('../database/connection');
const CategoryModel = require('./Category');

const Article = connection.define('articles',{
    title: {
        type: Sequelize.STRING, // campo text pequeno
        allowNull: false // campo não pode ser nulo
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT, //campo text longo
        allowNull: false
    }
});

//relaciomaneto entre models
Article.belongsTo(CategoryModel); // um artigo pertenca a uma categoria 1:1
CategoryModel.hasMany(Article); // uma categoria tem muitos artigos 1:N

/* Cria tabela no banco de dados
   Após criado a tabela comentar ou remover a linha abaixo para não criar a tabela novamente */
//Article.sync({force: true});

// exporta o model
module.exports = Article;