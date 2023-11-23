import React from 'react'
import Navbar from '../components/NavBar';
import Cuenta from './Cuenta';
import { GlobalContextProvider } from '../context/store';

const CuentaPage = () => {
  return (
    <div>
      <Navbar/>
      <Cuenta/>
    </div>
  );
};

export default CuentaPage;