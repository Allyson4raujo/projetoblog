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
    require('./models/postagem')
    const postagem = mongoose.model('postagens')
    require('./models/Categoria')
    const categoria = mongoose.model('categorias')

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
        app.engine('handlebars', handlebars.engine({ 
        defaultLayout: 'main',
        runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}))
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
    postagem.find().populate('categoria')                   //acessando o modulo postagem e buscando todas as postagem do banco de dados
    .then((postagens)=>{                                    //then(caso dê certo o resultado da postagem.find vai ser colocado na variavel postagens)
        res.render('index', {postagem: postagens})
    })
    .catch((err)=>{
        req.flash('error_msg', 'erro ao carregar postagem')
        res.redirect('/admin')
    })
})

//criando rota para ler postagem
app.get('/postagem/:slug', (req, res)=>{
    console.log(req.params.slug)
    postagem.findOne({slug : req.params.slug})
    .then((postagem)=>{
        if(postagem){
            res.render('postagem/index', {postagem: postagem})
        }
        else{
            req.flash('error_msg', 'Erro! Postagem não encontrada')
            res.redirect('/')
        }
    }).catch(()=>{
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/')
    })


})

//criando rota para no navbar (categorias)

app.get('/navcategorias', (req, res)=>{
    categoria.find()
    .then((categoria)=>{
        res.render('categoria/index', {categoria: categoria})
    })
    .catch((err)=>{
        req.flash('error_msg', 'Erro ao procurar categorias')
        res.redirect('/')
    })
})

//criando rota para ver linkados 

app.get('/categorias/:slug', (req, res) => {
    categoria.findOne({slug: req.params.slug}).then((categoria) => {
        if(categoria){
            // Adicione o .then() aqui e corrija o res.render
            postagem.find({categoria: categoria._id}).then((postagens) => {
                res.render('categoria/postagens', {
                    postagens: postagens,
                    categoria: categoria
                })
            }).catch((err) => {
                req.flash('error_msg', 'Erro ao buscar postagens')
                res.redirect('/')
            })
        }
        else{
            req.flash('error_msg', 'Esta categoria não existe')
            res.redirect('/')
        }
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao buscar categoria')
        res.redirect('/')
    })
})

app.use('/admin', admin)





//Outros
const PORT = 3000
app.listen(PORT, ()=>{
    console.log(`Servidor ativo na porta: ${PORT}`)
})

//Rodar o nodemon || npx nodemon app.js
