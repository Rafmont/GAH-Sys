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
  FiPlayCircle,
} from "react-icons/fi";
import { Modal } from "react-bootstrap";
import $ from "jquery";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";

export default function Manual() {
  //States da página.
  const nivel = useSelector((state) => state.levelReducer);
  const [erros, setErros] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [src, setSrc] = useState("");

  //States para os modais.
  const [showReadModal, setShowReadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);

  //Funções de obtenção e atualização de states.

  //Funções para modais.
  function handleShowCreateModal() {
    setShowCreateModal(true);
  }

  function handleCloseCreateModal() {
    setShowCreateModal(false);
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

  function abrirVideo(source) {
    setSrc(source);
    setShowCreateModal(true);
  }

  return (
    <div>
      <Navbar />
      <main className="global-container shadow">
        <h4>Manual do sistema</h4>
        <table className="table align-center mt-2">
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Digite o nome da operação..."
                  className="form-control"
                  id="palavra"
                  onKeyUp={buscaNome}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <table className="table align-center" id="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ver vídeo</th>
            </tr>
          </thead>
          {nivel >= 1 ? (
            <tbody>
              <tr>
                <td>Login</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/login.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Alterar senha</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/alterarsenha.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Eventos</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/Eventos.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Funcionários</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/Funcionario.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Terapeutas</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/terapeutas.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Especialidades</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/Especialidades.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Serviços</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/Servicos.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Tipo de quarto</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/tipoquarto.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Quarto</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/Quartos.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Faturas</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/Faturas.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Despesas</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/Despesas.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Balanço</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/Balanço.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Histórico de faturas</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/historicoFaturas.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Hóspedes</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/hospedes.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Configurações gerais</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/configurações.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Marcar Atendimento</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/MarcarAtendimento.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Marcar estadia</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/MarcarHospedagem.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td>Meus acertos</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/MeusAcertos.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Meus atendimentos</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      abrirVideo("videos/MeusAtendimentos.mp4");
                    }}
                  >
                    <FiPlayCircle size={30} />
                  </a>
                </td>
              </tr>
            </tbody>
          )}
        </table>

        {/* Modal Create */}
        <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="xl">
          <Modal.Header closeButton>
            <h5>Manual</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="align-center">
              <video width="900" height="600" controls>
                <source src={src} type="video/mp4"></source>
              </video>
            </div>
          </Modal.Body>
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
