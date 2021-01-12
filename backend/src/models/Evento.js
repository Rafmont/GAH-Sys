const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Evento = new Schema({
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  data_inicial: {
    type: String,
    required: true,
  },
  data_final: {
    type: String,
    required: true,
  },
  aconteceu: {
    type: Boolean,
    default: false,
  },
  funcionario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "funcionarios",
    required: true,
  },
  ultimoeditor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "funcionarios",
    required: true,
  },
});

mongoose.model("eventos", Evento);
