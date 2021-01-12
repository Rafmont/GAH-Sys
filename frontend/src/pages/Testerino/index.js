import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import api from "../../services/api";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import allLocales from "@fullcalendar/core/locales-all";
import PDF from "../components/PDF";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Testerino() {
  const [docDefinition, setDocDefinition] = useState([]);

  useEffect(() => {}, []);

  function openPDF() {
    let contador = 3;
    let tableBody = [];
    tableBody.push(["Campo 1", "Campo 2", "Campo 3", "Campo 4"]);

    for (let i = 0; i < 150; i++) {
      tableBody.push(["Iteração " + i, "Dados 2", "Dados 3", "Dados 4"]);
    }
    let docDef = {
      header: {
        text:
          "Relatório de contas a pagar e a receber: 01/08/2020 até 01/09/2020",
        fontSize: 18,
        margin: [15, 15, 0, 0],
      },
      content: [
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
        <h1>Testes</h1>
        <hr></hr>
        <button className="btn btn-success" onClick={openPDF}>
          Abrir PDF
        </button>
      </main>
    </div>
  );
}
