const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Especialidade = new Schema({
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  ativo: {
    type: Boolean,
    default: true,
  }
});

mongoose.model("especialidades", Especialidade);