import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PDF from "../components/PDF";
import api from "../../services/api";
import {
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiList,
  FiPrinter,
} from "react-icons/fi";
import { Modal } from "react-bootstrap";
import $ from "jquery";
import moment from "moment";
import "./style.css";
import { PDFViewer } from "@react-pdf/renderer";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Fatura() {
  //States da página.
  const [faturas, setFaturas] = useState([]);
  const [valorTotal, setValorTotal] = useState("");
  const [faturaAtiva, setFaturaAtiva] = useState([]);
  const [atendimentos, setAtendimentos] = useState([]);
  const [atendimentosAtivo, setAtendimentosAtivos] = useState([]);
  const [atendimentoDetalhe, setAtendimentoDetalhe] = useState([]);
  const [hospedeAtivo, setHospedeAtivo] = useState([]);
  const [servicosAtendimento, setServicosAtendimento] = useState("");
  const [horaInicial, setHoraInicial] = useState("");
  const [horaFinal, setHoraFinal] = useState("");
  const [dataAtendimento, setDataAtendimento] = useState("");
  const [hospedagensAtivas, sethospedagensAtivas] = useState([]);

  const [teste, setTeste] = useState([]);

  const [terapeutaAtivo, setTerapeutaAtivo] = useState([]);
  const [hospedagens, setHospedagens] = useState([]);
  const [hospedagemAtiva, setHospedagemAtiva] = useState([]);
  const [hospede, setHospede] = useState([]);
  const [erros, setErros] = useState("");
  const [sucesso, setSucesso] = useState("");

  //States para os modais.
  const [pagarModal, setPagarModal] = useState(false);
  const [detalhesModal, setDetalhesModal] = useState(false);
  const [pdfModal, setPdfModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);

  //Funções de obtenção e atualização de states.
  useEffect(() => {
    let testeParser = {
      teste1: "testerino",
      teste2: "testerino2",
    };

    setTeste(testeParser);

    api.get("/faturasPagar").then((response) => {
      setFaturas(response.data);
      let valorSoma = 0;
      for (let i = 0; i < response.data.length; i++) {
        valorSoma = valorSoma + response.data[i].valor;
      }
      setValorTotal(valorSoma);
      api.get("/atendimentos").then((response2) => {
        setAtendimentos(response2.data);
        api.get("/hospedagens").then((response3) => {
          setHospedagens(response3.data);
        });
      });
    });
  }, []);

  function reloadFaturas() {
    api.get("/faturasPagar").then((response) => {
      setFaturas(response.data);
      let valorSoma = 0;
      for (let i = 0; i < response.data.length; i++) {
        valorSoma = valorSoma + response.data[i].valor;
      }
      setValorTotal(valorSoma);
    });
  }

  function handleAtendimentos(fatura) {
    let atendimentosParser = [];
    for (let i = 0; i < fatura.atendimentos.length; i++) {
      for (let j = 0; j < atendimentos.length; j++) {
        if (fatura.atendimentos[i]._id === atendimentos[j]._id) {
          atendimentosParser.push(atendimentos[j]);
        }
      }
    }
    setAtendimentosAtivos(atendimentosParser);
  }

  function handleHospedagens(fatura) {
    let hospedagensParser = [];
    for (let i = 0; i < fatura.hospedagens.length; i++) {
      for (let j = 0; j < hospedagens.length; j++) {
        if (fatura.hospedagens[i]._id === hospedagens[j]._id) {
          hospedagensParser.push(hospedagens[j]);
        }
      }
    }
    sethospedagensAtivas(hospedagensParser);
  }

  //Funções para modais.
  async function showPagarModal(fatura) {
    setFaturaAtiva(fatura);
    let vazio = [];
    sethospedagensAtivas(vazio);
    setAtendimentosAtivos(vazio);

    if (fatura.atendimentos.length > 0) {
      handleAtendimentos(fatura);
    }

    if (fatura.hospedagens.length > 0) {
      handleHospedagens(fatura);
    }

    setHospede(fatura.hospede);
    setPagarModal(true);
  }

  function showPdfModal() {
    setPdfModal(true);
  }

  function closePdfModal() {
    setPdfModal(false);
  }

  function closePagarModal() {
    setPagarModal(false);
  }

  function closeDetalhesModal() {
    setDetalhesModal(false);
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

  //Funções para lidar com pagamento.
  async function realizarPagamento() {
    try {
      const response = await api.post("/faturasPagar/" + faturaAtiva._id);
      if (response.data.Sucesso) {
        reloadFaturas();
        setSucesso("Pagamento confimado ao sistema com sucesso!");
        closePagarModal();
        handleShowSuccessModal();
      } else {
        setErros(response.data.Erro);
        closePagarModal();
        handleShowErroModal();
      }
    } catch (err) {
      setErros("Erro ao confirmar pagamanto ao sistema, tente novamente! ");
      closePagarModal();
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

  function detalhes(atendimento) {
    for (let j = 0; j < atendimentos.length; j++) {
      if (atendimento._id === atendimentos[j]._id) {
        setAtendimentoDetalhe(atendimentos[j]);
        setTerapeutaAtivo(atendimentos[j].terapeuta);
        setHospedeAtivo(atendimentos[j].hospede);
        console.log(atendimentos[j]);
        let servicosParser = "";
        for (let i = 0; i < atendimentos[j].servico.length; i++) {
          servicosParser =
            servicosParser + " " + atendimentos[j].servico[i].nome + ",";
        }
        servicosParser = servicosParser.replace(/,$/, ".");
        setServicosAtendimento(servicosParser);

        setDataAtendimento(
          moment(atendimentos[j].data_inicial).format("DD/MM/YYYY")
        );
        setHoraInicial(moment(atendimentos[j].data_inicial).format("HH:mm"));
        setHoraFinal(moment(atendimentos[j].data_final).format("HH:mm"));
      }
    }
    setDetalhesModal(true);
  }

  function openPDF() {
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
        text: "Comprovante de pagamento ",
        fontSize: 18,
        margin: [190, 15, 0, 0],
        bold: true,
      },
      content: [
        {
          text: "Informações do hóspede ",
          fontSize: 16,
          margin: [0, 15, 0, 0],
        },
        {
          text: "Nome: " + hospede.nome,
          margin: [0, 5, 0, 0],
        },
        {
          text: "Telefone: " + hospede.telefone,
          margin: [0, 5, 0, 0],
        },
        {
          text: "E-mail: " + hospede.email,
          margin: [0, 5, 0, 0],
        },
        {
          text: "Data do pagamento: " + moment().format("DD/MM/YYYY"),
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
        {
          text:
            "___________________________________                                     ___________________________________",
          margin: [0, 60, 0, 0],
        },
        {
          text:
            "Funcionário responsável                                                                                   Hóspede",
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
        <h4>Faturas em aberto </h4>
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
        <div>
          <p id="valorTotal">
            Valor total a ser recebido: <strong>R$ {valorTotal} </strong>
          </p>
        </div>
        <table className="table align-center" id="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor (R$) </th>
              <th>Pagar</th>
            </tr>
          </thead>
          <tbody>
            {faturas.map((fatura) => (
              <tr key={fatura._id}>
                <td>{fatura.hospede.nome}</td>
                <td>R$ {fatura.valor}</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      showPagarModal(fatura);
                    }}
                  >
                    {" "}
                    <FiDollarSign size={30} />{" "}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Pagar */}
        <Modal show={pagarModal} onHide={closePagarModal} size="lg">
          <Modal.Header closeButton>
            <div id="title">
              <h5>Receber pagamento</h5>
            </div>

            <div id="print">
              <a href="#" onClick={openPDF}>
                <FiPrinter size="36" />
              </a>
            </div>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Informações do hóspede:</strong>
            </p>
            <p>Nome: {hospede.nome}</p>
            <p>Telefone: {hospede.telefone}</p>
            <p>Email: {hospede.email}</p>
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
                              detalhes(atendimento);
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

            <table className="table">
              <tbody>
                <tr>
                  <th>Valor total (R$): </th>
                  <td>R$ {faturaAtiva.valor}</td>
                </tr>
              </tbody>
            </table>

            <div className="align-center">
              <button className="btn btn-success" onClick={realizarPagamento}>
                Confirmar
              </button>{" "}
              <button className="btn btn-danger" onClick={closePagarModal}>
                Cancelar
              </button>
            </div>
          </Modal.Body>
        </Modal>

        {/* Modal detalhes */}
        <Modal show={detalhesModal} onHide={closeDetalhesModal}>
          <Modal.Header closeButton>
            <h5>Detalhes do atendimento</h5>
          </Modal.Header>
          <Modal.Body>
            <p>Hóspede: {hospedeAtivo.nome}</p>
            <p>Terapêuta: {terapeutaAtivo.nome}</p>
            <p>Serviços: {servicosAtendimento}</p>
            <p>
              Data: {dataAtendimento} às {horaInicial} até {horaFinal}
            </p>
            <p>Valor: {atendimentoDetalhe.valor}</p>
            <div className="align-center">
              <button className="btn btn-info" onClick={closeDetalhesModal}>
                Fechar
              </button>
            </div>
          </Modal.Body>
        </Modal>

        {/* Modal pdf */}
        <Modal show={pdfModal} onHide={closePdfModal} size={"lg"}>
          <Modal.Header closeButton>
            <h5>PDF</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="align-center">
              <PDFViewer>
                <PDF props={teste} />
              </PDFViewer>
            </div>
            <div className="align-center">
              <button className="btn btn-info" onClick={closePdfModal}>
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
                <a href="#" onClick={openPDF}>
                  <FiPrinter size="36" />
                </a>
                <br />
                <br />
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
