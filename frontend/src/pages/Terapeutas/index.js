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

export default function Terapeutas() {
  //Definição dos estados.
  const [terapeutas, setTerapeutas] = useState([]);
  const [terapeutaAtivo, setTerapeutaAtivo] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadeAtiva, setEspecialidadeAtiva] = useState([]);
  const [dataUpdate, setDataUpdate] = useState("");
  const [operacao, setOperacao] = useState("");
  const [errosList, setErrosList] = useState("");

  //Definição dos estados dos modais:
  const [showReadModal, setShowReadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);

  //Requisição da lista de funcionarios direto da API:
  useEffect(() => {
    api.get("/terapeutas").then((response) => {
      setTerapeutas(response.data);
    });
  }, []);

  useEffect(() => {
    api.get("/especialidades").then((response) => {
      setEspecialidades(response.data);
    });
  }, []);

  //Funções para se lidar com a abertura dos modais.
  async function handleShowReadModal(terapeuta) {
    setTerapeutaAtivo(terapeuta);

    setEspecialidadeAtiva(terapeuta.especialidade);

    setShowReadModal(true);
  }

  function handleCloseReadModal() {
    setShowReadModal(false);
  }

  async function handleShowEditModal(terapeuta) {
    setTerapeutaAtivo(terapeuta);

    let data = terapeuta.nascimento;

    let dia = data.substr(0, 2);
    let mes = data.substr(3, 2);
    let ano = data.substr(6, 4);

    let dataFormatada = ano + "-" + mes + "-" + dia;

    setDataUpdate(dataFormatada);
    await setShowEditModal(true);

    verificaAcerto(terapeuta.acerto);
    handleEspecialidades(terapeuta);
  }

  function handleCloseEditModal() {
    setShowEditModal(false);
  }

  async function handleShowDeleteModal(terapeuta) {
    setTerapeutaAtivo(terapeuta);
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

  //Funções para lidar com formulários.
  async function handleCreateForm(e) {
    e.preventDefault();

    const checkboxes = document.querySelectorAll(
      'input[name="especialidade-create"]:checked'
    );
    let idEsp = [];
    checkboxes.forEach((checkbox) => {
      idEsp.push(checkbox.value);
    });

    let dataNaoFormatada = document.getElementById("nascimento-create").value;
    let dataFormatada = moment(dataNaoFormatada).format("DD/MM/YYYY");

    const data = {
      nome: document.getElementById("nome-create").value,
      nascimento: dataFormatada,
      rg: document.getElementById("rg-create").value,
      cpf: document.getElementById("cpf-create").value,
      telefone: document.getElementById("telefone-create").value,
      email: document.getElementById("email-create").value,
      login: document.getElementById("login-create").value,
      senha: document.getElementById("senha-create").value,
      especialidade: idEsp,
      acerto: document.getElementById("acerto-create").value,
      nivel: 0,
    };
    try {
      const response = await api.post("terapeutas", data);

      if (!response.data.Erro) {
        reloadTerapeutas();
        setOperacao("cadastrado");
        setShowCreateModal(false);
        setShowSuccessModal(true);
      } else {
        setErrosList(response.data.SysErro);
        setShowErroModal(true);
      }
    } catch (err) {
      setShowCreateModal(false);
      setShowErroModal(true);
    }
  }

  async function handleDeleteForm() {
    try {
      let response = await api.delete("terapeutas/" + terapeutaAtivo._id);
      if (!response.data.Erro) {
        reloadTerapeutas();
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

    const checkboxes = document.querySelectorAll(
      'input[name="especialidade-update"]:checked'
    );
    let idEsp = [];
    checkboxes.forEach((checkbox) => {
      idEsp.push(checkbox.value);
    });

    let dataNaoFormatada = document.getElementById("nascimento-update").value;
    let dataFormatada = moment(dataNaoFormatada).format("DD/MM/YYYY");

    const data = {
      nome: document.getElementById("nome-update").value,
      nascimento: dataFormatada,
      telefone: document.getElementById("telefone-update").value,
      email: document.getElementById("email-update").value,
      especialidade: idEsp,
      acerto: document.getElementById("acerto-update").value,
    };

    try {
      const response = await api.put("terapeutas/" + terapeutaAtivo._id, data);
      reloadTerapeutas();
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

  //Funções da página.
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

  function reloadTerapeutas() {
    api.get("/terapeutas").then((response) => {
      setTerapeutas(response.data);
    });
  }

  $(document).ready(function () {
    $("#cpf-create").mask("999.999.999-99");
    $("#telefone-create").mask("(000) 00000-0000");
    $("#telefone-update").mask("(000) 00000-0000");
    $("#rg-create").mask("00.000.000-00");
  });

  function verificaAcerto(acerto) {
    if (acerto === 1) {
      document.getElementById("acerto-update").value = "1";
    } else if (acerto === 2) {
      document.getElementById("acerto-update").value = "2";
    } else if (acerto === 3) {
      document.getElementById("acerto-update").value = "3";
    }
  }

  function handleEspecialidades(terapeuta) {
    terapeuta.especialidade.forEach((especialidade) => {
      document.getElementById(especialidade).checked = true;
    });
  }

  return (
    <div>
      <Navbar />
      <main className="global-container shadow">
        <h4>Terapêutas</h4>
        <hr />
        <strong>Buscar: </strong>
        <table className="table align-center mt-2">
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Digite o nome do terapêuta..."
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
            {terapeutas.map((terapeuta) => (
              <tr key={terapeuta._id}>
                <td>{terapeuta.nome}</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      handleShowReadModal(terapeuta);
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
                      handleShowEditModal(terapeuta);
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
                      handleShowDeleteModal(terapeuta);
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
            <h5>Cadastrar terapêuta</h5>
          </Modal.Header>
          <form onSubmit={handleCreateForm}>
            <Modal.Body>
              <strong>Nome do terapêuta: </strong> <br></br>
              <input
                type="text"
                className="form-control mt-2"
                id="nome-create"
                required
              />
              <br></br>
              <strong>Data de nascimento: </strong> <br></br>
              <input
                type="date"
                className="form-control mt-2"
                id="nascimento-create"
                required
              />
              <br></br>
              <strong>E-mail: </strong> <br></br>
              <input
                type="email"
                className="form-control mt-2"
                id="email-create"
                required
              />
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
              <strong>Acerto: </strong>
              <br></br>
              <select
                name="acerto"
                className="form-control mt-2"
                id="acerto-create"
              >
                <option value="1">Diário</option>
                <option value="2">Semanal</option>
                <option value="3">Mensal</option>
              </select>
              <br></br>
              <table className="table table-bordless align-center">
                <thead>
                  <tr>
                    <th>Especialidade</th>
                    <th>Selecionar</th>
                  </tr>
                </thead>
                <tbody>
                  {especialidades.map((especialidade) => (
                    <tr key={especialidade._id} id="hover-table-row">
                      <td>{especialidade.nome}</td>
                      <td>
                        <input
                          name="especialidade-create"
                          type="checkbox"
                          value={especialidade._id}
                        ></input>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              />
              <br></br>
              <strong>Senha: </strong> <br></br>
              <input
                type="password"
                className="form-control mt-2"
                id="senha-create"
                required
              />
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
            <h5>Ver terapêuta</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Nome do terapêuta: </strong> <br></br>
              {terapeutaAtivo.nome}
            </p>
            <strong>Data de nascimento: </strong> <br></br>
            {terapeutaAtivo.nascimento}
            <p>
              <br></br>
              <strong>Contato: </strong> <br></br>
              Telefone: {terapeutaAtivo.telefone} <br></br>
              E-mail: {terapeutaAtivo.email}
            </p>
            <p>
              <strong>Dados: </strong> <br></br>
              RG: {terapeutaAtivo.rg} <br></br>
              CPF: {terapeutaAtivo.cpf}
            </p>
            <p>
              <strong>Especialidade(s):</strong>
              <br></br>
              {especialidadeAtiva.map((especialidade) => (
                <p>{especialidade}</p>
              ))}
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
            <h5>Desativar terapêuta</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Nome do terapêuta: </strong> <br></br>
              {terapeutaAtivo.nome}
            </p>
            <strong>Data de nascimento: </strong> <br></br>
            {terapeutaAtivo.nascimento}
            <p>
              {" "}
              <br></br>
              <strong>Contato: </strong> <br></br>
              Telefone: {terapeutaAtivo.telefone} <br></br>
              E-mail: {terapeutaAtivo.email}
            </p>
            <p>
              <strong>Dados: </strong> <br></br>
              RG: {terapeutaAtivo.rg} <br></br>
              CPF: {terapeutaAtivo.cpf}
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
            <h5>Editar terapêuta</h5>
          </Modal.Header>
          <form onSubmit={handleEditForm}>
            <Modal.Body>
              <strong>Nome do terapêuta: </strong> <br></br>
              <input
                type="text"
                className="form-control mt-2"
                id="nome-update"
                required
                defaultValue={terapeutaAtivo.nome}
              />
              <br></br>
              <strong>Data de nascimento: </strong> <br></br>
              <input
                type="date"
                className="form-control mt-2"
                id="nascimento-update"
                required
                defaultValue={dataUpdate}
              />
              <br></br>
              <strong>E-mail: </strong> <br></br>
              <input
                type="email"
                className="form-control mt-2"
                id="email-update"
                required
                defaultValue={terapeutaAtivo.email}
              />
              <br></br>
              <strong>Telefone: </strong> <br></br>
              <input
                type="text"
                className="form-control mt-2"
                id="telefone-update"
                required
                defaultValue={terapeutaAtivo.telefone}
              />
              <table className="table table-bordless align-center">
                <thead>
                  <tr>
                    <th>Especialidade</th>
                    <th>Selecionar</th>
                  </tr>
                </thead>
                <tbody>
                  {especialidades.map((especialidade) => (
                    <tr key={especialidade._id} id="hover-table-row">
                      <td>{especialidade.nome}</td>
                      <td>
                        <input
                          name="especialidade-update"
                          type="checkbox"
                          value={especialidade._id}
                          id={especialidade.nome}
                        ></input>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br></br>
              <strong>Acerto: </strong>
              <br></br>
              <select
                name="acerto"
                className="form-control mt-2"
                id="acerto-update"
              >
                <option value="1">Diário</option>
                <option value="2">Semanal</option>
                <option value="3">Mensal</option>
              </select>
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
                <h6>Terapêuta {operacao} com sucesso!</h6> <br></br>
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
