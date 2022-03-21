const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/admin/users', (req, res) => {

    UserModel.findAll().then(users => {
        res.render('admin/users/index',{ users: users });
    });
});

//rota: formulario de cadastro
router.get('/admin/user/new', (req, res) => {
    res.render('admin/users/new');
});

//rota: recebe dados vindo do fomulário
router.post('/admin/user/save', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    //verifica se o email esta cadastrado
    UserModel.findOne({
        where: {
            email: email
        }
    }).then(user => {
        // se não encontrou o usuário com mesmo email
        if(user == undefined){ 
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
        
            UserModel.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect('/admin/users');
            }).catch(error => {
                res.redirect('admin/users');
            });
        } else { // se encontrou usuário com mesm email
            res.redirect('/admin/user/new');
        }
    });
});

// rota de login e logout
router.use('/login', (req, res) => {
    res.render('admin/users/login');
});

router.use('/authenticate', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    UserModel.findOne({where: {email: email}}).then(user => {
        if(user != undefined) // se user existe
        {
            var correct_password = bcrypt.compareSync(password, user.password); // sevifica a senha
            if(correct_password){ // se a senha estiver correta
                req.session.user = { // cria session do usuário
                    id: user.id,
                    emal: user.email
                }
                res.redirect('/admin/articles');

            } else { // se a senha não estiver correta
                res.redirect('/login');
            }
        } else {// se o usuário não existir
            res.redirect('/login');
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
});

module.exports = router;