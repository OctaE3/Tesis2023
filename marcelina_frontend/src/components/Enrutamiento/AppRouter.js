import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../../paginas/Home/Home';
import AgregarLocalidad from '../../paginas/Persona/Localidad/AgregarLocalidad';
import Login from '../../paginas/Persona/Login/Login';
import AgregarCliente from '../../paginas/Persona/Cliente/AgregarCliente';
import AgregarCarne from "../../paginas/Insumo/Carne/AgregarCarne";
import AgregarInsumo from '../../paginas/Insumo/Control_de_Insumo/AgregarInsumo';
import AgregarProveedor from "../../paginas/Persona/Proveedor/AgregarProveedor";
import ListarCarne from "../../paginas/Insumo/Carne/ListarCarne";
import AgregarControlDeAlarmaLuminicaYSonoraDeCloro from '../../paginas/Control/Control_de_Alarma_Luminica_y_Sonora_de_Cloro/AgregarControlDeAlarmaLuminicaYSonoraDeCloro';
import AgregarControlDeCloroLibre from '../../paginas/Control/Control_de_Cloro_Libre/AgregarControlDeCloroLibre';
import AgregarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias from '../../paginas/Control/Control_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Cañerias/AgregarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias';
import AgregarControlDeMejorasEnInstalaciones from '../../paginas/Control/Control_de_Mejoras_en_Insatalaciones/AgregarControlDeMejorasEnInstalaciones';
import AgregarControlDeReposicionDeCloro from '../../paginas/Control/Control_de_Reposicion_de_Cloro/AgregarControlDeReposicionDeCloro';
import AgregarControlDeTemperaturaDeEsterilizadores from '../../paginas/Control/Control_de_Temperatura_de_Estirilizadores/AgregarControlDeTemperaturaDeEsterilizadores';
import AgregarControlDeTemperaturaEnCamaras from '../../paginas/Control/Control_de_Temperatura_en_Camaras/AgregarControlDeTemperaturaEnCamaras';
import AgregarControlDeNitrato from '../../paginas/Insumo/Control_de_Nitrato/AgregarControlDeNitrato';
import AgregarExpedicionDeProducto from '../../paginas/Trazabilidad/Expedicion_de_Producto/AgregarExpedicionDeProducto';
import AgregarControlDeProductosQuimicos from '../../paginas/Insumo/Control_de_Productos_Quimicos/AgregarControlDeProductosQuimicos';
import AgregarRecepcionDeMateriasPrimasCarnicas from '../../paginas/Insumo/Recepcion_de_Materias_Primas_Carnicas/AgregarRecepcionDeMateriasPrimasCarnicas';

const AppRouter = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/localidad" element={<AgregarLocalidad />} />
          <Route path="/cliente" element={<AgregarCliente />} />
          <Route path="/carne" element={<AgregarCarne />} />
          <Route path="/listarcarne" element={<ListarCarne />} />
          <Route path="/insumo" element={<AgregarInsumo />} />
          <Route path="/proveedor" element={<AgregarProveedor />} />
          <Route path="/control-de-alarma-luminica-y-sonora-de-cloro" element={<AgregarControlDeAlarmaLuminicaYSonoraDeCloro />} />
          <Route path="/control-de-cloro-libre" element={<AgregarControlDeCloroLibre />} />
          <Route path="/control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias" element={<AgregarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias />} />
          <Route path="/control-de-mejoras-en-instalaciones" element={<AgregarControlDeMejorasEnInstalaciones />} />
          <Route path="/control-de-reposicion-de-cloro" element={<AgregarControlDeReposicionDeCloro />} />
          <Route path="/control-de-temperatura-de-esterilizadores" element={<AgregarControlDeTemperaturaDeEsterilizadores />} />
          <Route path="/control-de-temperatura-en-camaras" element={<AgregarControlDeTemperaturaEnCamaras />} />
          <Route path="/control-de-nitratos" element={<AgregarControlDeNitrato />} />
          <Route path="/expedicion-de-producto" element={<AgregarExpedicionDeProducto />} />
          <Route path="/control-de-productos-quimicos" element={<AgregarControlDeProductosQuimicos />} />
          <Route path="/recepcion-de-materias-primas-carnicas" element={<AgregarRecepcionDeMateriasPrimasCarnicas />} />
          {/* Otras rutas */}
        </Routes>
      </Router>
    );
  };
  
  export default AppRouter;
  
