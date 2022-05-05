import "./App.css";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import FederatedLogin from "./components/FederatedLogin";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

function App() {
  const [customer, setCustomer] = useState(undefined);
  let customerLoggedInHandler = (customerEmail) => {
    localStorage.setItem("customer", customerEmail);
    setCustomer(customerEmail);
  };
  let customerLoggedOutHandler = () => {
    localStorage.removeItem("customer");
    setCustomer(undefined);
  };
  return (
    <HashRouter>
      <Container fluid>
        <Row>
          <Col>
            <Header />
          </Col>
        </Row>
        <Row>
          <Col>
            <Menu
              customer={customer}
              customerLoggOut={customerLoggedOutHandler}
            />
          </Col>
        </Row>

        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/register" element={<Register />}></Route>
          <Route
            exact
            path="/login"
            element={<Login customerLoggedIn={customerLoggedInHandler} />}
          ></Route>
          <Route
            exact
            path="/google/:username/:name"
            element={
              <FederatedLogin
                provider="google"
                customerLoggedIn={customerLoggedInHandler}
              />
            }
          ></Route>
        </Routes>
        <Row>
          <Col>
            <Footer />
          </Col>
        </Row>
      </Container>
    </HashRouter>
  );
}

export default App;
