const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Atendimento = new Schema({
  hospede: {
    type: Schema.Types.ObjectId,
    ref: "hospedes",
  },
  terapeuta: {
    type: Schema.Types.ObjectId,
    ref: "terapeutas",
  },
  duracao: {
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
  valor: {
    type: String,
    required: true,
  },
  ativo: {
    type: Boolean,
    default: true,
  },
  verificado: {
    type: Boolean,
    default: false,
    required: true,
  },
  servico: [{ type: mongoose.Schema.Types.ObjectId, ref: "servicos" }],
});

mongoose.model("atendimentos", Atendimento);
