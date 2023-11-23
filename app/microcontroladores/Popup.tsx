'use client';
// components/Popup.tsx

import React, { ReactNode, FC, useState, useEffect } from 'react';
import styles from '../styles/MicroPopup.module.css'; // Import your CSS module
import { Squada_One } from 'next/font/google';

interface PopupProps {
  show: boolean;
  onClose: () => void;
  microId: number;
  [key: string]: any;
}

  const Popup: FC<PopupProps> = ({ show, onClose, microId }) => {

    const[newName, setNewName] = useState('');
    const[error, setError] = useState('');

    if (!show) {
        return null;
    }


    /* INICIO codigo update SQL */
    const updateName = async(newName, microId) => {
        try {
            // Prepare the data to be sent in the request body
            const userData = {
                id: microId,
                name: newName
                // Include other fields as necessary
            };
        
            // Make the fetch request to your API endpoint
            const response = await fetch('http://iotevidencia.uc.r.appspot.com/api/updateMicroName', {
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

    const SaveName = () => {
        if(newName == ""){
            console.log("La nueva contraseña no puede estar vacia");
            setError("El nombre no puede estar vacio");
            return;
        }
        console.log("Guardando contraseña");
        updateName(newName, microId);

        onClose();
    }

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
            <h2 className={styles.subheader}>Cambiar Nombre</h2>

            <label htmlFor="newName" className={styles.text}>nuevo Nombre:</label>
            <input
            type="text"
            id="newName"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={styles.input}
            />
        </div>

        <div className={styles.buttons}>
            <button onClick={onClose} className={styles.close}>Cancelar</button>
            <button onClick={SaveName} className={styles.savePass}>Guardar</button>
        </div>

        <p className={styles.error}>{error}</p>
      </div>
    </div>
  );
};

export default Popup;
