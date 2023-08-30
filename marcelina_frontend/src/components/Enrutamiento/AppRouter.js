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
import AgregarControlDeNitrito from '../../paginas/Insumo/Control_de_Nitrito/AgregarControlDeNitrito';
import AgregarExpedicionDeProducto from '../../paginas/Trazabilidad/Expedicion_de_Producto/AgregarExpedicionDeProducto';
import AgregarControlDeProductosQuimicos from '../../paginas/Insumo/Control_de_Productos_Quimicos/AgregarControlDeProductosQuimicos';
import ListarControlDeAlarmaLuminicaYSonoraDeCloro from '../../paginas/Control/Control_de_Alarma_Luminica_y_Sonora_de_Cloro/ListarControlDeAlarmaLuminicaYSonoraDeCloro';
import ListarCliente from '../../paginas/Persona/Cliente/ListarCliente';
import AgregarDiariaDeProduccion from '../../paginas/Insumo/Diaria_de_Produccion/AgregarDiariaDeProduccion';
import AgregarResumenDeTrazabilidad from '../../paginas/Trazabilidad/Resumen_de_Trazabilidad/AgregarResumenDeTrazabilidad';
import AgregarProducto from '../../paginas/Insumo/Producto/AgregarProducto';
import AgregarMonitoreoDeSSOPOPerativo from '../../paginas/Trazabilidad/Monitoreo_de_SSOP_Operativo/AgregarMonitoreoDeSSOPOPerativo';
import AgregarMonitoreoDeSSOPPreOperativo from '../../paginas/Trazabilidad/Monitoreo_de_SSOP_PreOperativo/AgregarMonitoreoDeSSOPPreOperativo';
import AgregarRecepcionDeMateriasPrimasCarnicas from '../../paginas/Insumo/Recepcion_de_Materias_Primas_Carnicas/AgregarRecepcionDeMateriasPrimasCarnicas';
import ListarInsumo from '../../paginas/Insumo/Control_de_Insumo/ListarInsumo';
import ListarProveedor from '../../paginas/Persona/Proveedor/ListarProveedor';
import ModificarCliente from '../../paginas/Persona/Cliente/ModificarCliente';
import ModificarLocalidad from '../../paginas/Persona/Localidad/ModificarLocalidad';
import ModificProveedor from '../../paginas/Persona/Proveedor/ModificarProveedor';
import ModificarControlDeAlarmaLuminicaYSonoraDeCloro from '../../paginas/Control/Control_de_Alarma_Luminica_y_Sonora_de_Cloro/ModificarControlDeAlarmaLuminicaYSonoraDeCloro';
import ModificarControlDeCloroLibre from '../../paginas/Control/Control_de_Cloro_Libre/ModificarControlDeCloroLibre';
import ModificarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias from '../../paginas/Control/Control_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Cañerias/ModificarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias';
import ModificarControlDeMejorasEnInstalaciones from '../../paginas/Control/Control_de_Mejoras_en_Insatalaciones/ModificarControlDeMejorasEnInstalaciones';
import ModificarControlDeReposicionDeCloro from '../../paginas/Control/Control_de_Reposicion_de_Cloro/ModificarControlDeReposicionDeCloro';
import ModificarControlDeTemperaturaDeEsterilizadores from '../../paginas/Control/Control_de_Temperatura_de_Estirilizadores/ModificarControlDeTemperaturaDeEsterilizadores';
import ModificarControlDeTemperaturaEnCamaras from '../../paginas/Control/Control_de_Temperatura_en_Camaras/ModificarControlDeTemperaturaEnCamaras';

const AppRouter = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/localidad" element={<AgregarLocalidad />} />
          <Route path="/modificar-localidad/:id" element={<ModificarLocalidad />} />
          <Route path="/cliente" element={<AgregarCliente />} />
          <Route path="/listarcliente" element={<ListarCliente />} />
          <Route path="/modificar-cliente/:id" element={<ModificarCliente />} />
          <Route path="/carne" element={<AgregarCarne />} />
          <Route path="/listarcarne" element={<ListarCarne />} />
          <Route path="/insumo" element={<AgregarInsumo />} />
          <Route path="/producto" element={<AgregarProducto />} />
          <Route path="/proveedor" element={<AgregarProveedor />} />
          <Route path="/listarproveedor" element={<ListarProveedor />} />
          <Route path="/modificar-proveedor/:id" element={<ModificProveedor />} />
          <Route path="/control-de-alarma-luminica-y-sonora-de-cloro" element={<AgregarControlDeAlarmaLuminicaYSonoraDeCloro />} />
          <Route path="/listarcontrol-de-alarma-luminica-y-sonora-de-cloro" element={<ListarControlDeAlarmaLuminicaYSonoraDeCloro />} />
          <Route path="/modificar-control-de-alarma-luminica-y-sonora-de-cloro/:id" element={<ModificarControlDeAlarmaLuminicaYSonoraDeCloro />} />
          <Route path="/control-de-cloro-libre" element={<AgregarControlDeCloroLibre />} />
          <Route path="/modificar-control-de-cloro-libre/:id" element={<ModificarControlDeCloroLibre />} />
          <Route path="/control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias" element={<AgregarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias />} />
          <Route path="/modificar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias/:id" element={<ModificarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias />} />
          <Route path="/control-de-mejoras-en-instalaciones" element={<AgregarControlDeMejorasEnInstalaciones />} />
          <Route path="/modificar-control-de-mejoras-en-instalaciones/:id" element={<ModificarControlDeMejorasEnInstalaciones />} />
          <Route path="/control-de-reposicion-de-cloro" element={<AgregarControlDeReposicionDeCloro />} />
          <Route path="/modificar-control-de-reposicion-de-cloro/:id" element={<ModificarControlDeReposicionDeCloro />} />
          <Route path="/control-de-temperatura-de-esterilizadores" element={<AgregarControlDeTemperaturaDeEsterilizadores />} />
          <Route path="/modificar-control-de-temperatura-de-esterilizadores/:id" element={<ModificarControlDeTemperaturaDeEsterilizadores />} />
          <Route path="/control-de-temperatura-en-camaras" element={<AgregarControlDeTemperaturaEnCamaras />} />
          <Route path="/modificar-control-de-temperatura-en-camaras/:id" element={<ModificarControlDeTemperaturaEnCamaras />} />
          <Route path="/control-de-nitratos" element={<AgregarControlDeNitrato />} />
          <Route path="/control-de-nitritos" element={<AgregarControlDeNitrito />} />
          <Route path="/expedicion-de-producto" element={<AgregarExpedicionDeProducto />} />
          <Route path="/control-de-productos-quimicos" element={<AgregarControlDeProductosQuimicos />} />
          <Route path="/recepcion-de-materias-primas-carnicas" element={<AgregarRecepcionDeMateriasPrimasCarnicas />} />
          <Route path="/diaria-de-produccion" element={<AgregarDiariaDeProduccion />} />
          <Route path="/resumen-de-trazabilidad" element={<AgregarResumenDeTrazabilidad />} />
          <Route path="/monitoreo-de-ssop-operativo" element={<AgregarMonitoreoDeSSOPOPerativo />} />
          <Route path="/monitoreo-de-ssop-pre-operativo" element={<AgregarMonitoreoDeSSOPPreOperativo />} />
          <Route path="/listar-control-de-insumos" element={<ListarInsumo />} />
          {/* Otras rutas */}

        </Routes>
      </Router>
    );
  };
  
  export default AppRouter;
  
