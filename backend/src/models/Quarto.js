const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Quarto = new Schema({
  numero: {
    type: Number,
    required: true,
  },
  estado: {
    type: String,
    required: true,
  },
  tipoQuarto: {
    type: Schema.Types.ObjectId,
    ref: "tiposQuarto",
  },
  ativo: {
    type: Boolean,
    default: true,
  },
});

mongoose.model("quartos", Quarto);
