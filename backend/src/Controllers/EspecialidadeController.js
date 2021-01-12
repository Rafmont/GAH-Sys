//Carregamento dos modulos node
const mongoose = require("mongoose");
//Carregamento do modelo no banco de dados.
require("../models/Especialidade");
require("../models/Terapeuta");

//Definição das constantes das models.
const Especialidade = mongoose.model("especialidades");
const Terapeuta = mongoose.model("terapeutas");

module.exports = {
  async create(req, res) {
    const { nome, descricao } = req.body;

    const novaEspecialidade = new Especialidade({
      nome,
      descricao,
    });

    await novaEspecialidade.save().then(() => {
      return res.json(novaEspecialidade);
    });
  },

  async index(req, res) {
    let especialidades = await Especialidade.find({ ativo: true });

    if (especialidades) {
      return res.json(especialidades);
    } else {
      return res.json({ Erro: "Erro ao encontrar especialidades." });
    }
  },

  async delete(req, res) {
    const id = req.params.id;

    //Verifica por expressão regular se o id passado tem o formado de object id.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.json({ Erro: "Erro ao encontrar especialidade pelo ID." });
    }

    let especialidadeSave = await Especialidade.findById(id);
    let terapeutas = await Terapeuta.find();

    if (!especialidadeSave) {
      return res.json({ Erro: "Erro ao encontrar especialidade pelo ID." });
    }

    especialidadeSave.ativo = false;

    await especialidadeSave
      .save()
      .then(() => {
        for (let i = 0; i < terapeutas.length; i++) {
          let especialidades = terapeutas[i].especialidade;

          for (let j = 0; j < especialidades.length; j++) {
            let str1 = especialidades[j]._id.toString();
            let srt2 = especialidadeSave._id.toString();

            if (str1 === srt2) {
              terapeutas[i].especialidade.splice(
                terapeutas[i].especialidade.indexOf(especialidades[j]._id)
              );
              terapeutas[i].save();
            }
          }
        }
        return res.json({ Sucesso: "especialidade desativada com sucesso." });
      })
      .catch((err) => {
        return res.json({
          Erro: "Erro ao salvar alteração de estado na especialidade.",
        });
      });
  },

  async activate(req, res) {
    const id = req.params.id;

    //Verifica por expressão regular se o id passado tem o formado de object id.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.json({ Erro: "Erro ao encontrar especialidade pelo ID." });
    }

    let especialidade = await Especialidade.findById(id);

    if (!especialidade) {
      return res.json({ Erro: "Erro ao encontrar especialidade pelo ID." });
    }

    especialidade.ativo = true;

    await especialidade
      .save()
      .then(() => {
        return res.json({ Sucesso: "especialidade ativada com sucesso." });
      })
      .catch((err) => {
        return res.json({
          Erro: "Erro ao salvar alteração de estado na especialidade.",
        });
      });
  },

  async update(req, res) {
    const id = req.params.id;
    const { nome, descricao } = req.body;

    //Verifica por expressão regular se o id passado tem o formado de object id.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.json({ Erro: "Erro ao encontrar especialidade pelo ID." });
    }

    let especialidade = await Especialidade.findById(id);

    if (!especialidade) {
      return res.json({ Erro: "Erro ao encontrar especialidade pelo ID." });
    }

    especialidade.nome = nome;
    especialidade.descricao = descricao;

    await especialidade
      .save()
      .then(() => {
        return res.json({ Sucesso: "Especialidade atualizada com sucesso!" });
      })
      .catch((err) => {
        return res.json({ Erro: "Erro ao atualizar especialidade." });
      });
  },
};
