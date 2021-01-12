//Imports dos módulos instalados via Node.
import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

//Import dos meus módulos.
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Especialidade from "./pages/Especialidade";
import Funcionarios from "./pages/Funcionarios";
import Terapeutas from "./pages/Terapeutas";
import Servicos from "./pages/Servicos";
import Hospedes from "./pages/Hospedes";
import Agendamentos from "./pages/Agendamentos";
import TiposQuartos from "./pages/TiposQuarto";
import Quartos from "./pages/Quartos";
import Configuracoes from "./pages/Configuracoes";
import Hospedagem from "./pages/Hospedagem";
import Despesas from "./pages/Despesas";
import Acerto from "./pages/Acerto";
import Fatura from "./pages/Faturas";
import Balanco from "./pages/Balanco";
import HistoricoFaturas from "./pages/HistoricoFaturas";
import MeusAtendimentos from "./pages/Meusatendimentos";
import MeusAcertos from "./pages/MeusAcertos";
import Manual from "./pages/Manual";
import Testerino from "./pages/Testerino";

//Import função auxiliar para autenticação.
import { isAuthenticated } from "./services/auth";

function PrivateRoute({ component: Component, ...rest }) {
  const auth = useSelector((state) => state.authReducer);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated(auth) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
}

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <PrivateRoute path="/Funcionarios" component={Funcionarios} />
        <PrivateRoute path="/Terapeutas" component={Terapeutas} />
        <PrivateRoute path="/Especialidade" component={Especialidade} />
        <PrivateRoute path="/Quartos" component={Quartos} />
        <PrivateRoute path="/TiposQuarto" component={TiposQuartos} />
        <PrivateRoute path="/Servicos" component={Servicos} />
        <PrivateRoute path="/Hospedes" component={Hospedes} />
        <PrivateRoute path="/Agendamentos" component={Agendamentos} />
        <PrivateRoute path="/Configuracoes" component={Configuracoes} />
        <PrivateRoute path="/Despesas" component={Despesas} />
        <PrivateRoute path="/Acertos" component={Acerto} />
        <PrivateRoute path="/Faturas" component={Fatura} />
        <PrivateRoute path="/Balanco" component={Balanco} />
        <PrivateRoute path="/HistoricoFaturas" component={HistoricoFaturas} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/Hospedagem" component={Hospedagem} />
        <PrivateRoute path="/MeusAtendimentos" component={MeusAtendimentos} />
        <PrivateRoute path="/MeusAcertos" component={MeusAcertos} />

        <Route path="/Manual" component={Manual} />
        <Route path="/Testerino" component={Testerino} />
      </Switch>
    </BrowserRouter>
  );
}
