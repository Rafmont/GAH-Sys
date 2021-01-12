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

export default function Quartos() {
  //States da página.
  const [quartoAtivo, setQuartoAtivo] = useState([]);
  const [tipoQuartoAtivo, setTipoQuartoAtivo] = useState([]);
  const [tiposQuarto, setTiposQuarto] = useState([]);
  const [quartos, setQuartos] = useState([]);
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
    api.get("/quartos").then((response) => {
      setQuartos(response.data);
      setQuartoAtivo(response.data[0]);
      api.get("/tiposquarto").then((response2) => {
        setTiposQuarto(response2.data);
        setTipoQuartoAtivo(response2.data[0]);
      });
    });
  }, []);

  function reloadQuartos() {
    api.get("/quartos").then((response) => {
      setQuartos(response.data);
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

  function handleShowReadModal(quarto) {
    setShowReadModal(true);
    setQuartoAtivo(quarto);
    setTipoQuartoAtivo(quarto.tipoQuarto);
  }

  function handleCloseReadModal() {
    setShowReadModal(false);
  }

  function handleShowEditModal(quarto) {
    setShowEditModal(true);
    setQuartoAtivo(quarto);
    setTipoQuartoAtivo(quarto.tipoQuarto);
    let selectEdit = document.getElementById("tipoquarto-edit");
  }

  function handleCloseEditModal() {
    setShowEditModal(false);
  }

  function handleShowDeleteModal(quarto) {
    setShowDeleteModal(true);
    setQuartoAtivo(quarto);
    setTipoQuartoAtivo(quarto.tipoQuarto);
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
      numero: parseInt(document.getElementById("numero-create").value, 10),
      estado: document.getElementById("estado-create").value,
      tipoQuarto: document.getElementById("tipoquarto-create").value,
    };

    try {
      const response = await api.post("/quartos", dados);
      if (response.data.Sucesso) {
        reloadQuartos();
        setSucesso("Quarto cadastrado com sucesso!");
        handleCloseCreateModal();
        handleShowSuccessModal();
      } else {
        setErros(response.data.Erro);
        handleCloseCreateModal();
        handleShowErroModal();
      }
    } catch (err) {
      setErros("Não foi possível criar quarto, tente novamente.");
      handleCloseCreateModal();
      handleShowErroModal();
    }
  }

  async function handleEditForm(e) {
    e.preventDefault();
    const dados = {
      numero: parseInt(document.getElementById("numero-update").value, 10),
      estado: document.getElementById("estado-update").value,
      tipoQuarto: document.getElementById("tipoquarto-update").value,
    };

    try {
      const response = await api.put("/quartos/" + quartoAtivo._id, dados);
      if (response.data.Sucesso) {
        reloadQuartos();
        setSucesso("Quarto atualizado com sucesso!");
        handleCloseEditModal();
        handleShowSuccessModal();
      } else {
        setErros(response.data.Erro);
        handleCloseEditModal();
        handleShowErroModal();
      }
    } catch (err) {
      setErros("Não foi possível atualizar o quarto, tente novamente.");
      handleCloseEditModal();
      handleShowErroModal();
    }
  }

  async function handleDeleteForm(e) {
    e.preventDefault();

    try {
      const response = await api.delete("/quartos/" + quartoAtivo._id);
      if (response.data.Sucesso) {
        reloadQuartos();
        setSucesso("Quarto desativado com sucesso!");
        handleCloseDeleteModal();
        handleShowSuccessModal();
      } else {
        setErros(response.data.Erro);
        handleCloseDeleteModal();
        handleShowErroModal();
      }
    } catch (err) {
      setErros("Não foi possível desativar o quarto, tente novamente.");
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

  function buscaNome2() {
    var entrada, filtro, tabela, tr, td, i, txtValue;

    entrada = document.getElementById("palavra2");
    filtro = entrada.value.toUpperCase();
    tabela = document.getElementById("tabela");
    tr = tabela.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
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
        <h4>Quartos </h4>

        <table className="table align-center mt-2">
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Digite o número do quarto..."
                  className="form-control"
                  id="palavra"
                  onKeyUp={buscaNome}
                />
              </td>
              <td rowSpan="2">
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
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Digite o nome do tipo do quarto..."
                  className="form-control"
                  id="palavra2"
                  onKeyUp={buscaNome2}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <table className="table align-center" id="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo de quarto</th>
              <th>Estado</th>
              <th>Ver detalhes</th>
              <th>Editar</th>
              <th>Desativar</th>
            </tr>
          </thead>
          <tbody>
            {quartos.map((quarto) => (
              <tr key={quarto._id}>
                <td>Quarto {quarto.numero}</td>
                <td>{quarto.tipoQuarto.nome}</td>
                <td>{quarto.estado}</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      handleShowReadModal(quarto);
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
                      handleShowEditModal(quarto);
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
                      handleShowDeleteModal(quarto);
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
            <h5>Cadastrar quarto</h5>
          </Modal.Header>
          <form onSubmit={handleCreateForm}>
            <Modal.Body>
              <strong>Número do quarto:</strong>
              <input
                type="number"
                className="form-control"
                required
                id="numero-create"
              ></input>
              <br />
              <strong>Estado do quarto:</strong>
              <select className="form-control" id="estado-create" required>
                <option value="disponível">Disponível</option>
                <option value="ocupado">Ocupado</option>
                <option value="manutenção">Manutenção</option>
              </select>
              <br />
              <strong>Tipo do quarto:</strong>
              <select className="form-control" id="tipoquarto-create" required>
                {tiposQuarto.map((tipoQuarto) => (
                  <option
                    key={tipoQuarto._id}
                    id={tipoQuarto._id}
                    value={tipoQuarto._id}
                  >
                    {tipoQuarto.nome}
                  </option>
                ))}
              </select>
              <br />
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
            <h5>Ver quarto</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Quarto {quartoAtivo.numero}</strong>
            </p>

            <p>
              Estado do quarto: <strong>{quartoAtivo.estado}</strong>
            </p>
            <hr />
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
            <h5>Desativar quarto</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Quarto {quartoAtivo.numero}</strong>
            </p>

            <p>
              Estado do quarto: <strong>{quartoAtivo.estado}</strong>
            </p>
            <hr />
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
            <h5>Editar qaurto</h5>
          </Modal.Header>
          <form onSubmit={handleEditForm}>
            <Modal.Body>
              <strong>Número do quarto:</strong>
              <input
                type="number"
                className="form-control"
                required
                id="numero-update"
                defaultValue={quartoAtivo.numero}
              ></input>
              <br />
              <strong>Estado do quarto:</strong>
              <select
                className="form-control"
                id="estado-update"
                defaultValue={quartoAtivo.estado}
                required
              >
                <option value="disponível">Disponível</option>
                <option value="ocupado">Ocupado</option>
                <option value="manutenção">Manutenção</option>
              </select>
              <br />
              <strong>Tipo do quarto:</strong>
              <select className="form-control" id="tipoquarto-update" required>
                {tiposQuarto.map((tipoQuarto) =>
                  quartoAtivo.tipoQuarto._id === tipoQuarto._id ? (
                    <option
                      key={tipoQuarto._id}
                      id={tipoQuarto._id}
                      selected
                      value={tipoQuarto._id}
                    >
                      {tipoQuarto.nome}
                    </option>
                  ) : (
                    <option
                      key={tipoQuarto._id}
                      id={tipoQuarto._id}
                      value={tipoQuarto._id}
                    >
                      {tipoQuarto.nome}
                    </option>
                  )
                )}
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
