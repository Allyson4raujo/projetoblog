const mongoose = require('mongoose')

const UsuarioSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    senha:{
        type: String,
        required: true
    },
    eadmim:{
        type: Number,
        default: 0
    }

})

mongoose.model('usuario', UsuarioSchema) // ✅ Mudei para 'Usuario' (singular)