import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAccess from "../communication/apiAccess";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  let onNameChanged = (e) => {
    setName(e.target.value);
  };

  let onEmailChanged = (e) => {
    setEmail(e.target.value);
  };

  let onPassChanged = (e) => {
    setPassword(e.target.value);
  };

  let onSubmitHandler = (e) => {
    e.preventDefault();
    apiAccess
      .addCustomer(name, email, password)
      .then((x) => {
        if (x) {
          navigate("/login");
        }
      })
      .catch((e) => {
        alert("Registration failed.");
        console.log(e);
      });
  };

  return (
    <Form onSubmit={onSubmitHandler}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={onNameChanged}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={onEmailChanged}
        />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
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

export default Register;
