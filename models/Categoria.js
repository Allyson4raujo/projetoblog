const mongoose = require('mongoose')

const CategoriaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true // opcional; remova se não quiser obrigatoriedade
  },
  date: {
    type: Date,
    default: Date.now
  }
})

// registra o model
mongoose.model('categorias', CategoriaSchema)
// ou exporte diretamente, se preferir:
// module.exports = mongoose.model('Categoria', CategoriaSchema)