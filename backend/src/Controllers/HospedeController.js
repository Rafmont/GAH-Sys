//Carregamento dos modulos node
const mongoose = require("mongoose");
//Carregamento do modelo no banco de dados.
require("../models/Hospede");

//Definição das constantes das models.
const Hospede = mongoose.model("hospedes");

//Definição de fuções auxiliares.
function TestaCPF(strCPF) {
  strCPF = strCPF.split(".").join("");
  strCPF = strCPF.split("-").join("");

  var Soma;
  var Resto;
  Soma = 0;
  if (strCPF == "00000000000") return false;

  for (i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
}

module.exports = {
  async create(req, res) {
    const { nome, nascimento, rg, cpf, telefone, email, depende_de } = req.body;
    let dependente = false;

    //Bloco de verificações
    let erros = [];
    if (!TestaCPF(cpf)) {
      erros.push("CPF inválido.");
    }

    const hosepde = await Hospede.findOne({ cpf: cpf });
    if (hosepde) {
      erros.push("Já existe um hóspede com este CPF cadastrado.");
    }

    if (!nome || !nascimento || !rg || !telefone || !email) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json({ Erro: erros });
    }
    //Fim do bloco de verificações.

    if (!depende_de) {
      dependente = false;
    } else {
      dependente = true;
    }

    const novoHospede = new Hospede({
      nome,
      nascimento,
      rg,
      cpf,
      telefone,
      email,
      depende_de,
      dependente,
    });

    novoHospede
      .save()
      .then(() => {
        return res.json({
          Sucesso: true,
        });
      })
      .catch((err) => {
        return res.json({
          Erro: true,
          Message: "Erro ao salvar novo hóspede.",
          "SysError: ": err,
        });
      });
  },

  async index(req, res) {
    let hospedes = await Hospede.find({ ativo: true }).populate("depende_de");
    if (!hospedes) {
      return res.json("Erro", "Não foi possível encontrar nenhum hóspede.");
    }

    return res.json(hospedes);
  },

  async update(req, res) {
    const id = req.params.id;
    const { nome, telefone, nascimento, email } = req.body;

    //Inicio do bloco de verificação.
    let erros = [];
    if (!nome || !telefone || !nascimento || !email) {
      erros.push("Por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json(erros);
    }

    let hospede = await Hospede.findById(id, { ativo: true });

    hospede.nome = nome;
    hospede.telefone = telefone;
    hospede.nascimento = nascimento;
    hospede.email = email;

    hospede
      .save()
      .then(() => {
        return res.json({
          Sucesso: true,
          Message: "Dados atualizados com sucesso.",
          hospede,
        });
      })
      .catch((err) => {
        return res.json({
          Erro: true,
          Message: "Erro ao atulizar os dados do hóspede.",
          SysError: err,
        });
      });
  },

  async delete(req, res) {
    const id = req.params.id;

    let hospede = await Hospede.findById(id);

    if (!hospede) {
      return res.json({ Erro: "Não foi possível encontrar o hóspede." });
    }

    hospede.ativo = false;

    hospede
      .save()
      .then(() => {
        return res.json({
          Sucesso: true,
          Message: "Hóspede desativado com sucesso.",
        });
      })
      .catch((err) => {
        return res.json({
          Erro: true,
          Message: "Não foi possível desativar o Hóspede.",
          SysError: err,
        });
      });
  },

  async activate(req, res) {
    const id = req.params.id;
    const { login, senha } = req.body;

    let hospede = await Hospede.findById(id);

    if (!hospede) {
      return res.json({ Erro: "Não foi possível encontrar o hóspede." });
    }

    hospede.ativo = true;

    hospede
      .save()
      .then(() => {
        return res.json(
          { Sucesso: true, Message: "Hóspede reativado." },
          hospede
        );
      })
      .catch((err) => {
        return res.json({
          Erro: true,
          Message: "Não foi possível desativar o hóspede.",
          SysError: err,
        });
      });
  },
};
