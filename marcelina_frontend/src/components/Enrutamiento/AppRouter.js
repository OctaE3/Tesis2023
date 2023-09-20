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
import ModificarCarne from '../../paginas/Insumo/Carne/ModificarCarne';
import ModificarInsumo from '../../paginas/Insumo/Control_de_Insumo/ModificarInsumo';
import ModificarControlDeNitrato from '../../paginas/Insumo/Control_de_Nitrato/ModificarControlDeNitrato';
import ModificarControlDeNitrito from '../../paginas/Insumo/Control_de_Nitrito/ModificarControlDeNitrito';
import ModificarControlDeProductosQuimicos from '../../paginas/Insumo/Control_de_Productos_Quimicos/ModificarControlDeProductosQuimicos';
import ModificarDiariaDeProduccion from '../../paginas/Insumo/Diaria_de_Produccion/ModificarDiariaDeProduccion';
import ModificarProducto from '../../paginas/Insumo/Producto/ModificarProducto';
import ModificarRecepcionDeMateriasPrimasCarnicas from '../../paginas/Insumo/Recepcion_de_Materias_Primas_Carnicas/ModificarRecepcionDeMateriasPrimasCarnicas';
import ModificarMoniteoreoDeSSOPOperativo from '../../paginas/Trazabilidad/Monitoreo_de_SSOP_Operativo/ModificarMonitoreoDeSSOPOperativo';
import ModificarMoniteoreoDeSSOPPreOperativo from '../../paginas/Trazabilidad/Monitoreo_de_SSOP_PreOperativo/MoidificarMonitoreoDeSSOPPreOperativo';
import ModificarResumenDeTrazabilidad from '../../paginas/Trazabilidad/Resumen_de_Trazabilidad/ModificarResumenDeTrazabilidad';
import ModificarExpedicionDeProducto from '../../paginas/Trazabilidad/Expedicion_de_Producto/ModificarExpedicionDeProducto';
import ModificarControlDeAlarmaLuminicaYSonoraDeCloro from '../../paginas/Control/Control_de_Alarma_Luminica_y_Sonora_de_Cloro/ModificarControlDeAlarmaLuminicaYSonoraDeCloro';
import ModificarControlDeCloroLibre from '../../paginas/Control/Control_de_Cloro_Libre/ModificarControlDeCloroLibre';
import ModificarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias from '../../paginas/Control/Control_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Cañerias/ModificarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias';
import ModificarControlDeMejorasEnInstalaciones from '../../paginas/Control/Control_de_Mejoras_en_Insatalaciones/ModificarControlDeMejorasEnInstalaciones';
import ModificarControlDeReposicionDeCloro from '../../paginas/Control/Control_de_Reposicion_de_Cloro/ModificarControlDeReposicionDeCloro';
import ModificarControlDeTemperaturaDeEsterilizadores from '../../paginas/Control/Control_de_Temperatura_de_Estirilizadores/ModificarControlDeTemperaturaDeEsterilizadores';
import ModificarControlDeTemperaturaEnCamaras from '../../paginas/Control/Control_de_Temperatura_en_Camaras/ModificarControlDeTemperaturaEnCamaras';
import ListarControlDeNitrato from '../../paginas/Insumo/Control_de_Nitrato/ListarControlDeNitrato';
import ListarControlDeNitrito from '../../paginas/Insumo/Control_de_Nitrito/ListarControlDeNitrito';
import ListarLocalidad from '../../paginas/Persona/Localidad/ListarLocalidad';
import ListarControlDeCloroLibre from '../../paginas/Control/Control_de_Cloro_Libre/ListarControlDeCloroLibre';
import ListarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias from '../../paginas/Control/Control_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Cañerias/ListarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias';
import ListarControlDeMejorasEnInstalaciones from '../../paginas/Control/Control_de_Mejoras_en_Insatalaciones/ListarControlDeMejorasEnInstalaciones';
import ListarControlDeReposicionDeCloro from '../../paginas/Control/Control_de_Reposicion_de_Cloro/ListarControlDeReposicionDeCloro';
import ListarControlDeTemperaturaDeEsterilizadores from '../../paginas/Control/Control_de_Temperatura_de_Estirilizadores/ListarControlDeTemperaturaDeEsterilizadores';
import ListarControlDeTemperaturaEnCamaras from '../../paginas/Control/Control_de_Temperatura_en_Camaras/ListarControlDeTemperaturaEnCamaras';
import ListarUsuario from '../../paginas/Persona/Usuario/ListarUsuario';
import ListarControlDeProductosQuimicos from '../../paginas/Insumo/Control_de_Productos_Quimicos/ListarControlDeProductosQuimicos';
import ListarProducto from '../../paginas/Insumo/Producto/ListarProducto';
import ListarRecepcionDeMateriasPrimasCarnicas from '../../paginas/Insumo/Recepcion_de_Materias_Primas_Carnicas/ListarRecepcionDeMateriasPrimasCarnicas';
import ListarDiariaDeProduccion from '../../paginas/Insumo/Diaria_de_Produccion/ListarDiariaDeProduccion';
import ListarMonitoreoDeSSOPOPerativo from '../../paginas/Trazabilidad/Monitoreo_de_SSOP_Operativo/ListarMonitoreoDeSSOPOPerativo';
import ListarMonitoreoDeSSOPPreOPerativo from '../../paginas/Trazabilidad/Monitoreo_de_SSOP_PreOperativo/ListarMonitoreoDeSSOPPreOPerativo';
import ListarExpedicionDeProducto from '../../paginas/Trazabilidad/Expedicion_de_Producto/ListarExpedicionDeProducto';
import ListarResumenDeTrazabilidad from '../../paginas/Trazabilidad/Resumen_de_Trazabilidad/ListarResumenDeTrazabilidad';
import ListarAnualDeInsumosCarnicos from '../../paginas/Trazabilidad/Anual_de_Insumos_Carnicos/ListarAnualDeInsumosCarnicos';
import AgregarUsuario from '../../paginas/Persona/Usuario/AgregarUsuario';
import ModificarUsuario from '../../paginas/Persona/Usuario/ModificarUsuario';

const AppRouter = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/agregar-usuario" element={<AgregarUsuario />} />
          <Route path="/modificar-usuario/:id" element={<ModificarUsuario />} />
          <Route path="/localidad" element={<AgregarLocalidad />} />
          <Route path="/modificar-localidad/:id" element={<ModificarLocalidad />} />
          <Route path="/listar-localidad" element={<ListarLocalidad />} />
          <Route path="/cliente" element={<AgregarCliente />} />
          <Route path="/listarcliente" element={<ListarCliente />} />
          <Route path="/modificar-cliente/:id" element={<ModificarCliente />} />
          <Route path="/listar-cliente" element={<ListarCliente />} />
          <Route path="/carne" element={<AgregarCarne />} />
          <Route path="/modificar-carne/:id" element={<ModificarCarne />} />
          <Route path="/listar-carne" element={<ListarCarne />} />
          <Route path="/insumo" element={<AgregarInsumo />} />
          <Route path="/modificar-insumo/:id" element={<ModificarInsumo />} />
          <Route path="/producto" element={<AgregarProducto />} />
          <Route path="/modificar-producto/:id" element={<ModificarProducto />} />
          <Route path="/listar-producto" element={<ListarProducto />} />
          <Route path="/proveedor" element={<AgregarProveedor />} />
          <Route path="/listar-proveedor" element={<ListarProveedor />} />
          <Route path="/modificar-proveedor/:id" element={<ModificProveedor />} />
          <Route path="/control-de-alarma-luminica-y-sonora-de-cloro" element={<AgregarControlDeAlarmaLuminicaYSonoraDeCloro />} />
          <Route path="/listar-control-de-alarma-luminica-y-sonora-de-cloro" element={<ListarControlDeAlarmaLuminicaYSonoraDeCloro />} />
          <Route path="/modificar-control-de-alarma-luminica-y-sonora-de-cloro/:id" element={<ModificarControlDeAlarmaLuminicaYSonoraDeCloro />} />
          <Route path="/control-de-cloro-libre" element={<AgregarControlDeCloroLibre />} />
          <Route path="/modificar-control-de-cloro-libre/:id" element={<ModificarControlDeCloroLibre />} />
          <Route path="/listar-control-de-cloro-libre" element={<ListarControlDeCloroLibre />} />
          <Route path="/control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias" element={<AgregarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias />} />
          <Route path="/modificar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias/:id" element={<ModificarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias />} />
          <Route path="/listar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias" element={<ListarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias />} />
          <Route path="/control-de-mejoras-en-instalaciones" element={<AgregarControlDeMejorasEnInstalaciones />} />
          <Route path="/modificar-control-de-mejoras-en-instalaciones/:id" element={<ModificarControlDeMejorasEnInstalaciones />} />
          <Route path="/listar-control-de-mejoras-en-instalaciones" element={<ListarControlDeMejorasEnInstalaciones />} />
          <Route path="/control-de-reposicion-de-cloro" element={<AgregarControlDeReposicionDeCloro />} />
          <Route path="/modificar-control-de-reposicion-de-cloro/:id" element={<ModificarControlDeReposicionDeCloro />} />
          <Route path="/listar-control-de-reposicion-de-cloro" element={<ListarControlDeReposicionDeCloro />} />
          <Route path="/control-de-temperatura-de-esterilizadores" element={<AgregarControlDeTemperaturaDeEsterilizadores />} />
          <Route path="/listar-control-de-temperatura-de-esterilizadores" element={<ListarControlDeTemperaturaDeEsterilizadores />} />
          <Route path="/modificar-control-de-temperatura-de-esterilizadores/:id" element={<ModificarControlDeTemperaturaDeEsterilizadores />} />
          <Route path="/control-de-temperatura-en-camaras" element={<AgregarControlDeTemperaturaEnCamaras />} />
          <Route path="/listar-control-de-temperatura-en-camaras" element={<ListarControlDeTemperaturaEnCamaras />} />
          <Route path="/modificar-control-de-temperatura-en-camaras/:id" element={<ModificarControlDeTemperaturaEnCamaras />} />
          <Route path="/control-de-nitratos" element={<AgregarControlDeNitrato />} />
          <Route path="/modificar-control-de-nitratos/:id" element={<ModificarControlDeNitrato />} />
          <Route path="/listar-control-de-nitratos" element={<ListarControlDeNitrato />} />
          <Route path="/control-de-nitritos" element={<AgregarControlDeNitrito />} />
          <Route path="/modificar-control-de-nitritos/:id" element={<ModificarControlDeNitrito />} />
          <Route path="/listar-control-de-nitritos" element={<ListarControlDeNitrito />} />
          <Route path="/expedicion-de-producto" element={<AgregarExpedicionDeProducto />} />
          <Route path="/listar-expedicion-de-producto" element={<ListarExpedicionDeProducto />} />
          <Route path="/modificar-expedicion-de-producto/:id" element={<ModificarExpedicionDeProducto />} />
          <Route path="/control-de-productos-quimicos" element={<AgregarControlDeProductosQuimicos />} />
          <Route path="/modificar-control-de-productos-quimicos/:id" element={<ModificarControlDeProductosQuimicos />} />
          <Route path="/listar-control-de-productos-quimicos" element={<ListarControlDeProductosQuimicos />} />
          <Route path="/recepcion-de-materias-primas-carnicas" element={<AgregarRecepcionDeMateriasPrimasCarnicas />} />
          <Route path="/modificar-recepcion-de-materias-primas-carnicas/:id" element={<ModificarRecepcionDeMateriasPrimasCarnicas />} />
          <Route path="/listar-recepcion-de-materias-primas-carnicas" element={<ListarRecepcionDeMateriasPrimasCarnicas />} />
          <Route path="/diaria-de-produccion" element={<AgregarDiariaDeProduccion />} />
          <Route path="/modificar-diaria-de-produccion/:id" element={<ModificarDiariaDeProduccion />} />
          <Route path="/listar-diaria-de-produccion" element={<ListarDiariaDeProduccion />} />
          <Route path="/resumen-de-trazabilidad" element={<AgregarResumenDeTrazabilidad />} />
          <Route path="/listar-resumen-de-trazabilidad" element={<ListarResumenDeTrazabilidad />} />
          <Route path="/modificar-resumen-de-trazabilidad/:id" element={<ModificarResumenDeTrazabilidad />} />
          <Route path="/monitoreo-de-ssop-operativo" element={<AgregarMonitoreoDeSSOPOPerativo />} />
          <Route path="/listar-monitoreo-de-ssop-operativo" element={<ListarMonitoreoDeSSOPOPerativo />} />
          <Route path="/modificar-monitoreo-de-ssop-operativo/:id" element={<ModificarMoniteoreoDeSSOPOperativo />} />
          <Route path="/monitoreo-de-ssop-pre-operativo" element={<AgregarMonitoreoDeSSOPPreOperativo />} />
          <Route path="/listar-monitoreo-de-ssop-pre-operativo" element={<ListarMonitoreoDeSSOPPreOPerativo />} />
          <Route path="/modificar-monitoreo-de-ssop-pre-operativo/:id" element={<ModificarMoniteoreoDeSSOPPreOperativo />} />
          <Route path="/listar-control-de-insumos" element={<ListarInsumo />} />
          <Route path="/listar-usuarios" element={<ListarUsuario />} />
          <Route path="/listar-anual-de-insumos-carnicos" element={<ListarAnualDeInsumosCarnicos />} />
          {/* Otras rutas */}

        </Routes>
      </Router>
    );
  };
  
  export default AppRouter;
  
