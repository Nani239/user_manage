import React, { useState } from "react";
import { Container, Row, Col, Nav, Offcanvas } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoArrowSwitch } from "react-icons/go";

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const handleToggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <Container fluid>
      <Row>
        <Col
          md={2}
          className={`bg-light vh-100 ${
            showSidebar ? "d-block" : "d-none d-md-block"
          }`}
        >
          <Nav defaultActiveKey="/dashboard/home" className="flex-column">
            <Nav.Link as={Link} to="/dashboard/profile">
              Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/settings">
              Settings
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={2} className="d-md-none">
          <GoArrowSwitch
            showSidebar={showSidebar}
            onClick={handleToggleSidebar}
          />
          <Offcanvas
            show={showSidebar}
            onHide={handleToggleSidebar}
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav defaultActiveKey="/dashboard/home" className="flex-column">
                <Nav.Link
                  as={Link}
                  to="/dashboard/profile"
                  onClick={handleToggleSidebar}
                >
                  Profile
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/dashboard/settings"
                  onClick={handleToggleSidebar}
                >
                  Settings
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
        </Col>
        <Col md={10} className="p-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
