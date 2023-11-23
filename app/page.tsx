import Link from 'next/link';
import React from 'react';
import LoginPage from './login/page';
import './globals.css';
import styles from './styles/frontPage.module.css';



const Page = () => {
    return (
      <div className={styles.pageDiv}>
        {/* Otros componentes o contenido pueden ir aquí */}
        <LoginPage />
        {/* Cualquier otro contenido puede ir aquí */}
      </div>
    );
  };
  
  export default Page;
  