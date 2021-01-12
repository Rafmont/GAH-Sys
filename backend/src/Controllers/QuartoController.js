//Carregamento dos modulos node
const mongoose = require("mongoose");

//Carregamento do modelo no banco de dados.
require("../models/Quarto");

//Definição das constantes das models.
const Quarto = mongoose.model("quartos");

module.exports = {
  async create(req, res) {
    const { numero, estado, tipoQuarto } = req.body;

    //Bloco de verificações
    let erros = [];
    if (!numero || !estado || !tipoQuarto) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    const quarto = await Quarto.find({ ativo: true, numero: numero });

    if (quarto.length !== 0) {
      return res.json({
        Erro: true,
        Message: "Já existe um quarto com este número.",
      });
    }

    if (erros.length > 0) {
      return res.json({ Erro: erros });
    }
    //Fim do bloco de verificações.

    const novoQuarto = new Quarto({
      numero,
      estado,
      tipoQuarto,
    });

    novoQuarto
      .save()
      .then(() => {
        return res.json({
          Sucesso: true,
          novoQuarto,
        });
      })
      .catch((err) => {
        return res.json({
          Erro: true,
          Message: "Erro ao salvar novo quarto.",
          "SysError: ": err,
        });
      });
  },

  async index(req, res) {
    const quartos = await Quarto.find({ ativo: true }).populate("tipoQuarto");
    if (!quartos || quartos.length === 0) {
      return res.json({
        Erro: true,
        Message: "Não foi possivel encontrar os quartos.",
        "SysError: ": err,
      });
    }

    return res.json(quartos);
  },

  async update(req, res) {
    const id = req.params.id;
    const { estado, tipoQuarto } = req.body;

    //Bloco de verificações
    let erros = [];
    if (!estado || !tipoQuarto) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json({ Erro: erros });
    }
    //Fim do bloco de verificações.

    const quarto = await Quarto.findOne({ ativo: true, _id: id });

    quarto.estado = estado;
    quarto.tipoQuarto = tipoQuarto;

    quarto
      .save()
      .then(() => {
        return res.json({
          Sucesso: true,
          quarto,
        });
      })
      .catch((err) => {
        return res.json({
          Erro: true,
          Message: "Erro ao editar quarto.",
          "SysError: ": err,
        });
      });
  },

  async delete(req, res) {
    const id = req.params.id;

    const quarto = await Quarto.findOne({ ativo: true, _id: id });

    quarto.ativo = false;

    quarto
      .save()
      .then(() => {
        return res.json({
          Sucesso: true,
          Message: "Quarto desativo com sucesso.",
        });
      })
      .catch((err) => {
        return res.json({
          Erro: true,
          Message: "Erro ao desativar quarto.",
          "SysError: ": err,
        });
      });
  },
};
