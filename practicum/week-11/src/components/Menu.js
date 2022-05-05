import { Container, Navbar, Nav } from "react-bootstrap";
import NavbarToggle from "react-bootstrap/esm/NavbarToggle";
import apiAccess from "../communication/apiAccess";

const Menu = (props) => {
  let logout = () => {
    apiAccess
      .logout()
      .then((x) => props.customerLoggedOut())
      .catch((e) => console.log(e));
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#">Image Quiz</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {props.customer ? (
              <Navbar.Text>Signed in as {props.customer};</Navbar.Text>
            ) : (
              <>
                <Nav.Link href="#/register">Register</Nav.Link>
                <Nav.Link href="#/login">Login</Nav.Link>
                <Nav.Link href="#/auth/google">Sign In with Google</Nav.Link>

                <Nav.Link href="#/" onClick={logout}>
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;
