'use client';
// components/Popup.tsx

import React, { ReactNode, FC, useState } from 'react';
import styles from '../styles/Popup.module.css'; // Import your CSS module

interface PopupProps {
  show: boolean;
  onClose: () => void;
  password: string;
  userId: number;
  [key: string]: any;
}

  const Popup: FC<PopupProps> = ({ show, onClose, password, userId }) => {

    const[oldPass, setOldPass] = useState('');
    const[newPass, setNewPass] = useState('');
    const[confirmPass, setConfirmPass] = useState('');

    const[error, setError] = useState('');

    if (!show) {
        return null;
    }


    /* INICIO codigo update SQL */
    const updatePassword = async(userId, newPass) => {
        try {
            // Prepare the data to be sent in the request body
            const userData = {
                id: userId,
                password: newPass
                // Include other fields as necessary
            };
        
            // Make the fetch request to your API endpoint
            const response = await fetch('https://iotevidencia.uc.r.appspot.com/api/updatePassword', {
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
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };  
  /* FIN codigo update SQL */

    const SavePass = () => {
        if(newPass != confirmPass){
            console.log("Las contraseñas no coinciden");
            setError("Las contraseñas no coinciden");
            return;
        }
        if(oldPass != password){
            console.log("La contraseña anterior no coincide");
            setError("La contraseña anterior no coincide");
            return;
        }
        if(newPass == ""){
            console.log("La nueva contraseña no puede estar vacia");
            setError("La nueva contraseña no puede estar vacia");
            return;
        }
        console.log("Guardando contraseña");
        updatePassword(userId, newPass);
        
        onClose();
    }

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
            <h2 className={styles.subheader}>Cambiar Contraseña</h2>

            <label htmlFor="oldPass" className={styles.text}>Vieja Contraseña:</label>
            <input
            type="text"
            id="oldPass"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            className={styles.input}
            />

            <label htmlFor="newPass" className={styles.text}>Nueva Contraseña:</label>
            <input
            type="text"
            id="newPass"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className={styles.input}
            />

            <label htmlFor="confirmPass" className={styles.text}>Confirmar Contraseña:</label>
            <input
            type="text"
            id="confirmPass"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className={styles.input}
            />
        </div>

        <div className={styles.buttons}>
            <button onClick={onClose} className={styles.close}>Cancelar</button>
            <button onClick={SavePass} className={styles.savePass}>Guardar</button>
        </div>

        <p className={styles.error}>{error}</p>
      </div>
    </div>
  );
};

export default Popup;
