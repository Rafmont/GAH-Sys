//Carregamento das funções node
const express = require("express");

const routes = express.Router();

//Importação das controllers.
const EspecialidadeController = require("./Controllers/EspecialidadeController");
const FuncionarioController = require("./Controllers/FuncionarioController");
const TerapeutaController = require("./Controllers/TerapeutaController");
const EventoController = require("./Controllers/EventoController");
const AuthController = require("./Controllers/AuthController");
const ServicoController = require("./Controllers/ServicoController");
const HospedeController = require("./Controllers/HospedeController");
const AtendimentoController = require("./Controllers/AtendimentoController");
const TipoQuartoController = require("./Controllers/TipoQuartoController");
const QuartoController = require("./Controllers/QuartoController");
const HospedagemController = require("./Controllers/HospedagemController");
const ConfiguracaoController = require("./Controllers/ConfiguracaoController");
const FaturaController = require("./Controllers/FaturaController");
const DespesaController = require("./Controllers/DespesaController");
const AcertoController = require("./Controllers/AcertoController");
const ContaController = require("./Controllers/ContaController");

//Rotas.

//Rota para autenticação.
routes.post("/login", AuthController.login);

//Rotas das especialidades.
routes.post("/especialidades", EspecialidadeController.create);
routes.get("/especialidades", EspecialidadeController.index);
routes.delete("/especialidades/:id", EspecialidadeController.delete);
routes.put("/especialidades/:id", EspecialidadeController.activate);
routes.put("/especialidades/update/:id", EspecialidadeController.update);

//Rotas dos funcionários.
routes.post("/funcionarios", FuncionarioController.create);
routes.get("/funcionarios", FuncionarioController.index);
routes.get("/funcionarios/ativar", FuncionarioController.indexAtivar);
routes.put("/funcionarios/:id", FuncionarioController.update);
routes.delete("/funcionarios/:id", FuncionarioController.delete);
routes.put("/funcionarios/ativar/:id", FuncionarioController.activate);

//Rotas dos terapêutas.
routes.post("/terapeutas", TerapeutaController.create);
routes.get("/terapeutas", TerapeutaController.index);
routes.get("/terapeutas/nopop", TerapeutaController.indexNoEsp);
routes.get("/terapeutas/activate", TerapeutaController.indexAtivar);
routes.get("/terapeutas/:id", TerapeutaController.filteredIndex);
routes.put("/terapeutas/:id", TerapeutaController.update);
routes.delete("/terapeutas/:id", TerapeutaController.delete);
routes.put("/terapeutas/ativar/:id", TerapeutaController.activate);
routes.get("/oneTerapeuta/:id", TerapeutaController.oneTerapeuta);

//Rotas dos eventos.
routes.post("/eventos/:id", EventoController.create);
routes.get("/eventos", EventoController.index);
routes.put("/eventos/:id", EventoController.update);
routes.delete("/eventos/:id", EventoController.delete);

//Rotas para serviços.
routes.post("/servicos", ServicoController.create);
routes.get("/servicos", ServicoController.index);
routes.get("/servicos/:id", ServicoController.filteredIndex);
routes.put("/servicos/:id", ServicoController.update);
routes.delete("/servicos/:id", ServicoController.delete);

//Rotas dos Hóspedes.
routes.post("/hospedes", HospedeController.create);
routes.get("/hospedes", HospedeController.index);
routes.put("/hospedes/:id", HospedeController.update);
routes.delete("/hospedes/:id", HospedeController.delete);
routes.put("/hospedes/ativar/:id", HospedeController.activate);

//Rotas dos Atendimentos.
routes.post("/atendimentos", AtendimentoController.create);
routes.get("/atendimentos", AtendimentoController.index);
routes.get("/atendimentos/:id", AtendimentoController.filteredIndex);
routes.delete("/atendimentos/:id", AtendimentoController.delete);
//Rotas dos tipos de quarto.
routes.post("/tiposquarto", TipoQuartoController.create);
routes.get("/tiposquarto", TipoQuartoController.index);
routes.put("/tiposquarto/:id", TipoQuartoController.update);
routes.delete("/tiposquarto/:id", TipoQuartoController.delete);

//Rotas dos quartos.
routes.post("/quartos", QuartoController.create);
routes.get("/quartos", QuartoController.index);
routes.put("/quartos/:id", QuartoController.update);
routes.delete("/quartos/:id", QuartoController.delete);

//Rotas de configurações
routes.post("/configuracao", ConfiguracaoController.create);
routes.get("/configuracao", ConfiguracaoController.index);
routes.put("/configuracao", ConfiguracaoController.update);

//Rotas das hospedagens
routes.post("/hospedagens", HospedagemController.create);
routes.get("/hospedagens", HospedagemController.index);

//Rotas das faturas
routes.get("/faturas", FaturaController.index);
routes.get("/faturasPagar", FaturaController.indexPagar);
routes.get("/faturasGeral", FaturaController.indexGeral);
routes.post("/faturasPagar/:id", FaturaController.confirmar);

//Rotas das despesas
routes.post("/despesas", DespesaController.create);
routes.get("/despesas", DespesaController.index);
routes.put("/despesas/:id", DespesaController.update);
routes.delete("/despesas/:id", DespesaController.delete);

//Rotas dos acertos
routes.get("/acertos", AcertoController.index);
routes.get("/acertos/:id", AcertoController.filteredIndex);
routes.get("/acertosPagar", AcertoController.indexPagar);
routes.post("/acertos/:id", AcertoController.confirmar);

//Rotas das Contas
routes.post("/alterarsenha/:id", ContaController.TrocarSenha);

module.exports = routes;
