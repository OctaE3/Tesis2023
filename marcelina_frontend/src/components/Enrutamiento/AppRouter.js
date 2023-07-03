import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../../paginas/Home/Home';
import Localidad from '../../paginas/Localidad/Localidad';
import Login from '../../paginas/Login/Login';
import Cliente from '../../paginas/Cliente/Cliente';


const AppRouter = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/localidad" element={<Localidad />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Cliente" element={<Cliente />} />
          {/* Otras rutas */}
        </Routes>
      </Router>
    );
  };
  
  export default AppRouter;
  
