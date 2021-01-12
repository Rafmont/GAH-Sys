import React, { useState } from "react";
import { FiLogIn, FiAlertCircle } from "react-icons/fi";
import { Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import api from "../../services/api";
import "./style.css";

import { useSelector, useDispatch } from "react-redux";
import { setToken, setName, setLevel, setAuth, setID } from "../../actions";

function initialState() {
  return { user: "", password: "" };
}

export default function Login() {
  const history = useHistory();

  const dispatch = useDispatch();

  const [values, setValues] = useState(initialState);
  const [showErroModal, setShowErroModal] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");

  function onChange(event) {
    const { value, name } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  }

  function handleCloseErroModal() {
    setShowErroModal(false);
  }

  async function onSubmit(event) {
    event.preventDefault();

    const data = {
      login: document.getElementById("user").value,
      password: document.getElementById("password").value,
    };

    try {
      const response = await api.post("login", data);
      console.log(response.data.nivel);
      if (response.data.ErrorMessage) {
        setErrorMessage(response.data.ErrorMessage);
        setShowErroModal(true);
      } else {
        dispatch(setToken(response.data.token));
        dispatch(setName(response.data.nome));
        dispatch(setLevel(response.data.nivel));
        dispatch(setAuth());
        dispatch(setID(response.data.id));
        history.push("/dashboard");
      }
    } catch (err) {
      setErrorMessage("Erro!");
      console.log(err);
      setShowErroModal(true);
    }
  }

  return (
    <div className="login-container">
      <h3>Efetuar Login: </h3>

      <div className="card">
        <div className="card-body shadow rounded">
          <form onSubmit={onSubmit}>
            <label htmlFor="login">Login: </label>
            <input
              type="text"
              name="user"
              id="user"
              className="form-control"
              onChange={onChange}
              value={values.user}
            />

            <label htmlFor="senha">Senha: </label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              onChange={onChange}
              value={values.password}
            />

            <div className="submit-button">
              <button
                className="btn btn-success mt-4 rounded-pill shadow"
                type="submit"
              >
                Entrar
                <FiLogIn size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Erro */}
      <Modal show={showErroModal} onHide={handleCloseErroModal}>
        <div className="bg-danger">
          <Modal.Body>
            <div className="text-white align-center">
              <br></br>
              <FiAlertCircle size="46" /> <br></br> <br></br>
              <h6>{ErrorMessage}</h6> <br></br>
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
    </div>
  );
}
