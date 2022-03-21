const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./database/connection');
const categoryController = require('./controllers/CategoryController');
const articlesController = require('./controllers/ArticlesController');
const userController = require('./controllers/UserController');

const CategoryModel = require('./models/Category');
const ArticleModel = require('./models/Article');
const UserModel = require('./models/User');

// EJS para interpretar o HTML
app.set('view engine','ejs');
// session
app.use(session({
    secret: 'c0l0c4rQu4lqu3rc0i54',
    cookie: { maxAge: 3000000 } // tempo de expiração 1s = 1000 ms
}));
//pasta de arquivos estaticos
app.use(express.static('public'));
// body-parser para aceitar dados vindo do formulário
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// conexão com banco de dados
connection.authenticate().then(() => { // se conexão feita com sucesso
    console.log('Conectado ao bando de dados.');
}).catch((error) => { // se ocorreu algum error de conexão com o banco
    console.log('Erro conexão banco: ' + error);
});

// criando rotas
app.use('/', categoryController); //acessar as rotas dentro de ./controllers/CategoryController
app.use('/', articlesController); //acessar as rotas dentro de ./controllers/ArticlesController
app.use('/', userController); 

//rota: session
app.get('/session',(req, res) => {
    req.session.name = 'Denis Buarque';
    req.session.email = 'denisprogramadorweb@gmail.com';
    req.session.user = {
        username: "Denis",
        email: 'denisbuarque@gmail.com',
        idade: 40
    }
    res.send('Session criada...');
});

app.get('/leitura', (req, res) => {
    res.send('user session: ' + req.session.name); // acessando a session
});

// rota principal
app.get('/',(req,res) => {
    ArticleModel.findAll({
        order: [['id','DESC']],
        limit: 3
    }).then(articles => {
        CategoryModel.findAll().then(categories => {
            res.render('index', { articles: articles, categories: categories}); 
        });
    });
});

app.get('/:slug', (req, res) => {
    
    var slug = req.params.slug;

    ArticleModel.findOne({
        where: { slug: slug },
        include: [{model: CategoryModel}] // relacionamento: pega a categoria do artigo
    }).then(article => {
        if(article != undefined){
            res.render('article', { article: article });
        } else {
            console.log('Erro 1');
            res.redirect('/');
        }
    }).catch(error => {
        console.log('Erro 2');
        res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;

    CategoryModel.findOne({ //pega a categoria igual slug
        where: { 
            slug: slug 
        },
        include: [{model: ArticleModel}]
    }).then( category => {

        if(category != undefined) // categoria esta definida
        {
            CategoryModel.findAll().then(categories => {
                res.render('index', { articles: category.articles, categories: categories }); 
            });

        } else { // se categoria não estiver definida
            res.redirect('/');
        }

    }).catch(error => {
        res.redirect('/');
    });
});

// inicia o servidor na porta 3000 em http://localhost:3000
app.listen(3000, () => {
    console.log('Servidor iniciado...');
});