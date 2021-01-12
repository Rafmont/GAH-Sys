//Carregamento dos modulos node
const mongoose = require("mongoose");
const moment = require("moment");
const { filteredIndex } = require("./TerapeutaController");

//Carregamento do modelo no banco de dados.
require("../models/Acerto");
require("../models/Configuracao");

//Definição das constantes das models.

const Acerto = mongoose.model("acertos");
const Config = mongoose.model("configuracoes");

//Funções auxiliares.

module.exports = {
  async index(req, res) {
    const acertos = await Acerto.find({ ativo: true })
      .populate("terapeuta")
      .populate("atendimentos");

    if (!acertos) {
      return res.json({
        Erro: "Não foi possível encontrar algum acerto.",
        SysError: err,
      });
    }

    return res.json(acertos);
  },

  async delete(req, res) {
    const id = req.params.id;
    const acerto = await Acerto.findOne({ _id: id });
    acerto.ativo = false;

    await acerto.save();

    return res.json({ Sucesso: true, Message: "Acerto desfeito com sucesso!" });
  },

  async indexPagar(req, res) {
    const acertos = await Acerto.find({ ativo: true, pago: false })
      .populate("terapeuta")
      .populate("atendimentos");

    if (!acertos) {
      return res.json({
        Erro: "Não foi possível encontrar algum acerto.",
        SysError: err,
      });
    }

    return res.json(acertos);
  },

  async confirmar(req, res) {
    const id = req.params.id;

    const acerto = await Acerto.findOne({ ativo: true, _id: id, pago: false });

    acerto.pago = true;
    acerto.data = moment().format("YYYY-MM-DD");

    await acerto.save();

    return res.json({
      Sucesso: true,
      Message: "O pagamento foi confirmado para o sistema!",
    });
  },

  async filteredIndex(req, res) {
    const acertos = await Acerto.find({ ativo: true, terapeuta: req.params.id })
      .populate("terapeuta")
      .populate("atendimentos");

    if (!acertos) {
      return res.json({
        Erro: "Não foi possível encontrar algum acerto.",
        SysError: err,
      });
    }

    return res.json(acertos);
  },
};
