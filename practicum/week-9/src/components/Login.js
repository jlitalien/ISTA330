import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import apiAccess from "../communication/apiAccess";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  let onEmailChanged = (e) => {
    setEmail(e.target.value);
  };

  let onPassChanged = (e) => {
    setPassword(e.target.value);
  };

  let onSubmitHandler = (e) => {
    e.preventDefault();
    apiAccess
      .login(email, password)
      .then((x) => {
        if (x.done) {
          props.customerLoggedIn(email);
          navigate("/");
        } else {
          alert("The credentials are not valid");
        }
      })
      .catch((e) => {
        console.log(e);
        alert("Something went wrong");
      });
  };

  return (
    <Form onSubmit={onSubmitHandler}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={onEmailChanged}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={onPassChanged}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default Login;
