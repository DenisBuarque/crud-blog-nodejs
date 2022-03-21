const express = require('express');
const router = express.Router();
const ArticleModel = require('../models/Article');
const CategoryModel = require('../models/Category');
const adminAuthMiddleware = require('../middlewares/adminAuth');
const slugify = require('slugify');

// rota: lista de registros
router.get('/admin/articles', adminAuthMiddleware, (req, res) => {

    ArticleModel.findAll({
        include: [{model: CategoryModel}] // relacionamento: pega os dados da categoria do artigo
    }).then( articles => {
        res.render('admin/articles', { articles: articles });
    });

});

// rota: formulario nogo registro
router.get('/admin/article/new', adminAuthMiddleware, (req, res) => {
    CategoryModel.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories});
    });
});

// rotas: salvar dados do registros
router.post('/admin/article/save', adminAuthMiddleware, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    ArticleModel.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles');
    });
});

//rota: editar dados do registro
router.get('/admin/article/edit/:id', adminAuthMiddleware, (req, res) => {
    var id = req.params.id;
    ArticleModel.findByPk(id).then(article => {
        if(article != undefined)
        {
            CategoryModel.findAll().then(categories => {
                res.render('admin/articles/edit', {article: article, categories: categories})
            });
        } else {
            res.redirect('/admin/articles');
        }
    });
    
});

//rota: update dados do registro
router.post('/admin/article/update', adminAuthMiddleware, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    ArticleModel.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    },{ 
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles');
    }).catch(erro => {
        res.redirect('/');
    });
});

// rota: deleta o registro
router.post('/admin/article/delete', adminAuthMiddleware, (req, res) => {

    var id = req.body.id;

    if(id != undefined)
    {
        if(!isNaN(id)) // se id for um número
        {
            ArticleModel.destroy({
                where: { id: id }
            }).then(() => {
                res.redirect('/admin/articles');
            });
        } else { // se is não for um número
            res.redirect('/admin/articles');
        }
    } else { // se id não estiver definido
        res.redirect('/admin/articles');
    }
});

// rota: paginação
router.get('/admin/articles/page/:num', (req,res) => {

    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    } else {
        offset = (parseInt(page) - 1) * 3;
    }

    ArticleModel.findAndCountAll({
        limit: 3,
        offset: offset,
        order: [['id','DESC']]
    }).then(articles => {

        var next;
        if(offset + 3 >= articles.count){
            next = false;
        } else {
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        CategoryModel.findAll().then(categories => {
            res.render('admin/articles/page',{result: result, categories: categories});
        });

    });
});

module.exports = router;