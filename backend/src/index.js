//Carregamento de módulos:
//Módulos do Noje.JS
const express = require("express");
const mongoose = require("mongoose");
const schedule = require("node-schedule");
const cors = require("cors");

//Arquivo de tasks automáticas
const TaskController = require("./Controllers/TaskController");

//Arquivo de Rotas.
const routes = require("./routes");

//Configurações.
//App.

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

//Mongoose.
async function conectDB() {
  mongoose.Promise = global.Promise;
  try {
    await mongoose.connect("mongodb://localhost/GAH-SYS-DB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado ao Banco de Dados!");
  } catch (err) {
    console.log("Erro ao conectar ao banco de dados: " + err);
  }
}

conectDB();

//Tarefa automática a cada 10 minutos para verificar se o atendimento foi realizado.
schedule.scheduleJob("*/10 * * * *", function () {
  TaskController.handleAtendimento();
});

//Outros
//Definição da porta e deixando o servidor na espera de novas requisições.
const PORT = 3333;
app.listen(PORT, () => {
  console.log("Servidor disponível!");
});
