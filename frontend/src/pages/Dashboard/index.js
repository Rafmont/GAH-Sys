import React, { useState, useEffect } from "react";
import { FiPlusSquare, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import moment from "moment";
import { useSelector } from "react-redux";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import Navbar from "../components/Navbar";
import { Modal } from "react-bootstrap";

import "./style.css";

export default function Dashboard() {
  //Redux data
  const id = useSelector((state) => state.idReducer);
  const history = useHistory();

  //Definição dos estados da página:
  const [eventos, setEventos] = useState([]);
  const [eventosCalendar, setEventosCalendar] = useState([]);
  const [erros, setErros] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [eventoAtivo, setEventoAtivo] = useState([]);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [horaInicial, setHoraInicial] = useState("");
  const [horaFinal, setHoraFinal] = useState("");
  const [nomeFuncionario, setNomeFuncionario] = useState("");
  const [idFuncionario, setIdFuncionario] = useState("");
  const [dataInicialEdit, setDataInicialEdit] = useState("");
  const [horasInicialEdit, setHorasInicialEdit] = useState("");
  const [minutosInicialEdit, setMinutosInicialEdit] = useState("");
  const [dataFinalEdit, setDataFinalEdit] = useState("");
  const [horasFinalEdit, setHorasFinalEdit] = useState("");
  const [minutosFinalEdit, setMinutosFinalEdit] = useState("");

  //Definição dos estados dos modais:
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReadModal, setShowReadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  //Funções para se lidar com a abertura dos modais.
  function handleShowCreateModal() {
    setShowCreateModal(true);
  }

  function handleCloseCreateModal() {
    setShowCreateModal(false);
  }

  function handleShowReadModal() {
    setShowReadModal(true);
  }

  function handleCloseReadModal() {
    setShowReadModal(false);
  }

  function handleShowEditModal() {
    setShowEditModal(true);
  }

  function handleCloseEditModal() {
    setShowEditModal(false);
  }

  function handleCloseErroModal() {
    setShowErroModal(false);
  }

  function handleCloseSuccessModal() {
    setShowSuccessModal(false);
  }

  function handleShowConfirmModal() {
    setShowConfirmModal(true);
  }

  function handleCloseConfirmModal() {
    setShowConfirmModal(false);
  }

  //Lidar com formulários
  async function reloadEventos() {
    let response = await api.get("/eventos");
    let data = response.data;
    setEventos(data);
  }

  async function handleCreateForm(e) {
    e.preventDefault();
    let nome = document.getElementById("nome-create").value;
    let descricao = document.getElementById("descricao-create").value;
    let data = document.getElementById("date-create").value;
    let hora = document.getElementById("hora-create").value;
    let minuto = document.getElementById("minuto-create").value;

    let dataF = document.getElementById("dateF-create").value;
    let horaF = document.getElementById("horaF-create").value;
    let minutoF = document.getElementById("minutoF-create").value;

    const dados = {
      nome,
      descricao,
      data,
      hora,
      minuto,
      dataF,
      horaF,
      minutoF,
    };

    let data_geral = data + "T" + hora + ":" + minuto;
    let data_geralF = dataF + "T" + horaF + ":" + minutoF;

    let dataagora = moment().format("YYYY-MM-DD HH:mm:ss");
    let data_geralM = moment(data_geral).format("YYYY-MM-DD HH:mm:ss");

    if (data_geralM < dataagora || data_geral > data_geralF) {
      setErros(
        "Problemas com a data, verifique se a data inicial é após o dia de hoje e anterior a data e hora de término."
      );
      setShowErroModal(true);
    } else {
      try {
        const response = await api.post("eventos/" + id, dados);
        if (response.data.Sucesso) {
          reloadEventos();
          handleCloseCreateModal();
          setSucesso("Evento cadastrado com sucesso!");
          setShowSuccessModal(true);
        } else {
          setErros(response.data);
          setShowErroModal(true);
        }
      } catch (err) {
        setErros("Problemas ao criar novo evento, por favor tente novamente.");
        setShowErroModal(true);
      }
    }
  }

  async function handleEditForm(e) {
    e.preventDefault();
    let nome = document.getElementById("nome-update").value;
    let descricao = document.getElementById("descricao-update").value;
    let data = document.getElementById("date-update").value;
    let hora = document.getElementById("hora-update").value;
    let minuto = document.getElementById("minuto-update").value;

    let dataF = document.getElementById("dateF-update").value;
    let horaF = document.getElementById("horaF-update").value;
    let minutoF = document.getElementById("minutoF-update").value;

    const dados = {
      nome,
      descricao,
      data,
      hora,
      minuto,
      dataF,
      horaF,
      minutoF,
      funcionario: idFuncionario,
    };

    let data_geral = data + "T" + hora + ":" + minuto;
    let data_geralF = dataF + "T" + horaF + ":" + minutoF;

    let dataagora = moment().format("YYYY-MM-DD HH:mm:ss");
    let data_geralM = moment(data_geral).format("YYYY-MM-DD HH:mm:ss");

    if (data_geralM < dataagora || data_geral > data_geralF) {
      setErros(
        "Problemas com a data, verifique se a data inicial é após o dia de hoje e anterior a data e hora de término."
      );
      setShowErroModal(true);
    } else {
      try {
        const response = await api.put("eventos/" + eventoAtivo._id, dados);
        if (response.data.Sucesso) {
          await reloadEventos();
          handleCloseEditModal();
          setSucesso("Evento alterado com sucesso!");
          setShowSuccessModal(true);
          history.push("/dashboard");
        } else {
          setErros(response.data);
          setShowErroModal(true);
        }
      } catch (err) {
        setErros("Problemas ao atualizar o evento, por favor tente novamente.");
        setShowErroModal(true);
      }
    }
  }

  //Funções da página:
  useEffect(() => {
    api.get("/eventos").then((response) => {
      let data = response.data;
      setEventos(data);

      let eventsFormat = [];
      for (let i = 0; i < data.length; i++) {
        let single_data = data[i];
        eventsFormat.push({
          title: single_data.nome,
          start: single_data.data_inicial,
          end: single_data.data_final,
          color: "#5cb85c",
          id: single_data._id,
        });
      }
      setEventosCalendar(eventsFormat);
    });
  }, []);

  useEffect(() => {
    api.get("/eventos").then((response) => {
      let data = response.data;

      let eventsFormat = [];
      for (let i = 0; i < data.length; i++) {
        let single_data = data[i];
        eventsFormat.push({
          title: single_data.nome,
          start: single_data.data_inicial,
          end: single_data.data_final,
          color: "#5cb85c",
          id: single_data._id,
        });
      }
      setEventosCalendar(eventsFormat);
    });
  }, [eventos]);

  function handleEventClick(info) {
    let idEvento = info.event.id;
    for (let i = 0; i < eventos.length; i++) {
      let evento = eventos[i];
      if (idEvento === evento._id) {
        setEventoAtivo(evento);
        let dataInicialParcer = moment(evento.data_inicial).format(
          "DD/MM/YYYY"
        );
        let dataFinalParcer = moment(evento.data_final).format("DD/MM/YYYY");
        let horaInicialParcer = moment(evento.data_inicial).format("HH:mm");
        let horaFinalParcer = moment(evento.data_final).format("HH:mm");

        setDataInicial(dataInicialParcer);
        setDataFinal(dataFinalParcer);
        setHoraInicial(horaInicialParcer);
        setHoraFinal(horaFinalParcer);
        setNomeFuncionario(evento.funcionario.nome);
        setIdFuncionario(evento.funcionario._id);
      }
    }

    handleShowReadModal();
  }

  async function handleDeleteEvent() {
    try {
      let response = await api.delete("eventos/" + eventoAtivo._id);
      if (response.data.Sucesso) {
        reloadEventos();
        handleCloseConfirmModal();
        setSucesso("Evento deletado com sucesso.");
        setShowSuccessModal(true);
      } else {
        handleCloseConfirmModal();
        setErros("Não foi possível deletar evento, tente novamente 1.");
        setShowErroModal(true);
      }
    } catch (err) {
      handleCloseConfirmModal();
      setErros("Não foi possível deletar evento, tente novamente 2.");
      setShowErroModal(true);
    }
  }

  function handleDeleteButton() {
    handleCloseReadModal();
    handleShowConfirmModal();
  }

  function handleEditButton() {
    let dataInicialParcer = moment(eventoAtivo.data_inicial).format(
      "YYYY-MM-DD"
    );
    let horasInicialParser = moment(eventoAtivo.data_inicial).format("HH");
    let minutosInicialParser = moment(eventoAtivo.data_inicial).format("mm");

    let dataFinalParcer = moment(eventoAtivo.data_final).format("YYYY-MM-DD");
    let horasFinalParcer = moment(eventoAtivo.data_final).format("HH");
    let minutosFinalParcer = moment(eventoAtivo.data_final).format("mm");

    setHorasInicialEdit(horasInicialParser);
    setMinutosInicialEdit(minutosInicialParser);
    setDataInicialEdit(dataInicialParcer);
    setDataFinalEdit(dataFinalParcer);
    setHorasFinalEdit(horasFinalParcer);
    setMinutosFinalEdit(minutosFinalParcer);
    setShowEditModal(true);
    setShowReadModal(false);
  }

  return (
    <div>
      <Navbar />
      <main className="global-container shadow">
        <h4>Dashboard </h4>
        <hr />
        <h5>Bem vindo ao GAH-Sys!</h5>

        <div className="card">
          <div className="card-body">
            <div className="botao-evento">
              <a href="#" onClick={handleShowCreateModal}>
                <FiPlusSquare size={36} />
              </a>
            </div>

            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              locale="pt-br"
              handleWindowResize="true"
              eventClick={handleEventClick}
              events={eventosCalendar}
            />
          </div>
        </div>

        {/*LISTA DE MODAIS UTILIZADOS NA PÁGINA*/}

        {/* Modal Create */}
        <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="lg">
          <Modal.Header closeButton>
            <h5>Criar evento</h5>
          </Modal.Header>
          <form onSubmit={handleCreateForm}>
            <Modal.Body>
              <strong>Nome do evento:</strong>
              <input id="nome-create" className="form-control" required></input>
              <br></br>
              <strong>Descrição:</strong>
              <textarea
                required
                id="descricao-create"
                className="form-control"
              ></textarea>
              <br></br>
              <strong>Data e hora de início:</strong>
              <table className="table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Minuto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        required
                        className="form-control"
                        id="date-create"
                        type="date"
                      ></input>
                    </td>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="hora-create"
                      >
                        <option value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                      </select>
                    </td>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="minuto-create"
                      >
                        <option value="00">00</option>
                        <option value="30">30</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <strong>Data e hora de término:</strong>
              <table className="table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Minuto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        className="form-control"
                        id="dateF-create"
                        type="date"
                        required
                      ></input>
                    </td>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="horaF-create"
                      >
                        <option value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                      </select>
                    </td>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="minutoF-create"
                      >
                        <option value="00">00</option>
                        <option value="30">30</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="align-center">
                <button className="btn btn-success mt-4" type="submit">
                  Cadastar
                </button>
              </div>
            </Modal.Body>
          </form>
        </Modal>

        {/* Modal Read */}
        <Modal show={showReadModal} onHide={handleCloseReadModal} size="lg">
          <Modal.Header closeButton>
            <h5>Ver evento</h5>
          </Modal.Header>
          <Modal.Body>
            <strong>{eventoAtivo.nome}</strong>
            <br></br>
            <p className="justify">{eventoAtivo.descricao}</p>
            <hr></hr>
            <strong>Data e horário:</strong>
            <p>
              Início: {dataInicial} às {horaInicial}
            </p>
            <p>
              Término: {dataFinal} às {horaFinal}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <small>Evento criado por: {nomeFuncionario}</small>
            <div className="align-center">
              <button onClick={handleEditButton} className="btn btn-primary">
                Editar
              </button>{" "}
              <button onClick={handleDeleteButton} className="btn btn-danger">
                Deletar
              </button>
            </div>
          </Modal.Footer>
        </Modal>

        {/* Modal Edit */}
        <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
          <Modal.Header closeButton>
            <h5>Editar evento</h5>
          </Modal.Header>
          <form onSubmit={handleEditForm}>
            <Modal.Body>
              <strong>Nome do evento:</strong>
              <input
                defaultValue={eventoAtivo.nome}
                id="nome-update"
                className="form-control"
                required
              ></input>
              <br></br>
              <strong>Descrição:</strong>
              <textarea
                defaultValue={eventoAtivo.descricao}
                required
                id="descricao-update"
                className="form-control"
              ></textarea>
              <br></br>
              <strong>Data e hora de início:</strong>
              <table className="table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Minuto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        required
                        className="form-control"
                        id="date-update"
                        type="date"
                        defaultValue={dataInicialEdit}
                      ></input>
                    </td>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="hora-update"
                        defaultValue={horasInicialEdit}
                      >
                        <option value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                      </select>
                    </td>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="minuto-update"
                        defaultValue={minutosInicialEdit}
                      >
                        <option value="00">00</option>
                        <option value="30">30</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <strong>Data e hora de término:</strong>
              <table className="table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Minuto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        required
                        className="form-control"
                        id="dateF-update"
                        type="date"
                        defaultValue={dataFinalEdit}
                      ></input>
                    </td>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="horaF-update"
                        defaultValue={horasFinalEdit}
                      >
                        <option value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                      </select>
                    </td>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="minutoF-update"
                        defaultValue={minutosFinalEdit}
                      >
                        <option value="00">00</option>
                        <option value="30">30</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="align-center">
                <button className="btn btn-success mt-4" type="submit">
                  Editar
                </button>
              </div>
            </Modal.Body>
          </form>
        </Modal>

        {/* Modal Confirm Delete */}
        <Modal show={showConfirmModal} onhide={handleCloseConfirmModal}>
          <div className="bg-warning align-center">
            <Modal.Body>
              <FiAlertCircle size="46" /> <br></br> <br></br>
              <h6>Atenção!</h6> <br></br>
              <p>
                Você está prestes a deletar este evento, os dados não poderão
                ser recuperados após sua remoção do banco de dados.
              </p>
              <p>Deseja continuar?</p>
              <button className="btn btn-dark" onClick={handleDeleteEvent}>
                Deletear
              </button>{" "}
              <button
                className="btn btn-primary"
                onClick={handleCloseConfirmModal}
              >
                Cancelar
              </button>
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
