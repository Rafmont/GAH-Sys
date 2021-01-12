//Carregamento dos modulos node
const mongoose = require("mongoose");

//Carregamento do modelo no banco de dados.
require("../models/Configuracao");

//Definição das constantes das models.
const Configuracao = mongoose.model("configuracoes");

module.exports = {
  async create(req, res) {
    const configuracao = new Configuracao({
      meuId: 1,
    });
    await configuracao.save();

    return res.json(configuracao);
  },

  async index(req, res) {
    const configuracao = await Configuracao.findOne({ meuId: 1 });
    return res.json(configuracao);
  },

  async update(req, res) {
    const {
      checkInTime,
      checkOutTime,
      atendimentoIni,
      atendimentoFim,
      porcentagem_atendimento,
    } = req.body;

    //Bloco de verificações
    let erros = [];

    if (
      !checkInTime ||
      !checkOutTime ||
      !atendimentoIni ||
      !atendimentoFim ||
      !porcentagem_atendimento
    ) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json(erros);
    }
    //Fim do bloco de verificações.

    const configuracao = await Configuracao.findOne({ meuId: 1 });

    configuracao.checkInTime = checkInTime;
    configuracao.checkOutTime = checkOutTime;
    configuracao.atendimentoIni = atendimentoIni;
    configuracao.atendimentoFim = atendimentoFim;
    configuracao.porcentagem_atendimento = porcentagem_atendimento;

    await configuracao.save();

    return res.json({ Sucesso: true });
  },
};
