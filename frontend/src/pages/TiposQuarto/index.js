import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../../services/api";
import {
  FiPlusSquare,
  FiEye,
  FiEdit3,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { Modal } from "react-bootstrap";
import $ from "jquery";
import moment from "moment";

export default function Servicos() {
  //States da página.
  const [tiposQuarto, setTiposQuarto] = useState([]);
  const [tipoQuartoAtivo, setTipoQuartoAtivo] = useState([]);
  const [erros, setErros] = useState("");
  const [sucesso, setSucesso] = useState("");

  //States para os modais.
  const [showReadModal, setShowReadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);

  //Funções de obtenção e atualização de states.
  useEffect(() => {
    api.get("/tiposquarto").then((response) => {
      setTiposQuarto(response.data);
    });
  }, []);

  function reloadTiposQuarto() {
    api.get("/tiposquarto").then((response) => {
      setTiposQuarto(response.data);
    });
  }

  //Funções da página:

  //Funções para modais.
  function handleShowCreateModal() {
    setShowCreateModal(true);
  }

  function handleCloseCreateModal() {
    setShowCreateModal(false);
  }

  function handleShowReadModal(tipoQuarto) {
    setTipoQuartoAtivo(tipoQuarto);
    setShowReadModal(true);
  }

  function handleCloseReadModal() {
    setShowReadModal(false);
  }

  function handleShowEditModal(tipoQuarto) {
    setTipoQuartoAtivo(tipoQuarto);
    setShowEditModal(true);
  }

  function handleCloseEditModal() {
    setShowEditModal(false);
  }

  function handleShowDeleteModal(tipoQuarto) {
    setTipoQuartoAtivo(tipoQuarto);
    setShowDeleteModal(true);
  }

  function handleCloseDeleteModal() {
    setShowDeleteModal(false);
  }

  function handleShowErroModal() {
    setShowErroModal(true);
  }

  function handleCloseErroModal() {
    setShowErroModal(false);
  }

  function handleShowSuccessModal() {
    setShowSuccessModal(true);
  }

  function handleCloseSuccessModal() {
    setShowSuccessModal(false);
  }

  //Funções para lidar com formulários.
  async function handleCreateForm(e) {
    e.preventDefault();
    const dados = {
      nome: document.getElementById("nome-create").value,
      descricao: document.getElementById("descricao-create").value,
      capacidade: document.getElementById("capacidade-create").value,
      valor_diaria: document.getElementById("valor-create").value,
    };

    try {
      const response = await api.post("/tiposquarto", dados);
      if (response.data.Sucesso) {
        reloadTiposQuarto();
        setSucesso("Tipo de quarto cadastrado com sucesso!");
        handleCloseCreateModal();
        handleShowSuccessModal();
      } else {
        setErros(response.data.Erro);
        handleCloseCreateModal();
        handleShowErroModal();
      }
    } catch (err) {
      setErros("Não foi possível criar novo tipo de quarto, tente novamente.");
      handleCloseCreateModal();
      handleShowErroModal();
    }
  }

  async function handleEditForm(e) {
    e.preventDefault();
    const dados = {
      nome: document.getElementById("nome-update").value,
      descricao: document.getElementById("descricao-update").value,
      capacidade: document.getElementById("capacidade-update").value,
      valor_diaria: document.getElementById("valor-update").value,
    };

    try {
      const response = await api.put(
        "/tiposquarto/" + tipoQuartoAtivo._id,
        dados
      );
      if (response.data.Sucesso) {
        reloadTiposQuarto();
        setSucesso("Tipo de quarto atualziado com sucesso!");
        handleCloseEditModal();
        handleShowSuccessModal();
      } else {
        setErros(response.data.Erro);
        handleCloseEditModal();
        handleShowErroModal();
      }
    } catch (err) {
      setErros("Não foi possível atualizar o tipo de quarto, tente novamente.");
      handleCloseEditModal();
      handleShowErroModal();
    }
  }

  async function handleDeleteForm(e) {
    e.preventDefault();

    try {
      const response = await api.delete("/tiposquarto/" + tipoQuartoAtivo._id);
      if (response.data.Sucesso) {
        reloadTiposQuarto();
        setSucesso("Tipo de quarto desativado com sucesso!");
        handleCloseDeleteModal();
        handleShowSuccessModal();
      } else {
        setErros(response.data.Erro);
        handleCloseDeleteModal();
        handleShowErroModal();
      }
    } catch (err) {
      setErros("Não foi possível desativar o tipo de quarto, tente novamente.");
      handleCloseDeleteModal();
      handleShowErroModal();
    }
  }

  //Funções auxiliares
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

  return (
    <div>
      <Navbar />
      <main className="global-container shadow">
        <h4>Tipos de quarto </h4>
        <table className="table align-center mt-2">
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Digite o nome do tipo de quarto..."
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
            {tiposQuarto.map((tipoQuarto) =>
              tipoQuarto._id === "5f50da20bbf4a924a8670c12" ? (
                <></>
              ) : (
                <tr key={tipoQuarto._id}>
                  <td>{tipoQuarto.nome}</td>
                  <td>
                    <a
                      href="#"
                      onClick={() => {
                        handleShowReadModal(tipoQuarto);
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
                        handleShowEditModal(tipoQuarto);
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
                        handleShowDeleteModal(tipoQuarto);
                      }}
                    >
                      {" "}
                      <FiTrash2 size={30} />{" "}
                    </a>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* Modal Create */}
        <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="lg">
          <Modal.Header closeButton>
            <h5>Cadastrar tipo de quarto</h5>
          </Modal.Header>
          <form onSubmit={handleCreateForm}>
            <Modal.Body>
              <strong>Nome: </strong>
              <input className="form-control" required id="nome-create"></input>
              <br />
              <strong>Descrição: </strong>
              <textarea
                className="form-control"
                required
                id="descricao-create"
              ></textarea>
              <br />
              <strong>Capacidade: </strong>
              <input
                className="form-control"
                required
                id="capacidade-create"
              ></input>
              <br />
              <strong>Valor da diária: </strong>
              <input
                className="form-control"
                required
                id="valor-create"
              ></input>
              <hr />
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
            <h5>Ver tipo de quarto</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              Tipo de quarto: <strong>{tipoQuartoAtivo.nome}</strong>
            </p>
            <p>Descrição: {tipoQuartoAtivo.descricao}</p>
            <p>
              Capacidade: <strong>{tipoQuartoAtivo.capacidade}</strong> pessoas.
            </p>
            <p>
              Valor da diária:{" "}
              <strong>R$ {tipoQuartoAtivo.valor_diaria}.</strong>
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
            <h5>Desativar tipo de quarto</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              Tipo de quarto: <strong>{tipoQuartoAtivo.nome}</strong>
            </p>
            <p>Descrição: {tipoQuartoAtivo.descricao}</p>
            <p>
              Capacidade: <strong>{tipoQuartoAtivo.capacidade}</strong> pessoas.
            </p>
            <p>
              Valor da diária:{" "}
              <strong>R$ {tipoQuartoAtivo.valor_diaria}.</strong>
            </p>
          </Modal.Body>
          <div className="align-center">
            <Modal.Footer>
              <button className="btn btn-danger" onClick={handleDeleteForm}>
                Desativar
              </button>
              <button className="btn btn-info" onClick={handleCloseDeleteModal}>
                Cancelar
              </button>
            </Modal.Footer>
          </div>
        </Modal>

        {/* Modal Edit */}
        <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
          <Modal.Header closeButton>
            <h5>Editar tipo de quarto</h5>
          </Modal.Header>
          <form onSubmit={handleEditForm}>
            <Modal.Body>
              <strong>Nome: </strong>
              <input
                className="form-control"
                required
                id="nome-update"
                defaultValue={tipoQuartoAtivo.nome}
              ></input>
              <br />
              <strong>Descrição: </strong>
              <textarea
                className="form-control"
                required
                id="descricao-update"
                defaultValue={tipoQuartoAtivo.descricao}
              ></textarea>
              <br />
              <strong>Capacidade: </strong>
              <input
                className="form-control"
                required
                id="capacidade-update"
                defaultValue={tipoQuartoAtivo.capacidade}
              ></input>
              <br />
              <strong>Valor da diária: </strong>
              <input
                className="form-control"
                required
                id="valor-update"
                defaultValue={tipoQuartoAtivo.valor_diaria}
              ></input>
              <hr />
              <div className="align-center">
                <button className="btn btn-success" type="submit">
                  Editar
                </button>
              </div>
            </Modal.Body>
          </form>
        </Modal>

        {/* Modal Erro */}
        <Modal show={showErroModal} onHide={handleCloseErroModal}>
          <div className="bg-danger">
            <Modal.Body>
              <div className="text-white align-center">
                <br></br>
                <FiAlertCircle size="46" /> <br></br> <br></br>
                <h6>Erro!</h6> <br></br>
                <p>{erros}</p>
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

        {/* Modal Sucesso */}
        <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
          <div className="bg-success">
            <Modal.Body>
              <div className="text-white align-center">
                <br></br>
                <FiCheckCircle size="46" /> <br></br> <br></br>
                <h6>Sucesso!</h6> <br></br>
                <p>{sucesso}</p>
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
      </main>
    </div>
  );
}
