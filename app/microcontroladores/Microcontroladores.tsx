'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/Micro.module.css';
import { useGlobalContext } from '../context/store';
import Image from 'next/image';
import Popup from './Popup';


const Microcontroladores = () => {
  interface Micro {
    idMicrocontrolador: number;
    nombre: string;
  }  
  const { idUser } = useGlobalContext();
  const [micros, setMicros] = useState<Micro[]>([]);

  const [showPopup, setShowPopup] = useState(false);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if(loaded) return;
    const fetchData = async () => {
      try {
        const response = await fetch('https://iotevidencia.uc.r.appspot.com/api/micros');
        if (!response.ok) {
          // Handle response errors
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();

        console.log(data);

        const userMicros = data.filter(micro => micro.idUsuario == idUser)
                           .map(micro => ({ idMicrocontrolador: micro.idMicrocontrolador, nombre: micro.nombre }));
    
        setMicros(userMicros);
        setLoaded(true);
      } catch (error) {
        console.error("error fetching data", error);
      }
    };

    fetchData();
  });

  useEffect(() => {
    console.log("Micros updated:");
    console.log(micros);
  }, [micros]);


  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setLoaded(false);
    setShowPopup(false);
  };

  return (
    <div>
      <div className={styles.headDiv}>
        <h1 className={styles.header}>Tus sensores</h1>
      </div>

      <div className={styles.microsContainer}>
        {micros.map((micro) => (
          <div key={micro.idMicrocontrolador} className={styles.microBlock}>
            <div className={styles.microDetails}>
              <h3 className={styles.microHeader}>{micro.nombre}</h3>
              <p className={styles.microId}>ID: {micro.idMicrocontrolador}</p>
              <button className={styles.microButton} onClick={handleOpenPopup}>Cambiar Nombre</button>
                <Popup show={showPopup} onClose={handleClosePopup} microId={micro.idMicrocontrolador}>
                </Popup>
            </div>
            <div className={styles.microImageContainer}>
              {/* Placeholder for image, replace with actual <img> or component */}
              <Image
                src="/Picture2.png"
                alt="Img"
                height={100}
                width={100}
                className={styles.microImage}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Microcontroladores;