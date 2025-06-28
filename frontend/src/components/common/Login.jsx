import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { message } from 'antd';
import { Button, Form } from 'react-bootstrap';
import photo1 from '../../images/projectimg2.png';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '', password: ''
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8001/api/user/login", user);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userData', JSON.stringify(res.data.userData));
        message.success('Login successfully');
        const isLoggedIn = JSON.parse(localStorage.getItem("userData"));
        const { type } = isLoggedIn;
        
        switch (type) {
          case "admin":
            navigate("/adminHome");
            break;
          case "user":
            navigate("/userhome");
            break;
          default:
            navigate("/login");
            break;
        }
        window.location.reload(); // Refresh the page after successful login
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error.response ? error.response.data : error.message);
      message.error('Something went wrong');
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>
            <Link to={'/'}>DocSpot</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
            </Nav>
            <Nav>
              <Link to={'/'}>Home</Link>
              <Link to={'/login'}>Login</Link>
              <Link to={'/register'}>Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <MDBContainer className="my-5 mdb-container">
        <MDBCard className="mdb-card">
          <MDBRow className='g-0 border-none p-3' style={{ background: 'rgb(190, 203, 203)' }}>
            <MDBCol md='6'>
              <MDBCardImage src={photo1} alt="login form" className='rounded-start w-100 mdb-card-image' />
            </MDBCol>
            <MDBCol md='6'>
              <MDBCardBody className='d-flex mx-5 flex-column mdb-card-body'>
                <div className='d-flex flex-row mt-2 mb-5'>
                  <span className="h1 fw-bold mb-0">Sign in to your account</span>
                </div>
                <Form onSubmit={handleSubmit}>
                  <label className="form-label" htmlFor="formControlLgEmail">Email</label>
                  <MDBInput
                    className="mdb-input"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    id="formControlLgEmail"
                    type="email"
                    size="md"
                    autoComplete='off'
                  />
                  <label className="form-label" htmlFor="formControlLgPassword">Password</label>
                  <MDBInput
                    className="mdb-input"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    id="formControlLgPassword"
                    type="password"
                    size="md"
                    autoComplete='off'
                  />
                  <Button className="mb-4 px-5 btn-dark" size='lg' type='submit'>Login</Button>
                </Form>
                <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Don't have an account? <Link to={'/register'} className="register-link">Register here</Link></p>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </>
  );
}

export default Login;