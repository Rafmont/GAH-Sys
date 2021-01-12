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
  const [despesas, setDespesas] = useState([]);
  const [despesaAtiva, setDespesaAtiva] = useState([]);
  const [dataAtiva, setDataAtiva] = useState("");
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
    api.get("/despesas").then((response) => {
      setDespesas(response.data);
    });
  }, []);

  function reloadDespesas() {
    api.get("/despesas").then((response) => {
      setDespesas(response.data);
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

  function handleShowReadModal(despesa) {
    setDataAtiva(moment(despesa.data).format("DD/MM/YYYY"));
    setDespesaAtiva(despesa);
    setShowReadModal(true);
  }

  function handleCloseReadModal() {
    setShowReadModal(false);
  }

  function handleShowEditModal(despesa) {
    setDataAtiva(moment(despesa.data).format("DD/MM/YYYY"));
    setDespesaAtiva(despesa);
    setShowEditModal(true);
  }

  function handleCloseEditModal() {
    setShowEditModal(false);
  }

  function handleShowDeleteModal(despesa) {
    setDataAtiva(moment(despesa.data).format("DD/MM/YYYY"));
    setDespesaAtiva(despesa);
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
      titulo: document.getElementById("titulo-create").value,
      descricao: document.getElementById("descricao-create").value,
      valor: document.getElementById("valor-create").value,
      data: document.getElementById("data-create").value,
    };

    try {
      const response = await api.post("/despesas", dados);
      if (response.data.Sucesso) {
        reloadDespesas();
        handleCloseCreateModal();
        setSucesso("Despesa cadastrada com sucesso!");
        setShowSuccessModal(true);
      } else {
        handleCloseCreateModal();
        setErros(response.data.Erro[0]);
        setShowErroModal(true);
      }
    } catch (err) {
      handleCloseCreateModal();
      setErros(
        "Problemas para cadastrar a despesa, por favor tente novamente." + err
      );
      setShowErroModal(true);
    }
  }

  async function handleEditForm(e) {
    e.preventDefault();

    const dados = {
      titulo: document.getElementById("titulo-update").value,
      descricao: document.getElementById("descricao-update").value,
      valor: document.getElementById("valor-update").value,
      data: document.getElementById("data-update").value,
    };

    try {
      const response = await api.put("/despesas/" + despesaAtiva._id, dados);
      if (response.data.Sucesso) {
        reloadDespesas();
        handleCloseEditModal();
        setSucesso("Despesa atualizada com sucesso!");
        setShowSuccessModal(true);
      } else {
        handleCloseEditModal();
        setErros(response.data.Erro[0]);
        setShowErroModal(true);
      }
    } catch (err) {
      handleCloseEditModal();
      setErros(
        "Problemas para atualizar a despesa, por favor tente novamente." + err
      );
      setShowErroModal(true);
    }
  }

  async function handleDeleteForm(e) {
    e.preventDefault();
    try {
      const response = await api.delete("/despesas/" + despesaAtiva._id);

      console.log(response.data);
      if (response.data.Sucesso) {
        reloadDespesas();
        handleCloseDeleteModal();
        setSucesso("Despesa desativada com sucesso!");
        setShowSuccessModal(true);
      } else {
        handleCloseDeleteModal();
        setErros(response.data.Erro[0]);
        setShowErroModal(true);
      }
    } catch (err) {
      handleCloseDeleteModal();
      setErros(
        "Problemas para desativar a despesa, por favor tente novamente." + err
      );
      setShowErroModal(true);
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

  function handleDate() {
    let inicial = moment(Date()).format("YYYY-MM-DD");
    let final = moment(document.getElementById("data-create").value).format(
      "YYYY-MM-DD"
    );

    if (final < inicial) {
      setErros("Por favor insira uma data igual ou posterior a data de hoje. ");
      handleShowErroModal();
      document.getElementById("data-create").value = "";
    }
  }

  return (
    <div>
      <Navbar />
      <main className="global-container shadow">
        <h4>Despesas </h4>
        <table className="table align-center mt-2">
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Digite o título da despesa..."
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
              <th>Título</th>
              <th>Valor (R$)</th>
              <th>Ver detalhes</th>
              <th>Editar</th>
              <th>Desativar</th>
            </tr>
          </thead>
          <tbody>
            {despesas.map((despesa) => (
              <tr key={despesa._id}>
                <td>{despesa.titulo}</td>
                <td>{despesa.valor}</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      handleShowReadModal(despesa);
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
                      handleShowEditModal(despesa);
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
                      handleShowDeleteModal(despesa);
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
            <h5>Inserir despesa</h5>
          </Modal.Header>
          <form onSubmit={handleCreateForm}>
            <Modal.Body>
              <strong>Título</strong>
              <input className="form-control mt-2" id="titulo-create"></input>
              <br />
              <strong>Descrição</strong>
              <textarea
                className="form-control mt-2"
                id="descricao-create"
              ></textarea>
              <br />
              <strong>Valor (R$)</strong>
              <input
                className="form-control mt-2"
                id="valor-create"
                type="number"
              ></input>
              <br />
              <strong>Data</strong>
              <input
                className="form-control mt-2"
                id="data-create"
                type="date"
                onChange={handleDate}
              ></input>
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
            <h5>Ver despesa</h5>
          </Modal.Header>
          <Modal.Body>
            <strong>Título: {despesaAtiva.titulo}</strong>
            <br />
            <p>Descrição: </p>
            <p>{despesaAtiva.descricao}</p>
            <p>
              Valor da despesa: <strong>R$ {despesaAtiva.valor}</strong>
            </p>
            <p>
              Data da despesa: <strong>{dataAtiva}</strong>
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
            <h5>Desativar serviço</h5>
          </Modal.Header>
          <Modal.Body>
            <strong>Título: {despesaAtiva.titulo}</strong>
            <br />
            <p>Descrição: </p>
            <p>{despesaAtiva.descricao}</p>
            <p>
              Valor da despesa: <strong>R$ {despesaAtiva.valor}</strong>
            </p>
            <p>
              Data da despesa: <strong>{dataAtiva}</strong>
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
            <h5>Editar serviço</h5>
          </Modal.Header>
          <form onSubmit={handleEditForm}>
            <Modal.Body>
              <strong>Título</strong>
              <input
                className="form-control mt-2"
                id="titulo-update"
                defaultValue={despesaAtiva.titulo}
              ></input>
              <br />
              <strong>Descrição</strong>
              <textarea
                className="form-control mt-2"
                id="descricao-update"
                defaultValue={despesaAtiva.descricao}
              ></textarea>
              <br />
              <strong>Valor (R$)</strong>
              <input
                className="form-control mt-2"
                id="valor-update"
                type="number"
                defaultValue={despesaAtiva.valor}
              ></input>
              <br />
              <strong>Data</strong>
              <input
                className="form-control mt-2"
                id="data-update"
                type="date"
                onChange={handleDate}
                defaultValue={despesaAtiva.data}
              ></input>
              <br />
              <div className="align-center">
                <button className="btn btn-success" type="submit">
                  Cadastar
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
