import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../../paginas/Home/Home';
import AgregarLocalidad from '../../paginas/Localidad/AgregarLocalidad';
import Login from '../../paginas/Login/Login';
import AgregarCliente from '../../paginas/Cliente/AgregarCliente';
import AgregarCarne from "../../paginas/Carne/AgregarCarne";
import AgregarInsumo from '../../paginas/Insumo/AgregarInsumo';
import AgregarProveedor from "../../paginas/Proveedor/AgregarProveedor";


const AppRouter = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/localidad" element={<AgregarLocalidad />} />
          <Route path="/cliente" element={<AgregarCliente />} />
          <Route path="/carne" element={<AgregarCarne />} />
          <Route path="/insumo" element={<AgregarInsumo />} />
          <Route path="/proveedor" element={<AgregarProveedor />} />
          {/* Otras rutas */}
        </Routes>
      </Router>
    );
  };
  
  export default AppRouter;
  
