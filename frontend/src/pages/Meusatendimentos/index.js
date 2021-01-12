import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRightCircle,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import api from "../../services/api";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import allLocales from "@fullcalendar/core/locales-all";
import moment from "moment";
import { useSelector } from "react-redux";

export default function MeusAtendimentos() {
  //States diversos da página.
  const id = useSelector((state) => state.idReducer);
  const name = useSelector((state) => state.nameReducer);
  const [sucesso, setSucesso] = useState("");
  const [erros, setErros] = useState("");

  //States utilizados para manipular do banco de dados.
  const [atendimentos, setAtendimentos] = useState([]);
  const [resources, setResources] = useState([
    {
      id: id,
      title: name,
    },
  ]);
  const [servicosAtendimento, setServicosAtendimento] = useState([]);
  const [events, setEvents] = useState([]);
  const [atendimentoAtivo, setAtendimentoAtivo] = useState([]);

  const [hospedeRead, setHospedeRead] = useState("");
  const [terapeutaRead, setTerapeutaRead] = useState("");

  //States utilizados para manipular a abertura de modais.
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReadModal, setShowReadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);

  //Gerenciamento de dados puxados do banco.
  useEffect(() => {
    api.get("/atendimentos/" + id).then((response) => {
      setAtendimentos(response.data);
      let eventParser = [];
      for (let i = 0; i < response.data.length; i++) {
        eventParser.push({
          id: response.data[i]._id,
          resourceId: response.data[i].terapeuta._id,
          start: response.data[i].data_inicial,
          end: response.data[i].data_final,
          title: " ",
        });
      }
      setEvents(eventParser);
    });
  }, []);

  //Funções para lidar com os modais.
  function handleShowCreateModal() {
    setShowCreateModal(true);
  }

  function handleCloseCreateModal() {
    setShowCreateModal(false);
  }

  function handleShowReadModal(info) {
    setShowReadModal(true);
    let atendimentoId = info.event.id;
    for (let i = 0; i < atendimentos.length; i++) {
      if (atendimentos[i]._id === atendimentoId) {
        setAtendimentoAtivo(atendimentos[i]);
        let servicosParser = "";
        for (let j = 0; j < atendimentos[i].servico.length; j++) {
          servicosParser =
            servicosParser + " " + atendimentos[i].servico[j].nome + ",";
        }
        servicosParser = servicosParser.replace(/,$/, ".");
        setServicosAtendimento(servicosParser);
        setHospedeRead(atendimentos[i].hospede.nome);
        setTerapeutaRead(atendimentos[i].terapeuta.nome);
        break;
      }
    }
  }

  function handleCloseReadModal() {
    setShowReadModal(false);
  }

  function handleShowSuccessModal() {
    setShowSuccessModal(true);
  }

  function handleCloseSuccessModal() {
    setShowSuccessModal(false);
  }

  function handleShowErroModal() {
    setShowErroModal(true);
  }

  function handleCloseErroModal() {
    setShowErroModal(false);
  }

  //Funções para lidar com formulários.

  //Funções auxiliares

  return (
    <div>
      <Navbar />
      <main className="global-container shadow">
        <h4>Meus atendimentos </h4>
        <hr />

        <FullCalendar
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          resources={resources}
          initialView="resourceTimelineDay"
          locales={allLocales}
          events={events}
          locale="pt-br"
          selectable="true"
          scrollTime="06:00"
          eventColor="#5cb85c"
          editable="true"
          headerToolbar={{
            left: "today prev,next",
            center: "title",
            right: "resourceTimelineDay,resourceTimelineWeek",
          }}
          resourceAreaWidth="200px"
          views={{
            resourceTimelineDay: {
              buttonText: "Dia",
              slotDuration: "00:15",
            },
          }}
          nowIndicator="true"
          aspectRatio="3"
          eventClick={handleShowReadModal}
        />

        {/* Modal Read */}
        <Modal show={showReadModal} onHide={handleCloseReadModal} size="lg">
          <Modal.Header closeButton>
            <h5>Ver atendimento</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              Hóspede: <strong>{hospedeRead}</strong>
            </p>
            <p>
              Terapêuta: <strong>{terapeutaRead}</strong>
            </p>
            <p>
              Valor: <strong>R$ {atendimentoAtivo.valor}.</strong>
            </p>
            <p>
              Duração: <strong>{atendimentoAtivo.duracao} minutos.</strong>
            </p>
            <p>
              Serviços prestados: <strong>{servicosAtendimento}</strong>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-info" onClick={handleCloseReadModal}>
              Fechar
            </button>
          </Modal.Footer>
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
      </main>
    </div>
  );
}
