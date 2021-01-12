import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

import {
  FiPlusSquare,
  FiEye,
  FiEdit3,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import Navbar from "../components/Navbar";

import api from "../../services/api";

import "./style.css";

export default function Especialidade() {
  const [especialidades, setEspecialidades] = useState([]);

  const [operacao, setOperacao] = useState("");

  const [especilidadeAtiva, setEspecialidadeAtiva] = useState([]);
  const [showReadModal, setShowReadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);

  useEffect(() => {
    api.get("/especialidades").then((response) => {
      setEspecialidades(response.data);
    });
  }, []);

  function reloadEspecialidades() {
    api.get("/especialidades").then((response) => {
      setEspecialidades(response.data);
    });
  }

  function handleShowReadModal(especialidade) {
    setShowReadModal(true);
    setEspecialidadeAtiva(especialidade);
  }

  function handleCloseReadModal() {
    setShowReadModal(false);
  }

  function handleShowEditModal(especialidade) {
    setShowEditModal(true);
    setEspecialidadeAtiva(especialidade);
  }

  function handleCloseEditModal() {
    setShowEditModal(false);
  }

  async function handleEditForm(e) {
    e.preventDefault();

    const data = {
      nome: document.getElementById("nome-update").value,
      descricao: document.getElementById("descricao-update").value,
    };

    try {
      const response = await api.put(
        "especialidades/update/" + especilidadeAtiva._id,
        data
      );
      reloadEspecialidades();
      if (!response.data.Erro) {
        setOperacao("atualizada");
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

  function handleShowDeleteModal(especialidade) {
    setShowDeleteModal(true);
    setEspecialidadeAtiva(especialidade);
  }

  function handleCloseDeleteModal() {
    setShowDeleteModal(false);
  }

  async function handleDeleteForm() {
    try {
      await api.delete("especialidades/" + especilidadeAtiva._id);
      reloadEspecialidades();
      setOperacao("desativada");
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      setShowDeleteModal(false);
      setShowErroModal(true);
    }
  }

  function handleShowCreateModal() {
    setShowCreateModal(true);
  }

  function handleCloseCreateModal() {
    setShowCreateModal(false);
  }

  async function handleCreateForm(e) {
    e.preventDefault();

    const data = {
      nome: document.getElementById("nome-create").value,
      descricao: document.getElementById("descricao-create").value,
    };

    try {
      await api.post("especialidades", data);
      reloadEspecialidades();
      setOperacao("cadastrada");
      setShowCreateModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      setShowCreateModal(false);
      setShowErroModal(true);
    }
  }

  function handleCloseSuccessModal() {
    setShowSuccessModal(false);
  }

  function handleCloseErroModal() {
    setShowErroModal(false);
  }

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
        <h4>Especialidades </h4>
        <hr />
        <strong>Buscar: </strong>
        <table className="table align-center mt-2">
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Digite o nome da especialidade..."
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
            {especialidades.map((especialidade) => (
              <tr key={especialidade._id}>
                <td>{especialidade.nome}</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      handleShowReadModal(especialidade);
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
                      handleShowEditModal(especialidade);
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
                      handleShowDeleteModal(especialidade);
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

        {/* Modal Create */}
        <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="lg">
          <Modal.Header closeButton>
            <h5>Cadastrar especialidade</h5>
          </Modal.Header>
          <form onSubmit={handleCreateForm}>
            <Modal.Body>
              <strong>Nome da especialidade: </strong> <br></br>
              <input
                type="text"
                className="form-control mt-2"
                id="nome-create"
                required
              />{" "}
              <br></br>
              <strong>Descrição: </strong> <br></br>
              <textarea
                id="descricao-create"
                className="form-control mt-2"
                rows="4"
                required
              ></textarea>
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
            <h5>Ver especialidade</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Nome da especialidade: </strong> <br></br>
              {especilidadeAtiva.nome}
            </p>
            <p className="modal-descricao">
              <strong>Descrição: </strong> <br></br>
              {especilidadeAtiva.descricao}
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
            <h5>Desativar especialidade</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Nome da especialidade: </strong> <br></br>
              {especilidadeAtiva.nome}
            </p>
            <p className="modal-descricao">
              <strong>Descrição: </strong> <br></br>
              {especilidadeAtiva.descricao}
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
            <h5>Editar especialidade</h5>
          </Modal.Header>
          <form onSubmit={handleEditForm}>
            <Modal.Body>
              <strong>Nome da especialidade: </strong> <br></br>
              <input
                type="text"
                className="form-control mt-2"
                defaultValue={especilidadeAtiva.nome}
                required
                id="nome-update"
              />{" "}
              <br></br>
              <strong>Descrição: </strong> <br></br>
              <textarea
                id="descricao-update"
                className="form-control mt-2"
                rows="4"
                required
                defaultValue={especilidadeAtiva.descricao}
              ></textarea>
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
                <h6>Especialidade {operacao} com sucesso!</h6> <br></br>
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
