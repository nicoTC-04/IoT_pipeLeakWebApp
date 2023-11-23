'use client';

import React, { useState, useEffect, use } from 'react';
import styles from '../styles/Cuenta.module.css';
import { useGlobalContext } from '../context/store';
import Popup from './Popup';


const Cuenta = () => {
  const { username, setUsername } = useGlobalContext();
  const [userID, setUserID] = useState(0); // TODO: Cambiar por el id del usuario logeado
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');

  const [guardado, setGuardado] = useState('');
  const [showPopup, setShowPopup] = useState(false);



  /* INICIO codigo fetch SQL */
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if(loaded) return;
    const fetchData = async () => {
      try {
        const response = await fetch('http://iotevidencia.uc.r.appspot.com/api/usuarios');
        if (!response.ok) {
          // Handle response errors
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();

        for(let i = 0; i < data.length; i++){
          if(data[i].username == username){
            setUserID(data[i].idUsuario);
            setCorreo(data[i].correo);
            setTelefono(data[i].telefono);
            setPassword(data[i].password);
          }
        }

        setLoaded(true);
      } catch (error) {
        console.error("error fecthing data");
      }
    };

    fetchData();
  });

  useEffect(() => {
    console.log("User updated:");
    console.log(correo);
  }, [correo]);
  /* FIN codigo fetch SQL */


  /* INICIO codigo update SQL */
  const updateUserData = async (userId, newUsername, newCorreo, newTel) => {
    try {
      // Prepare the data to be sent in the request body
      const userData = {
        id: userId,
        username: newUsername,
        correo: newCorreo,
        tel: newTel
        // Include other fields as necessary
      };
  
      // Make the fetch request to your API endpoint
      const response = await fetch('http://iotevidencia.uc.r.appspot.com/api/updateUser', {
        method: 'PUT', // Using PUT method for update
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData) // Convert the JavaScript object to a JSON string
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        // Handle JSON data
        console.log(data);
      } else {
        const text = await response.text();
        // Handle text/plain data
        console.log(text);
      }
       // Log the result or update state as necessary
      setGuardado('Datos guardados');
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };  
  /* FIN codigo update SQL */


  const saveData = () => {
    console.log("Guardando datos");
    updateUserData(userID, username, correo, telefono);
  }


  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };


  return (
    <div>
      <div className={styles.headDiv}>
        <h1 className={styles.header}>Tu cuenta</h1>
      </div>
      
      <div className={styles.userData}>
        <h2 className={styles.subheader}>Datos de usuario</h2>

        <label htmlFor="username" className={styles.text}>Usuario:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />

        <label htmlFor="correo" className={styles.text}>Correo:</label>
        <input
          type="text"
          id="correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className={styles.input}
        />
        
        <label htmlFor="telefono" className={styles.text}>Telefono:</label>
        <input
          type="text"
          id="telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className={styles.input}
        />
      </div>
      
      <button type="submit" className={styles.passwordButton} onClick={handleOpenPopup}>Cambiar contraseña</button>

      <Popup show={showPopup} onClose={handleClosePopup} password={password} userId={userID}>
      </Popup>

      <button type="submit" className={styles.button} onClick={saveData}>Guardar</button>

      <p className={styles.guardado}>{guardado}</p>
    </div>
  );
};

export default Cuenta;