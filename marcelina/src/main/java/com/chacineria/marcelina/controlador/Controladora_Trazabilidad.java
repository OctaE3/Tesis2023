package com.chacineria.marcelina.controlador;

import com.chacineria.marcelina.dto.ExpedicionCantidadDto;
import com.chacineria.marcelina.dto.ModificarExpedicionDto;
import com.chacineria.marcelina.entidad.persona.Usuario;
import com.chacineria.marcelina.entidad.trazabilidad.PAnual_de_Insumos_Carnicos;
import com.chacineria.marcelina.entidad.trazabilidad.PExpedicion_de_Producto;
import com.chacineria.marcelina.entidad.trazabilidad.PMonitoreo_de_SSOP_Operativo;
import com.chacineria.marcelina.entidad.trazabilidad.PMonitoreo_de_SSOP_PreOperativo;
import com.chacineria.marcelina.entidad.trazabilidad.PResumen_de_Trazabilidad;
import com.chacineria.marcelina.repositorio.persona.UsuarioRepositorio;
import com.chacineria.marcelina.repositorio.trazabilidad.PAnual_de_Insumos_CarnicosRepositorio;
import com.chacineria.marcelina.servicio.trazabilidad.PAnual_de_Insumos_CarnicosServicioImpl;
import com.chacineria.marcelina.servicio.trazabilidad.PExpedicion_de_ProductoServicioImpl;
import com.chacineria.marcelina.servicio.trazabilidad.PMonitoreo_de_SSOP_OperativoServicioImpl;
import com.chacineria.marcelina.servicio.trazabilidad.PMonitoreo_de_SSOP_PreOperativoServicioImpl;
import com.chacineria.marcelina.servicio.trazabilidad.PResumen_de_TrazabilidadServicioImpl;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequestMapping("/marcelina")
@RestController
public class Controladora_Trazabilidad {

        @Autowired
        private UsuarioRepositorio usuarioRepositorio;

        // #region ABM PAnual_de_Insumos_Carnicos

        @Autowired
        private PAnual_de_Insumos_CarnicosServicioImpl anualDeInsumosCarnicosServicioImpl;

        @Autowired
        private PAnual_de_Insumos_CarnicosRepositorio anualDeInsumosCarnicosRepositorio;

        @GetMapping("/listar-anual-de-insumos-carnicos")
        public List<PAnual_de_Insumos_Carnicos> listadoAnualDeInsumosCarnicos() {
                List<PAnual_de_Insumos_Carnicos> anualDeInsumosCarnicos = StreamSupport
                                .stream(anualDeInsumosCarnicosServicioImpl.findAll().spliterator(), false)
                                .collect(Collectors.toList());
                Collections.reverse(anualDeInsumosCarnicos);
                return anualDeInsumosCarnicos;
        }

        @GetMapping("/listar-ultimo-anual")
        public PAnual_de_Insumos_Carnicos listadoUltimoAnualDeInsumosCarnicos() {
                return anualDeInsumosCarnicosRepositorio.findLastAnualDeInsumosCarnicos();
        }

        @GetMapping("/buscar-anual-de-insumos-carnicos/{anualDeInsumosCarnicosId}")
        public ResponseEntity<?> buscarAnualDeInsumosCarnicosPorId(
                        @PathVariable(value = "anualDeInsumosCarnicosId") Long anualDeInsumosCarnicosId) {
                Optional<PAnual_de_Insumos_Carnicos> anualDeInsumosCarnicos = anualDeInsumosCarnicosServicioImpl
                                .findById(anualDeInsumosCarnicosId);
                if (!anualDeInsumosCarnicos.isPresent()) {
                        return ResponseEntity.notFound().build();
                }
                return ResponseEntity.ok(anualDeInsumosCarnicos);
        }

        @PostMapping("/agregar-anual-de-insumos-carnicos-automatico")
        public ResponseEntity<?> agregarAnualDeInsumosCarnicos() {
                try {
                        return ResponseEntity.status(HttpStatus.CREATED)
                                        .body(anualDeInsumosCarnicosServicioImpl
                                                        .saveAnualDeInsumosCarnicosAutomatico());
                } catch (Exception e) {
                        HashMap<String, String> error = new HashMap<>();
                        error.put("error", e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
                }
        }

        @DeleteMapping("/borrar-anual-de-insumos-carnicos/{anualDeInsumosCarnicosId}")
        public ResponseEntity<HttpStatus> eliminarAnualDeInsumosCarnicos(@PathVariable Long anualDeInsumosCarnicosId) {
                try {
                        anualDeInsumosCarnicosServicioImpl.deleteById(anualDeInsumosCarnicosId);
                        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } catch (Exception e) {
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
        }

        @PutMapping("/modificar-anual-de-insumos-carnicos/{anualDeInsumosCarnicosId}")
        public ResponseEntity<PAnual_de_Insumos_Carnicos> modificarAnualDeInsumosCarnicos(
                        @RequestBody PAnual_de_Insumos_Carnicos anualDeInsumosCarnicos,
                        @PathVariable(value = "anualDeInsumosCarnicosId") Long anualDeInsumosCarnicosId) {
                Optional<PAnual_de_Insumos_Carnicos> anualDeInsumosCarnicosData = anualDeInsumosCarnicosServicioImpl
                                .findById(anualDeInsumosCarnicosId);
                if (anualDeInsumosCarnicosData.isPresent()) {
                        anualDeInsumosCarnicosData.get()
                                        .setAnualDeInsumosCarnicosAnio(
                                                        anualDeInsumosCarnicos.getAnualDeInsumosCarnicosAnio());
                        anualDeInsumosCarnicosData.get().setAnualDeInsumosCarnicosCarneBovinaCH(
                                        anualDeInsumosCarnicos.getAnualDeInsumosCarnicosCarneBovinaCH());
                        anualDeInsumosCarnicosData.get()
                                        .setAnualDeInsumosCarnicosHigado(
                                                        anualDeInsumosCarnicos.getAnualDeInsumosCarnicosHigado());
                        anualDeInsumosCarnicosData.get().setAnualDeInsumosCarnicosCarneBovinaSH(
                                        anualDeInsumosCarnicos.getAnualDeInsumosCarnicosCarneBovinaSH());
                        anualDeInsumosCarnicosData.get().setAnualDeInsumosCarnicosCarnePorcinaCH(
                                        anualDeInsumosCarnicos.getAnualDeInsumosCarnicosCarnePorcinaCH());
                        anualDeInsumosCarnicosData.get().setAnualDeInsumosCarnicosCarnePorcinaGrasa(
                                        anualDeInsumosCarnicos.getAnualDeInsumosCarnicosCarnePorcinaGrasa());
                        anualDeInsumosCarnicosData.get().setAnualDeInsumosCarnicosCarnePorcinaSH(
                                        anualDeInsumosCarnicos.getAnualDeInsumosCarnicosCarnePorcinaSH());
                        anualDeInsumosCarnicosData.get().setAnualDeInsumosCarnicosLitrosSangre(
                                        anualDeInsumosCarnicos.getAnualDeInsumosCarnicosLitrosSangre());
                        anualDeInsumosCarnicosData.get()
                                        .setAnualDeInsumosCarnicosMes(
                                                        anualDeInsumosCarnicos.getAnualDeInsumosCarnicosMes());
                        anualDeInsumosCarnicosData.get().setAnualDeInsumosCarnicosTripasMadejas(
                                        anualDeInsumosCarnicos.getAnualDeInsumosCarnicosTripasMadejas());
                        return new ResponseEntity<>(
                                        anualDeInsumosCarnicosServicioImpl.save(anualDeInsumosCarnicosData.get()),
                                        HttpStatus.OK);
                } else {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
        }

        // #endregion

        // #region ABM PExpedicion_de_Producto

        @Autowired
        private PExpedicion_de_ProductoServicioImpl expedicionDeProductoServicioImpl;

        @GetMapping("/listar-expedicion-de-productos")
        public ResponseEntity<List<PExpedicion_de_Producto>> listadoExpedicionDeProducto() {
                try {
                        List<PExpedicion_de_Producto> expedicionDeProducto = StreamSupport
                                        .stream(expedicionDeProductoServicioImpl.findAll().spliterator(), false)
                                        .collect(Collectors.toList());

                        Collections.reverse(expedicionDeProducto);
                        return ResponseEntity.ok(expedicionDeProducto);
                } catch (Exception e) {
                        return ResponseEntity.notFound().build();
                }
        }

        @GetMapping("/buscar-expedicion-de-producto/{expedicionDeProductoId}")
        public ResponseEntity<?> buscarExpedicionDeProductoPorId(
                        @PathVariable(value = "expedicionDeProductoId") Long expedicionDeProductoId) {
                Optional<PExpedicion_de_Producto> expedicionDeProducto = expedicionDeProductoServicioImpl
                                .findById(expedicionDeProductoId);
                if (!expedicionDeProducto.isPresent()) {
                        return ResponseEntity.notFound().build();
                }
                return ResponseEntity.ok(expedicionDeProducto);
        }

        @PostMapping("/agregar-expedicion-de-producto")
        public ResponseEntity<?> agregarExpedicionDeProducto(@RequestBody ExpedicionCantidadDto dto) {
                try {
                        Usuario responsable = dto.getExpedicionDeProducto().getExpedicionDeProductoUsuario();
                        if (responsable != null && responsable.getUsuarioNombre() != null) {
                                Usuario usuarioExistente = usuarioRepositorio
                                                .findByUsuarioNombre(responsable.getUsuarioNombre());
                                if (usuarioExistente != null) {
                                        dto.getExpedicionDeProducto().setExpedicionDeProductoUsuario(usuarioExistente);
                                } else {
                                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                                        .body("Surgio un problema con el usuario, intete lograrse de nuevo.");
                                }
                        } else {
                                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                                .body("No tiene un usuario asignado.");
                        }

                        if (dto.getExpedicionDeProducto() != null && dto.getListaCantidad() != null) {

                                return ResponseEntity.status(HttpStatus.CREATED).body(
                                                expedicionDeProductoServicioImpl
                                                                .saveExpCantidad(dto.getExpedicionDeProducto(),
                                                                                dto.getListaCantidad()));

                        } else {
                                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                                .body("Error en la expedicon de producto eviada o en la lista");
                        }
                } catch (Exception e) {
                        HashMap<String, String> error = new HashMap<>();
                        error.put("error", e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
                }
        }

        @DeleteMapping("/borrar-expedicion-de-producto/{expedicionDeProductoId}")
        public ResponseEntity<HttpStatus> eliminarExpedicionDeProducto(@PathVariable Long expedicionDeProductoId) {
                try {
                        expedicionDeProductoServicioImpl.deleteById(expedicionDeProductoId);
                        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } catch (Exception e) {
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
        }

        @PutMapping("/modificar-expedicion-de-producto/{expedicionDeProductoId}")
        public ResponseEntity<PExpedicion_de_Producto> modificarExpedicionDeProducto(
                        @RequestBody ModificarExpedicionDto dto,
                        @PathVariable(value = "expedicionDeProductoId") Long expedicionDeProductoId) {
                Optional<PExpedicion_de_Producto> expedicionDeProductoData = expedicionDeProductoServicioImpl
                                .findById(expedicionDeProductoId);
                if (expedicionDeProductoData.isPresent()) {
                        expedicionDeProductoData.get()
                                        .setExpedicionDeProductoCliente(
                                                        dto.getExpedicionDeProducto().getExpedicionDeProductoCliente());
                        expedicionDeProductoData.get()
                                        .setExpedicionDeProductoDocumento(
                                                        dto.getExpedicionDeProducto()
                                                                        .getExpedicionDeProductoDocumento());
                        expedicionDeProductoData.get()
                                        .setExpedicionDeProductoFecha(
                                                        dto.getExpedicionDeProducto().getExpedicionDeProductoFecha());
                        expedicionDeProductoData.get()
                                        .setExpedicionDeProductoLotes(
                                                        dto.getExpedicionDeProducto().getExpedicionDeProductoLotes());
                        expedicionDeProductoData.get()
                                        .setExpedicionDeProductoCantidad(
                                                        dto.getExpedicionDeProducto()
                                                                        .getExpedicionDeProductoCantidad());
                        expedicionDeProductoData.get()
                                        .setExpedicionDeProductoProductos(
                                                        dto.getExpedicionDeProducto()
                                                                        .getExpedicionDeProductoProductos());
                        expedicionDeProductoData.get().setExpedicionDeProductoUsuario(
                                        dto.getExpedicionDeProducto().getExpedicionDeProductoUsuario());
                        dto.setExpedicionDeProducto(expedicionDeProductoData.get());
                        return new ResponseEntity<>(
                                        expedicionDeProductoServicioImpl.saveExpModificar(dto),
                                        HttpStatus.OK);
                } else {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
        }

        // #endregion

        // #region ABM PMonitoreo_de_SSOP_Operativo

        @Autowired
        private PMonitoreo_de_SSOP_OperativoServicioImpl monitoreoDeSSOPOperativoServicioImpl;

        @GetMapping("/listar-monitoreo-de-ssop-operativo")
        public List<PMonitoreo_de_SSOP_Operativo> listadoMonitoreoDeSSOPOperativo() {
                List<PMonitoreo_de_SSOP_Operativo> monitoreoDeSSOPOperativo = StreamSupport
                                .stream(monitoreoDeSSOPOperativoServicioImpl.findAll().spliterator(), false)
                                .collect(Collectors.toList());
                Collections.reverse(monitoreoDeSSOPOperativo);
                return monitoreoDeSSOPOperativo;
        }

        @GetMapping("/buscar-monitoreo-de-ssop-operativo/{monitoreoDeSSOPOperativoId}")
        public ResponseEntity<?> buscarMonitoreoDeSSOPOperativoPorId(
                        @PathVariable(value = "monitoreoDeSSOPOperativoId") Long monitoreoDeSSOPOperativoId) {
                Optional<PMonitoreo_de_SSOP_Operativo> monitoreoDeSSOPOperativo = monitoreoDeSSOPOperativoServicioImpl
                                .findById(monitoreoDeSSOPOperativoId);
                if (!monitoreoDeSSOPOperativo.isPresent()) {
                        return ResponseEntity.notFound().build();
                }
                return ResponseEntity.ok(monitoreoDeSSOPOperativo);
        }

        @PostMapping("/agregar-monitoreo-de-ssop-operativo")
        public ResponseEntity<?> agregarMonitoreoDeSSOPOperativo(
                        @RequestBody PMonitoreo_de_SSOP_Operativo monitoreoDeSSOPOperativo) {
                try {
                        Usuario responsable = monitoreoDeSSOPOperativo.getMonitoreoDeSSOPOperativoResponsable();
                        if (responsable != null && responsable.getUsuarioNombre() != null) {
                                Usuario usuarioExistente = usuarioRepositorio
                                                .findByUsuarioNombre(responsable.getUsuarioNombre());
                                if (usuarioExistente != null) {
                                        monitoreoDeSSOPOperativo
                                                        .setMonitoreoDeSSOPOperativoResponsable(usuarioExistente);
                                } else {
                                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                                                        "Surgió un problema con el usuario, intete logearse de nuevo.");
                                }
                        } else {
                                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                                .body("No tiene un usuario asignado.");
                        }
                        return ResponseEntity.status(HttpStatus.CREATED)
                                        .body(monitoreoDeSSOPOperativoServicioImpl.save(monitoreoDeSSOPOperativo));
                } catch (Exception e) {
                        HashMap<String, String> error = new HashMap<>();
                        error.put("error", e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
                }
        }

        @DeleteMapping("/borrar-monitoreo-de-ssop-operativo/{monitoreoDeSSOPOperativoId}")
        public ResponseEntity<HttpStatus> eliminarMonitoreoDeSSOPOperativo(
                        @PathVariable Long monitoreoDeSSOPOperativoId) {
                try {
                        monitoreoDeSSOPOperativoServicioImpl.deleteById(monitoreoDeSSOPOperativoId);
                        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } catch (Exception e) {
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
        }

        @PutMapping("/modificar-monitoreo-de-ssop-operativo/{monitoreoDeSSOPOperativoId}")
        public ResponseEntity<PMonitoreo_de_SSOP_Operativo> modificarCarne(
                        @RequestBody PMonitoreo_de_SSOP_Operativo monitoreoDeSSOPOperativo,
                        @PathVariable(value = "monitoreoDeSSOPOperativoId") Long monitoreoDeSSOPOperativoId) {
                Optional<PMonitoreo_de_SSOP_Operativo> monitoreoDeSSOPOperativoData = monitoreoDeSSOPOperativoServicioImpl
                                .findById(monitoreoDeSSOPOperativoId);
                if (monitoreoDeSSOPOperativoData.isPresent()) {
                        monitoreoDeSSOPOperativoData.get().setMonitoreoDeSSOPOperativoAccCorrectivas(
                                        monitoreoDeSSOPOperativo.getMonitoreoDeSSOPOperativoAccCorrectivas());
                        monitoreoDeSSOPOperativoData.get().setMonitoreoDeSSOPOperativoAccPreventivas(
                                        monitoreoDeSSOPOperativo.getMonitoreoDeSSOPOperativoAccPreventivas());
                        monitoreoDeSSOPOperativoData.get()
                                        .setMonitoreoDeSSOPOperativoArea(
                                                        monitoreoDeSSOPOperativo.getMonitoreoDeSSOPOperativoArea());
                        monitoreoDeSSOPOperativoData.get().setMonitoreoDeSSOPOperativoFechaInicio(
                                        monitoreoDeSSOPOperativo.getMonitoreoDeSSOPOperativoFechaInicio());
                        monitoreoDeSSOPOperativoData.get().setMonitoreoDeSSOPOperativoFechaFinal(
                                        monitoreoDeSSOPOperativo.getMonitoreoDeSSOPOperativoFechaFinal());
                        monitoreoDeSSOPOperativoData.get()
                                        .setMonitoreoDeSSOPOperativoDias(
                                                        monitoreoDeSSOPOperativo.getMonitoreoDeSSOPOperativoDias());
                        monitoreoDeSSOPOperativoData.get().setMonitoreoDeSSOPOperativoObservaciones(
                                        monitoreoDeSSOPOperativo.getMonitoreoDeSSOPOperativoObservaciones());
                        monitoreoDeSSOPOperativoData.get().setMonitoreoDeSSOPOperativoResponsable(
                                        monitoreoDeSSOPOperativo.getMonitoreoDeSSOPOperativoResponsable());
                        return new ResponseEntity<>(
                                        monitoreoDeSSOPOperativoServicioImpl.save(monitoreoDeSSOPOperativoData.get()),
                                        HttpStatus.OK);
                } else {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
        }

        // #endregion

        // #region ABM PMonitoreo_de_SSOP_PreOperativo

        @Autowired
        private PMonitoreo_de_SSOP_PreOperativoServicioImpl monitoreoDeSSOPPreOperativoServicioImpl;

        @GetMapping("/listar-monitoreo-de-ssop-pre-operativo")
        public List<PMonitoreo_de_SSOP_PreOperativo> listadoMonitoreoDeSSOPPreOperativo() {
                List<PMonitoreo_de_SSOP_PreOperativo> monitoreoDeSSOPPreOperativo = StreamSupport
                                .stream(monitoreoDeSSOPPreOperativoServicioImpl.findAll().spliterator(), false)
                                .collect(Collectors.toList());
                Collections.reverse(monitoreoDeSSOPPreOperativo);
                return monitoreoDeSSOPPreOperativo;
        }

        @GetMapping("/buscar-monitoreo-de-ssop-pre-operativo/{monitoreoDeSSOPPreOperativoId}")
        public ResponseEntity<?> buscarMonitoreoDeSSOPPreOperativoPorId(
                        @PathVariable(value = "monitoreoDeSSOPPreOperativoId") Long monitoreoDeSSOPPreOperativoId) {
                Optional<PMonitoreo_de_SSOP_PreOperativo> monitoreoDeSSOPPreOperativo = monitoreoDeSSOPPreOperativoServicioImpl
                                .findById(monitoreoDeSSOPPreOperativoId);
                if (!monitoreoDeSSOPPreOperativo.isPresent()) {
                        return ResponseEntity.notFound().build();
                }
                return ResponseEntity.ok(monitoreoDeSSOPPreOperativo);
        }

        @PostMapping("/agregar-monitoreo-de-ssop-pre-operativo")
        public ResponseEntity<?> agregarMonitoreoDeSSOPPreOperativo(
                        @RequestBody PMonitoreo_de_SSOP_PreOperativo monitoreoDeSSOPPreOperativo) {
                try {
                        Usuario responsable = monitoreoDeSSOPPreOperativo.getMonitoreoDeSSOPPreOperativoResponsable();
                        if (responsable != null && responsable.getUsuarioNombre() != null) {
                                Usuario usuarioExistente = usuarioRepositorio
                                                .findByUsuarioNombre(responsable.getUsuarioNombre());
                                if (usuarioExistente != null) {
                                        monitoreoDeSSOPPreOperativo
                                                        .setMonitoreoDeSSOPPreOperativoResponsable(usuarioExistente);
                                } else {
                                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                                                        "Surgió un problema con el usuario, intete logearse de nuevo.");
                                }
                        } else {
                                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                                .body("No tiene un usuario asignado.");
                        }
                        return ResponseEntity.status(HttpStatus.CREATED)
                                        .body(monitoreoDeSSOPPreOperativoServicioImpl
                                                        .save(monitoreoDeSSOPPreOperativo));
                } catch (Exception e) {
                        HashMap<String, String> error = new HashMap<>();
                        error.put("error", e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
                }
        }

        @DeleteMapping("/borrar-monitoreo-de-ssop-pre-operativo/{monitoreoDeSSOPPreOperativoId}")
        public ResponseEntity<HttpStatus> eliminarMonitoreoDeSSOPPreOperativo(
                        @PathVariable Long monitoreoDeSSOPPreOperativoId) {
                try {
                        monitoreoDeSSOPPreOperativoServicioImpl.deleteById(monitoreoDeSSOPPreOperativoId);
                        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } catch (Exception e) {
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
        }

        @PutMapping("/modificar-monitoreo-de-ssop-pre-operativo/{monitoreoDeSSOPPreOperativoId}")
        public ResponseEntity<PMonitoreo_de_SSOP_PreOperativo> modificarMonitoreoDeSSOPPreOperativo(
                        @RequestBody PMonitoreo_de_SSOP_PreOperativo monitoreoDeSSOPPreOperativo,
                        @PathVariable(value = "monitoreoDeSSOPPreOperativoId") Long monitoreoDeSSOPPreOperativoId) {
                Optional<PMonitoreo_de_SSOP_PreOperativo> monitoreoDeSSOPPreOperativoData = monitoreoDeSSOPPreOperativoServicioImpl
                                .findById(monitoreoDeSSOPPreOperativoId);
                if (monitoreoDeSSOPPreOperativoData.isPresent()) {
                        monitoreoDeSSOPPreOperativoData.get().setMonitoreoDeSSOPPreOperativoAccCorrectivas(
                                        monitoreoDeSSOPPreOperativo.getMonitoreoDeSSOPPreOperativoAccCorrectivas());
                        monitoreoDeSSOPPreOperativoData.get().setMonitoreoDeSSOPPreOperativoDias(
                                        monitoreoDeSSOPPreOperativo.getMonitoreoDeSSOPPreOperativoDias());
                        monitoreoDeSSOPPreOperativoData.get().setMonitoreoDeSSOPPreOperativoAccPreventivas(
                                        monitoreoDeSSOPPreOperativo.getMonitoreoDeSSOPPreOperativoAccPreventivas());
                        monitoreoDeSSOPPreOperativoData.get().setMonitoreoDeSSOPPreOperativoArea(
                                        monitoreoDeSSOPPreOperativo.getMonitoreoDeSSOPPreOperativoArea());
                        monitoreoDeSSOPPreOperativoData.get().setMonitoreoDeSSOPPreOperativoFecha(
                                        monitoreoDeSSOPPreOperativo.getMonitoreoDeSSOPPreOperativoFecha());
                        monitoreoDeSSOPPreOperativoData.get().setMonitoreoDeSSOPPreOperativoSector(
                                        monitoreoDeSSOPPreOperativo.getMonitoreoDeSSOPPreOperativoSector());
                        monitoreoDeSSOPPreOperativoData.get().setMonitoreoDeSSOPPreOperativoArea(
                                        monitoreoDeSSOPPreOperativo.getMonitoreoDeSSOPPreOperativoArea());
                        monitoreoDeSSOPPreOperativoData.get().setMonitoreoDeSSOPPreOperativoObservaciones(
                                        monitoreoDeSSOPPreOperativo.getMonitoreoDeSSOPPreOperativoObservaciones());
                        monitoreoDeSSOPPreOperativoData.get().setMonitoreoDeSSOPPreOperativoResponsable(
                                        monitoreoDeSSOPPreOperativo.getMonitoreoDeSSOPPreOperativoResponsable());
                        return new ResponseEntity<>(
                                        monitoreoDeSSOPPreOperativoServicioImpl
                                                        .save(monitoreoDeSSOPPreOperativoData.get()),
                                        HttpStatus.OK);
                } else {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
        }

        // #endregion

        // #region ABM PResumen_de_Trazabilidad

        @Autowired
        private PResumen_de_TrazabilidadServicioImpl resumenDeTrazabilidadServicioImpl;

        @GetMapping("/listar-resumen-de-trazabilidad")
        public List<PResumen_de_Trazabilidad> listadoResumenDeTrazabilidad() {
                List<PResumen_de_Trazabilidad> resumenDeTrazabilidad = StreamSupport
                                .stream(resumenDeTrazabilidadServicioImpl.findAll().spliterator(), false)
                                .collect(Collectors.toList());
                Collections.reverse(resumenDeTrazabilidad);
                return resumenDeTrazabilidad;
        }

        @GetMapping("/buscar-resumen-de-trazabilidad/{resumenDeTrazabilidadId}")
        public ResponseEntity<?> buscarResumenDeTrazabilidadPorId(
                        @PathVariable(value = "resumenDeTrazabilidadId") Long resumenDeTrazabilidadId) {
                Optional<PResumen_de_Trazabilidad> resumenDeTrazabilidad = resumenDeTrazabilidadServicioImpl
                                .findById(resumenDeTrazabilidadId);
                if (!resumenDeTrazabilidad.isPresent()) {
                        return ResponseEntity.notFound().build();
                }
                return ResponseEntity.ok(resumenDeTrazabilidad);
        }

        @PostMapping("/agregar-resumen-de-trazabilidad")
        public ResponseEntity<?> agregarResumenDeTrazabilidad(
                        @RequestBody List<PResumen_de_Trazabilidad> resumenesDeTrazabilidad) {
                try {
                        return ResponseEntity.status(HttpStatus.CREATED)
                                        .body(resumenDeTrazabilidadServicioImpl.saveAll(resumenesDeTrazabilidad));
                } catch (Exception e) {
                        HashMap<String, String> error = new HashMap<>();
                        error.put("error", e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
                }
        }

        @DeleteMapping("/borrar-resumen-de-trazabilidad/{resumenDeTrazabilidadId}")
        public ResponseEntity<HttpStatus> eliminarResumenDeTrazabilidad(@PathVariable Long resumenDeTrazabilidadId) {
                try {
                        resumenDeTrazabilidadServicioImpl.deleteById(resumenDeTrazabilidadId);
                        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } catch (Exception e) {
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
        }

        @PutMapping("/modificar-resumen-de-trazabilidad/{resumenDeTrazabilidadId}")
        public ResponseEntity<PResumen_de_Trazabilidad> modificarResumenDeTrazabilidad(
                        @RequestBody PResumen_de_Trazabilidad resumenDeTrazabilidad,
                        @PathVariable(value = "resumenDeTrazabilidadId") Long resumenDeTrazabilidadId) {
                Optional<PResumen_de_Trazabilidad> resumenDeTrazabilidadData = resumenDeTrazabilidadServicioImpl
                                .findById(resumenDeTrazabilidadId);
                if (resumenDeTrazabilidadData.isPresent()) {
                        resumenDeTrazabilidadData.get().setResumenDeTrazabilidadCantidadProducida(
                                        resumenDeTrazabilidad.getResumenDeTrazabilidadCantidadProducida());
                        resumenDeTrazabilidadData.get()
                                        .setResumenDeTrazabilidadDestino(
                                                        resumenDeTrazabilidad.getResumenDeTrazabilidadDestino());
                        resumenDeTrazabilidadData.get()
                                        .setResumenDeTrazabilidadFecha(
                                                        resumenDeTrazabilidad.getResumenDeTrazabilidadFecha());
                        resumenDeTrazabilidadData.get()
                                        .setResumenDeTrazabilidadLote(
                                                        resumenDeTrazabilidad.getResumenDeTrazabilidadLote());
                        resumenDeTrazabilidadData.get().setResumenDeTrazabilidadMatPrimaCarnica(
                                        resumenDeTrazabilidad.getResumenDeTrazabilidadMatPrimaCarnica());
                        resumenDeTrazabilidadData.get().setResumenDeTrazabilidadMatPrimaNoCarnica(
                                        resumenDeTrazabilidad.getResumenDeTrazabilidadMatPrimaNoCarnica());
                        resumenDeTrazabilidadData.get()
                                        .setResumenDeTrazabilidadProducto(
                                                        resumenDeTrazabilidad.getResumenDeTrazabilidadProducto());
                        resumenDeTrazabilidadData.get()
                                        .setResumenDeTrazabilidadResponsable(
                                                        resumenDeTrazabilidad.getResumenDeTrazabilidadResponsable());
                        return new ResponseEntity<>(
                                        resumenDeTrazabilidadServicioImpl.save(resumenDeTrazabilidadData.get()),
                                        HttpStatus.OK);
                } else {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
        }

        // #endregion

}
