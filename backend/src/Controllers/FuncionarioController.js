//Carregamento dos módulos do Node
const bcrypt = require("bcryptjs");

//Carregamento dos modulos node
const mongoose = require("mongoose");
//Carregamento do modelo no banco de dados.
require("../models/Funcionario");
require("../models/Conta");

//Definição das constantes das models.
const Funcionario = mongoose.model("funcionarios");
const Conta = mongoose.model("contas");

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
    } = req.body;

    //Bloco de verificações
    let erros = [];
    if (!TestaCPF(cpf)) {
      erros.push("CPF inválido.");
    }

    const funcionario = await Funcionario.findOne({ cpf: cpf });
    if (funcionario) {
      erros.push("Já existe um funcionário com este CPF cadastrado.");
    }

    const conta = await Conta.findOne({ login: login });
    if (conta) {
      erros.push("Já existe uma conta com este login cadastrado.");
    }

    if (
      !nome ||
      !nascimento ||
      !rg ||
      !telefone ||
      !email ||
      !senha ||
      !login
    ) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json({ Erro: erros });
    }
    //Fim do bloco de verificações.

    const novoFuncionario = new Funcionario({
      nome,
      nascimento,
      rg,
      cpf,
      telefone,
      email,
      nivel,
    });

    novoFuncionario
      .save()
      .then(() => {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(senha, salt, (err, hash) => {
            const novaConta = new Conta({
              funcionario: novoFuncionario._id,
              login: login,
              senha: hash,
              nome: nome,
              nivel: nivel,
            });
            novaConta
              .save()
              .then(() => {
                return res.json(
                  { Sucesso: "Funcionário cadastrado" },
                  novoFuncionario,
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
          Erro: "Erro ao salvar novo funcionário.",
          "SysError: ": err,
        });
      });
  },

  async index(req, res) {
    let funcionarios = await Funcionario.find({ ativo: true });
    if (!funcionarios) {
      return res.json("Erro", "Não foi possível encontrar nenhum funcionário.");
    }

    return res.json(funcionarios);
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

    let funcionario = await Funcionario.findById(id, { ativo: true });

    funcionario.nome = nome;
    funcionario.telefone = telefone;
    funcionario.nascimento = nascimento;
    funcionario.email = email;

    funcionario
      .save()
      .then(() => {
        Conta.findOne({ funcionario: funcionario._id }).then((conta) => {
          conta.nome = funcionario.nome;
          conta.save().then(() => {
            return res.json({
              Sucesso: "Dados atualizados com sucesso.",
              SysReturn: funcionario,
            });
          });
        });
      })
      .catch((err) => {
        return res.json({
          Erro: "Erro ao atulizar os dados do funcionário.",
          SysError: err,
        });
      });
  },

  async delete(req, res) {
    const id = req.params.id;

    let funcionario = await Funcionario.findById(id);

    if (!funcionario) {
      return res.json({ Erro: "Não foi possível encontrar o funcionário" });
    }

    funcionario.ativo = false;

    funcionario
      .save()
      .then(() => {
        Conta.findOneAndDelete({ funcionario: id }).then(() => {
          return res.json({ Sucesso: "Funcionario desativado com sucesso." });
        });
      })
      .catch((err) => {
        return res.json({
          Erro: "Não foi possível desativar o funcionario.",
          SysError: err,
        });
      });
  },

  async indexAtivar(req, res) {
    let funcionarios = await Funcionario.find({ ativo: false });
    if (!funcionarios) {
      return res.json("Erro", "Não foi possível encontrar nenhum funcionário.");
    }

    return res.json(funcionarios);
  },

  async activate(req, res) {
    const id = req.params.id;
    const { login, senha } = req.body;

    let funcionario = await Funcionario.findById(id);

    const conta = await Conta.findOne({ login: login });
    if (conta) {
      return res.json({ Erro: "Já existe uma conta com este login." });
    }

    if (!funcionario) {
      return res.json({ Erro: "Não foi possível encontrar o funcionário" });
    }

    funcionario.ativo = true;

    funcionario
      .save()
      .then(() => {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(senha, salt, (err, hash) => {
            const novaConta = new Conta({
              funcionario: funcionario._id,
              login: login,
              senha: hash,
              nome: funcionario.nome,
              nivel: funcionario.nivel,
            });

            novaConta
              .save()
              .then(() => {
                return res.json(
                  { Sucesso: "Funcionário reativado." },
                  funcionario,
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
          Erro: "Não foi possível desativar o funcionario.",
          SysError: err,
        });
      });
  },
};
