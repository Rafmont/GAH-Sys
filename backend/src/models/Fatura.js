const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Fatura = new Schema({
  hospede: {
    type: Schema.Types.ObjectId,
    ref: "hospedes",
  },
  atendimentos: [{ type: mongoose.Schema.Types.ObjectId, ref: "atendimentos" }],
  hospedagens: [{ type: mongoose.Schema.Types.ObjectId, ref: "hospedagens" }],
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
});

mongoose.model("faturas", Fatura);
