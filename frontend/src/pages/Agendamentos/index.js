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
import "./style.css";
export default function Agendamentos() {
  //States diversos da página.
  const [sucesso, setSucesso] = useState("");
  const [erros, setErros] = useState("");

  //States utilizados para manipular do banco de dados.
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadeAtiva, setEspecialidadeAtiva] = useState([]);
  const [dataAtiva, setDataAtiva] = useState("");
  const [dataParser, setDataParser] = useState("");
  const [terapeutas, setTerapeutas] = useState([]);
  const [atendimentos, setAtendimentos] = useState([]);
  const [terapeutaAtivoNome, setTerapeutaAtivoNome] = useState("");
  const [terapeutaAtivoId, setTerapeutaATivoId] = useState("");
  const [resources, setResources] = useState([]);
  const [hospedes, setHospedes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [servicosAtendimento, setServicosAtendimento] = useState([]);
  const [servicosFiltered, setServicosFiltered] = useState([]);
  const [resultadoSoma, setResultadoSoma] = useState(0);
  const [resultadoDuracao, setResultadoDuracao] = useState(0);
  const [events, setEvents] = useState([]);
  const [atendimentoAtivo, setAtendimentoAtivo] = useState([]);

  const [hospedeRead, setHospedeRead] = useState("");
  const [terapeutaRead, setTerapeutaRead] = useState("");
  const [dataRead, setDataRead] = useState("");
  const [valorRead, setValorRead] = useState("");
  const [duracaoRead, setDuracaoRead] = useState("");
  const [servicosRead, setServicosRead] = useState("");

  //States utilizados para manipular a abertura de modais.
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReadModal, setShowReadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);

  //Gerenciamento de dados puxados do banco.
  useEffect(() => {
    let agenda = document.getElementById("agenda");
    agenda.style.display = "none";
    api.get("/especialidades").then((response) => {
      setEspecialidades(response.data);
      api.get("/terapeutas/nopop").then((response2) => {
        setTerapeutas(response2.data);
        api.get("/hospedes").then((response3) => {
          setHospedes(response3.data);
          api.get("/servicos").then((response4) => {
            setServicos(response4.data);
            api.get("/atendimentos").then((response5) => {
              setAtendimentos(response5.data);
            });
          });
        });
      });
    });
  }, []);

  function reloadAtendimentos() {
    api.get("/atendimentos").then((response) => {
      let atendimentosParser = response.data;
      setAtendimentos(response.data);
      let eventParser = [];

      for (let i = 0; i < atendimentosParser.length; i++) {
        if (
          atendimentosParser[i].servico[0].especialidade ===
          especialidadeAtiva._id
        ) {
          eventParser.push({
            id: atendimentosParser[i]._id,
            resourceId: atendimentosParser[i].terapeuta._id,
            start: atendimentosParser[i].data_inicial,
            end: atendimentosParser[i].data_final,
            title: " ",
          });
        }
      }

      setEvents(eventParser);
    });
  }

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
  async function handleCreateForm(e) {
    e.preventDefault();
    let hospedeRadio = document.getElementsByName("hospede-create");
    let hospede;
    for (let i = 0, length = hospedeRadio.length; i < length; i++) {
      if (hospedeRadio[i].checked) {
        hospede = hospedeRadio[i].value;
        break;
      }
    }
    let terapeuta = terapeutaAtivoId;
    let duracao = resultadoDuracao;
    let data_inicial = dataParser;
    let valor = resultadoSoma;
    let servico = servicosAtendimento;

    const data = {
      hospede,
      terapeuta,
      duracao,
      data_inicial,
      valor,
      servico,
    };
    try {
      const response = await api.post("/atendimentos", data);
      if (response.data.Sucesso) {
        reloadAtendimentos();
        handleCloseCreateModal();
        setSucesso("Atendimento agendado com sucesso!");
        setShowSuccessModal(true);
      } else {
        handleCloseCreateModal();
        setErros(response.data.Erro[0]);
        setShowErroModal(true);
      }
    } catch (err) {
      handleCloseCreateModal();
      setErros(
        "Problemas ao agendar atendimento, por favor tente novamente." + err
      );
      setShowErroModal(true);
    }
  }

  async function desativarAtendimento(e) {
    e.preventDefault();
    try {
      const response = await api.delete(
        "/atendimentos/" + atendimentoAtivo._id
      );
      if (response.data.Sucesso) {
        reloadAtendimentos();
        handleCloseCreateModal();
        setSucesso("Atendimento desativado com sucesso!");
        setShowSuccessModal(true);
      } else {
        handleCloseCreateModal();
        setErros("Erro ao desativar atendimento.");
        setShowErroModal(true);
      }
    } catch (err) {
      handleCloseCreateModal();
      setErros("Problemas ao agendar atendimento, por favor tente novamente.");
      setShowErroModal(true);
    }
  }

  //Funções auxiliares
  function handleSelectEspecialidade(especialidade) {
    let agenda = document.getElementById("agenda");
    let resources = [];
    let servicosParser = [];
    setEspecialidadeAtiva(especialidade);

    agenda.style.display = "block";

    for (let i = 0; i < terapeutas.length; i++) {
      for (let j = 0; j < terapeutas[i].especialidade.length; j++) {
        if (terapeutas[i].especialidade[j] === especialidade._id) {
          let terapeuta = {
            id: terapeutas[i]._id,
            title: terapeutas[i].nome,
            businessHours: { startTime: "06:00", endTime: "22:00" },
          };

          resources.push(terapeuta);
        }
      }
    }
    setResources(resources);

    let eventParser = [];

    for (let i = 0; i < atendimentos.length; i++) {
      if (atendimentos[i].servico[0].especialidade === especialidade._id) {
        eventParser.push({
          id: atendimentos[i]._id,
          resourceId: atendimentos[i].terapeuta._id,
          start: atendimentos[i].data_inicial,
          end: atendimentos[i].data_final,
          title: " ",
        });
      }
    }

    setEvents(eventParser);

    for (let i = 0; i < servicos.length; i++) {
      if (servicos[i].especialidade._id === especialidade._id) {
        servicosParser.push(servicos[i]);
      }
    }

    setServicosFiltered(servicosParser);
  }

  function handleDateClick(info) {
    let dataSelecionada = moment(info.dateStr).format("DD/MM/YYYY HH:mm");
    let dataParser2 = moment(info.dateStr).format("YYYY-MM-DDTHH:mm:ss");
    setDataParser(dataParser2);
    setDataAtiva(dataSelecionada);
    setTerapeutaAtivoNome(info.resource.title);
    setTerapeutaATivoId(info.resource.id);
    handleShowCreateModal();
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

  function buscaNomeHospede() {
    var entrada, filtro, tabela, tr, td, i, txtValue;

    entrada = document.getElementById("palavra-hospede");
    filtro = entrada.value.toUpperCase();
    tabela = document.getElementById("tabela-hospede");
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

  function verificaValor() {
    const checkboxes = document.querySelectorAll(
      'input[name="servico-create"]:checked'
    );
    let servicosId = [];
    checkboxes.forEach((checkbox) => {
      servicosId.push(checkbox.value);
    });

    setServicosAtendimento(servicosId);
    let soma = 0;
    let duracao = 0;

    for (let i = 0; i < servicos.length; i++) {
      for (let j = 0; j < servicosId.length; j++) {
        if (servicos[i]._id === servicosId[j]) {
          duracao = duracao + parseInt(servicos[i].duracao, 10);
          soma = soma + servicos[i].valor;
        }
      }
    }

    setResultadoSoma(soma);
    setResultadoDuracao(duracao);
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
            </tr>
          </tbody>
        </table>
        <table className="table align-center" id="tabela">
          <thead>
            <tr>
              <th>Nome da especialidade</th>
              <th>Selecionar</th>
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
                      handleSelectEspecialidade(especialidade);
                    }}
                  >
                    {" "}
                    <FiArrowRightCircle size={30} />{" "}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <div id="agenda">
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
            dateClick={handleDateClick}
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
        </div>

        {/* Modal Create */}
        <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="lg">
          <Modal.Header closeButton>
            <h5>Agendar atendimento</h5>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleCreateForm}>
              <p>
                O atendimento será marcado dia: <strong>{dataAtiva}</strong>
              </p>
              <p>
                Terapêuta selecionado: <strong>{terapeutaAtivoNome}</strong>
              </p>
              <p>
                <strong>Hóspede: </strong>
              </p>
              <table className="table align-center mt-2">
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        placeholder="Digite o nome do hóspede..."
                        className="form-control"
                        id="palavra-hospede"
                        onKeyUp={buscaNomeHospede}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="table align-center" id="tabela-hospede">
                <thead>
                  <tr>
                    <th>Nome do hóspede</th>
                    <th>Selecionar</th>
                  </tr>
                </thead>
                <tbody>
                  {hospedes.map((hospede) => (
                    <tr key={hospede._id}>
                      <td>{hospede.nome}</td>
                      <td>
                        <input
                          value={hospede._id}
                          type="radio"
                          className="form-control"
                          name="hospede-create"
                          required
                        ></input>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                <strong>Serviço: </strong>
              </p>
              <table className="table" id="tabela">
                <thead>
                  <tr className="align-center">
                    <th>Nome</th>
                    <th>Duração (minutos)</th>
                    <th>Valor (reais)</th>
                    <th>Selecionar</th>
                  </tr>
                </thead>
                <tbody>
                  {servicosFiltered.map((servico) => (
                    <tr className="align-center" key={servico._id}>
                      <td>{servico.nome}</td>
                      <td>
                        <p>{servico.duracao} minutos</p>
                      </td>
                      <td>
                        <p>R$ {servico.valor}</p>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          name="servico-create"
                          value={servico._id}
                          onClick={verificaValor}
                        ></input>
                      </td>
                    </tr>
                  ))}
                  <tr className="align-center">
                    <th>Duração total:</th>
                    <td colSpan="3">{resultadoDuracao} minutos</td>
                  </tr>
                  <tr className="align-center">
                    <th>Valor total:</th>
                    <td colSpan="3">R$ {resultadoSoma}</td>
                  </tr>
                </tbody>
              </table>

              <strong></strong>
              <div className="align-center">
                <button className="btn btn-success" type="submit">
                  Agendar
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

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
            <div className="align-center">
              <button className="btn btn-info" onClick={handleCloseReadModal}>
                Fechar
              </button>{" "}
              <button className="btn btn-danger" onClick={desativarAtendimento}>
                Desativar atendimento
              </button>
            </div>
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
