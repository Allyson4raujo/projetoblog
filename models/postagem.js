const mongoose = require('mongoose')

//criando model(campos) no banco de dados

const postagemSchema = new mongoose.Schema({
    titulo:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    
    descricao:{
        type:String,
        require: true
    },
    conteudo:{
        type:String,
        require: true
    },
    categoria:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categorias',
        require: true,
    },
    data:{
        type: Date,
        default: Date.now
    }
})

// registar um model no mongoose 

mongoose.model('postagens', postagemSchema) // criei um model chamado 'postagens' usando o postagemSchema
