const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Funcionario = new Schema({
  nome: {
    type: String,
    required: true,
  },
  nascimento: {
    type: String,
    required: true,
  },
  rg: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  nivel: {
    type: Number,
    required: true,
    default: 1,
  },
  ativo: {
    type: Boolean,
    default: true,
  }
});

mongoose.model("funcionarios", Funcionario);