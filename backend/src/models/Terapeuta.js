//Bibliotecas do Node.
const mongoose = require("mongoose");

//Constantes.
const Schema = mongoose.Schema;

const Terapeuta = new Schema({
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
  },
  ativo: {
    type: Boolean,
    default: true,
  },
  acerto: {
    type: Number,
    required: true,
  },
  ultimoAcerto: {
    type: String,
    required: true,
    default: "null",
  },
  especialidade: [
    { type: mongoose.Schema.Types.ObjectId, ref: "especialidades" },
  ],
});

mongoose.model("terapeutas", Terapeuta);
