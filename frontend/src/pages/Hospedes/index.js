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
  const [hospedes, setHospedes] = useState([]);
  const [erros, setErros] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [dataUpdate, setDataUpdate] = useState("");
  const [hospedeAtivo, setHospedeAtivo] = useState([]);

  //States para os modais.
  const [showReadModal, setShowReadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);

  //Funções de obtenção e atualização de states.
  useEffect(() => {
    api.get("/hospedes").then((response) => {
      setHospedes(response.data);
    });
  }, []);

  function realoadHospedes() {
    api.get("/hospedes").then((response) => {
      setHospedes(response.data);
    });
  }

  //Funções da página:
  $(document).ready(function () {
    $("#cpf-create").mask("999.999.999-99");
    $("#telefone-create").mask("(000) 00000-0000");
    $("#telefone-update").mask("(000) 00000-0000");
    $("#rg-create").mask("00.000.000-00");
  });

  //Funções para modais.
  function handleShowCreateModal() {
    setShowCreateModal(true);
  }

  function handleCloseCreateModal() {
    setShowCreateModal(false);
  }

  function handleShowReadModal(hospede) {
    setHospedeAtivo(hospede);
    setShowReadModal(true);
  }

  function handleCloseReadModal() {
    setShowReadModal(false);
  }

  function handleShowEditModal(hospede) {
    setHospedeAtivo(hospede);

    let data = hospede.nascimento;

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

  function handleShowDeleteModal(hospede) {
    setHospedeAtivo(hospede);
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

    let dataNaoFormatada = document.getElementById("nascimento-create").value;
    let dataFormatada = moment(dataNaoFormatada).format("DD/MM/YYYY");

    const data = {
      nome: document.getElementById("nome-create").value,
      nascimento: dataFormatada,
      rg: document.getElementById("rg-create").value,
      cpf: document.getElementById("cpf-create").value,
      telefone: document.getElementById("telefone-create").value,
      email: document.getElementById("email-create").value,
    };

    try {
      const response = await api.post("hospedes", data);

      if (!response.data.Erro) {
        realoadHospedes();
        setSucesso("Hóspede cadastrado com sucesso!");
        handleCloseCreateModal();
        handleShowSuccessModal();
      } else {
        setErros(response.data.Erro);
        handleShowErroModal();
      }
    } catch (err) {
      setErros("Não foi possível realizar o cadastro, tente novamente.");
      handleCloseCreateModal();
      handleShowErroModal();
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
      const response = await api.put("hospedes/" + hospedeAtivo._id, data);

      if (!response.data.Erro) {
        realoadHospedes();
        setSucesso("Hóspede editado com sucesso!");
        handleCloseEditModal();
        handleShowSuccessModal();
      } else {
        setErros(response.data.Erro);
        handleShowErroModal();
      }
    } catch (err) {
      setErros("Não foi possível realizar a alteração, tente novamente.");
      handleShowErroModal();
    }
  }

  async function handleDeleteForm(e) {
    e.preventDefault();
    try {
      const response = await api.delete("hospedes/" + hospedeAtivo._id);

      if (!response.data.Erro) {
        realoadHospedes();
        setSucesso("Hóspede desativado com sucesso!");
        handleCloseDeleteModal();
        handleShowSuccessModal();
      } else {
        setErros(response.data.Erro);
        handleCloseDeleteModal();
        handleShowErroModal();
      }
    } catch (err) {
      setErros("Não foi possível desativar o hóspede, tente novamente.");
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
        <h4>Hóspedes </h4>
        <table className="table align-center mt-2">
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Digite o nome do hóspede..."
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
            {hospedes.map((hospede) => (
              <tr key={hospede._id}>
                <td>{hospede.nome}</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      handleShowReadModal(hospede);
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
                      handleShowEditModal(hospede);
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
                      handleShowDeleteModal(hospede);
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
            <h5>Cadastrar hóspede</h5>
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
            <h5>Ver hóspede</h5>
          </Modal.Header>
          <Modal.Body>
            <h6>Dados gerais</h6>
            <hr />
            <p>
              <strong>{hospedeAtivo.nome}</strong>
            </p>
            <p>
              <strong>Data de nascimento:</strong> {hospedeAtivo.nascimento}
            </p>
            <p>
              <strong>RG:</strong> {hospedeAtivo.rg}
            </p>
            <p>
              <strong>CPF:</strong> {hospedeAtivo.cpf}
            </p>
            <hr></hr>
            <h6>Contato</h6>
            <hr />
            <p>
              <strong>Email: </strong> {hospedeAtivo.email}
            </p>
            <p>
              <strong>Telefone: </strong> {hospedeAtivo.telefone}
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
            <h5>Desativar hóspede</h5>
          </Modal.Header>
          <Modal.Body>
            <h6>Dados gerais</h6>
            <hr />
            <p>
              <strong>{hospedeAtivo.nome}</strong>
            </p>
            <p>
              <strong>Data de nascimento:</strong> {hospedeAtivo.nascimento}
            </p>
            <p>
              <strong>RG:</strong> {hospedeAtivo.rg}
            </p>
            <p>
              <strong>CPF:</strong> {hospedeAtivo.cpf}
            </p>
            <hr></hr>
            <h6>Contato</h6>
            <hr />
            <p>
              <strong>Email: </strong> {hospedeAtivo.email}
            </p>
            <p>
              <strong>Telefone: </strong> {hospedeAtivo.telefone}
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
            <h5>Editar hóspede</h5>
          </Modal.Header>
          <form onSubmit={handleEditForm}>
            <Modal.Body>
              <strong>Nome do funcionário: </strong> <br></br>
              <input
                type="text"
                className="form-control mt-2"
                id="nome-update"
                required
                defaultValue={hospedeAtivo.nome}
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
                defaultValue={hospedeAtivo.email}
              />{" "}
              <br></br>
              <strong>Telefone: </strong> <br></br>
              <input
                type="text"
                className="form-control mt-2"
                id="telefone-update"
                required
                placeholder="(DDD) 99999-9999"
                defaultValue={hospedeAtivo.telefone}
              />
              <br />
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
