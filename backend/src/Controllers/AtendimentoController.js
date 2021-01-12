//Carregamento dos modulos node
const mongoose = require("mongoose");
const moment = require("moment");
const { min } = require("moment");

//Carregamento do modelo no banco de dados.
require("../models/Atendimento");
require("../models/Fatura");

//Definição das constantes das models.
const Atendimento = mongoose.model("atendimentos");
const Fatura = mongoose.model("faturas");

//Funções auxiliares.
async function handleFatura(item) {
  let fatura = await Fatura.findOne({ hospede: item.hospede, pago: false });
  if (!fatura) {
    const novaFatura = new Fatura({
      hospede: item.hospede,
      atendimentos: item,
      valor: parseInt(item.valor),
    });

    await novaFatura.save();
  } else {
    fatura.atendimentos.push(item);
    fatura.valor = parseInt(fatura.valor) + parseInt(item.valor);

    await fatura.save();
  }
}

module.exports = {
  async create(req, res) {
    const {
      hospede,
      terapeuta,
      duracao,
      data_inicial,
      valor,
      servico,
    } = req.body;
    const data_final = moment(data_inicial)
      .add(duracao, "minutes")
      .format("YYYY-MM-DDTHH:mm:ss");

    //Bloco de verificações
    let erros = [];

    const atendimentos = await Atendimento.find({
      ativo: true,
      terapeuta: terapeuta,
    });

    for (let i = 0; i < atendimentos.length; i++) {
      if (
        atendimentos[i].data_inicial >= data_inicial &&
        atendimentos[i].data_final <= data_final
      ) {
        erros.push("Já existe um atendimento marcado neste horário.");
      }
      if (
        atendimentos[i].data_final >= data_inicial &&
        atendimentos[i].data_inicial <= data_inicial
      ) {
        erros.push("Já existe um atendimento marcado neste horário.");
      }
      if (
        atendimentos[i].data_inicial <= data_final &&
        atendimentos[i].data_final >= data_inicial
      ) {
        erros.push("Já existe um atendimento marcado neste horário.");
      }
      if (
        atendimentos[i].data_inicial <= data_inicial &&
        atendimentos[i].data_final >= data_final
      ) {
        erros.push("Já existe um atendimento marcado neste horário.");
      }
    }

    if (
      !hospede ||
      !terapeuta ||
      !duracao ||
      !data_inicial ||
      !valor ||
      !servico
    ) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json({ Erro: erros });
    }
    //Fim do bloco de verificações.

    const novoAtendimento = new Atendimento({
      hospede,
      terapeuta,
      duracao,
      data_inicial,
      data_final,
      valor,
      servico,
    });

    await handleFatura(novoAtendimento);

    novoAtendimento
      .save()
      .then(() => {
        return res.json({
          Sucesso: true,
          Message: "Atendimento agendado com sucesso.",
          novoAtendimento,
        });
      })
      .catch((err) => {
        return res.json({
          Erro: "Erro ao agendar novo atendimento.",
          SysError: err,
        });
      });
  },
  async index(req, res) {
    let atendimentos = await Atendimento.find({ ativo: true })
      .populate("servico")
      .populate("hospede")
      .populate("terapeuta");
    return res.json(atendimentos);
  },

  async filteredIndex(req, res) {
    let atendimentos = await Atendimento.find({
      ativo: true,
      terapeuta: req.params.id,
    })
      .populate("servico")
      .populate("hospede")
      .populate("terapeuta");
    return res.json(atendimentos);
  },

  async delete(req, res) {
    let atendimento = await Atendimento.find({
      ativo: true,
      _id: req.params.id,
    });
    atendimento[0].ativo = false;
    let fatura = await Fatura.find({
      pago: false,
      hospede: atendimento[0].hospede,
    });
    fatura[0].valor =
      parseInt(fatura[0].valor) - parseInt(atendimento[0].valor);
    await fatura[0].save();
    await atendimento[0].save();
    return res.json({ Sucesso: "Desativado com sucesso." });
  },
};
