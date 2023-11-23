'use client';

import React, { useState, useEffect, use } from 'react';
import styles from '../styles/LoginForm.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '../context/store';

const LoginForm = () => {
  interface User {
    idUsuario: number;
    username: string;
    password: string;
    correo: string;
    telefono: string;
  }  

  const { username, setUsername } = useGlobalContext();
  const { idUser, setIdUser } = useGlobalContext();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if(loaded) return;
    const fetchData = async () => {
      try {
        const response = await fetch('https://iotevidencia.uc.r.appspot.com/api/usuarios');
        if (!response.ok) {
          // Handle response errors
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
      
        setUsers(data);
        setLoaded(true);
      } catch (error) {
        console.error("error fecthin data");
      }
    };

    fetchData();
  });

  useEffect(() => {
    console.log("Users updated:");
    console.log(users);
  }, [users]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Aquí podrías añadir lógica para manejar el inicio de sesión
    console.log(username, password);
    console.log(users);

    for(let i = 0; i < users.length; i++){
      if(users[i].username == username && users[i].password == password){
        console.log("Usuario encontrado");
        setUsername(username);
        setIdUser(users[i].idUsuario);
        router.push('/dashboard');
        return;
      }
    }

    console.log('Autenticacion fallida');
    setError('Autenticacion fallida');

  };

  return (
    <div className={styles.formDiv}>
      <Image
        src="/logo1.png"
        alt="Logo"
        height={300}
        width={300}
        className={styles.logo}
      />
      <form onSubmit={handleSubmit} className={styles.loginform}>
        <div className={styles.fill}>
          <label htmlFor="username" className={styles.label}>Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.fill}>
          <label htmlFor="password" className={styles.label}>Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Iniciar Sesión</button>
        <label className={styles.error}>{error}</label>
      </form>
    </div>
  );
};

export default LoginForm;