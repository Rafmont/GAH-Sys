import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../../services/api";
import { FiCheckCircle, FiAlertCircle, FiPrinter } from "react-icons/fi";
import { Modal } from "react-bootstrap";
import moment from "moment";
import "./style.css";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Balanco() {
  //States da página.
  const [faturas, setFaturas] = useState([]);
  const [acertos, setAcertos] = useState([]);
  const [despesas, setDespesas] = useState([]);

  const [dataComeco, setDataComeco] = useState("");
  const [dataEncerramento, setDataEncerramento] = useState("");

  const [somaFaturasG, setSomaFaturas] = useState(0);
  const [somaAcertosG, setSomaAcertos] = useState(0);
  const [somaDespesasG, setSomaDespesas] = useState(0);
  const [somaTotalG, setSomaTotal] = useState(0);

  const [printModal, setPrintModal] = useState(false);

  const [faturasAtivas, setFaturasAtivas] = useState([]);
  const [acertosAtivos, setAcertosAtivos] = useState([]);
  const [despesasAtivas, setDespesasAtivas] = useState([]);

  //States para os modais.

  //Funções de obtenção e atualização de states.
  useEffect(() => {
    document.getElementById("display").style.display = "none";
    api.get("/acertos").then((response) => {
      setAcertos(response.data);
      api.get("/despesas").then((response1) => {
        setDespesas(response1.data);
        api.get("/faturas").then((response2) => {
          setFaturas(response2.data);
        });
      });
    });
  }, []);

  //Funções para lidar com formulários.
  function handleDate(dataini, datafim) {
    let inicial = moment(dataini, "YYYY-MM-DD");
    let final = moment(datafim, "YYYY-MM-DD");
    if (final <= inicial) {
      return false;
    } else {
      return true;
    }
  }

  async function handleRelatorio(e) {
    e.preventDefault();
    document.getElementById("display").style.display = "none";

    let dataInicial = document.getElementById("dataI").value;
    let dataFinal = document.getElementById("dataF").value;

    setDataComeco(moment(dataInicial).format("DD/MM/YYYY"));
    setDataEncerramento(moment(dataFinal).format("DD/MM/YYYY"));

    let dataBool = handleDate(dataInicial, dataFinal);

    if (!dataBool) {
      console.log("Faio");
    } else {
      let somatorio = 0;
      let somaFatura = 0;
      let somaDespesa = 0;
      let somaAcerto = 0;
      let faturasParser = [];
      for (let i = 0; i < faturas.length; i++) {
        if (
          moment(faturas[i].data) < moment(dataFinal) &&
          moment(faturas[i].data) > moment(dataInicial)
        ) {
          faturasParser.push(faturas[i]);
          somaFatura = somaFatura + faturas[i].valor;
        }
      }
      setFaturasAtivas(faturasParser);
      let despesasParser = [];

      for (let i = 0; i < despesas.length; i++) {
        if (
          moment(despesas[i].data) < moment(dataFinal) &&
          moment(despesas[i].data) > moment(dataInicial)
        ) {
          despesasParser.push(despesas[i]);
          somaDespesa = somaDespesa + despesas[i].valor;
        }
      }
      setDespesasAtivas(despesasParser);
      let acertoParser = [];
      for (let i = 0; i < acertos.length; i++) {
        if (
          moment(acertos[i].data) < moment(dataFinal) &&
          moment(acertos[i].data) > moment(dataInicial)
        ) {
          acertoParser.push(acertos[i]);
          somaAcerto = somaAcerto + acertos[i].valor;
        }
      }
      setAcertosAtivos(acertoParser);
      somatorio = somaFatura - somaAcerto - somaDespesa;

      setSomaFaturas(somaFatura);
      setSomaAcertos(somaAcerto);
      setSomaDespesas(somaDespesa);
      setSomaTotal(somatorio);

      if (
        !(
          faturasParser.length === 0 &&
          acertoParser.length === 0 &&
          despesasParser.length === 0
        )
      ) {
        document.getElementById("display").style.display = "block";
      }
    }
  }

  function openPDF() {
    let contador = 3;
    let tableBody = [];
    tableBody.push(["Tipo", "Nome", "Data", "Valor (R$)"]);

    for (let i = 0; i < faturasAtivas.length; i++) {
      tableBody.push([
        "Fatura",
        faturasAtivas[i].hospede.nome,
        moment(faturasAtivas[i].data).format("DD/MM/YYYY"),
        "R$ " + faturasAtivas[i].valor,
      ]);
    }

    for (let i = 0; i < acertosAtivos.length; i++) {
      tableBody.push([
        "Acerto",
        acertosAtivos[i].terapeuta.nome,
        moment(acertosAtivos[i].data).format("DD/MM/YYYY"),
        "R$ " + acertosAtivos[i].valor,
      ]);
    }

    for (let i = 0; i < despesasAtivas.length; i++) {
      tableBody.push([
        "Despesa",
        despesasAtivas[i].titulo,
        moment(despesasAtivas[i].data).format("DD/MM/YYYY"),
        "R$ " + despesasAtivas[i].valor,
      ]);
    }
    let docDef = {
      header: {
        text:
          "Relatório de contas a pagar e a receber: " +
          dataComeco +
          " até " +
          dataEncerramento,
        fontSize: 18,
        margin: [15, 15, 0, 0],
      },
      content: [
        {
          text: "Saldo: R$ " + somaTotalG,
          fontSize: 16,
          margin: [0, 15, 0, 0],
        },
        {
          layout: "lightHorizontalLines", // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [100, "*", 100, 100],

            body: tableBody,
          },
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
        <h4>Balanço </h4>
        <form onSubmit={handleRelatorio}>
          <table className="table align-center mt-2">
            <thead>
              <tr>
                <th>Data Inicial</th>
                <th>Data Final</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="date"
                    className="form-control"
                    id="dataI"
                    required
                  />
                </td>
                <td>
                  <input
                    type="date"
                    className="form-control"
                    id="dataF"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <button className="btn btn-success" type="submit">
                    Gerar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>

        <div id="display">
          <table className="table">
            <tbody>
              <tr>
                <td id="saldo">
                  Saldo: R$ <strong>{somaTotalG}</strong>
                </td>
                <td>
                  <a href="#" onClick={openPDF}>
                    <FiPrinter size="36" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <table className="table align-center" id="tabela">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nome</th>
                <th>Data</th>
                <th>Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              {faturasAtivas.map((fatura) => (
                <tr key={fatura._id} id="positivo">
                  <td>Fatura</td>
                  <td>{fatura.hospede.nome}</td>
                  <td>{moment(fatura.data).format("DD/MM/YYYY")}</td>
                  <td>R$ {fatura.valor}</td>
                </tr>
              ))}
              {acertosAtivos.map((acerto) => (
                <tr key={acerto._id} id="negativo">
                  <td>Acerto</td>
                  <td>{acerto.terapeuta.nome}</td>
                  <td>{moment(acerto.data).format("DD/MM/YYYY")}</td>
                  <td>R$ - {acerto.valor}</td>
                </tr>
              ))}
              {despesasAtivas.map((despesa) => (
                <tr key={despesa._id} id="negativo">
                  <td>Despesa</td>
                  <td>{despesa.titulo}</td>
                  <td>{moment(despesa.data).format("DD/MM/YYYY")}</td>
                  <td>R$ - {despesa.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
