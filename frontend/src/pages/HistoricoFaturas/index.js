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
  FiList,
  FiPrinter,
} from "react-icons/fi";
import { Modal } from "react-bootstrap";
import $ from "jquery";
import moment from "moment";
import "./style.css";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Servicos() {
  //States da página.
  const [hospedes, setHospedes] = useState([]);
  const [faturas, setFaturas] = useState([]);
  const [atendimentos, setAtendimentos] = useState([]);
  const [hospedagens, setHospedagens] = useState([]);

  const [faturasAtivas, setFaturasAtivas] = useState([]);
  const [hospedeAtivo, setHospedeAtivo] = useState([]);
  const [atendimentosAtivo, setAtendimentosAtivo] = useState([]);
  const [hospedagensAtivas, setHospedagensAtivas] = useState([]);
  const [atendimentoAtivo, setAtendimentoAtivo] = useState([]);
  const [terapeutaAtivo, setTerapeutaAtivo] = useState([]);
  const [servicoAtendimento, setServicoAtendimento] = useState("");
  const [faturaAtiva, setFaturaAtiva] = useState([]);

  const [erros, setErros] = useState("");
  const [sucesso, setSucesso] = useState("");

  //States para os modais.
  const [showReadModal, setShowReadModal] = useState(false);
  const [detalhesModal, setDetalhesModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);

  //Funções de obtenção e atualização de states.
  useEffect(() => {
    let selectHospedes = document.getElementById("hospedes");
    let faturaDiv = document.getElementById("faturas");
    selectHospedes.style.display = "none";
    faturaDiv.style.display = "none";

    api.get("/hospedes").then((response) => {
      setHospedes(response.data);
      api.get("/faturasGeral").then((response1) => {
        setFaturas(response1.data);
        api.get("/atendimentos").then((response2) => {
          setAtendimentos(response2.data);
          api.get("/hospedagens").then((response3) => {
            setHospedagens(response3.data);
          });
        });
      });
    });
  }, []);

  function realoadHospedes() {
    api.get("/hospedes").then((response) => {
      setHospedes(response.data);
    });
  }

  //Funções da página:

  //Funções para modais.
  function closeDetalhesModal() {
    setDetalhesModal(false);
  }

  function handleShowCreateModal() {
    setShowCreateModal(true);
  }

  function handleCloseCreateModal() {
    setShowCreateModal(false);
  }

  function handleShowReadModal(hospede) {
    setShowReadModal(true);
  }

  function handleCloseReadModal() {
    setShowReadModal(false);
  }

  function handleShowEditModal(hospede) {
    setShowEditModal(true);
  }

  function handleCloseEditModal() {
    setShowEditModal(false);
  }

  function handleShowDeleteModal(hospede) {
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
  async function handleCreateForm(e) {}

  async function handleEditForm(e) {}

  async function handleDeleteForm(e) {}

  //Funções auxiliares
  function buscaNome() {
    var entrada, filtro, tabela, tr, td, i, txtValue;
    entrada = document.getElementById("palavra");
    filtro = entrada.value.toUpperCase();
    tabela = document.getElementById("tabela");
    tr = tabela.getElementsByTagName("tr");

    let selectHospedes = document.getElementById("hospedes");
    let faturaDiv = document.getElementById("faturas");
    faturaDiv.style.display = "none";

    if (entrada.value.length >= 3) {
      selectHospedes.style.display = "block";
    } else {
      selectHospedes.style.display = "none";
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

  function showFaturas(hospede) {
    let faturaDiv = document.getElementById("faturas");
    faturaDiv.style.display = "block";

    let faturaParser = [];
    for (let i = 0; i < faturas.length; i++) {
      let faturaAtual = faturas[i];
      if (faturaAtual.hospede._id === hospede._id) {
        faturaParser.push(faturaAtual);
      }
    }

    setHospedeAtivo(hospede);
    setFaturasAtivas(faturaParser);
  }

  function verDetalhes(fatura) {
    setShowReadModal(true);

    let atendimentosParser = [];

    for (let i = 0; i < atendimentos.length; i++) {
      for (let j = 0; j < fatura.atendimentos.length; j++) {
        if (atendimentos[i]._id === fatura.atendimentos[j]._id) {
          atendimentosParser.push(atendimentos[i]);
        }
      }
    }

    setAtendimentosAtivo(atendimentosParser);

    let hospedagensParser = [];

    console.log(fatura);
    console.log(hospedagens);
    for (let i = 0; i < hospedagens.length; i++) {
      for (let j = 0; j < fatura.hospedagens.length; j++) {
        if (hospedagens[i]._id === fatura.hospedagens[j]._id) {
          hospedagensParser.push(hospedagens[i]);
        }
      }
    }

    setHospedagensAtivas(hospedagensParser);

    setFaturaAtiva(fatura);
  }

  function detalhesAtendimento(atendimento) {
    setAtendimentoAtivo(atendimento);
    setTerapeutaAtivo(atendimento.terapeuta);
    setDetalhesModal(true);
    let servicosParser = "";
    for (let i = 0; i < atendimento.servico.length; i++) {
      servicosParser = servicosParser + " " + atendimento.servico[i].nome + ",";
    }
    servicosParser = servicosParser.replace(/,$/, ".");
    setServicoAtendimento(servicosParser);
  }

  function PDFDetail() {
    let tableAten;

    if (atendimentosAtivo.length > 0) {
      let tableAtenParser = [];
      tableAtenParser.push(["Hóspede", "Data", "Valor (R$)"]);
      for (let i = 0; i < atendimentosAtivo.length; i++) {
        tableAtenParser.push([
          atendimentosAtivo[i].hospede.nome,
          moment(atendimentosAtivo[i].data_inicial).format("DD/MM/YYYY"),
          "R$ " + atendimentosAtivo[i].valor,
        ]);
        tableAten = {
          layout: "lightHorizontalLines",
          table: {
            headerRows: 1,
            widths: ["*", 100, 100],

            body: tableAtenParser,
          },
          margin: [0, 15, 0, 0],
        };
      }
    } else {
      tableAten = {
        text: "Não existem atendimentos vinculados a esta fatura.",
        margin: [0, 5, 0, 0],
      };
    }

    let tableHosp;

    console.log(hospedagensAtivas);

    if (hospedagensAtivas.length > 0) {
      let tableHospParser = [];
      tableHospParser.push(["Quarto", "Check-in", "Check-out", "Valor (R$)"]);
      for (let i = 0; i < hospedagensAtivas.length; i++) {
        tableHospParser.push([
          hospedagensAtivas[i].quarto.numero,
          moment(hospedagensAtivas[i].checkIn).format("DD/MM/YYYY"),
          moment(hospedagensAtivas[i].checkOut).format("DD/MM/YYYY"),
          "R$ " + hospedagensAtivas[i].valor_total,
        ]);
      }

      tableHosp = {
        layout: "lightHorizontalLines",
        table: {
          headerRows: 1,
          widths: ["*", 100, 100, 100],

          body: tableHospParser,
        },
        margin: [0, 15, 0, 0],
      };
    } else {
      tableHosp = {
        text: "Não existem hospedagens vinculadas a esta fatura.",
        margin: [0, 5, 0, 0],
      };
    }

    let docDef = {
      header: {
        text: "Fatura",
        fontSize: 18,
        margin: [280, 15, 0, 0],
        bold: true,
      },
      content: [
        {
          text: "Informações do hóspede ",
          fontSize: 16,
          margin: [0, 15, 0, 0],
        },
        {
          text: "Nome: " + hospedeAtivo.nome,
          margin: [0, 5, 0, 0],
        },
        {
          text: "Telefone: " + hospedeAtivo.telefone,
          margin: [0, 5, 0, 0],
        },
        {
          text: "E-mail: " + hospedeAtivo.email,
          margin: [0, 5, 0, 0],
        },
        {
          text: "Informações dos atendimentos ",
          fontSize: 16,
          margin: [0, 15, 0, 0],
        },
        tableAten,
        {
          text: "Informações das hospedagens ",
          fontSize: 16,
          margin: [0, 15, 0, 0],
        },
        tableHosp,
        {
          text: "Valor total pago: R$ " + faturaAtiva.valor,
          fontSize: 16,
          margin: [0, 15, 0, 0],
        },
      ],
    };

    pdfMake.createPdf(docDef).open();
  }

  function PDFGeral() {
    let tableFaturasParser = [];

    let faturasParser = [];
    let valorAtendimento = 0;
    let valorHospedagem = 0;
    let valorTotalFaturas = 0;

    for (let i = 0; i < faturas.length; i++) {
      if (faturas[i].hospede._id === hospedeAtivo._id) {
        faturasParser.push(faturas[i]);
        for (let j = 0; j < faturas[i].atendimentos.length; j++) {
          valorAtendimento =
            valorAtendimento + parseInt(faturas[i].atendimentos[j].valor);
        }
        for (let j = 0; j < faturas[i].hospedagens.length; j++) {
          valorHospedagem =
            valorHospedagem + parseInt(faturas[i].hospedagens[j].valor_total);
        }
        valorTotalFaturas = valorTotalFaturas + parseInt(faturas[i].valor);
      }
    }

    if (faturasParser.length > 0) {
      tableFaturasParser.push([
        "Data",
        "Pago",
        "Atendimentos (R$)",
        "Hospedagens (R$)",
        "Valor total (R$)",
      ]);
      for (let i = 0; i < faturasParser.length; i++) {
        let confirmacaoPg = "";
        if (faturasParser[i].pago === true) {
          confirmacaoPg = "Sim";
        } else {
          confirmacaoPg = "Não";
        }
        tableFaturasParser.push([
          moment(faturasParser[i].data).format("DD/MM/YYYY"),
          confirmacaoPg,
          "R$ " + valorAtendimento,
          "R$ " + valorHospedagem,
          "R$ " + faturasParser[i].valor,
        ]);
      }
    }

    let tableFaturas = {
      layout: "lightHorizontalLines",
      table: {
        headerRows: 1,
        widths: [90, 90, 90, 90, 90],

        body: tableFaturasParser,
      },
      margin: [0, 15, 0, 0],
    };

    let docDef = {
      header: {
        text: "Relatório de faturas (" + moment().format("DD/MM/YYYY") + ")",
        fontSize: 18,
        margin: [150, 15, 0, 0],
        bold: true,
      },
      content: [
        tableFaturas,
        {
          text: "Valor total das faturas: R$ " + valorTotalFaturas,
          fontSize: 16,
          margin: [0, 15, 0, 0],
        },
      ],
    };

    pdfMake.createPdf(docDef).open();
  }

  return (
    <div>
      <Navbar />
      <main className="global-container shadow">
        <h4>Histórico de faturas </h4>
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
            </tr>
          </tbody>
        </table>

        <div id="hospedes">
          <table className="table align-center" id="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Selecionar</th>
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
                        showFaturas(hospede);
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
        </div>

        <div id="faturas">
          <hr />
          <div id="faturaTitle">
            <h5>Faturas</h5>
          </div>
          <div id="printIcon">
            <a href="#" onClick={PDFGeral}>
              <FiPrinter size={40} />
            </a>
          </div>
          <br />
          {faturasAtivas.length > 0 ? (
            <table className="table align-center">
              <thead>
                <th>Data</th>
                <th>Ver detalhes</th>
                <th>Pago</th>
                <th>Valor (R$)</th>
              </thead>
              <tbody>
                {faturasAtivas.map((fatura) => (
                  <tr key={fatura._id}>
                    <td>{moment(fatura.data).format("DD/MM/YYYY")}</td>
                    <td>
                      <a
                        href="#"
                        onClick={() => {
                          verDetalhes(fatura);
                        }}
                      >
                        <FiList size={30} />
                      </a>
                    </td>
                    <td>{fatura.pago === true ? <>Sim</> : <>Não</>}</td>
                    <td>R$ {fatura.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Não existem faturas vinculadas a este hóspede.</p>
          )}
        </div>

        {/* Modal Read */}
        <Modal show={showReadModal} onHide={handleCloseReadModal} size="lg">
          <Modal.Header closeButton>
            <div id="titleModal">
              <h5>Detalhes da fatura</h5>
            </div>

            <div id="printIconModal">
              <a href="#" onClick={PDFDetail}>
                <FiPrinter size={40} />
              </a>
            </div>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Informações do hóspede:</strong>
            </p>
            <p>Nome: {hospedeAtivo.nome}</p>
            <p>Telefone: {hospedeAtivo.telefone}</p>
            <p>Email: {hospedeAtivo.email}</p>
            <hr />
            {atendimentosAtivo.length === 0 ? (
              <></>
            ) : (
              <div>
                <strong>Informação dos atendimentos:</strong>
                <table className="table align-center">
                  <thead>
                    <tr>
                      <th>Hóspede</th>
                      <th>Data</th>
                      <th>Ver detalhes</th>
                      <th>Valor (R$) </th>
                    </tr>
                  </thead>
                  <tbody>
                    {atendimentosAtivo.map((atendimento) => (
                      <tr key={atendimento._id}>
                        <td>{atendimento.hospede.nome}</td>
                        <td>
                          {moment(atendimento.data_inicial).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </td>
                        <td>
                          <a
                            href="#"
                            onClick={() => {
                              detalhesAtendimento(atendimento);
                            }}
                          >
                            {" "}
                            <FiList size={30} />{" "}
                          </a>
                        </td>
                        <td>R$ {atendimento.valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr />
              </div>
            )}
            {hospedagensAtivas.length === 0 ? (
              <></>
            ) : (
              <div>
                <strong>Informação das hospedagens:</strong>
                <table className="table align-center">
                  <thead>
                    <tr>
                      <th>Quarto</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Valor (R$) </th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospedagensAtivas.map((hospedagem) => (
                      <tr key={hospedagem._id}>
                        <td>{hospedagem.quarto.numero}</td>
                        <td>
                          {moment(hospedagem.checkIn).format("DD/MM/YYYY")}
                        </td>
                        <td>
                          {moment(hospedagem.checkOut).format("DD/MM/YYYY")}
                        </td>
                        <td>R$ {hospedagem.valor_total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr />
              </div>
            )}
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
          <Modal.Body></Modal.Body>
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
              <hr />
              <div className="align-center">
                <button className="btn btn-success" type="submit">
                  Editar
                </button>
              </div>
            </Modal.Body>
          </form>
        </Modal>

        {/* Modal detalhes */}
        <Modal show={detalhesModal} onHide={closeDetalhesModal}>
          <Modal.Header closeButton>
            <h5>Detalhes do atendimento</h5>
          </Modal.Header>
          <Modal.Body>
            <p>Hóspede: {hospedeAtivo.nome}</p>
            <p>Terapêuta: {terapeutaAtivo.nome}</p>
            <p>Serviços: {servicoAtendimento}</p>
            <p>
              Data: {moment(atendimentoAtivo.data_inicial).format("DD/MM/YYYY")}{" "}
              às {moment(atendimentoAtivo.data_inicial).format("HH:mm")} até{" "}
              {moment(atendimentoAtivo.data_final).format("HH:mm")}
            </p>
            <p>Valor: R$ {atendimentoAtivo.valor}</p>
            <div className="align-center">
              <button className="btn btn-info" onClick={closeDetalhesModal}>
                Fechar
              </button>
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
