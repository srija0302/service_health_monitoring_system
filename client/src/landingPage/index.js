import '../App.css';
import { useState } from 'react';
import {Form, Col, Row, Button, Container} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [signin, setSignin] = useState(true);
  const [signinPassword, setSigninPassword] = useState('');
  const [signinEmail, setSigninEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  let navigate = useNavigate(); 

  const changeSigninEmail = (e) => {
    setSigninEmail(e.target.value)
  }
  const changeSigninPassword = (e) => {
    setSigninPassword(e.target.value)
  }
  const changeEmail = (e) => {
    setEmail(e.target.value)
  }
  const changePassword = (e) => {
    setPassword(e.target.value)
  }

  const changeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value)
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };
  
  const authorizeUser = (e) => {
    e.preventDefault();
    if (!validateEmail(signinEmail)) {
      setErrors({ signinEmail: 'Invalid email format' });
      return;
    }

    if (!validatePassword(signinPassword)) {
      setErrors({ signinPassword: 'Password must be at least 8 characters long' });
      return;
    }

    setErrors({});
    fetch(`http://localhost:3001/get-user?email=${signinEmail}&&password=${signinPassword}`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" ,'Authorization': `Bearer ${localStorage.getItem('token')}`}
    }).then((res) => {
      if(res.ok){
      res.json().then((result) => {
         if(result){
           localStorage.setItem('token', result.token);
            setSigninEmail('');
            setSigninPassword('');
            navigate('/dashboard');
         }else{
            alert('Email or password is incorrect')
         }
      }).catch((error) => {
        console.error(error);
      });}
      else {
        alert('mail or password is not correct')
    }
    })
  }
  const signIn = ()=>{
    return (
      <Container style={{display:'flex', justifyContent:'center', alignItems:'center',height: '100vh'}}>
      <Form className="mx-auto" style={{ maxWidth: '400px' }}>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="3" style={{color:'white'}}>
            Email
          </Form.Label>
          <Col sm="9">
            <Form.Control  placeholder="email" value={signinEmail} onChange={changeSigninEmail}
            isInvalid={!!errors.signinEmail}/>
              <Form.Control.Feedback type="invalid">{errors.signinEmail}</Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
          <Form.Label column sm="3" style={{color:'white'}}>
            Password
          </Form.Label>
          <Col sm="9">
            <Form.Control type="password" placeholder="Password" value={signinPassword} onChange={changeSigninPassword} 
              isInvalid={!!errors.signinPassword}/>
            <Form.Control.Feedback type="invalid">{errors.signinPassword}</Form.Control.Feedback>
          </Col>
        </Form.Group>
        
      <div style={{marginLeft:'10rem'}}> 
        <Button variant="link" onClick={()=>setSignin(false)} style={{color:'white'}}>SignUp</Button>
        <Button variant="primary" type="submit" onClick={(e)=>authorizeUser(e)}>
        Login
      </Button>
      </div>
      </Form>
      </Container>
    );
  }

  const registerUser = async(e)=>{
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrors({ email: 'Invalid email format' });
      return;
    }

    if (!validatePassword(password)) {
      setErrors({ password: 'Password must be at least 8 characters long' });
      return;
    }

    setErrors({});
    if(password === confirmPassword){
      const payload= {
        email, 
        password
      }
      const response = await fetch('http://localhost:3001/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      alert('User registered successfully!')
      setSignin(true);

    }else{
      alert("Passwords do not match")
    }
  }
  const signUp = ()=>{
    return (
      <Container style={{display:'flex', justifyContent:'center', alignItems:'center',height: '100vh'}}>
      <Form className="mx-auto" style={{ maxWidth: '400px' }}>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="3" style={{color:'white'}}>
            Email
          </Form.Label>
          <Col sm="9">
            <Form.Control  
              placeholder="email" 
              value={email} 
              onChange={changeEmail}
              isInvalid={!!errors.email}/>
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
          <Form.Label column sm="3" style={{color:'white'}}>
            Password
          </Form.Label>
          <Col sm="9">
            <Form.Control 
              type="password" 
              placeholder="password" 
              value={password} 
              onChange={changePassword}
              isInvalid={!!errors.password}/>
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
          <Form.Label column sm="3" style={{color:'white'}}>
            Confirm Password
          </Form.Label>
          <Col sm="9">
            <Form.Control type="password" placeholder="Password" value={confirmPassword} onChange={changeConfirmPassword}/>
          </Col>
        </Form.Group>
      <div style={{marginLeft:'15rem'}}> 
        <Button variant="link" onClick={()=>setSignin(true)} style={{color:'white'}}>Login</Button>
        <Button variant="primary" type="submit" onClick={(e)=>registerUser(e)}>
        SignUp
      </Button>
      </div>
      </Form>
      </Container>
    );
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          SERVICE HEALTH MONITORING SYSTEM
        </h1>
      </header>
      <div>{signin ? signIn(): signUp()}</div>
    </div>
  );
}

export default LandingPage;
