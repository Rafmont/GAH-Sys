//Carregamento dos módulos do Node
const bcrypt = require("bcryptjs");

//Carregamento dos modulos node
const mongoose = require("mongoose");

//Carregamento do modelo no banco de dados.
require("../models/Terapeuta");
require("../models/Conta");
require("../models/Especialidade");

//Definição das constantes das models.
const Terapeuta = mongoose.model("terapeutas");
const Conta = mongoose.model("contas");
const Especialidade = mongoose.model("especialidades");

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
    const {
      nome,
      nascimento,
      rg,
      cpf,
      telefone,
      email,
      nivel,
      login,
      senha,
      especialidade,
      acerto,
    } = req.body;

    //Bloco de verificações
    let erros = [];
    if (!TestaCPF(cpf)) {
      erros.push("CPF inválido.");
    }

    const terapeuta = await Terapeuta.findOne({ cpf: cpf });
    if (terapeuta) {
      erros.push("Já existe um terapêuta com este CPF cadastrado.");
    }

    const conta = await Conta.findOne({ login: login });
    if (conta) {
      erros.push("Já existe uma conta com este login cadastrado.");
    }

    if (!nome) {
      erros.push("Preencha o nome corretamente!");
    } else if (!nascimento) {
      erros.push("Preencha a data de nascimento!");
    } else if (!rg) {
      erros.push("Preencha o RG!");
    } else if (!telefone) {
      erros.push("Preencha o telefone corretamente!");
    } else if (!email) {
      erros.push("Preencha o e-mail corretamente!");
    } else if (!senha || !login) {
      erros.push("Preencha o login e a senha corretamente!");
    } else if (!especialidade) {
      erros.push("O terapêuta deve possuir ao menos uma especialidade.");
    } else if (!acerto) {
      erros.push("Você deve selecionar uma forma de acerto com o terapêuta.");
    }

    if (erros.length > 0) {
      return res.json({ Erro: "Campos inválidos", SysErro: erros });
    }
    //Fim do bloco de verificações.

    const novoTerapeuta = new Terapeuta({
      nome,
      nascimento,
      rg,
      cpf,
      telefone,
      email,
      nivel,
      acerto,
      especialidade,
    });
    novoTerapeuta
      .save()
      .then(() => {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(senha, salt, (err, hash) => {
            const novaConta = new Conta({
              terapeuta: novoTerapeuta._id,
              login: login,
              senha: hash,
              nome: nome,
              nivel: nivel,
            });
            novaConta
              .save()
              .then(() => {
                return res.json(
                  { Sucesso: "Terapêuta cadastrado" },
                  novoTerapeuta,
                  novaConta
                );
              })
              .catch((err) => {
                return res.json({
                  Erro: "Erro ao salvar novo terapêuta.",
                  SysError: err,
                });
              });
          });
        });
      })
      .catch((err) => {
        return res.json({
          Erro: "Erro ao salvar novo terapêuta.",
          "SysError: ": err,
        });
      });
  },

  async index(req, res) {
    let terapeutas = await Terapeuta.find({ ativo: true }).populate(
      "especialidade"
    );

    if (!terapeutas) {
      return res.json("Erro", "Não foi possível encontrar nenhum terapêuta.");
    }

    let terapeutasFormatados = [];

    for (i = 0; i < terapeutas.length; i++) {
      let terapeutaI = terapeutas[i];

      let terapeutaFormatado = {
        _id: terapeutaI._id,
        nome: terapeutaI.nome,
        nascimento: terapeutaI.nascimento,
        rg: terapeutaI.rg,
        cpf: terapeutaI.cpf,
        telefone: terapeutaI.telefone,
        email: terapeutaI.email,
        nivel: terapeutaI.nivel,
        acerto: terapeutaI.acerto,
        especialidade: [],
      };

      for (j = 0; j < terapeutaI.especialidade.length; j++) {
        let especialidadeI = terapeutaI.especialidade[j];
        terapeutaFormatado.especialidade.push(especialidadeI.nome);
      }

      terapeutasFormatados.push(terapeutaFormatado);
    }

    return res.json(terapeutasFormatados);
  },

  async indexAtivar(req, res) {
    let terapeutas = await Terapeuta.find({ ativo: false });
    if (!terapeutas) {
      return res.json("Erro", "Não foi possível encontrar nenhum terapêuta.");
    }

    return res.json(terapeutas);
  },

  async indexNoEsp(req, res) {
    let terapeutas = await Terapeuta.find({ ativo: true }).populate(
      "especialidade"
    );

    if (!terapeutas) {
      return res.json("Erro", "Não foi possível encontrar nenhum terapêuta.");
    }

    let terapeutasFormatados = [];

    for (i = 0; i < terapeutas.length; i++) {
      let terapeutaI = terapeutas[i];

      let terapeutaFormatado = {
        _id: terapeutaI._id,
        nome: terapeutaI.nome,
        nascimento: terapeutaI.nascimento,
        rg: terapeutaI.rg,
        cpf: terapeutaI.cpf,
        telefone: terapeutaI.telefone,
        email: terapeutaI.email,
        nivel: terapeutaI.nivel,
        acerto: terapeutaI.acerto,
        especialidade: [],
      };

      for (j = 0; j < terapeutaI.especialidade.length; j++) {
        let especialidadeI = terapeutaI.especialidade[j];
        terapeutaFormatado.especialidade.push(especialidadeI._id);
      }

      terapeutasFormatados.push(terapeutaFormatado);
    }

    return res.json(terapeutasFormatados);
  },

  async filteredIndex(req, res) {
    const especialidadeId = req.params.id;

    const terapeutas = await Terapeuta.find({
      especialidade: especialidadeId,
    }).populate("especialidade");

    if (!terapeutas) {
      return res.json("Erro", "Não foi possível encontrar algum terapêuta.");
    }

    let terapeutasFormatados = [];

    for (i = 0; i < terapeutas.length; i++) {
      let terapeutaI = terapeutas[i];

      let terapeutaFormatado = {
        _id: terapeutaI._id,
        nome: terapeutaI.nome,
        nascimento: terapeutaI.nascimento,
        rg: terapeutaI.rg,
        cpf: terapeutaI.cpf,
        telefone: terapeutaI.telefone,
        email: terapeutaI.email,
        nivel: terapeutaI.nivel,
        acerto: terapeutaI.acerto,
        especialidade: [],
      };

      for (j = 0; j < terapeutaI.especialidade.length; j++) {
        let especialidadeI = terapeutaI.especialidade[j];
        terapeutaFormatado.especialidade.push(especialidadeI.nome);
      }

      terapeutasFormatados.push(terapeutaFormatado);
    }

    return res.json(terapeutasFormatados);
  },

  async oneTerapeuta(req, res) {
    const terapeuta = await Terapeuta.find({ _id: req.params.id });
    return res.json(terapeuta);
  },

  async update(req, res) {
    const terapeutaId = req.params.id;
    const {
      nome,
      telefone,
      nascimento,
      email,
      especialidade,
      acerto,
    } = req.body;

    let erros = [];
    if (
      !nome ||
      !telefone ||
      !nascimento ||
      !email ||
      !especialidade ||
      !acerto
    ) {
      erros.push("Por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json(erros);
    }

    let terapeuta = await Terapeuta.findById(terapeutaId);

    if (!terapeuta) {
      res.json("Erro", "Não foi possível encontrar o terapêuta desejado.");
    }

    terapeuta.nome = nome;
    terapeuta.telefone = telefone;
    terapeuta.nascimento = nascimento;
    terapeuta.email = email;
    terapeuta.acerto = acerto;
    terapeuta.especialidade = especialidade;

    terapeuta
      .save()
      .then(() => {
        Conta.findOne({ terapeuta: terapeuta.id }).then((conta) => {
          conta.nome = terapeuta.nome;

          conta.save().then(() => {
            return res.json({ Sucesso: "Terapêuta atualizado com sucesso." });
          });
        });
      })
      .catch((err) => {
        return res.json({
          Erro: "Não foi possível salvar as atualizações no terapêuta.",
          "SysError:": err,
        });
      });
  },

  async delete(req, res) {
    const terapeutaId = req.params.id;

    let terapeuta = await Terapeuta.findById(terapeutaId);

    if (!terapeuta) {
      return res.json({ Erro: "Não foi possível encontrar o terapêuta." });
    }

    terapeuta.ativo = false;

    Conta.findOneAndDelete({ terapeuta: terapeutaId }).then(() => {
      terapeuta.save().then(() => {
        return res.json({ Sucesso: "Terapêuta desativado com sucesso." });
      });
    });
  },

  async activate(req, res) {
    const id = req.params.id;
    const { login, senha } = req.body;

    let terapeuta = await Terapeuta.findById(id);

    const conta = await Conta.findOne({ login: login });
    if (conta) {
      return res.json({ Erro: "Já existe uma conta com este login." });
    }

    if (!terapeuta) {
      return res.json({ Erro: "Não foi possível encontrar o funcionário" });
    }

    terapeuta.ativo = true;

    terapeuta
      .save()
      .then(() => {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(senha, salt, (err, hash) => {
            const novaConta = new Conta({
              terapeuta: terapeuta._id,
              login: login,
              senha: hash,
              nome: terapeuta.nome,
              nivel: terapeuta.nivel,
            });

            novaConta
              .save()
              .then(() => {
                return res.json(
                  { Sucesso: "Terapêuta reativado." },
                  terapeuta,
                  novaConta
                );
              })
              .catch((err) => {
                return res.json(err);
              });
          });
        });
      })
      .catch((err) => {
        return res.json({
          Erro: "Não foi possível desativar o terapêuta.",
          SysError: err,
        });
      });
  },
};
