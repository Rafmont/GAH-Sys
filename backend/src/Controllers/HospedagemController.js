//Carregamento dos modulos node
const mongoose = require("mongoose");
const moment = require("moment");
const { min } = require("moment");

//Carregamento do modelo no banco de dados.
require("../models/Hospedagem");
require("../models/Fatura");

//Definição das constantes das models.
const Hospedagem = mongoose.model("hospedagens");
const Fatura = mongoose.model("faturas");

//Funções auxiliares.
async function handleFatura(item) {
  let fatura = await Fatura.findOne({ hospede: item.hospede, pago: false });
  if (!fatura) {
    const novaFatura = new Fatura({
      hospede: item.hospede,
      hospedagens: item,
      valor: item.valor_total,
    });

    await novaFatura.save();
  } else {
    fatura.hospedagens.push(item);
    fatura.valor = fatura.valor + item.valor_total;

    await fatura.save();
  }
}

module.exports = {
  async create(req, res) {
    const {
      quarto,
      hospede,
      checkIn,
      checkOut,
      diarias,
      valor_total,
      dependentes,
    } = req.body;

    //Bloco de verificações
    let erros = [];

    const hospedagens = await Hospedagem.find({
      $or: [{ quarto: quarto }, { hospede: hospede }],
    });

    for (let i = 0; i < hospedagens.length; i++) {
      if (
        hospedagens[i].checkIn >= checkIn &&
        hospedagens[i].checkOut <= checkOut
      ) {
        erros.push("Já existe uma hospedagem agendada nesta data.");
      }
      if (
        hospedagens[i].checkOut >= checkIn &&
        hospedagens[i].checkIn <= checkIn
      ) {
        erros.push("Já existe uma hospedagem agendada nesta data.");
      }
      if (
        hospedagens[i].checkIn <= checkOut &&
        hospedagens[i].checkOut >= checkIn
      ) {
        erros.push("Já existe uma hospedagem agendada nesta data.");
      }
      if (
        hospedagens[i].checkIn <= checkIn &&
        hospedagens[i].checkOut >= checkOut
      ) {
        erros.push("Já existe uma hospedagem agendada nesta data.");
      }
    }

    if (
      !hospede ||
      !quarto ||
      !checkOut ||
      !checkIn ||
      !diarias ||
      !valor_total
    ) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json({ Erro: erros });
    }
    //Fim do bloco de verificações.

    const novaHospedagem = new Hospedagem({
      quarto,
      hospede,
      checkIn,
      checkOut,
      diarias,
      valor_total,
      dependentes,
    });

    await handleFatura(novaHospedagem);

    novaHospedagem
      .save()
      .then(() => {
        return res.json({
          Sucesso: true,
          Message: "Hospedagem agendada com sucesso.",
          novaHospedagem,
        });
      })
      .catch((err) => {
        return res.json({
          Erro: "Erro ao agendar nova hospedagem.",
          SysError: err,
        });
      });
  },
  async index(req, res) {
    let hospedagens = await Hospedagem.find()
      .populate("quarto")
      .populate("hospede")
      .populate("dependentes");
    return res.json(hospedagens);
  },
};
