const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Despesa = new Schema({
  titulo: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
});

mongoose.model("despesas", Despesa);
