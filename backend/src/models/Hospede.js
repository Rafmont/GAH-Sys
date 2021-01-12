const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Hospede = new Schema({
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
  ativo: {
    type: Boolean,
    default: true,
  },
  dependente: {
    type: Boolean,
    default: false,
  },
  depende_de: {
    type: Schema.Types.ObjectId,
    ref: "hospedes",
  },
});

mongoose.model("hospedes", Hospede);
