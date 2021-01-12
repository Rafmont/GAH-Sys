const bcrypt = require("bcryptjs");
//Carregamento dos modulos node
const mongoose = require("mongoose");

//Carregamento do modelo no banco de dados.
require("../models/Conta");

//Definição das constantes das models.
const Conta = mongoose.model("contas");

module.exports = {
  async TrocarSenha(req, res) {
    const { senhaAtual, senhaNova1, senhaNova2 } = req.body;

    const conta1 = await Conta.find({
      ativo: true,
      funcionario: req.params.id,
    });
    const conta2 = await Conta.find({ ativo: true, terapeuta: req.params.id });

    let conta;
    if (conta1.length > 0) {
      conta = conta1;
    } else if (conta2.length > 0) {
      conta = conta2;
    } else if (conta1.length === 0 && conta2.length === 0) {
      return res.json({ Erro: "Nenhuma conta encontrada." });
    }

    await bcrypt.compare(senhaAtual, conta[0].senha, (err, result) => {
      let resultado = result;
      if (resultado) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(senhaNova1, salt, (err, hash) => {
            conta[0].senha = hash;
            conta[0].save();
            return res.json({ Sucesso: "Senha alterada com sucesso!" });
          });
        });
      } else {
        return res.json({ Erro: "Senha atual incorreta." });
      }
    });
  },
};
