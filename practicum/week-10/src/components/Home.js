import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { useEffect, useState } from "react";
import apiAccess from "../communication/apiAccess";
import flowers from "./Flowers";
const Home = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   apiAccess.getFlowers().then((x) =>
  //     setFlowers(x).catch((e) => {
  //       console.log(e);
  //       alert("Something went wrong");
  //     })
  //   );
  // }, []);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Image src={flowers[0].picture} responsive />
          <Image src={flowers[1].picture} responsive />
          <Image src={flowers[2].picture} responsive />
          <Image src={flowers[3].picture} responsive />
          <Image src={flowers[4].picture} responsive />
          <Image src={flowers[5].picture} responsive />
          <Image src={flowers[6].picture} responsive />
          <Image src={flowers[7].picture} responsive />
          <Image src={flowers[8].picture} responsive />
          <Image src={flowers[9].picture} responsive />
          <Image src={flowers[10].picture} responsive />
          <Image src={flowers[11].picture} responsive />
          <Image src={flowers[12].picture} responsive />
          <Image src={flowers[13].picture} responsive />
          <Image src={flowers[14].picture} responsive />
          <Image src={flowers[15].picture} responsive />
          <Image src={flowers[16].picture} responsive />
          <Image src={flowers[17].picture} responsive />
          <Image src={flowers[18].picture} responsive />
          <Image src={flowers[19].picture} responsive />
          <Image src={flowers[20].picture} responsive />
          <Image src={flowers[21].picture} responsive />
          <Image src={flowers[22].picture} responsive />
          <Image src={flowers[23].picture} responsive />
          <Image src={flowers[24].picture} responsive />
          <Image src={flowers[25].picture} responsive />
          <Image src={flowers[26].picture} responsive />
        </Col>
      </Row>

      <Row>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default Home;
