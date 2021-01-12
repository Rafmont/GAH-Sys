//Carregamento dos modulos node
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Carregamento do modelo no banco de dados.
require("../models/Conta");

require("dotenv-safe").config();
var jwt = require("jsonwebtoken");

//Definição das constantes das models.
const Conta = mongoose.model("contas");

function handlePassword(err, result) {
  if (!err) {
    return result;
  } else {
    return res.json({ message: "Erro" });
  }
}

module.exports = {
  async login(req, res) {
    const { login, password } = req.body;

    let conta = await Conta.findOne({ login: login });

    if (!conta) {
      return res.json({
        ErrorMessage:
          "Conta não encontrada, por favor insira os dados novamente!",
      });
    }

    let response = await bcrypt.compare(
      password,
      conta.senha,
      handlePassword()
    );

    if (response === true) {
      let id = conta.id;

      let token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300, //Expira em 3 minutos
      });

      if (!conta.terapeuta) {
        return res.json({
          auth: true,
          token: token,
          nome: conta.nome,
          nivel: conta.nivel,
          id: conta.funcionario,
        });
      } else {
        return res.json({
          auth: true,
          token: token,
          nome: conta.nome,
          nivel: conta.nivel,
          id: conta.terapeuta,
        });
      }
    } else {
      return res.json({
        ErrorMessage: "Senha incorreta, por favor insira novamente.",
      });
    }
  },
};
