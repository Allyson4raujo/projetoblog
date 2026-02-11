const express = require('express')
const { default: mongoose } = require('mongoose')
const router = express.Router()
require('../models/usuario')
const Usuario = mongoose.model('usuario') // ← CORRIGIDO para minúsculo
const bcrypt = require('bcryptjs')
const passport = require('passport') // ← Adicione isso

// ============================================
// ROTA GET '/' - LISTAR TODOS OS USUÁRIOS
// Rota completa: /usuarios
// ============================================
router.get('/', (req, res)=>{
    // Busca TODOS os usuários no banco de dados
    Usuario.find().then((usuarios)=>{
        // Renderiza a view passando o array de usuários
        res.render('usuarios/index', {usuarios: usuarios})
    })
    .catch((err)=>{
        console.log('Erro ao buscar usuarios:', err)
        req.flash('error_msg', 'Erro ao buscar usuários')
        res.redirect('/')
    })
})

// ============================================
// ROTA GET '/registro' - EXIBIR FORMULÁRIO DE CADASTRO
// Rota completa: /usuarios/registro
// ============================================
router.get('/registro', (req, res)=>{
    // Apenas renderiza o formulário HTML
    res.render('usuarios/registro')
})

// ============================================
// ROTA POST '/registro' - PROCESSAR CADASTRO
// Rota completa: /usuarios/registro
// ============================================
router.post('/registro', (req, res)=>{
    // Array para armazenar erros de validação
    var erros = []

    // -------- VALIDAÇÕES --------
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome Inválido'})
    }
    
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: 'Email Inválido'})
    }
    
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: 'Senha Inválida'})
    }
    
    if(req.body.senha.length < 4){
        erros.push({texto: 'Senha muito curta (mínimo 4 caracteres)'})
    }
    
    if(req.body.senha != req.body.senha2){
        erros.push({texto: 'Senhas diferentes, tente novamente'})
    }
    
    // -------- SE HÁ ERROS, MOSTRA O FORMULÁRIO NOVAMENTE --------
    if(erros.length > 0){
       res.render('usuarios/registro', {erros: erros})  
    }else{
        // -------- VERIFICA SE EMAIL JÁ EXISTE --------
        Usuario.findOne({email: req.body.email}).then((usuarioExistente) => {
            
            if(usuarioExistente){
                req.flash('error_msg', 'Email já cadastrado no sistema')
                res.redirect('/usuarios/registro')
            }else{
                // -------- CRIA OBJETO DO NOVO USUÁRIO --------
                const novousuario = {
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha // Ainda em texto plano (vai ser hasheada abaixo)
                }
                
                // ===== CORRIGIDO: HASH DA SENHA =====
                // Gera um "salt" (string aleatória para aumentar segurança)
                bcrypt.genSalt(10, (erro, salt)=>{
                    if(erro){
                        req.flash('error_msg', 'Erro ao processar senha')
                        return res.redirect('/usuarios/registro')
                    }
                    
                    // Cria o hash da senha usando o salt
                    bcrypt.hash(novousuario.senha, salt, (erro, hash)=>{
                        if(erro){
                            req.flash('error_msg', 'Erro ao criptografar senha')
                            return res.redirect('/usuarios/registro')
                        }
                        
                        // Substitui a senha em texto plano pelo hash
                        novousuario.senha = hash
                        
                        // ===== AGORA SIM SALVA NO BANCO =====
                        // Cria uma instância do modelo e salva
                        new Usuario(novousuario).save()
                        .then(()=>{
                            req.flash('success_msg', 'Usuário cadastrado com sucesso!')
                            res.redirect('/usuarios/login') // ← Melhor redirecionar para login
                        })
                        .catch((err)=>{
                            console.log('Erro ao salvar usuário:', err)
                            req.flash('error_msg', 'Erro ao cadastrar usuário')
                            res.redirect('/usuarios/registro')
                        })
                    })
                })
            } 
        }).catch((err)=>{
            console.log('Erro ao verificar email:', err)
            req.flash('error_msg', 'Erro interno ao verificar email')
            res.redirect('/usuarios/registro')
        })
    }
})

// ============================================
// ROTA GET '/login' - EXIBIR FORMULÁRIO DE LOGIN
// Rota completa: /usuarios/login
// ============================================
router.get('/login', (req, res)=>{
    res.render('usuarios/login')
})

// ============================================
// ROTA POST '/login' - PROCESSAR LOGIN
// Rota completa: /usuarios/login
// Usa o Passport para autenticar
// ============================================
router.post('/login', (req, res, next) => {
    // passport.authenticate('local') usa a estratégia que configuramos
    // 'local' = autenticação com email/senha (não é OAuth, etc)
    passport.authenticate('local', {
        // Se login bem-sucedido, redireciona para a página inicial
        successRedirect: '/',
        // Se falhar, volta para o formulário de login
        failureRedirect: '/usuarios/login',
        // Habilita mensagens flash para mostrar erros
        failureFlash: true
    })(req, res, next) // Executa a função retornada
})

// ROTA GET '/logout' - FAZER LOGOUT

router.get('/logout', (req, res) => {
    // req.logout() é fornecido pelo Passport
    // Remove os dados do usuário da sessão
    req.logout((err) => {
        if(err){
            console.log('Erro ao fazer logout:', err)
            req.flash('error_msg', 'Erro ao sair')
            return res.redirect('/')
        }
        req.flash('success_msg', 'Você saiu com sucesso!')
        res.redirect('/')
    })
})

// Exporta o router para ser usado no app.js
module.exports = router