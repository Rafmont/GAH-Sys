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
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";

export default function Servicos() {
  //States da página.
  const [hospedes, setHospedes] = useState([]);
  const [dependentes, setDependentes] = useState([]);
  const [dependentesSelect, setDependetesSelect] = useState([]);
  const [quartos, setQuartos] = useState([]);
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [dataClick, setDataClick] = useState("");
  const [rawDataClick, setRawDataClick] = useState("");
  const [quartoAtivo, setQuartoAtivo] = useState([]);
  const [tipoAtivo, setTipoAtivo] = useState([]);
  const [configuracoes, setConfiguracoes] = useState([]);
  const [totalDiarias, setTotalDiarias] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [erros, setErros] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [hospedagens, setHospedagens] = useState("");

  //States para os modais.
  const [marcarModal, setMarcarModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);

  //Funções de obtenção e atualização de states.
  useEffect(() => {
    api.get("/configuracao").then((configuracoes) => {
      setConfiguracoes(configuracoes.data);

      api.get("/hospedes").then((response1) => {
        let hospedes = response1.data;
        let dependenteParser = [];
        let hospedeParser = [];

        for (let i = 0; i < hospedes.length; i++) {
          if (hospedes[i].dependente === true) {
            dependenteParser.push(hospedes[i]);
          } else {
            hospedeParser.push(hospedes[i]);
          }
        }
        setHospedes(hospedeParser);
        setDependentes(dependenteParser);

        api.get("/quartos").then((response2) => {
          setQuartos(response2.data);
          let quartosData = response2.data;
          let resourcesData = [];
          for (let i = 0; i < quartosData.length; i++) {
            if (quartosData[i].tipoQuarto._id != "5f50da20bbf4a924a8670c12") {
              if (quartosData[i].estado != "manutenção") {
                let resource = {
                  id: quartosData[i]._id,
                  title: "Quarto " + quartosData[i].numero,
                  TipoQuarto: quartosData[i].tipoQuarto.nome,
                };
                resourcesData.push(resource);
              }
            }
          }
          setResources(resourcesData);

          api.get("/hospedagens").then((response3) => {
            setHospedagens(response3.data);

            let response = response3.data;
            let eventParser = [];

            for (let i = 0; i < response.length; i++) {
              eventParser.push({
                id: response[i]._id,
                resourceId: response[i].quarto._id,
                start:
                  response[i].checkIn + "T" + configuracoes.data.checkInTime,
                end:
                  response[i].checkOut + "T" + configuracoes.data.checkOutTime,
                title: " ",
              });
            }
            setEvents(eventParser);
          });
        });
      });
    });
  }, []);

  async function realoadHospedagem() {
    await api.get("/hospedagens").then((response3) => {
      setHospedagens(response3.data);

      let response = response3.data;
      let eventParser = [];

      for (let i = 0; i < response.length; i++) {
        eventParser.push({
          id: response[i]._id,
          resourceId: response[i].quarto._id,
          start: response[i].checkIn + "T" + configuracoes.checkInTime,
          end: response[i].checkOut + "T" + configuracoes.checkOutTime,
          title: " ",
        });
      }
      console.log(eventParser);
      setEvents(eventParser);
    });
  }

  //Funções da página:
  function handleDate(dataini, datafim) {
    let inicial = moment(dataini, "YYYY-MM-DD");
    let final = moment(datafim, "YYYY-MM-DD");

    if (final <= inicial) {
      return false;
    }

    let diferenca = moment.duration(inicial.diff(final)).asDays();

    return diferenca;
  }

  function handleDateClick(info) {
    let resourceId = info.resource._resource.id;
    let dataFormatada = moment(info.dateStr).format("DD/MM/YYYY");
    for (let i = 0; i < quartos.length; i++) {
      if (quartos[i]._id === resourceId) {
        setQuartoAtivo(quartos[i]);
        setTipoAtivo(quartos[i].tipoQuarto);
      }
    }

    setRawDataClick(info.dateStr);
    setDataClick(dataFormatada);
    showMarcarModal();

    let select_hospede = document.getElementById("select_hospede");
    select_hospede.style.display = "none";
    let select_dependete = document.getElementById("select_dependete");
    select_dependete.style.display = "none";
    let no_depentende = document.getElementById("no-dependente");
    no_depentende.style.display = "none";
    let soma_diaria = document.getElementById("soma_diaria");
    soma_diaria.style.display = "none";
  }

  function handleCalculoDiaria() {
    const diarias = handleDate(
      rawDataClick,
      document.getElementById("data-checkout").value
    );
    if (diarias === false) {
      setErros("Por favor insira uma data posterior a data de check-in. ");
      handleShowErroModal();
      document.getElementById("data-checkout").value = "";
      let soma_diaria = document.getElementById("soma_diaria");
      soma_diaria.style.display = "none";
    } else {
      setTotalDiarias(diarias * -1);
      setValorTotal(diarias * tipoAtivo.valor_diaria * -1);
      let soma_diaria = document.getElementById("soma_diaria");
      soma_diaria.style.display = "block";
    }
  }

  function buscaNomeHospede() {
    var entrada, filtro, tabela, tr, td, i, txtValue;

    entrada = document.getElementById("palavra-hospede");
    filtro = entrada.value.toUpperCase();
    tabela = document.getElementById("tabela-hospede");
    tr = tabela.getElementsByTagName("tr");

    let select_hospede = document.getElementById("select_hospede");
    let no_depentende = document.getElementById("no-dependente");
    let select_dependete = document.getElementById("select_dependete");

    if (entrada.value.length >= 3) {
      select_hospede.style.display = "block";
    } else {
      select_hospede.style.display = "none";
      no_depentende.style.display = "none";
      select_dependete.style.display = "none";
    }

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

  function handleHospedeSelect() {
    var radios = document.getElementsByName("hospede-create");
    let idHospede;

    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        idHospede = radios[i].value;
        break;
      }
    }
    let dependentesParser = [];
    for (let i = 0; i < dependentes.length; i++) {
      if (dependentes[i].depende_de._id === idHospede) {
        dependentesParser.push(dependentes[i]);
      }
    }

    const checkboxes = document.querySelectorAll(
      'input[name="dependente-create"]:checked'
    );
    let idDependente = [];
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    if (dependentesParser.length > 0) {
      setDependetesSelect(dependentesParser);
      let select_dependete = document.getElementById("select_dependete");
      select_dependete.style.display = "block";
      let no_depentende = document.getElementById("no-dependente");
      no_depentende.style.display = "none";
    } else {
      let select_dependete = document.getElementById("select_dependete");
      select_dependete.style.display = "none";
      let no_depentende = document.getElementById("no-dependente");
      no_depentende.style.display = "block";
    }
  }

  function handleShowReadModal() {}

  //Funções para modais.
  function showMarcarModal() {
    setMarcarModal(true);
  }

  function closeMarcarModal() {
    setMarcarModal(false);
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
    var radios = document.getElementsByName("hospede-create");
    let idHospede;

    const checkboxes = document.querySelectorAll(
      'input[name="dependente-create"]:checked'
    );
    let idDependente = [];
    checkboxes.forEach((checkbox) => {
      idDependente.push(checkbox.value);
    });

    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        idHospede = radios[i].value;
        break;
      }
    }

    console.log(idDependente);
    let contagem = idDependente.length + 1;

    if (contagem > tipoAtivo.capacidade) {
      setErros(
        "Capacidade excedida.\n Capacidade do quarto: " +
          tipoAtivo.capacidade +
          ".\n Hóspedes selecionados: " +
          contagem +
          "."
      );
      handleShowErroModal();
      return 0;
    }

    const dados = {
      quarto: quartoAtivo._id,
      hospede: idHospede,
      checkIn: rawDataClick,
      checkOut: document.getElementById("data-checkout").value,
      diarias: totalDiarias,
      valor_total: valorTotal,
      dependentes: idDependente,
    };

    try {
      const response = await api.post("/hospedagens", dados);
      if (response.data.Sucesso) {
        realoadHospedagem();
        closeMarcarModal();
        setSucesso("Hospedagem agendada com sucesso!");
        setShowSuccessModal(true);
      } else {
        closeMarcarModal();
        setErros(response.data.Erro[0]);
        setShowErroModal(true);
      }
    } catch (err) {
      closeMarcarModal();
      setErros(
        "Problemas ao agendar hospedagem, por favor tente novamente." + err
      );
      setShowErroModal(true);
    }
  }

  async function handleEditForm(e) {}

  async function handleDeleteForm(e) {}

  return (
    <div>
      <Navbar />
      <main className="global-container shadow">
        <h4>Hospedagem </h4>
        <hr />
        <FullCalendar
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          resources={resources}
          initialView="resourceTimeLineMes"
          locales={allLocales}
          events={events}
          locale="pt-br"
          selectable="true"
          scrollTime="06:00"
          eventColor="#5cb85c"
          editable="true"
          resourceGroupField="TipoQuarto"
          headerToolbar={{
            left: "today prev,next",
            center: "title",
            right:
              "resourceTimelineDay,resourceTimelineWeek,resourceTimeLineMes",
          }}
          resourceAreaWidth="200px"
          dateClick={handleDateClick}
          views={{
            resourceTimelineDay: {
              buttonText: "Dia",
              slotDuration: "00:15",
            },
            resourceTimeLineMes: {
              buttonText: "Mês",
              type: "resourceTimeline",
              duration: { days: 30 },
            },
          }}
          eventClick={handleShowReadModal}
          aspectRatio="2"
        />

        {/* Modal Marcar */}
        <Modal show={marcarModal} onHide={closeMarcarModal} size="lg">
          <Modal.Header closeButton>
            <h5>Marcar hospedagem</h5>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleCreateForm}>
              <p>
                O check-in será marcado para o dia:{" "}
                <strong>
                  {dataClick} {configuracoes.checkInTime}.
                </strong>
              </p>
              <p>
                Quarto selecionado:{" "}
                <strong>Quarto {quartoAtivo.numero}.</strong>
              </p>
              <p>
                Tipo do quarto: <strong>{tipoAtivo.nome}.</strong>
              </p>
              <p>
                Valor da diária: <strong>R$ {tipoAtivo.valor_diaria}.</strong>
              </p>
              <p>
                Capacidade: <strong>{tipoAtivo.capacidade}.</strong>
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
                        required
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div id="select_hospede">
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
                            onChange={handleHospedeSelect}
                            required
                          ></input>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div id="select_dependete">
                <hr />
                <strong>Dependentes: </strong>
                <table className="table align-center" id="tabela-dependente">
                  <thead>
                    <tr>
                      <th>Nome do dependente</th>
                      <th>Selecionar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dependentesSelect.map((dependente) => (
                      <tr key={dependente._id}>
                        <td>{dependente.nome}</td>
                        <td>
                          <input
                            value={dependente._id}
                            type="checkbox"
                            className="form-control"
                            name="dependente-create"
                          ></input>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div id="no-dependente">
                <p>
                  <strong>Este hóspede não possuí dependentes.</strong>
                </p>
              </div>
              <hr />
              <strong>Data de check-out:</strong>
              <input
                id="data-checkout"
                className="form-control"
                type="date"
                onChange={handleCalculoDiaria}
                required
              ></input>
              <br />
              <div id="soma_diaria">
                <p>
                  Número de diárias: <strong>{totalDiarias}</strong>
                </p>
                <p>
                  Valor total da estadia: R$ <strong>{valorTotal}</strong>
                </p>
              </div>
              <br />
              <div className="align-center">
                <button className="btn btn-success" type="submit">
                  Agendar
                </button>
              </div>
            </form>
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
