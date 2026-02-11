const mongoose = require('mongoose')
const localstrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

// Carrega o modelo de usuário
require('../models/usuario')
const Usuario = mongoose.model('usuario')

module.exports = function(passport){
    
    // Estratégia de autenticação local (email/senha)
    passport.use(new localstrategy(
        {usernameField: 'email', passwordField: 'senha'}, 
        (email, senha, done) => {
        
        // Busca usuário por email
        Usuario.findOne({email: email})
        .then((usuario) => {
            
            if(!usuario){
                return done(null, false, {message: 'Usuário inexistente'})
            }

            // Compara a senha digitada com o hash do banco
            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                if(erro){
                    return done(erro)
                }
                
                if(batem){
                    return done(null, usuario) // Login bem-sucedido
                } else {
                    return done(null, false, {message: 'Senha incorreta'})
                }
            })
        })
        .catch((err) => {
            return done(err)
        })

    }))

    // Salva apenas o ID do usuário na sessão
    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    // ===== CORRIGIDO: Usa Promise em vez de callback =====
    passport.deserializeUser((id, done) => {
        Usuario.findById(id)
        .then((usuario) => {
            done(null, usuario)
        })
        .catch((err) => {
            done(err, null)
        })
    })
}