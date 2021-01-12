const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Configuracao = new Schema({
  meuId: {
    type: Number,
    required: true,
  },
  checkInTime: {
    type: String,
    default: "12:00",
  },
  checkOutTime: {
    type: String,
    default: "12:00",
  },
  atendimentoIni: {
    type: String,
    default: "07:00",
  },
  atendimentoFim: {
    type: String,
    default: "22:00",
  },
  porcentagem_atendimento: {
    type: Number,
    default: 50,
  },
});

mongoose.model("configuracoes", Configuracao);
