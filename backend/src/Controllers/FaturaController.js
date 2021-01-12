//Carregamento dos modulos node
const mongoose = require("mongoose");
const moment = require("moment");

//Carregamento do modelo no banco de dados.
require("../models/Fatura");

//Definição das constantes das models.

const Fatura = mongoose.model("faturas");

//Funções auxiliares.

module.exports = {
  async index(req, res) {
    let faturas = await Fatura.find({ ativo: true })
      .populate({
        path: "atendimentos",
        populate: {
          path: "hospede",
        },
      })
      .populate("hospede")
      .populate("hospedagens");

    return res.json(faturas);
  },
  async indexPagar(req, res) {
    let faturas = await Fatura.find({ ativo: true, pago: false })
      .populate({
        path: "atendimentos",
        populate: {
          path: "hospede",
        },
      })
      .populate("hospede")
      .populate({
        path: "hospedagens",
        populate: {
          path: "quarto",
        },
      });
    return res.json(faturas);
  },

  async indexGeral(req, res) {
    let faturas = await Fatura.find()
      .populate({
        path: "atendimentos",
        populate: {
          path: "hospede",
        },
      })
      .populate("hospede")
      .populate({
        path: "hospedagens",
        populate: {
          path: "quarto",
        },
      });
    return res.json(faturas);
  },

  async confirmar(req, res) {
    const id = req.params.id;

    const fatura = await Fatura.findOne({ ativo: true, _id: id, pago: false });

    fatura.pago = true;
    fatura.data = moment().format("YYYY-MM-DD");

    await fatura.save();

    return res.json({
      Sucesso: true,
      Message: "O pagamento foi confirmado para o sistema!",
    });
  },
};
