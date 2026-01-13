// criando variavéis necessarias

const express = require('express')
const router = express.Router()

    //variaveis para trabalhar com o mongodb e criar novos cadastros no bd

const mongoose = require('mongoose') //importa a biblioteca.
require('../models/Categoria') //carrega o schema/model da categoria.
const categoria = mongoose.model('categorias') //pega o model registrado e guarda na variável categoria para manipular os dados no MongoDB.



//Criando rotas
    //rota principal

    router.get('/', (req, res)=>{
        res.render('admin/index')
    })

    //rota de categorias | aqui vamos listar e printar no html todas as categorias salvas no BD

    router.get('/categorias', (req, res)=>{
        categoria.find().lean() //buscar categorias
        .then((categorias)=>{
            res.render('admin/categorias', {categorias: categorias})
        })
        .catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao listar categorias')
            res.redirect('/admin')
        })
    })

    //rota para adicionar categoria

    router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategoria')
    })


    //rota para cadastrar categorias

    router.post('/categorias/nova', (req, res)=>{

        //array para armazenar msg de error
        var erros = []

        // Validação: verifica se o campo "nome" foi enviado corretamente
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){
            erros.push({texto: 'Nome inválido'})
        }

        //Validação: verifica se o campo "slug" foi enviado corretamente
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            erros.push({texto: 'Slug inválido'})
        }

        //Validação: garante que o nome tenha pelo menos 2 caracteres
        if(req.body.nome.length < 2){
            erros.push({texto: 'Minimo 3 letras'})
        }

        //Se houver erros, renderiza a view de adicionar categoria mostrando os erros
        if(erros.length > 0){
            res.render('admin/addcategoria', {erros: erros})
        }

        else{
            //// Cria um objeto com os dados da nova categoria
            const novacategoria = {
            nome: req.body.nome,
            slug: req.body.slug
            }

            // Salva a nova categoria no banco de dados usando o model "categoria"
            new categoria(novacategoria).save()
            .then(()=>{
                req.flash('success_msg', 'Categoria criado com sucesso.')
                res.redirect('/admin/categorias')})
            .catch((err)=>{
                req.flash('error_msg', 'Error ao cadastrar categoria.')
                res.redirect('/admin/categorias')
                console.log(`Error ${err}`)})
        }
        
    }

    )

    //rota para editar categoria

    router.get('/categorias/edit/:id', (req, res)=>{
        categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
            res.render('admin/editcategorias', {categoria:categoria})
        }).catch((err)=>{
            req.flash('error_msg', 'Esse usuário nao existe.')
            res.redirect('/admin/categorias')
        })
        
    })

    router.post('/categorias/edit', (req, res) => {
    categoria.findOne({ _id: req.body.id }).then((categoria) => {
        if (!categoria) {
            req.flash('error_msg', 'Categoria não encontrada.')
            return res.redirect('/admin/categorias')
        }

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao editar categoria')
            res.redirect('/admin/categorias')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar categoria')
        res.redirect('/admin/categorias')
    })
})

// Rota para exibir página de confirmação de exclusão
router.get('/categorias/delete/:id', (req, res)=>{
    categoria.findOne({_id: req.params.id}).lean()
    .then((categoria)=>{
        if(!categoria){
            req.flash('error_msg', 'Categoria não encontrada')
            res.redirect('/admin/categorias')
        }
        res.render('admin/deletecategorias', {categoria:categoria})
    })
    .catch((err)=>{
        req.flash('error_msg', 'Erro ao buscar categoria')
        res.render('/admin/categorias')
    })
})

//Rota POST para enviar a exclusao ao BD
router.post('/categorias/delete', (req, res)=>{
    categoria.deleteOne({_id: req.body.id})
    .then(()=>{
        req.flash('success_msg', 'Categoria deletada com sucesso')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg', `Erro ao deletar categoria ${err}`)
        req.redirect('/admin/categorias')
    })
})


//AQUI VAMOS CRIAR AS ROTAS DE POSTAGENS 

    //rota que vai listar os posts

    router.get('/postagens', (req, res)=>{
        res.render('admin/postagens')
    })

    router.get('/postagem/add', (req, res)=>{
        categoria.find().lean().then((categorias)=>{
            res.render('admin/addpostagem', {categorias: categorias})
        }).catch((err)=>{
            req.flash('error_msg', 'Erro ao carregar formulário')
            res.redirect('/admin')
        })
    })

    router.post('/postagem/nova', (req, res)=>{

    })

//exportando rotas para o app.js

module.exports = router

