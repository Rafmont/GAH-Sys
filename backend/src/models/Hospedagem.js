//Bibliotecas do Node.
const mongoose = require("mongoose");

//Constantes.
const Schema = mongoose.Schema;

const Hospedagem = new Schema({
  quarto: {
    type: Schema.Types.ObjectId,
    ref: "quartos",
    required: true,
  },
  hospede: {
    type: Schema.Types.ObjectId,
    ref: "hospedes",
    required: true,
  },
  checkIn: {
    type: String,
    required: true,
  },
  checkOut: {
    type: String,
    required: true,
  },
  diarias: {
    type: Number,
    required: true,
  },
  valor_total: {
    type: Number,
    required: true,
  },
  dependentes: [{ type: mongoose.Schema.Types.ObjectId, ref: "hospedes" }],
});

mongoose.model("hospedagens", Hospedagem);
