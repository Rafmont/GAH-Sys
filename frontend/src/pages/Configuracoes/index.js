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
  FiArrowRightCircle,
} from "react-icons/fi";
import { Modal } from "react-bootstrap";
import moment from "moment";

export default function Configuracoes() {
  //States da página.
  const [configuracoes, setConfiguracoes] = useState([]);
  const [terapeutas, setTerapeutas] = useState([]);
  const [reativarAgora, setReativarAgora] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [horaAtivaIni, setHoraAtivaIni] = useState("");
  const [minutoAtivoIni, setMinutoAtivoIni] = useState("");
  const [horaAtivaFim, setHoraAtivaFim] = useState("");
  const [minutoAtivoFim, setMinutoAtivoFim] = useState("");
  const [erros, setErros] = useState("");
  const [sucesso, setSucesso] = useState("");

  //States para os modais.
  const [readHorarioModal, setReadHorarioModal] = useState(false);
  const [updateHorarioModal, setUpdateHorarioModal] = useState(false);
  const [readCheckModal, setReadCheckModal] = useState(false);
  const [updateCheckModal, setUpdateCheckModal] = useState(false);
  const [readAcertoModal, setReadAcertoModal] = useState(false);
  const [updateAcertoModal, setUpdateAcertoModal] = useState(false);
  const [funcionarioModal, setFuncionarioModal] = useState(false);
  const [terapeutaModal, setTerapeutaModal] = useState(false);
  const [confirmarModal, setConfirmarModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);

  //Funções de obtenção e atualização de states.
  useEffect(() => {
    api.get("/configuracao").then((response1) => {
      setConfiguracoes(response1.data);
      api.get("/terapeutas/activate").then((response2) => {
        setTerapeutas(response2.data);
        api.get("/funcionarios/ativar").then((response3) => {
          setFuncionarios(response3.data);
          console.log(response3.data);
        });
      });
    });
  }, []);

  function reloadConfig() {
    api.get("/configuracao").then((response1) => {
      setConfiguracoes(response1.data);
    });
  }

  function reloadFuncionarios() {
    api.get("/funcionarios/ativar").then((response1) => {
      setFuncionarios(response1.data);
      api.get("/terapeutas/activate").then((response2) => {
        setTerapeutas(response2.data);
      });
    });
  }

  //Funções para modais.
  function ShowReadHorarioModal() {
    setReadHorarioModal(true);
  }

  function CloseReadHorarioModal() {
    setReadHorarioModal(false);
  }

  function ShowUpdateHorarioModal() {
    setHoraAtivaIni(configuracoes.atendimentoIni.slice(0, 2));
    setMinutoAtivoIni(configuracoes.atendimentoIni.slice(3, 5));
    setHoraAtivaFim(configuracoes.atendimentoFim.slice(0, 2));
    setMinutoAtivoFim(configuracoes.atendimentoFim.slice(3, 5));
    setUpdateHorarioModal(true);
  }

  function CloseUpdateHorarioModal() {
    setUpdateHorarioModal(false);
  }

  function ShowReadCheckModal() {
    setReadCheckModal(true);
  }

  function CloseReadCheckModal() {
    setReadCheckModal(false);
  }

  function ShowUpdateCheckModal() {
    setHoraAtivaIni(configuracoes.checkInTime.slice(0, 2));
    setMinutoAtivoIni(configuracoes.checkInTime.slice(3, 5));
    setHoraAtivaFim(configuracoes.checkOutTime.slice(0, 2));
    setMinutoAtivoFim(configuracoes.checkOutTime.slice(3, 5));
    setUpdateCheckModal(true);
  }

  function CloseUpdateCheckModal() {
    setUpdateCheckModal(false);
  }

  function ShowReadAcertoModal() {
    setReadAcertoModal(true);
  }

  function CloseReadAcertoModal() {
    setReadAcertoModal(false);
  }

  function ShowUpdateAcertoModal() {
    setUpdateAcertoModal(true);
  }

  function CloseUpdateAcertoModal() {
    setUpdateAcertoModal(false);
  }

  function ShowFuncionarioModal() {
    setFuncionarioModal(true);
  }

  function CloseFuncionarioModal() {
    setFuncionarioModal(false);
  }

  function ShowTerapeutaModal() {
    setTerapeutaModal(true);
  }

  function CloseTerapeutaModal() {
    setTerapeutaModal(false);
  }

  function ShowConfirmarModal(fulanoPraAtivar) {
    setReativarAgora(fulanoPraAtivar);
    setFuncionarioModal(false);
    setTerapeutaModal(false);
    setConfirmarModal(true);
  }

  function CloseConfirmarModal() {
    setConfirmarModal(false);
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
  async function handleUpdateHorarioForm(e) {
    e.preventDefault();
    let atendimentoIni =
      document.getElementById("A-hora-updateI").value +
      ":" +
      document.getElementById("A-minuto-updateI").value;
    let atendimentoFim =
      document.getElementById("A-hora-updateF").value +
      ":" +
      document.getElementById("A-minuto-updateF").value;

    const dados = {
      checkInTime: configuracoes.checkInTime,
      checkOutTime: configuracoes.checkOutTime,
      porcentagem_atendimento: configuracoes.porcentagem_atendimento,
      atendimentoIni,
      atendimentoFim,
    };

    try {
      const response = await api.put("/configuracao", dados);
      if (response.data.Sucesso) {
        reloadConfig();
        setSucesso("Horário de atendimento atualizado com sucesso!");
        CloseUpdateHorarioModal();
        handleShowSuccessModal();
      } else {
        setErros(response.data.Erro);
        CloseUpdateHorarioModal();
        handleShowErroModal();
      }
    } catch (err) {
      setErros(
        "Não foi possível atualizar o horário de atendimento, tente novamente."
      );
      CloseUpdateHorarioModal();
      handleShowErroModal();
    }
  }

  async function handleUpdateCheckForm(e) {
    e.preventDefault();
    let checkInTime =
      document.getElementById("C-hora-updateI").value +
      ":" +
      document.getElementById("C-minuto-updateI").value;
    let checkOutTime =
      document.getElementById("C-hora-updateF").value +
      ":" +
      document.getElementById("C-minuto-updateF").value;

    const dados = {
      checkInTime,
      checkOutTime,
      porcentagem_atendimento: configuracoes.porcentagem_atendimento,
      atendimentoIni: configuracoes.atendimentoIni,
      atendimentoFim: configuracoes.atendimentoFim,
    };

    try {
      const response = await api.put("/configuracao", dados);
      if (response.data.Sucesso) {
        reloadConfig();
        setSucesso("Horário de check-in e check-out atualizado com sucesso!");
        CloseUpdateCheckModal();
        handleShowSuccessModal();
      } else {
        setErros(response.data.Erro);
        CloseUpdateCheckModal();
        handleShowErroModal();
      }
    } catch (err) {
      setErros(
        "Não foi possível atualizar o horário de check-in e check-out, tente novamente."
      );
      CloseUpdateCheckModal();
      handleShowErroModal();
    }
  }

  async function handleUpdateAcertoForm(e) {
    e.preventDefault();
    const dados = {
      porcentagem_atendimento: document.getElementById("porcentagem-update")
        .value,
      atendimentoIni: configuracoes.atendimentoIni,
      atendimentoFim: configuracoes.atendimentoFim,
      checkInTime: configuracoes.checkInTime,
      checkOutTime: configuracoes.checkOutTime,
    };

    try {
      const response = await api.put("/configuracao", dados);
      if (response.data.Sucesso) {
        reloadConfig();
        setSucesso(
          "Porcentagem cobrada sob os atendimentos atualizada com sucesso!"
        );
        CloseUpdateAcertoModal();
        handleShowSuccessModal();
      } else {
        setErros(response.data.Erro);
        console.log(response);
        CloseUpdateAcertoModal();
        handleShowErroModal();
      }
    } catch (err) {
      setErros(
        "Não foi possível atualizar a porcentagem cobrada sob os atendimentos, tente novamente."
      );
      CloseUpdateAcertoModal();
      handleShowErroModal();
    }
  }

  async function activateFuncionario(e) {
    e.preventDefault();
    const dados = {
      login: document.getElementById("loginFuncionario").value,
      senha: document.getElementById("senhaFuncionario").value,
    };
    try {
      const response = await api.put(
        "/terapeutas/ativar/" + reativarAgora._id,
        dados
      );
      if (response.data.Sucesso) {
        reloadFuncionarios();
        setSucesso("Funcionario reativado com sucesso com sucesso!");
        CloseConfirmarModal();
        handleShowSuccessModal();
      } else {
        setErros(response.data.Erro);
        CloseConfirmarModal();
        handleShowErroModal();
      }
    } catch (err) {
      setErros("Não foi possível reativar o funcionario, tente novamente.");
      CloseConfirmarModal();
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
        <h4>Configurações de políticas administrativas </h4>

        <table className="table align-center mt-2">
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Digite o nome da configuração..."
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
              <th>Nome da configuração</th>
              <th>Ver configuração</th>
              <th>Editar configuração</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Check-in e check-out</td>
              <td>
                <a
                  href="#"
                  onClick={() => {
                    ShowReadCheckModal();
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
                    ShowUpdateCheckModal();
                  }}
                >
                  {" "}
                  <FiEdit3 size={30} />{" "}
                </a>
              </td>
            </tr>
            <tr>
              <td>Horário de atendimento</td>
              <td>
                <a
                  href="#"
                  onClick={() => {
                    ShowReadHorarioModal();
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
                    ShowUpdateHorarioModal();
                  }}
                >
                  {" "}
                  <FiEdit3 size={30} />{" "}
                </a>
              </td>
            </tr>
            <tr>
              <td>Porcentagem do atendimento</td>
              <td>
                <a
                  href="#"
                  onClick={() => {
                    ShowReadAcertoModal();
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
                    ShowUpdateAcertoModal();
                  }}
                >
                  {" "}
                  <FiEdit3 size={30} />{" "}
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="table align-center" id="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Selecionar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Reativar funcionário</td>
              <td>
                <a
                  href="#"
                  onClick={() => {
                    ShowFuncionarioModal();
                  }}
                >
                  {" "}
                  <FiArrowRightCircle size={30} />{" "}
                </a>
              </td>
            </tr>
            <tr>
              <td>Reativar terapêuta</td>
              <td>
                <a
                  href="#"
                  onClick={() => {
                    ShowTerapeutaModal();
                  }}
                >
                  {" "}
                  <FiArrowRightCircle size={30} />{" "}
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Modal Read Horário */}
        <Modal show={readHorarioModal} onHide={CloseReadHorarioModal} size="lg">
          <Modal.Header closeButton>
            <h5>Configurar horário de atendimento</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              Início dos atendimentos:{" "}
              <strong>{configuracoes.atendimentoIni}</strong>.
            </p>
            <p>
              Encerramento dos atendimentos:{" "}
              <strong>{configuracoes.atendimentoFim}</strong>.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-info" onClick={CloseReadHorarioModal}>
              Fechar
            </button>
          </Modal.Footer>
        </Modal>

        {/* Modal Update Horário */}
        <Modal
          show={updateHorarioModal}
          onHide={CloseUpdateHorarioModal}
          size="lg"
        >
          <Modal.Header closeButton>
            <h5>Atualizar configuração</h5>
          </Modal.Header>
          <form onSubmit={handleUpdateHorarioForm}>
            <Modal.Body>
              <strong>Insira o novo horário inicial.</strong>
              <table className="table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Minuto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="A-hora-updateI"
                        defaultValue={horaAtivaIni}
                      >
                        <option value="00">00</option>
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="04">04</option>
                        <option value="05">05</option>
                        <option value="06">06</option>
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
                        <option value="23">23</option>
                      </select>
                    </td>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="A-minuto-updateI"
                        defaultValue={minutoAtivoIni}
                      >
                        <option value="00">00</option>
                        <option value="30">30</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <strong>Insira o novo horário final.</strong>
              <table className="table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Minuto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="A-hora-updateF"
                        defaultValue={horaAtivaFim}
                      >
                        <option value="00">00</option>
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="04">04</option>
                        <option value="05">05</option>
                        <option value="06">06</option>
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
                        <option value="23">23</option>
                      </select>
                    </td>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="A-minuto-updateF"
                        defaultValue={minutoAtivoFim}
                      >
                        <option value="00">00</option>
                        <option value="30">30</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="align-center">
                <button className="btn btn-success" type="submit">
                  Atualizar
                </button>
              </div>
            </Modal.Body>
          </form>
        </Modal>

        {/* Modal Read Check */}
        <Modal show={readCheckModal} onHide={CloseReadCheckModal} size="lg">
          <Modal.Header closeButton>
            <h5>Configurar horário check-in e check-out</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              Horário do check-in: <strong>{configuracoes.checkInTime}</strong>.
            </p>
            <p>
              Horário do check-out:{" "}
              <strong>{configuracoes.checkOutTime}</strong>.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-info" onClick={CloseReadCheckModal}>
              Fechar
            </button>
          </Modal.Footer>
        </Modal>

        {/* Modal Update Check */}
        <Modal show={updateCheckModal} onHide={CloseUpdateCheckModal} size="lg">
          <Modal.Header closeButton>
            <h5>Atualizar configuração</h5>
          </Modal.Header>
          <form onSubmit={handleUpdateCheckForm}>
            <Modal.Body>
              <strong>Insira o novo horário de check-in.</strong>
              <table className="table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Minuto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="C-hora-updateI"
                        defaultValue={horaAtivaIni}
                      >
                        <option value="00">00</option>
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="04">04</option>
                        <option value="05">05</option>
                        <option value="06">06</option>
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
                        <option value="23">23</option>
                      </select>
                    </td>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="C-minuto-updateI"
                        defaultValue={minutoAtivoIni}
                      >
                        <option value="00">00</option>
                        <option value="30">30</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <strong>Insira o novo horário de check-out.</strong>
              <table className="table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Minuto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="C-hora-updateF"
                        defaultValue={horaAtivaFim}
                      >
                        <option value="00">00</option>
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="04">04</option>
                        <option value="05">05</option>
                        <option value="06">06</option>
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
                        <option value="23">23</option>
                      </select>
                    </td>
                    <td>
                      <select
                        required
                        className="form-control"
                        id="C-minuto-updateF"
                        defaultValue={minutoAtivoFim}
                      >
                        <option value="00">00</option>
                        <option value="30">30</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="align-center">
                <button className="btn btn-success" type="submit">
                  Atualizar
                </button>
              </div>
            </Modal.Body>
          </form>
        </Modal>

        {/* Modal Read Acerto */}
        <Modal show={readAcertoModal} onHide={CloseReadAcertoModal} size="lg">
          <Modal.Header closeButton>
            <h5>Configurar porcentagem do atendimento.</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              Porcentagem cobrado pelo estabelecimento por atendimento:{" "}
              <strong>{configuracoes.porcentagem_atendimento} %</strong>.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-info" onClick={CloseReadAcertoModal}>
              Fechar
            </button>
          </Modal.Footer>
        </Modal>

        {/* Modal Update Acerto */}
        <Modal
          show={updateAcertoModal}
          onHide={CloseUpdateAcertoModal}
          size="lg"
        >
          <Modal.Header closeButton>
            <h5>Atualizar configuração</h5>
          </Modal.Header>
          <form onSubmit={handleUpdateAcertoForm}>
            <Modal.Body>
              <strong>
                Insira o novo valor da porcentagem cobrada por atendimento (%):
              </strong>
              <br />
              <input
                type="number"
                className="form-control mt-2"
                id="porcentagem-update"
                min="1"
                max="99"
                defaultValue={configuracoes.porcentagem_atendimento}
              ></input>
              <br />
              <div className="align-center">
                <button className="btn btn-success" type="submit">
                  Atualizar
                </button>
              </div>
            </Modal.Body>
          </form>
        </Modal>

        {/* Modal Ativar Funcionario */}
        <Modal show={funcionarioModal} onHide={CloseFuncionarioModal} size="lg">
          <Modal.Header closeButton>
            <h5>Ativar funcionário</h5>
          </Modal.Header>
          <Modal.Body>
            {funcionarios.length === 0 ? (
              <h6>Nenhum funcionário desativado no momento.</h6>
            ) : (
              <table className="table align-center" id="tabela">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Reativar</th>
                  </tr>
                </thead>
                <tbody>
                  {funcionarios.map((funcionario) => (
                    <tr key={funcionario._id}>
                      <td>{funcionario.nome}</td>
                      <td>
                        <a
                          href="#"
                          onClick={() => {
                            ShowConfirmarModal(funcionario);
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
            )}
          </Modal.Body>
        </Modal>

        {/* Modal Ativar Terapêuta */}
        <Modal show={terapeutaModal} onHide={CloseTerapeutaModal} size="lg">
          <Modal.Header closeButton>
            <h5>Reativar terapêuta</h5>
          </Modal.Header>
          <Modal.Body>
            {terapeutas.length === 0 ? (
              <h6>Nenhum terapêuta desativado no momento.</h6>
            ) : (
              <table className="table align-center" id="tabela">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Reativar</th>
                  </tr>
                </thead>
                <tbody>
                  {terapeutas.map((terapeuta) => (
                    <tr key={terapeuta._id}>
                      <td>{terapeuta.nome}</td>
                      <td>
                        <a
                          href="#"
                          onClick={() => {
                            ShowConfirmarModal(terapeuta);
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
            )}
          </Modal.Body>
        </Modal>

        {/* Modal Confirmar reativação */}
        <Modal show={confirmarModal} onHide={CloseConfirmarModal}>
          <Modal.Header closeButton>
            <h5>Confirmar reativação</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              Deseja realmente reativar <strong>{reativarAgora.nome}</strong>?
            </p>
            <form onSubmit={activateFuncionario}>
              <strong>Novo login: </strong>
              <input
                className="form-control"
                id="loginFuncionario"
                required
              ></input>
              <strong>Nova senha: </strong>
              <input
                className="form-control"
                id="senhaFuncionario"
                type="password"
                required
              ></input>
              <hr />
              <div className="align-center">
                <button className="btn btn-success" type="submit">
                  Reativar
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
