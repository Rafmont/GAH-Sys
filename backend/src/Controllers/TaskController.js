//Módulos nodejs
const mongoose = require("mongoose");
const moment = require("moment");
const PrettyLog = require("@emersonbraun/pretty-log").default;

//Modulos mongo
require("../models/Atendimento");
require("../models/Acerto");
require("../models/Terapeuta");
require("../models/Configuracao");

//Criação das constantes
const Acerto = mongoose.model("acertos");
const Atendimento = mongoose.model("atendimentos");
const Terapeuta = mongoose.model("terapeutas");
const Configuracao = mongoose.model("configuracoes");

//Funções auxiliares
async function handleAcerto(item) {
  let acerto = await Acerto.findOne({ terapeuta: item.terapeuta, ativo: true });
  let configuracoes = await Configuracao.findOne();

  if (!acerto) {
    let porcentagem =
      (configuracoes.porcentagem_atendimento * item.valor) / 100;
    let valor_calculado = item.valor - porcentagem;
    const novoAcerto = new Acerto({
      terapeuta: item.terapeuta,
      atendimentos: item,
      valor: valor_calculado,
    });

    await novoAcerto.save();
  } else {
    let porcentagem =
      (configuracoes.porcentagem_atendimento * item.valor) / 100;
    let valor_calculado = item.valor - porcentagem;
    acerto.atendimentos.push(item);
    acerto.valor = acerto.valor + valor_calculado;

    await acerto.save();
  }
}

module.exports = {
  async handleAtendimento() {
    const atendimentos = await Atendimento.find({
      ativo: true,
      verificado: false,
    });

    for (let i = 0; i < atendimentos.length; i++) {
      let atendimento = atendimentos[i];

      let dataHoje = moment().format("YYYY-MM-DD:HH:mm:ss");

      let dataAtendimento = moment(atendimento.data_inicial).format(
        "YYYY-MM-DD:HH:mm:ss"
      );

      console.log("===============================================");
      PrettyLog.success(
        "Verificação de atendimento realizada. Horário: ",
        moment().format("HH:mm:ss")
      );
      console.log("===============================================");

      if (dataAtendimento <= dataHoje) {
        atendimento.verificado = true;
        await handleAcerto(atendimento);
        await atendimento.save();
      }
    }
  },
};
