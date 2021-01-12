import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import {
  FiList,
  FiCalendar,
  FiUser,
  FiEdit,
  FiDollarSign,
  FiChevronDown,
  FiSettings,
  FiAlertCircle,
  FiCheckCircle,
  FiHelpCircle,
} from "react-icons/fi";

import "./style.css";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setToken, setName, setLevel, removeAuth } from "../../../actions";

export default function Navbar() {
  const history = useHistory();
  const dispatch = useDispatch();

  const name = useSelector((state) => state.nameReducer);
  const nivel = useSelector((state) => state.levelReducer);
  const id = useSelector((state) => state.idReducer);

  const [sucesso, setSucesso] = useState("");
  const [erros, setErros] = useState("");
  const [alterarModal, setAlterarModal] = useState(false);
  const [showErroModal, setShowErroModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  function handleCloseSuccessModal() {
    setShowSuccessModal(false);
  }

  function handleCloseErroModal() {
    setShowErroModal(false);
  }

  function handleLogout() {
    dispatch(setToken(""));
    dispatch(setName(""));
    dispatch(setLevel(""));
    dispatch(removeAuth());
    history.push("/");
  }

  function closeAlterarModal() {
    setAlterarModal(false);
  }

  function openAlterarModal() {
    setAlterarModal(true);
  }

  async function trocarSenha(e) {
    e.preventDefault();

    const data = {
      senhaAtual: document.getElementById("senhaAtual").value,
      senhaNova1: document.getElementById("senhaNova1").value,
      senhaNova2: document.getElementById("senhaNova2").value,
    };

    if (data.senhaNova1 === data.senhaNova2) {
      try {
        const response = await api.post("/alterarsenha/" + id, data);
        if (response.data.Sucesso) {
          setSucesso(response.data.Sucesso);
          closeAlterarModal();
          setShowSuccessModal(true);
        } else {
          setErros(response.data.Erro);
          closeAlterarModal();
          setShowErroModal(true);
        }
      } catch (err) {
        setErros("erro ao comunicar com servidor.");
        closeAlterarModal();
        setShowErroModal(true);
      }
    } else {
      setErros("Senhas diferentes, por favor insira novamente.");
      setShowErroModal(true);
    }
  }

  return (
    <div className="wrapper">
      <nav id="sidebar" className="shadow">
        <div className="sidebar-header">
          <h3>
            <Link to="/dashboard"> GAH-Sys </Link>
          </h3>
        </div>

        <ul className="lisst-unstyled components">
          {/* Submenu de usuário. */}
          <li className="active">
            <a href="#userSubmenu" data-toggle="collapse" aria-expanded="false">
              <FiUser size={20} /> {name}{" "}
              <div className="flecha-menu">
                <FiChevronDown />
              </div>
            </a>
            <ul className="collapse lisst-unstyled" id="userSubmenu">
              <li>
                {" "}
                <a href="#h1" onClick={openAlterarModal}>
                  {" "}
                  Alterar senha{" "}
                </a>{" "}
              </li>
              <li onClick={handleLogout}>
                <a href="#h1">Sair</a>
              </li>
            </ul>
          </li>

          {/* Submenu de configurações. */}
          {nivel === 3 ? (
            <li>
              <Link to="/Configuracoes">
                <FiSettings size={20} /> Configurações de políticas
              </Link>
            </li>
          ) : (
            <></>
          )}

          {/* Submenu de funcionários. */}
          {nivel >= 2 ? (
            <li>
              <Link to="/Funcionarios">
                <FiEdit size={20} /> Gerenciar funcionários
              </Link>
            </li>
          ) : (
            <></>
          )}

          {/* Submenu de hóspedes. */}
          {nivel >= 1 ? (
            <li>
              <Link to="/Hospedes">
                <FiEdit size={20} /> Gerenciar hóspedes
              </Link>
            </li>
          ) : (
            <></>
          )}

          {/* Submenu de terapeutas. */}
          {nivel >= 1 ? (
            <li className="active">
              <a
                href="#terapeutaSubmenu"
                data-toggle="collapse"
                aria-expanded="false"
              >
                <FiList size={20} /> Terapeutas{" "}
                <div className="flecha-menu">
                  <FiChevronDown />
                </div>
              </a>
              <ul className="collapse lisst-unstyled" id="terapeutaSubmenu">
                <li>
                  {" "}
                  <Link to="/Terapeutas"> Gerenciar terapêutas </Link>
                </li>
                <li>
                  {" "}
                  <Link to="/Agendamentos"> Agendar atendimento </Link>
                </li>
                <li>
                  {" "}
                  <Link to="/Especialidade"> Especialidades </Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link to="/Servicos"> Servicos </Link>{" "}
                </li>
              </ul>
            </li>
          ) : (
            <></>
          )}

          {/* Submenu de quartos. */}
          {nivel >= 1 ? (
            <li className="active">
              <a
                href="#quartoSubmenu"
                data-toggle="collapse"
                aria-expanded="false"
              >
                <FiList size={20} /> Quartos{" "}
                <div className="flecha-menu">
                  <FiChevronDown />
                </div>
              </a>
              <ul className="collapse lisst-unstyled" id="quartoSubmenu">
                <li>
                  {" "}
                  <Link to="/Quartos"> Gerenciar Quartos </Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link to="/TiposQuarto">
                    {" "}
                    Gerenciar Tipos de Quarto{" "}
                  </Link>{" "}
                </li>
              </ul>
            </li>
          ) : (
            <></>
          )}

          {/* Submenu de hospedagem. */}
          {nivel >= 1 ? (
            <li>
              <Link to="/Hospedagem">
                <FiCalendar size={20} /> Hospedagem
              </Link>
            </li>
          ) : (
            <></>
          )}

          {/* Submenu financeiro. */}
          {nivel >= 3 ? (
            <li className="active">
              <a
                href="#financeiroSubmenu"
                data-toggle="collapse"
                aria-expanded="false"
              >
                <FiDollarSign size={20} /> Financeiro{" "}
                <div className="flecha-menu">
                  <FiChevronDown />
                </div>
              </a>
              <ul className="collapse lisst-unstyled" id="financeiroSubmenu">
                <li>
                  {" "}
                  <Link to="/Faturas"> Faturas </Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link to="/Acertos">Acertos </Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link to="/Despesas">Despesas </Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link to="/Balanco">Balanco </Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link to="/HistoricoFaturas">Histórico de faturas </Link>{" "}
                </li>
              </ul>
            </li>
          ) : (
            <></>
          )}

          {/* Submenu Meus atendimentos. */}
          {nivel === 0 ? (
            <>
              <li>
                <Link to="MeusAtendimentos">
                  <FiCalendar size={20} /> Meus Atendimentos
                </Link>
              </li>
              <li>
                <Link to="/MeusAcertos">
                  <FiDollarSign size={20} /> Meus acertos
                </Link>
              </li>
            </>
          ) : (
            <></>
          )}

          {/* Submenu de ajuda. */}
          <li>
            <Link to="/Manual">
              <FiHelpCircle size={20} /> Manual do sistema
            </Link>
          </li>
        </ul>
      </nav>

      {/* Modal Alterar senha */}
      <Modal show={alterarModal} onhide={closeAlterarModal} size="lg">
        <Modal.Header closeButton>
          <h5>Alterar senha</h5>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={trocarSenha}>
            <label>Senha atual:</label>
            <input
              type="password"
              className="form-control"
              id="senhaAtual"
            ></input>
            <br />
            <label>Nova senha:</label>
            <input
              type="password"
              className="form-control"
              id="senhaNova1"
            ></input>
            <br />
            <label>Repita a senha:</label>
            <input
              type="password"
              className="form-control"
              id="senhaNova2"
            ></input>
            <br />
            <div className="align-center">
              <button type="submit" className="btn btn-success">
                Alterar
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
    </div>
  );
}
