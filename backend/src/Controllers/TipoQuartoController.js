//Carregamento dos modulos node
const mongoose = require("mongoose");

//Carregamento do modelo no banco de dados.
require("../models/TipoQuarto");
require("../models/Quarto");

//Definição das constantes das models.
const TipoQuarto = mongoose.model("tiposQuarto");
const Quarto = mongoose.model("quartos");

module.exports = {
  async create(req, res) {
    const { nome, descricao, capacidade, valor_diaria } = req.body;

    //Bloco de verificações
    let erros = [];
    if (!nome || !descricao || !capacidade || !valor_diaria) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json({ Erro: erros });
    }
    //Fim do bloco de verificações.

    const novoTipoQuarto = new TipoQuarto({
      nome,
      descricao,
      capacidade,
      valor_diaria,
    });

    novoTipoQuarto
      .save()
      .then(() => {
        return res.json({
          Sucesso: true,
          novoTipoQuarto,
        });
      })
      .catch((err) => {
        return res.json({
          Erro: true,
          Message: "Erro ao salvar novo tipo de quarto.",
          "SysError: ": err,
        });
      });
  },

  async index(req, res) {
    const tiposQuarto = await TipoQuarto.find({ ativo: true });
    if (!tiposQuarto) {
      return res.json({
        Erro: true,
        Message: "Não foi possivel resgatar os tipos de quartos.",
        "SysError: ": err,
      });
    }
    return res.json(tiposQuarto);
  },

  async update(req, res) {
    const { nome, descricao, capacidade, valor_diaria } = req.body;
    const id = req.params.id;

    //Bloco de verificações
    let erros = [];
    if (!nome || !descricao || !capacidade || !valor_diaria) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json({ Erro: erros });
    }
    //Fim do bloco de verificações.

    const tipoQuarto = await TipoQuarto.findOne({ _id: id, ativo: true });

    if (!tipoQuarto) {
      return res.json({
        Erro: true,
        Message: "Não foi possivel resgatar o tipo de quartos.",
        "SysError: ": err,
      });
    }

    tipoQuarto.nome = nome;
    tipoQuarto.descricao = descricao;
    tipoQuarto.capacidade = capacidade;
    tipoQuarto.valor_diaria = valor_diaria;

    tipoQuarto
      .save()
      .then(() => {
        return res.json({
          Sucesso: true,
        });
      })
      .catch((err) => {
        return res.json({
          Erro: true,
          Message: "Erro ao salvar a atualização no tipo de quarto.",
          "SysError: ": err,
        });
      });
  },

  async delete(req, res) {
    const id = req.params.id;

    const tipoQuarto = await TipoQuarto.findOne({ _id: id, ativo: true });

    if (!tipoQuarto) {
      return res.json({
        Erro: true,
        Message: "Não foi possivel resgatar o tipo de quartos.",
        "SysError: ": err,
      });
    }

    const quartos = await Quarto.find({ tipoQuarto: id });

    for (let i = 0; i < quartos.length; i++) {
      quartos[i].tipoQuarto = "5f50da20bbf4a924a8670c12";
      await quartos[i].save();
    }

    tipoQuarto.ativo = false;
    tipoQuarto
      .save()
      .then(() => {
        return res.json({
          Sucesso: true,
        });
      })
      .catch((err) => {
        return res.json({
          Erro: true,
          Message: "Erro ao desativar o tipo de quarto, tente novamente.",
          "SysError: ": err,
        });
      });
  },
};
