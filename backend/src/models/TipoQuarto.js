const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TipoQuarto = new Schema({
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  capacidade: {
    type: Number,
    required: true,
  },
  valor_diaria: {
    type: Number,
    required: true,
  },
  ativo: {
    type: Boolean,
    default: true,
  },
});

mongoose.model("tiposQuarto", TipoQuarto);
