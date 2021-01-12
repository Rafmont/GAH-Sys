import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  FiPlusSquare,
  FiEye,
  FiEdit3,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../../services/api";
import { Modal } from "react-bootstrap";
import $ from "jquery";
import moment from "moment";

import "./style.css";

export default function Funcionarios() {
  //Definição de estados:
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionarioAtivo, setFuncionarioAtivo] = useState([]);
  const [operacao, setOperacao] = useState("");
  const [errosList, setErrosList] = useState("");
  const [funcao, setFuncao] = useState("");
  const [dataUpdate, setDataUpdate] = useState("");

  //Definição dos estados dos modais:
  const [showReadModal, setShowReadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);

  //Funções para se lidar com a abertura dos modais.
  async function handleShowReadModal(funcionario) {
    setFuncionarioAtivo(funcionario);
    await handleFuncao(funcionario);
    setShowReadModal(true);
  }

  function handleCloseReadModal() {
    setShowReadModal(false);
  }

  function handleShowEditModal(funcionario) {
    setFuncionarioAtivo(funcionario);

    let data = funcionario.nascimento;

    let dia = data.substr(0, 2);
    let mes = data.substr(3, 2);
    let ano = data.substr(6, 4);

    let dataFormatada = ano + "-" + mes + "-" + dia;

    setDataUpdate(dataFormatada);
    setShowEditModal(true);
  }

  function handleCloseEditModal() {
    setShowEditModal(false);
  }

  async function handleShowDeleteModal(funcionario) {
    setFuncionarioAtivo(funcionario);
    await handleFuncao(funcionario);
    setShowDeleteModal(true);
  }

  function handleCloseDeleteModal() {
    setShowDeleteModal(false);
  }

  function handleShowCreateModal() {
    setShowCreateModal(true);
  }

  function handleCloseCreateModal() {
    setShowCreateModal(false);
  }

  function handleCloseSuccessModal() {
    setShowSuccessModal(false);
  }

  function handleCloseErroModal() {
    setShowErroModal(false);
  }

  //Requisição da lista de funcionarios direto da API:
  useEffect(() => {
    api.get("/funcionarios").then((response) => {
      setFuncionarios(response.data);
      console.log(response.data);
    });
  }, []);

  function reloadFuncionarios() {
    api.get("/funcionarios").then((response) => {
      setFuncionarios(response.data);
    });
  }

  //Funções da página:
  $(document).ready(function () {
    $("#cpf-create").mask("999.999.999-99");
    $("#telefone-create").mask("(000) 00000-0000");
    $("#telefone-update").mask("(000) 00000-0000");
    $("#rg-create").mask("00.000.000-00");
  });

  function buscaNome() {
    var entrada, filtro, tabela, tr, td, i, txtValue;

    entrada = document.getElementById("palavra");
    filtro = entrada.value.toUpperCase();
    tabela = document.getElementById("tabela");
    tr = tabela.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filtro) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  async function handleDeleteForm() {
    try {
      let response = await api.delete("funcionarios/" + funcionarioAtivo._id);
      if (!response.data.Erro) {
        reloadFuncionarios();
        setOperacao("desativado");
        setShowDeleteModal(false);
        setShowSuccessModal(true);
      } else {
        setShowDeleteModal(false);
        setShowErroModal(true);
      }
    } catch (err) {
      setShowDeleteModal(false);
      setShowErroModal(true);
    }
  }

  async function handleEditForm(e) {
    e.preventDefault();

    let dataNaoFormatada = document.getElementById("nascimento-update").value;
    let dataFormatada = moment(dataNaoFormatada).format("DD/MM/YYYY");

    const data = {
      nome: document.getElementById("nome-update").value,
      nascimento: dataFormatada,
      telefone: document.getElementById("telefone-update").value,
      email: document.getElementById("email-update").value,
    };

    try {
      const response = await api.put(
        "funcionarios/" + funcionarioAtivo._id,
        data
      );
      reloadFuncionarios();
      if (!response.data.Erro) {
        setOperacao("atualizado");
        setShowEditModal(false);
        setShowSuccessModal(true);
      } else {
        setOperacao("atualizar");
        setShowEditModal(false);
        setShowErroModal(true);
      }
    } catch (err) {
      setShowEditModal(false);
      setShowErroModal(true);
    }
  }

  async function handleCreateForm(e) {
    e.preventDefault();

    let dataNaoFormatada = document.getElementById("nascimento-create").value;
    let dataFormatada = moment(dataNaoFormatada).format("DD/MM/YYYY");

    const data = {
      nome: document.getElementById("nome-create").value,
      nascimento: dataFormatada,
      rg: document.getElementById("rg-create").value,
      cpf: document.getElementById("cpf-create").value,
      telefone: document.getElementById("telefone-create").value,
      email: document.getElementById("email-create").value,
      nivel: document.getElementById("nivel-create").value,
      login: document.getElementById("login-create").value,
      senha: document.getElementById("senha-create").value,
    };

    try {
      const response = await api.post("funcionarios", data);

      if (!response.data.Erro) {
        reloadFuncionarios();
        setOperacao("cadastrado");
        setShowCreateModal(false);
        setShowSuccessModal(true);
      } else {
        setErrosList(response.data.Erro);
        setShowErroModal(true);
      }
    } catch (err) {
      setShowCreateModal(false);
      setShowErroModal(true);
    }
  }

  function handleFuncao(funcionario) {
    if (funcionario.nivel === "1") {
      setFuncao("Atendente");
    } else if (funcionario.nivel === "2") {
      setFuncao("Gerente");
    } else {
      setFuncao("Administrador do sistema");
    }

    return 0;
  }

  return (
    <div>
      <Navbar />
      <main className="global-container shadow">
        <h4>Funcionários</h4>
        <hr />
        <strong>Buscar: </strong>
        <table className="table align-center mt-2">
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Digite o nome do funcionário..."
                  className="form-control"
                  id="palavra"
                  onKeyUp={buscaNome}
                />
              </td>
              <td>
                <a
                  href="#"
                  onClick={() => {
                    handleShowCreateModal();
                  }}
                >
                  <FiPlusSquare size={40} />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <table className="table align-center" id="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ver detalhes</th>
              <th>Editar</th>
              <th>Desativar</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.map((funcionario) => (
              <tr key={funcionario._id}>
                <td>{funcionario.nome}</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      handleShowReadModal(funcionario);
                    }}
                  >
                    {" "}
                    <FiEye size={30} />{" "}
                  </a>
                </td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      handleShowEditModal(funcionario);
                    }}
                  >
                    {" "}
                    <FiEdit3 size={30} />{" "}
                  </a>
                </td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      handleShowDeleteModal(funcionario);
                    }}
                  >
                    {" "}
                    <FiTrash2 size={30} />{" "}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/*LISTA DE MODAIS UTILIZADOS NA PÁGINA*/}

        {/* Modal Create */}
        <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="lg">
          <Modal.Header closeButton>
            <h5>Cadastrar funcionário</h5>
          </Modal.Header>
          <form onSubmit={handleCreateForm}>
            <Modal.Body>
              <strong>Nome do funcionário: </strong> <br></br>
              <input
                type="text"
                className="form-control mt-2"
                id="nome-create"
                required
              />{" "}
              <br></br>
              <strong>Data de nascimento: </strong> <br></br>
              <input
                type="date"
                className="form-control mt-2"
                id="nascimento-create"
                required
              />{" "}
              <br></br>
              <strong>E-mail: </strong> <br></br>
              <input
                type="email"
                className="form-control mt-2"
                id="email-create"
                required
              />{" "}
              <br></br>
              <strong>Telefone: </strong> <br></br>
              <input
                type="text"
                className="form-control mt-2"
                id="telefone-create"
                required
                placeholder="(DDD) 99999-9999"
              />{" "}
              <br></br>
              <table className="table table-borderless">
                <tr>
                  <th>RG: </th>
                  <th>CPF: </th>
                </tr>
                <tr>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      id="rg-create"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      id="cpf-create"
                      required
                      minLength="11"
                      maxLength="11"
                    />
                  </td>
                </tr>
              </table>
              <strong>Função: </strong> <br></br>
              <select id="nivel-create" className="form-control mt-2">
                <option value="1">Atendente</option>
                <option value="2">Gerente</option>
                <option value="3">Administrador</option>
              </select>
              <br></br>
              <hr></hr>
              <strong>Informações da conta de acesso</strong>
              <br></br>
              <hr></hr>
              <strong>Login: </strong> <br></br>
              <input
                type="text"
                className="form-control mt-2"
                id="login-create"
                required
              />{" "}
              <br></br>
              <strong>Senha: </strong> <br></br>
              <input
                type="password"
                className="form-control mt-2"
                id="senha-create"
                required
              />{" "}
              <br></br>
              <hr></hr>
              <div className="align-center">
                <button className="btn btn-success" type="submit">
                  Cadastar
                </button>
              </div>
            </Modal.Body>
          </form>
        </Modal>

        {/* Modal Read */}
        <Modal show={showReadModal} onHide={handleCloseReadModal} size="lg">
          <Modal.Header closeButton>
            <h5>Ver funcionário</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Nome do funcionário: </strong> <br></br>
              {funcionarioAtivo.nome}
            </p>
            <strong>Data de nascimento: </strong> <br></br>
            {funcionarioAtivo.nascimento}
            <p>
              {" "}
              <br></br>
              <strong>Contato: </strong> <br></br>
              Telefone: {funcionarioAtivo.telefone} <br></br>
              E-mail: {funcionarioAtivo.email}
            </p>
            <p>
              <strong>Dados: </strong> <br></br>
              RG: {funcionarioAtivo.rg} <br></br>
              CPF: {funcionarioAtivo.cpf}
            </p>
            <p>
              <strong>Função: </strong> <br></br>
              {funcao}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-info" onClick={handleCloseReadModal}>
              Fechar
            </button>
          </Modal.Footer>
        </Modal>

        {/* Modal Delete */}
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} size="lg">
          <Modal.Header closeButton>
            <h5>Desativar funcionário</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Nome do funcionário: </strong> <br></br>
              {funcionarioAtivo.nome}
            </p>
            <strong>Data de nascimento: </strong> <br></br>
            {funcionarioAtivo.nascimento}
            <p>
              {" "}
              <br></br>
              <strong>Contato: </strong> <br></br>
              Telefone: {funcionarioAtivo.telefone} <br></br>
              E-mail: {funcionarioAtivo.email}
            </p>
            <p>
              <strong>Dados: </strong> <br></br>
              RG: {funcionarioAtivo.rg} <br></br>
              CPF: {funcionarioAtivo.cpf}
            </p>
            <p>
              <strong>Função: </strong> <br></br>
              {funcao}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-danger" onClick={handleDeleteForm}>
              Desativar
            </button>
            <button className="btn btn-info" onClick={handleCloseDeleteModal}>
              Cancelar
            </button>
          </Modal.Footer>
        </Modal>

        {/* Modal Edit */}
        <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
          <Modal.Header closeButton>
            <h5>Editar funcionário</h5>
          </Modal.Header>
          <form onSubmit={handleEditForm}>
            <Modal.Body>
              <strong>Nome do funcionário: </strong> <br></br>
              <input
                type="text"
                className="form-control mt-2"
                id="nome-update"
                required
                defaultValue={funcionarioAtivo.nome}
              />{" "}
              <br></br>
              <strong>Data de nascimento: </strong> <br></br>
              <input
                type="date"
                className="form-control mt-2"
                id="nascimento-update"
                required
                defaultValue={dataUpdate}
              />{" "}
              <br></br>
              <strong>E-mail: </strong> <br></br>
              <input
                type="email"
                className="form-control mt-2"
                id="email-update"
                required
                defaultValue={funcionarioAtivo.email}
              />{" "}
              <br></br>
              <strong>Telefone: </strong> <br></br>
              <input
                type="text"
                className="form-control mt-2"
                id="telefone-update"
                required
                defaultValue={funcionarioAtivo.telefone}
              />{" "}
              <br></br>
              <hr />
              <div className="align-center">
                <button className="btn btn-success" type="submit">
                  Editar
                </button>
              </div>
            </Modal.Body>
          </form>
        </Modal>

        {/* Modal Sucesso */}
        <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
          <div className="bg-success">
            <Modal.Body>
              <div className="text-white align-center">
                <br></br>
                <FiCheckCircle size="46" /> <br></br> <br></br>
                <h6>Funcionário {operacao} com sucesso!</h6> <br></br>
                <button
                  className="btn btn-primary"
                  onClick={handleCloseSuccessModal}
                >
                  Concluido
                </button>
              </div>
            </Modal.Body>
          </div>
        </Modal>

        {/* Modal Erro */}
        <Modal show={showErroModal} onHide={handleCloseErroModal}>
          <div className="bg-danger">
            <Modal.Body>
              <div className="text-white align-center">
                <br></br>
                <FiAlertCircle size="46" /> <br></br> <br></br>
                <h6>Erro ao executar operação, tente novamente.</h6> <br></br>
                <p>{errosList}</p>
                <button
                  className="btn btn-primary"
                  onClick={handleCloseErroModal}
                >
                  Concluido
                </button>
              </div>
            </Modal.Body>
          </div>
        </Modal>
      </main>
    </div>
  );
}
