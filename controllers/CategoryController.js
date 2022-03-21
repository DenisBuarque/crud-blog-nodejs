const express = require('express');
const router = express.Router();
const CategoryModel = require('../models/Category');
const adminAuthMiddleware = require('../middlewares/adminAuth');
const slugify = require('slugify');

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new');
});

// rota: lista os registros
router.get('/admin/categories', adminAuthMiddleware, (req, res) => {
    CategoryModel.findAll().then( categories => {
        res.render('admin/categories/index',{
            categories: categories
        });
    });
});

// rota: salvar os dados do formulario no banco
router.post('/category/save', adminAuthMiddleware, (req, res) => {

    var title = req.body.title; // receb dados do campo do form.

    if(title != undefined) // verificar se não esta vazio
    {
        CategoryModel.create({ // salva os dados na tabela
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories');
        });

    } else {
        res.redirect('/admin/categories/new');
    }
});

//rote: alterar dados do registro
router.get('/admin/category/edit/:id', adminAuthMiddleware, (req, res) => {

    var id = req.params.id;

    if(isNaN(id)){ // se id não for um número
        res.redirect('/admin/categories');
    }

    CategoryModel.findByPk(id).then(category => {
        if(category != undefined)
        {
            res.render('admin/categories/edit', { category: category });

        } else {
            res.redirect('/admin/categories');
        }
    }).catch(erro => {
        res.redirect('/admin/categories');
    });
});

//rota: update dados registro
router.post('/admin/category/update', adminAuthMiddleware, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    CategoryModel.update({title: title, slug: slugify(title)},{
        where: { 
            id: id 
        }
    }).then(() => {
        res.redirect('/admin/categories');
    });
});

// rota: deleta o registro
router.post('/admin/category/delete', adminAuthMiddleware, (req, res) => {

    var id = req.body.id;

    if(id != undefined)
    {
        if(!isNaN(id)) // se id for um número
        {
            CategoryModel.destroy({
                where: { id: id }
            }).then(() => {
                res.redirect('/admin/categories');
            });

        } else { // se is não for um número
            res.redirect('/admin/categories');
        }
    } else { // se id não estiver definido
        res.redirect('/admin/categories');
    }
});

module.exports = router;