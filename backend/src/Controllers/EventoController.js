//Carregamento dos modulos node
const mongoose = require("mongoose");
const moment = require("moment");

//Carregamento do modelo no banco de dados.
require("../models/Evento");

//Definição das constantes das models.
const Evento = mongoose.model("eventos");

//Funções auxiliares.
function verificaData(data) {
  let dataParsed = moment(data).format("YYYY-MM-DD");

  if (dataParsed < moment().format("YYYY-MM-DD")) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  async create(req, res) {
    const idFuncionario = req.params.id;
    const {
      nome,
      descricao,
      data,
      hora,
      minuto,
      dataF,
      horaF,
      minutoF,
    } = req.body;

    //Bloco de verificações
    let erros = [];

    if (
      !nome ||
      !descricao ||
      !data ||
      !hora ||
      !minuto ||
      !dataF ||
      !horaF ||
      !minutoF
    ) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    if (!verificaData(data)) {
      erros.push("Favor escolher uma data depois do dia de hoje.");
    }

    if (erros.length > 0) {
      return res.json(erros);
    }
    //Fim do bloco de verificações.

    let data_inicial = data + "T" + hora + ":" + minuto;
    let data_final = dataF + "T" + horaF + ":" + minutoF;

    const novoEvento = new Evento({
      nome,
      descricao,
      data_inicial: data_inicial,
      data_final: data_final,
      funcionario: idFuncionario,
      ultimoeditor: idFuncionario,
    });

    novoEvento.save().then(() => {
      return res.json({ Sucesso: true });
    });
  },

  async index(req, res) {
    const eventos = await Evento.find({ aconteceu: false })
      .populate("funcionario")
      .populate("ultimoeditor");

    if (!eventos) {
      return res.json({ Erro: "Não foi possível encontrar nenhum evento." });
    }

    return res.json(eventos);
  },

  async update(req, res) {
    const eventoId = req.params.id;
    const {
      nome,
      descricao,
      data,
      hora,
      minuto,
      dataF,
      horaF,
      minutoF,
      funcionario,
    } = req.body;

    //Bloco de verificações
    let erros = [];

    const evento = await Evento.findOne({ _id: eventoId, aconteceu: false });

    if (!evento) {
      erros.push("Id incorreto ou o evento desejado já ocorreu.");
    }

    if (!verificaData(data)) {
      erros.push("Favor escolher uma data depois do dia de hoje.");
    }

    if (
      !nome ||
      !descricao ||
      !data ||
      !hora ||
      !minuto ||
      !dataF ||
      !horaF ||
      !minutoF
    ) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json(erros);
    }
    //Fim do bloco de verificações.

    let data_inicial = data + "T" + hora + ":" + minuto;
    let data_final = dataF + "T" + horaF + ":" + minutoF;

    evento.nome = nome;
    evento.descricao = descricao;
    evento.data_inicial = data_inicial;
    evento.data_final = data_final;
    evento.ultimoeditor = funcionario;

    evento.save().then(() => {
      return res.json({ Sucesso: true });
    });
  },

  async delete(req, res) {
    const eventoId = req.params.id;

    Evento.findOneAndDelete({ _id: eventoId, aconteceu: false })
      .then(() => {
        return res.json({ Sucesso: true });
      })
      .catch((err) => {
        return res.json({
          Erro: "Não foi possível deletar o evento.",
          SysErro: err,
        });
      });
  },
};
