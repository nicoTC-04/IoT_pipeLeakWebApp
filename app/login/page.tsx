/* @client */
import React from 'react';
import LoginForm from './LoginForm';
import styles from '../styles/LoginForm.module.css';

const LoginPage = () => {
  return (
    <div className={styles.highDiv}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;