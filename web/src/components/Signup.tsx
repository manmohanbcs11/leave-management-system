import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignupProps {
  showAlert: (type: string, message: string) => void;
}

export const Signup = (props: SignupProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "eNotebook - Signup";
  });

  const [body, setBody] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: ''
  });

  const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { name, email, password, cpassword } = body;

    if (password !== cpassword) {
      props.showAlert('danger', 'Passwords are not matching!');
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    if (response.ok) {
      const responseJson = await response.json();
      localStorage.setItem('token', responseJson.data.authToken);
      navigate('/');
      props.showAlert('success', 'Registered successfully!');
    } else {
      const errorData = await response.json();
      props.showAlert('danger', errorData.message);
    }
  }

  return (
    <div className='container mt-2'>
      <h3 className='my-4'>Please signup to use eNotebook:</h3>
      <form onSubmit={handleOnSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" value={body.name} onChange={(e) => setBody({ ...body, name: e.target.value })} minLength={3} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name='email' value={body.email} onChange={(e) => setBody({ ...body, email: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' value={body.password} onChange={(e) => setBody({ ...body, password: e.target.value })} minLength={6} required />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Password</label>
          <input type="password" className="form-control" id="cpassword" name='cpassword' value={body.cpassword} onChange={(e) => setBody({ ...body, cpassword: e.target.value })} required />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}