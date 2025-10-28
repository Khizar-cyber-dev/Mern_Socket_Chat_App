import React, { useState } from 'react';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useUserStore } from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';

const Form = () => {
  const { register, login, handleSocialLogin, loading } = useUserStore();
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) { 
        await register(formData);
      } else { 
        await login(formData);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };


  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">{isRegister ? 'Register' : 'Login'}</p>
        <p className="message">
          {isRegister ? 'Register' : 'Login'} now and get full access to our app.
        </p>

        {isRegister && (
          <>
            <label>
              <input
                className="input"
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
              <span>Full Name</span>
            </label>
          </>
        )}

        <label>
              <input
                className="input"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <span>User Name</span>
        </label>

        {isRegister && (
        <>
        <label>
          <input
            className="input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <span>Email</span>
        </label>
        </>
        )}

        <label>
          <input
            className="input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span>Password</span>
        </label>

        {isRegister && (
          <label>
            <input
              className="input"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span>Confirm Password</span>
          </label>
        )}

        <button className="submit" type="submit" disabled={loading}>
          {isRegister ? 'Register' : 'Login'}
        </button>

        <div className="social-login">
          <p className="divider">or continue with</p>
          <div className="social-buttons">
            <button
              type="button"
              className="social-btn google"
              onClick={() => handleSocialLogin('google')}
            >
              <FcGoogle className="social-icon" />
              Google
            </button>
            <button
              type="button"
              className="social-btn github"
              onClick={() => handleSocialLogin('github')}
            >
              <FaGithub className="social-icon" />
              GitHub
            </button>
          </div>
        </div>

        <p className="signin" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <a href="#">{isRegister ? 'Sign in' : 'Sign up'}</a>
        </p>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 350px;
    padding: 25px;
    border-radius: 20px;
    position: relative;
    background-color: #1a1a1a;
    color: #fff;
    border: 1px solid #333;
    margin: 20px auto;
  }

  .title {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
    color: #00bfff;
    margin-bottom: 10px;
  }

  .title::before {
    width: 18px;
    height: 18px;
  }

  .title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
  }

  .title::before,
  .title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: #00bfff;
  }

  .message, 
  .signin {
    font-size: 14.5px;
    color: rgba(255, 255, 255, 0.7);
  }

  .signin {
    text-align: center;
    margin-top: 10px;
  }

  .signin a {
    color: #00bfff;
    text-decoration: none;
  }

  .signin a:hover {
    text-decoration: underline;
  }

  .form label {
    position: relative;
  }

  .form label .input {
    background-color: #333;
    color: #fff;
    width: 100%;
    padding: 20px 10px 10px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
    box-sizing: border-box;
    font-size: 16px;
  }

  .form label .input + span {
    color: rgba(255, 255, 255, 0.5);
    position: absolute;
    left: 10px;
    top: 0px;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
  }

  .form label .input:placeholder-shown + span {
    top: 12.5px;
    font-size: 0.9em;
  }

  .form label .input:focus + span,
  .form label .input:valid + span {
    color: #00bfff;
    top: 0px;
    font-size: 0.7em;
    font-weight: 600;
  }

  .submit {
    border: none;
    outline: none;
    padding: 12px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    transition: 0.3s ease;
    background-color: #00bfff;
    cursor: pointer;
    margin-top: 10px;
  }

  .submit:hover {
    background-color: #00bfff96;
  }

  .social-login {
    margin: 15px 0;
  }

  .divider {
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    margin: 15px 0;
    position: relative;
  }

  .divider::before,
  .divider::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 30%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.3);
  }

  .divider::before {
    left: 0;
  }

  .divider::after {
    right: 0;
  }

  .social-buttons {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }

  .social-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background-color: #2a2a2a;
    color: white;
    cursor: pointer;
    transition: 0.3s ease;
    font-size: 14px;
  }

  .social-btn:hover {
    background-color: #333;
    border-color: rgba(255, 255, 255, 0.4);
  }

  .social-icon {
    font-size: 18px;
  }

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }

    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }
`;

export default Form;