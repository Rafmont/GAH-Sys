//Carregamento dos modulos node
const mongoose = require("mongoose");

//Carregamento do modelo no banco de dados.
require("../models/Despesas");

//Definição das constantes das models.

const Despesa = mongoose.model("despesas");

//Funções auxiliares.

module.exports = {
  async create(req, res) {
    const { titulo, descricao, valor, data } = req.body;

    //Bloco de verificações
    let erros = [];

    if (!titulo || !descricao || !valor || !data) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json({ Erro: erros });
    }
    //Fim do bloco de verificações.

    const novaDespesa = new Despesa({
      titulo,
      descricao,
      valor,
      data,
    });

    novaDespesa
      .save()
      .then(() => {
        return res.json({
          Sucesso: true,
          Message: "Despesa cadastrada com sucesso.",
          novaDespesa,
        });
      })
      .catch((err) => {
        return res.json({
          Erro: "Erro ao cadastrar despesa.",
          SysError: err,
        });
      });
  },

  async index(req, res) {
    const despesas = await Despesa.find();

    if (!despesas) {
      return res.json({
        Erro: "Não foi possível encontrar as despesas.",
        SysError: err,
      });
    }

    return res.json(despesas);
  },

  async update(req, res) {
    const { titulo, descricao, valor, data } = req.body;
    const id = req.params.id;

    //Bloco de verificações
    let erros = [];

    if (!titulo || !descricao || !valor || !data) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json({ Erro: erros });
    }
    //Fim do bloco de verificações.

    const despesa = await Despesa.findOne({ _id: id });

    despesa.titulo = titulo;
    despesa.descricao = descricao;
    despesa.valor = valor;
    despesa.data = data;

    despesa
      .save()
      .then(() => {
        return res.json({
          Sucesso: true,
          Message: "Despesa alterada com sucesso.",
          despesa,
        });
      })
      .catch((err) => {
        return res.json({
          Erro: "Erro ao alterar despesa.",
          SysError: err,
        });
      });
  },

  async delete(req, res) {
    const id = req.params.id;
    Despesa.deleteOne({ _id: id })
      .then(() => {
        return res.json({
          Sucesso: true,
          Message: "Despesa desativada com sucesso.",
        });
      })
      .catch((err) => {
        return res.json({
          Erro: "Erro ao desativar despesa.",
          SysError: err,
        });
      });
  },
};
