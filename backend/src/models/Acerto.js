const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Acerto = new Schema({
  terapeuta: {
    type: Schema.Types.ObjectId,
    ref: "terapeutas",
  },
  valor: {
    type: Number,
    required: true,
  },
  ativo: {
    type: Boolean,
    default: true,
  },
  pago: {
    type: Boolean,
    default: false,
  },
  data: {
    type: String,
  },
  atendimentos: [{ type: mongoose.Schema.Types.ObjectId, ref: "atendimentos" }],
});

mongoose.model("acertos", Acerto);
