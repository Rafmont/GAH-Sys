const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Conta = new Schema({
  terapeuta: {
    type: Schema.Types.ObjectId,
    ref: "terapeutas",
  },
  funcionario: {
    type: Schema.Types.ObjectId,
    ref: "funcionarios",
  },
  login: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  nome: {
    type: String,
    required: true,
  },
  nivel: {
    type: Number,
    required: true,
  },
  ativo: {
    type: Boolean,
    default: true,
  }
});

mongoose.model("contas", Conta);