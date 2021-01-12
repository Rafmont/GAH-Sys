import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../../services/api";
import { FiEye, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { Modal } from "react-bootstrap";
import $ from "jquery";
import moment from "moment";
import { useSelector } from "react-redux";

export default function MeusAcertos() {
  const id = useSelector((state) => state.idReducer);
  const name = useSelector((state) => state.nameReducer);

  //States da página.
  const [acertos, setAcertos] = useState([]);
  const [valorTotal, setValorTotal] = useState("");
  const [acertoAtivo, setAcertoAtivo] = useState([]);
  const [terapeutaAtivo, setTerapeutaAtivo] = useState([]);
  const [periodicidade, setPeriodicidade] = useState("");
  const [ultimoAcerto, setUltimoAcerto] = useState("");
  const [atendimentosRealizados, setAtendimentosRealizados] = useState("");
  const [erros, setErros] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [uacerto, setUAcerto] = useState("");

  //States para os modais.
  const [pagarModal, setPagarModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);

  //Funções de obtenção e atualização de states.
  useEffect(() => {
    api.get("/acertos/" + id).then((response) => {
      setAcertos(response.data);
      let valorSoma = 0;
      for (let i = 0; i < response.data.length; i++) {
        valorSoma = valorSoma + response.data[i].valor;
      }
      setValorTotal(valorSoma);
      api.get("/oneTerapeuta/" + id).then((response2) => {
        console.log(response2.data.ultimoAcerto);
        if (!response2.data.ultimoAcerto) {
          setUAcerto("Nenhum acerto realizado até o momento.");
        } else {
          setUAcerto(moment(response2.data.ultimoAcerto).format("DD/MM/YYYY"));
        }
      });
    });
  }, []);

  function reloadAcertos() {
    api.get("/acertosPagar").then((response) => {
      setAcertos(response.data);
      let valorSoma = 0;
      for (let i = 0; i < response.data.length; i++) {
        valorSoma = valorSoma + response.data[i].valor;
      }
      setValorTotal(valorSoma);
    });
  }

  //Funções para modais.
  function showPagarModal(acerto) {
    setAcertoAtivo(acerto);
    setAtendimentosRealizados(acerto.atendimentos.length);
    setTerapeutaAtivo(acerto.terapeuta);

    switch (acerto.terapeuta.acerto) {
      case 1:
        setPeriodicidade("Diário");
      case 2:
        setPeriodicidade("Semanal");
      case 3:
        setPeriodicidade("Mensal");
    }
    setPagarModal(true);

    if (acerto.terapeuta.ultimoAcerto === null) {
      setUltimoAcerto("Nenhum pagamento foi realizado a este terapêuta. ");
    }
  }

  function closePagarModal() {
    setPagarModal(false);
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
      const response = await api.post("/acertos/" + acertoAtivo._id);
      if (response.data.Sucesso) {
        reloadAcertos();
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

  return (
    <div>
      <Navbar />
      <main className="global-container shadow">
        <h4>Meus acertos </h4>
        <div>
          <p id="valorTotal">
            Valor total recebido: <strong>R$ {valorTotal} </strong>
          </p>
          <p>Ultimo acerto: {uacerto}</p>
        </div>
        <table className="table align-center" id="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor (R$) </th>
              <th>Pago?</th>
              <th>Ver detalhes</th>
            </tr>
          </thead>
          <tbody>
            {acertos.map((acerto) => (
              <tr key={acerto._id}>
                <td>{acerto.terapeuta.nome}</td>
                <td>R$ {acerto.valor}</td>
                <td>{acerto.pago ? <>Sim</> : <>Não</>}</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      showPagarModal(acerto);
                    }}
                  >
                    {" "}
                    <FiEye size={30} />{" "}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Pagar */}
        <Modal show={pagarModal} onHide={closePagarModal} size="lg">
          <Modal.Header closeButton>
            <h5>Detalhes do acerto</h5>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Informações do terapêuta: </strong>
            </p>
            <p>Nome: {terapeutaAtivo.nome}</p>
            <p>Periodicidade do pagamento: {periodicidade}</p>

            <hr />
            <p>
              <strong>Informações do pagamento:</strong>
            </p>
            <p>
              Valor total: <strong>R$ {acertoAtivo.valor} </strong>
            </p>
            <p>
              Quantidade de atendimentos realizados:
              <strong> {atendimentosRealizados}</strong>{" "}
            </p>
            <div className="align-center">
              <button className="btn btn-danger" onClick={closePagarModal}>
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
