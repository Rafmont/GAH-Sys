//Carregamento dos modulos node
const mongoose = require("mongoose");

//Carregamento do modelo no banco de dados.
require("../models/Servico");

//Definição das constantes das models.
const Servico = mongoose.model("servicos");

module.exports = {
  async create(req, res) {
    const { nome, descricao, duracao, valor, especialidade } = req.body;

    //Inicio do bloco de verificação
    let erros = [];

    if (!nome || !descricao || !duracao || !valor || !especialidade) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json({ Erro: erros });
    }
    //Fim do bloco de verificações.

    const novoServico = new Servico({
      nome,
      descricao,
      duracao,
      valor,
      especialidade,
    });

    await novoServico
      .save()
      .then(() => {
        return res.json({ Sucesso: true, novoServico });
      })
      .catch((err) => {
        return res.json({ Erro: true, err });
      });
  },

  async index(req, res) {
    const servicos = await Servico.find({ ativo: true }).populate(
      "especialidade"
    );
    if (servicos) {
      return res.json(servicos);
    } else {
      return res.json({ Erro: true, Message: "Falha ao buscar serviços." });
    }
  },

  async filteredIndex(req, res) {
    const idEspecialidade = req.params.id;
    const servicos = await Servico.find({
      ativo: true,
      especialidade: idEspecialidade,
    });
    if (servicos) {
      return res.json(servicos);
    } else {
      return res.json({ Erro: true, Message: "Falha ao buscar serviços." });
    }
  },

  async update(req, res) {
    const servicoId = req.params.id;
    const { nome, descricao, duracao, valor } = req.body;

    //Inicio do bloco de verificação
    let erros = [];

    if (!nome || !descricao || !duracao || !valor) {
      erros.push("Campos em branco, por favor preencha todos os campos.");
    }

    if (erros.length > 0) {
      return res.json({ Erro: erros });
    }
    //Fim do bloco de verificações.

    const servico = await Servico.findOne({ _id: servicoId, ativo: true });

    if (!servico) {
      return res.json({
        Erro: true,
        Message: "Não foi encontrado um serviço com este ID.",
      });
    }

    servico.nome = nome;
    servico.descricao = descricao;
    servico.duracao = duracao;
    servico.valor = valor;

    servico
      .save()
      .then(() => {
        return res.json({ Sucesso: true, servico });
      })
      .catch((err) => {
        return res.json({
          Erro: true,
          Message: "Não foi possível alterar o serviço.",
        });
      });
  },

  async delete(req, res) {
    const servicoId = req.params.id;
    const servico = await Servico.findOne({ _id: servicoId, ativo: true });
    servico.ativo = false;
    servico
      .save()
      .then(() => {
        return res.json({ Sucesso: true, Message: "Serviço desativado." });
      })
      .catch((err) => {
        return res.json({ Erro: true, Message: "Falha ao desativar serviço." });
      });
  },
};
