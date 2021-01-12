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

export default function Servicos() {
  //States da página.
  const [servicos, setServicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [erros, setErros] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [servicoAtivo, setServicoAtivo] = useState([]);
  const [especialidadeAtiva, setEspecialidadeAtiva] = useState([]);

  //States para os modais.
  const [showReadModal, setShowReadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);

  //Funções de obtenção e atualização de states.
  useEffect(() => {
    api.get("/servicos").then((response) => {
      setServicos(response.data);
    });
  }, []);

  useEffect(() => {
    api.get("/especialidades").then((response) => {
      setEspecialidades(response.data);
    });
  }, []);

  function realoadServicos() {
    api.get("/servicos").then((response) => {
      setServicos(response.data);
    });
  }

  //Funções para modais.
  function handleShowCreateModal() {
    setShowCreateModal(true);
  }

  function handleCloseCreateModal() {
    setShowCreateModal(false);
  }

  function handleShowReadModal(servico) {
    setServicoAtivo(servico);
    setEspecialidadeAtiva(servico.especialidade);
    setShowReadModal(true);
  }

  function handleCloseReadModal() {
    setShowReadModal(false);
  }

  function handleShowEditModal(servico) {
    setServicoAtivo(servico);
    setEspecialidadeAtiva(servico.especialidade);
    setShowEditModal(true);
  }

  function handleCloseEditModal() {
    setShowEditModal(false);
  }

  function handleShowDeleteModal(servico) {
    setServicoAtivo(servico);
    setEspecialidadeAtiva(servico.especialidade);
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

    const data = {
      nome: document.getElementById("nome-create").value,
      descricao: document.getElementById("descricao-create").value,
      duracao: document.getElementById("duracao-create").value,
      valor: document.getElementById("valor-create").value,
      especialidade: document.getElementById("especialidade-create").value,
    };

    try {
      const response = await api.post("servicos", data);
      if (response.data.Sucesso) {
        realoadServicos();
        setSucesso("Serviço cadastrado com sucesso!");
        handleCloseCreateModal();
        handleShowSuccessModal();
      } else {
        setErros("Erro ao enviar dados ao servidor, tente novamente.");
        handleShowErroModal();
        handleCloseCreateModal();
      }
    } catch (err) {
      setErros("Erro ao cadastrar novo serviço, tente novamente.");
      handleShowErroModal();
      handleCloseCreateModal();
    }
  }

  async function handleEditForm(e) {
    e.preventDefault();

    let servicoId = servicoAtivo._id;

    const data = {
      nome: document.getElementById("nome-update").value,
      descricao: document.getElementById("descricao-update").value,
      duracao: document.getElementById("duracao-update").value,
      valor: document.getElementById("valor-update").value,
    };

    try {
      const response = await api.put("servicos/" + servicoId, data);
      if (response.data.Sucesso) {
        realoadServicos();
        setSucesso("Serviço editado com sucesso!");
        handleCloseEditModal();
        handleShowSuccessModal();
      } else {
        setErros("Erro ao enviar dados ao servidor, tente novamente.");
        handleShowErroModal();
        handleCloseEditModal();
      }
    } catch (err) {
      setErros("Erro ao alterar o serviço, tente novamente.");
      handleShowErroModal();
      handleCloseEditModal();
    }
  }

  async function handleDeleteForm(e) {
    let servicoId = servicoAtivo._id;
    try {
      const response = await api.delete("servicos/" + servicoId);
      if (response.data.Sucesso) {
        realoadServicos();
        setSucesso("Serviço desativado com sucesso!");
        handleCloseDeleteModal();
        handleShowSuccessModal();
      } else {
        setErros("Erro ao enviar dados ao servidor, tente novamente.");
        handleShowErroModal();
        handleCloseDeleteModal();
      }
    } catch (err) {
      setErros("Erro ao desativar o serviço, tente novamente.");
      handleShowErroModal();
      handleCloseDeleteModal();
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
        <h4>Serviços </h4>
        <table className="table align-center mt-2">
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Digite o nome do serviço..."
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
            {servicos.map((servico) => (
              <tr key={servico._id}>
                <td>{servico.nome}</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      handleShowReadModal(servico);
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
                      handleShowEditModal(servico);
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
                      handleShowDeleteModal(servico);
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
            <h5>Cadastrar serviço</h5>
          </Modal.Header>
          <form onSubmit={handleCreateForm}>
            <Modal.Body>
              <strong>Nome do serviço:</strong>
              <input
                type="text"
                id="nome-create"
                className="form-control"
                required
              ></input>
              <br></br>
              <strong>Descrição:</strong>
              <textarea
                id="descricao-create"
                className="form-control"
                required
              ></textarea>
              <br></br>
              <strong>Duração:</strong>
              <select id="duracao-create" className="form-control" required>
                <option value="30">30 minutos</option>
                <option value="60">60 minutos</option>
              </select>
              <br></br>
              <strong>Valor:</strong>
              <input
                type="number"
                id="valor-create"
                className="form-control"
                required
              ></input>
              <br></br>
              <strong>Especialidade:</strong>
              <select
                id="especialidade-create"
                className="form-control"
                required
              >
                {especialidades.map((especialidade) => (
                  <option key={especialidade._id} value={especialidade._id}>
                    {especialidade.nome}
                  </option>
                ))}
              </select>
              <br></br>
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
            <h5>Ver serviço</h5>
          </Modal.Header>
          <Modal.Body>
            <h6>{servicoAtivo.nome}</h6>
            <br></br>
            <p>{servicoAtivo.descricao}</p>
            <hr></hr>
            <p>
              Duração do serviço:{" "}
              <strong>{servicoAtivo.duracao} minutos.</strong>
            </p>
            <p>
              Valor do serviço: <strong>R$ {servicoAtivo.valor}.</strong>
            </p>
            <hr></hr>
            <p>Especialidade atrelada: {especialidadeAtiva.nome}.</p>
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
            <h5>Desativar serviço</h5>
          </Modal.Header>
          <Modal.Body>
            <h6>{servicoAtivo.nome}</h6>
            <br></br>
            <p>{servicoAtivo.descricao}</p>
            <hr></hr>
            <p>
              Duração do serviço:{" "}
              <strong>{servicoAtivo.duracao} minutos.</strong>
            </p>
            <p>
              Valor do serviço: <strong>R$ {servicoAtivo.valor}.</strong>
            </p>
            <hr></hr>
            <p>Especialidade atrelada: {especialidadeAtiva.nome}.</p>
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
            <h5>Editar serviço</h5>
          </Modal.Header>
          <form onSubmit={handleEditForm}>
            <Modal.Body>
              <strong>Nome do serviço:</strong>
              <input
                type="text"
                id="nome-update"
                className="form-control"
                required
                defaultValue={servicoAtivo.nome}
              ></input>
              <br></br>
              <strong>Descrição:</strong>
              <textarea
                id="descricao-update"
                className="form-control"
                required
                defaultValue={servicoAtivo.descricao}
              ></textarea>
              <br></br>
              <strong>Duração:</strong>
              <select
                id="duracao-update"
                className="form-control"
                required
                defaultValue={servicoAtivo.duracao}
              >
                <option value="30">30 minutos</option>
                <option value="60">60 minutos</option>
              </select>
              <br></br>
              <strong>Valor:</strong>
              <input
                type="number"
                id="valor-update"
                className="form-control"
                required
                defaultValue={servicoAtivo.valor}
              ></input>
              <hr />
              <p>
                Especialidade atrelada:{" "}
                <strong>{especialidadeAtiva.nome}.</strong>
              </p>
              <br></br>
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
