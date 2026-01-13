//Esse é o arquivo principal da aplicação
//Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const mongoose = require('mongoose')
    const app = express()
    const admin = require('./router/admin')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')

//Configurações
    //sessao
        app.use(session({
            secret: 'gemeos0215',
            resave: true,
            saveUninitialized: true,
        }))
        app.use(flash())
    // Middleware
        app.use(express.urlencoded({extended: false}))
        app.use(express.json())
        //sessoes
        app.use((req, res, next)=>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            next()
        })
    // Handlebars
        app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
        app.set('view engine', 'handlebars')
    //public
        app.use(express.static(path.join(__dirname,'public')))


// mongodb
    //conectar 
    mongoose.connect('mongodb://localhost/blogapp').then(()=>{
        console.log('Conectado ao Banco')
    }).catch((err)=>{console.log(`Falha ao conectar com o banco,${err}`)})


//Rotas
app.get('/', (req, res)=>{
    res.send('Página principal do APP')
})

app.use('/admin', admin)





//Outros
const PORT = 3000
app.listen(PORT, ()=>{
    console.log(`Servidor ativo na porta: ${PORT}`)
})

//Rodar o nodemon || npx nodemon app.js
