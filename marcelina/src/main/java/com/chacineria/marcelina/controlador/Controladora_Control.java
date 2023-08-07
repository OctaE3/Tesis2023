package com.chacineria.marcelina.controlador;

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

import com.chacineria.marcelina.entidad.control.PControl_de_Alarma_Luminica_y_Sonora_de_Cloro;
import com.chacineria.marcelina.entidad.control.PControl_de_Cloro_Libre;
import com.chacineria.marcelina.entidad.control.PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias;
import com.chacineria.marcelina.entidad.control.PControl_de_Mejoras_en_Instalaciones;
import com.chacineria.marcelina.entidad.control.PControl_de_Reposicion_de_Cloro;
import com.chacineria.marcelina.entidad.control.PControl_de_Temperatura_de_Esterilizadores;
import com.chacineria.marcelina.entidad.control.PControl_de_Temperatura_en_Camaras;
import com.chacineria.marcelina.entidad.persona.Usuario;
import com.chacineria.marcelina.repositorio.persona.UsuarioRepositorio;
import com.chacineria.marcelina.servicio.control.PControl_de_Alarma_Luminica_y_Sonora_de_CloroServicioImpl;
import com.chacineria.marcelina.servicio.control.PControl_de_Cloro_LibreServicioImpl;
import com.chacineria.marcelina.servicio.control.PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_CanieriasServicioImpl;
import com.chacineria.marcelina.servicio.control.PControl_de_Mejoras_en_InstalacionesServicioImpl;
import com.chacineria.marcelina.servicio.control.PControl_de_Reposicion_de_CloroServicioImpl;
import com.chacineria.marcelina.servicio.control.PControl_de_Temperatura_de_EsterilizadoresServicioImpl;
import com.chacineria.marcelina.servicio.control.PControl_de_Temperatura_en_CamarasServicioImpl;

@Controller
@RequestMapping("/marcelina")
@RestController
public class Controladora_Control {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    //#region ABM PControl_de_Alarma_Luminica_y_Sonora_de_Cloro 

    @Autowired
    private PControl_de_Alarma_Luminica_y_Sonora_de_CloroServicioImpl controlDeAlarmaLuminicaYSonoraDeCloroServicioImpl;

    @GetMapping("/listar-control-de-alarma-luminica-y-sonora-de-cloro")
    public List<PControl_de_Alarma_Luminica_y_Sonora_de_Cloro> listadoControlDeAlarmaLuminicaYSonoraDeCloro(){
        List<PControl_de_Alarma_Luminica_y_Sonora_de_Cloro> controlDeAlarmaLuminicaYSonoraDeCloro = StreamSupport
        .stream(controlDeAlarmaLuminicaYSonoraDeCloroServicioImpl.findAll().spliterator(), false)
        .collect(Collectors.toList());
        return controlDeAlarmaLuminicaYSonoraDeCloro;
    }

    @GetMapping("/buscar-control-de-alarma-luminica-y-sonora-de-cloro/{controlDeAlarmaLuminicaYSonoraDeCloroId}")
    public ResponseEntity<?> buscarControlDeAlarmaLuminicaYSonoraDeCloroPorId(@PathVariable(value="controlDeAlarmaLuminicaYSonoraDeCloroId") Long controlDeAlarmaLuminicaYSonoraDeCloroId){
        Optional<PControl_de_Alarma_Luminica_y_Sonora_de_Cloro> controlDeAlarmaLuminicaYSonoraDeCloro = controlDeAlarmaLuminicaYSonoraDeCloroServicioImpl.findById(controlDeAlarmaLuminicaYSonoraDeCloroId);
        if(!controlDeAlarmaLuminicaYSonoraDeCloro.isPresent()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(controlDeAlarmaLuminicaYSonoraDeCloro);
    }

    @PostMapping("/agregar-control-de-alarma-luminica-y-sonora-de-cloro")
    public ResponseEntity<?> agregarControlDeAlarmaLuminicaYSonoraDeCloro(@RequestBody PControl_de_Alarma_Luminica_y_Sonora_de_Cloro controlDeAlarmaLuminicaYSonoraDeCloro){
        try{
            Usuario responsable = controlDeAlarmaLuminicaYSonoraDeCloro.getControlDeAlarmaLuminicaYSonoraDeCloroResponsable();
            if (responsable != null && responsable.getUsuarioNombre() != null){
                Usuario usuarioExistente = usuarioRepositorio.findByUsuarioNombre(responsable.getUsuarioNombre());
                if (usuarioExistente != null){
                    controlDeAlarmaLuminicaYSonoraDeCloro.setControlDeAlarmaLuminicaYSonoraDeCloroResponsable(usuarioExistente);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Surgió un problema con el usuario, intete logearse de nuevo");
                }
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No tiene un usuario asignado");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(controlDeAlarmaLuminicaYSonoraDeCloroServicioImpl.save(controlDeAlarmaLuminicaYSonoraDeCloro));
        }
        catch(Exception e){
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-control-de-alarma-luminica-y-sonora-de-cloro/{controlDeAlarmaLuminicaYSonoraDeCloroId}")
    public ResponseEntity<HttpStatus> eliminarControlDeAlarmaLuminicaYSonoraDeCloro(@PathVariable Long controlDeAlarmaLuminicaYSonoraDeCloroId){
        try{
            controlDeAlarmaLuminicaYSonoraDeCloroServicioImpl.deleteById(controlDeAlarmaLuminicaYSonoraDeCloroId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-control-de-alarma-luminica-y-sonora-de-cloro/{controlDeAlarmaLuminicaYSonoraDeCloroId}")
    public ResponseEntity<PControl_de_Alarma_Luminica_y_Sonora_de_Cloro> modificarControlDeAlarmaLuminicaYSonoraDeCloro(@RequestBody PControl_de_Alarma_Luminica_y_Sonora_de_Cloro controlDeAlarmaLuminicaYSonoraDeCloro, @PathVariable(value="controlDeAlarmaLuminicaYSonoraDeCloroId") Long controlDeAlarmaLuminicaYSonoraDeCloroId){
        Optional<PControl_de_Alarma_Luminica_y_Sonora_de_Cloro> controlDeAlarmaLuminicaYSonoraDeCloroData = controlDeAlarmaLuminicaYSonoraDeCloroServicioImpl.findById(controlDeAlarmaLuminicaYSonoraDeCloroId);
        if(controlDeAlarmaLuminicaYSonoraDeCloroData.isPresent()){
            controlDeAlarmaLuminicaYSonoraDeCloroData.get().setControlDeAlarmaLuminicaYSonoraDeCloroFechaHora(controlDeAlarmaLuminicaYSonoraDeCloro.getControlDeAlarmaLuminicaYSonoraDeCloroFechaHora());
            controlDeAlarmaLuminicaYSonoraDeCloroData.get().setControlDeAlarmaLuminicaYSonoraDeCloroResponsable(controlDeAlarmaLuminicaYSonoraDeCloro.getControlDeAlarmaLuminicaYSonoraDeCloroResponsable());
            controlDeAlarmaLuminicaYSonoraDeCloroData.get().setControlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica(controlDeAlarmaLuminicaYSonoraDeCloro.getControlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica());
            controlDeAlarmaLuminicaYSonoraDeCloroData.get().setControlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora(controlDeAlarmaLuminicaYSonoraDeCloro.getControlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora());
            controlDeAlarmaLuminicaYSonoraDeCloroData.get().setControlDeAlarmaLuminicaYSonoraDeCloroObservaciones(controlDeAlarmaLuminicaYSonoraDeCloro.getControlDeAlarmaLuminicaYSonoraDeCloroObservaciones());
            return new ResponseEntity<>(controlDeAlarmaLuminicaYSonoraDeCloroServicioImpl.save(controlDeAlarmaLuminicaYSonoraDeCloroData.get()), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //#endregion

    //#region ABM PControl_de_Cloro_Libre

    @Autowired
    private PControl_de_Cloro_LibreServicioImpl controlDeCloroLibreServicioImpl;

    @GetMapping("/listar-control-de-cloro-libre")
    public List<PControl_de_Cloro_Libre> listadoControlDeCloroLibre(){
        List<PControl_de_Cloro_Libre> controlDeCloroLibre = StreamSupport
        .stream(controlDeCloroLibreServicioImpl.findAll().spliterator(), false)
        .collect(Collectors.toList());
        return controlDeCloroLibre;
    }

    @GetMapping("/buscar-control-de-cloro-libre/{controlDeCloroLibreId}")
    public ResponseEntity<?> buscarControlDeCloroLibrePorId(@PathVariable(value="controlDeCloroLibreId") Long controlDeCloroLibreId){
        Optional<PControl_de_Cloro_Libre> controlDeCloroLibre = controlDeCloroLibreServicioImpl.findById(controlDeCloroLibreId);
        if(!controlDeCloroLibre.isPresent()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(controlDeCloroLibre);
    }

    @PostMapping("/agregar-control-de-cloro-libre")
    public ResponseEntity<?> agregarControlDeCloroLibre(@RequestBody PControl_de_Cloro_Libre controlDeCloroLibre){
        try{
            Usuario responsable = controlDeCloroLibre.getControlDeCloroLibreResponsable();
            if (responsable != null && responsable.getUsuarioNombre() != null) {
                Usuario usuarioExistente = usuarioRepositorio.findByUsuarioNombre(responsable.getUsuarioNombre());
                if (usuarioExistente != null) {
                    controlDeCloroLibre.setControlDeCloroLibreResponsable(usuarioExistente);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Surgió un problema con el usuario, intete logearse de nuevo.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No tiene un usuario asignado.");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(controlDeCloroLibreServicioImpl.save(controlDeCloroLibre));
        }
        catch(Exception e){
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-control-de-cloro-libre/{controlDeCloroLibreId}")
    public ResponseEntity<HttpStatus> eliminarControlDeCloroLibre(@PathVariable Long controlDeCloroLibreId){
        try{
            controlDeCloroLibreServicioImpl.deleteById(controlDeCloroLibreId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-controlDeCloroLibre/{controlDeCloroLibreId}")
    public ResponseEntity<PControl_de_Cloro_Libre> modificarControlDeCloroLibre(@RequestBody PControl_de_Cloro_Libre controlDeCloroLibre, @PathVariable(value="controlDeCloroLibreId") Long controlDeCloroLibreId){
        Optional<PControl_de_Cloro_Libre> controlDeCloroLibreData = controlDeCloroLibreServicioImpl.findById(controlDeCloroLibreId);
        if(controlDeCloroLibreData.isPresent()){
            controlDeCloroLibreData.get().setControlDeCloroLibreFecha(controlDeCloroLibre.getControlDeCloroLibreFecha());
            controlDeCloroLibreData.get().setControlDeCloroLibreGrifoPico(controlDeCloroLibre.getControlDeCloroLibreGrifoPico());
            controlDeCloroLibreData.get().setControlDeCloroLibreObservaciones(controlDeCloroLibre.getControlDeCloroLibreObservaciones());
            controlDeCloroLibreData.get().setControlDeCloroLibreResponsable(controlDeCloroLibre.getControlDeCloroLibreResponsable());
            controlDeCloroLibreData.get().setControlDeCloroLibreResultado(controlDeCloroLibre.getControlDeCloroLibreResultado());
            return new ResponseEntity<>(controlDeCloroLibreServicioImpl.save(controlDeCloroLibreData.get()), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //#endregion

    //#region ABM PControl_de_Limpieza_y_Desinfeccion_de_Depositos_De_Agua_y_Canierias

    @Autowired
    private PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_CanieriasServicioImpl controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasServicioImpl;

    @GetMapping("/listar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-canierias")
    public List<PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias> listadoControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias(){
        List<PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias> controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias = StreamSupport
        .stream(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasServicioImpl.findAll().spliterator(), false)
        .collect(Collectors.toList());
        return controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias;
    }

    @GetMapping("/buscar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-canierias/{controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId}")
    public ResponseEntity<?> buscarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasPorId(@PathVariable(value="controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId") Long controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId){
        Optional<PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias> controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasServicioImpl.findById(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId);
        if(!controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias.isPresent()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias);
    }

    @PostMapping("/agregar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-canierias")
    public ResponseEntity<?> agregarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias(@RequestBody PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias){
        try{
            Usuario responsable = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias.getControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable();
            if (responsable != null && responsable.getUsuarioNombre() != null) {
                Usuario usuarioExistente = usuarioRepositorio.findByUsuarioNombre(responsable.getUsuarioNombre());
                if (usuarioExistente != null) {
                    controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias.setControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable(usuarioExistente);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Surgió un problema con el usuario, intete logearse de nuevo.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Usted no tiene un usuario asignado.");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasServicioImpl.save(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias));
        }
        catch(Exception e){
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-canierias/{controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId}")
    public ResponseEntity<HttpStatus> eliminarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias(@PathVariable Long controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId){
        try{
            controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasServicioImpl.deleteById(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-canierias/{controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId}")
    public ResponseEntity<PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias> modificarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias(@RequestBody PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias, @PathVariable(value="controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId") Long controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId){
        Optional<PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias> controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasData = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasServicioImpl.findById(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId);
        if(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasData.isPresent()){
            controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasData.get().setControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias.getControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias());
            controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasData.get().setControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias.getControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito());
            controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasData.get().setControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias.getControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha());
            controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasData.get().setControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias.getControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones());
            controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasData.get().setControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias.getControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable());
            return new ResponseEntity<>(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasServicioImpl.save(controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasData.get()), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //#endregion

    //#region ABM PControl_de_Mejoras_en_Instalaciones

    @Autowired
    private PControl_de_Mejoras_en_InstalacionesServicioImpl controlDeMejorasEnInstalacionesServicioImpl;

    @GetMapping("/listar-control-de-mejoras-en-instalaciones")
    public List<PControl_de_Mejoras_en_Instalaciones> listadoControlDeMejorasEnInstalaciones(){
        List<PControl_de_Mejoras_en_Instalaciones> controlDeMejorasEnInstalaciones = StreamSupport
        .stream(controlDeMejorasEnInstalacionesServicioImpl.findAll().spliterator(), false)
        .collect(Collectors.toList());
        return controlDeMejorasEnInstalaciones;
    }

    @GetMapping("/buscar-control-de-mejoras-en-instalaciones/{controlDeMejorasEnInstalacionesId}")
    public ResponseEntity<?> buscarControlDeMejorasEnInstalacionesPorId(@PathVariable(value="controlDeMejorasEnInstalacionesId") Long controlDeMejorasEnInstalacionesId){
        Optional<PControl_de_Mejoras_en_Instalaciones> controlDeMejorasEnInstalaciones = controlDeMejorasEnInstalacionesServicioImpl.findById(controlDeMejorasEnInstalacionesId);
        if(!controlDeMejorasEnInstalaciones.isPresent()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(controlDeMejorasEnInstalaciones);
    }

    @PostMapping("/agregar-control-de-mejoras-en-instalaciones")
    public ResponseEntity<?> agregarControlDeMejorasEnInstalaciones(@RequestBody PControl_de_Mejoras_en_Instalaciones controlDeMejorasEnInstalaciones){
        try{
            Usuario responsable = controlDeMejorasEnInstalaciones.getControlDeMejorasEnInstalacionesResponsable();
            if (responsable != null && responsable.getUsuarioNombre() != null) {
                Usuario usuarioExistente = usuarioRepositorio.findByUsuarioNombre(responsable.getUsuarioNombre());
                if (usuarioExistente != null) {
                    controlDeMejorasEnInstalaciones.setControlDeMejorasEnInstalacionesResponsable(usuarioExistente);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Surgió un problema con el usuario, intete logearse de nuevo.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No tiene un usuario asignado.");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(controlDeMejorasEnInstalacionesServicioImpl.save(controlDeMejorasEnInstalaciones));
        }
        catch(Exception e){
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-control-de-mejoras-en-instalaciones/{controlDeMejorasEnInstalacionesId}")
    public ResponseEntity<HttpStatus> eliminarControlDeMejorasEnInstalaciones(@PathVariable Long controlDeMejorasEnInstalacionesId){
        try{
            controlDeMejorasEnInstalacionesServicioImpl.deleteById(controlDeMejorasEnInstalacionesId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-control-de-mejoras-en-instalaciones/{controlDeMejorasEnInstalacionesId}")
    public ResponseEntity<PControl_de_Mejoras_en_Instalaciones> modificarControlDeMejorasEnInstalaciones(@RequestBody PControl_de_Mejoras_en_Instalaciones controlDeMejorasEnInstalaciones, @PathVariable(value="controlDeMejorasEnInstalacionesId") Long controlDeMejorasEnInstalacionesId){
        Optional<PControl_de_Mejoras_en_Instalaciones> controlDeMejorasEnInstalacionesData = controlDeMejorasEnInstalacionesServicioImpl.findById(controlDeMejorasEnInstalacionesId);
        if(controlDeMejorasEnInstalacionesData.isPresent()){
            controlDeMejorasEnInstalacionesData.get().setControlDeMejorasEnInstalacionesDefecto(controlDeMejorasEnInstalaciones.getControlDeMejorasEnInstalacionesDefecto());
            controlDeMejorasEnInstalacionesData.get().setControlDeMejorasEnInstalacionesFecha(controlDeMejorasEnInstalaciones.getControlDeMejorasEnInstalacionesFecha());
            controlDeMejorasEnInstalacionesData.get().setControlDeMejorasEnInstalacionesMejoraRealizada(controlDeMejorasEnInstalaciones.getControlDeMejorasEnInstalacionesMejoraRealizada());
            controlDeMejorasEnInstalacionesData.get().setControlDeMejorasEnInstalacionesResponsable(controlDeMejorasEnInstalaciones.getControlDeMejorasEnInstalacionesResponsable());
            controlDeMejorasEnInstalacionesData.get().setControlDeMejorasEnInstalacionesSector(controlDeMejorasEnInstalaciones.getControlDeMejorasEnInstalacionesSector());
            return new ResponseEntity<>(controlDeMejorasEnInstalacionesServicioImpl.save(controlDeMejorasEnInstalacionesData.get()), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //#endregion

    //#region ABM PControl_de_Reposicion_de_Cloro

    @Autowired
    private PControl_de_Reposicion_de_CloroServicioImpl controlDeReposicionDeCloroServicioImpl;

    @GetMapping("/listar-control-de-reposicion-de-cloro")
    public List<PControl_de_Reposicion_de_Cloro> listadoControlDeReposicionDeCloro(){
        List<PControl_de_Reposicion_de_Cloro> controlDeReposicionDeCloro = StreamSupport
        .stream(controlDeReposicionDeCloroServicioImpl.findAll().spliterator(), false)
        .collect(Collectors.toList());
        return controlDeReposicionDeCloro;
    }

    @GetMapping("/buscar-control-de-reposicion-de-cloro/{controlDeReposicionDeCloroId}")
    public ResponseEntity<?> buscarControlDeReposicionDeCloroPorId(@PathVariable(value="controlDeReposicionDeCloroId") Long controlDeReposicionDeCloroId){
        Optional<PControl_de_Reposicion_de_Cloro> controlDeReposicionDeCloro = controlDeReposicionDeCloroServicioImpl.findById(controlDeReposicionDeCloroId);
        if(!controlDeReposicionDeCloro.isPresent()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(controlDeReposicionDeCloro);
    }

    @PostMapping("/agregar-control-de-reposicion-de-cloro")
    public ResponseEntity<?> agregarControlDeReposicionDeCloro(@RequestBody PControl_de_Reposicion_de_Cloro controlDeReposicionDeCloro){
        try{
            Usuario responsable = controlDeReposicionDeCloro.getControlDeReposicionDeCloroResponsable();
            if (responsable != null && responsable.getUsuarioNombre() != null) {
                Usuario usuarioExistente = usuarioRepositorio.findByUsuarioNombre(responsable.getUsuarioNombre());
                if (usuarioExistente != null) {
                    controlDeReposicionDeCloro.setControlDeReposicionDeCloroResponsable(usuarioExistente);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Surgió un problema con el usuario, intete logearse de nuevo.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No tiene un usuario asignado.");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(controlDeReposicionDeCloroServicioImpl.save(controlDeReposicionDeCloro));
        }
        catch(Exception e){
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-control-de-reposicion-de-cloro/{controlDeReposicionDeCloroId}")
    public ResponseEntity<HttpStatus> eliminarControlDeReposicionDeCloro(@PathVariable Long controlDeReposicionDeCloroId){
        try{
            controlDeReposicionDeCloroServicioImpl.deleteById(controlDeReposicionDeCloroId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-control-de-reposicion-de-cloro/{controlDeReposicionDeCloroId}")
    public ResponseEntity<PControl_de_Reposicion_de_Cloro> modificarControlDeReposicionDeCloro(@RequestBody PControl_de_Reposicion_de_Cloro controlDeReposicionDeCloro, @PathVariable(value="controlDeReposicionDeCloroId") Long controlDeReposicionDeCloroId){
        Optional<PControl_de_Reposicion_de_Cloro> controlDeReposicionDeCloroData = controlDeReposicionDeCloroServicioImpl.findById(controlDeReposicionDeCloroId);
        if(controlDeReposicionDeCloroData.isPresent()){
            controlDeReposicionDeCloroData.get().setControlDeReposicionDeCloroCantidadDeAgua(controlDeReposicionDeCloro.getControlDeReposicionDeCloroCantidadDeAgua());
            controlDeReposicionDeCloroData.get().setControlDeReposicionDeCloroCantidadDeCloroAdicionado(controlDeReposicionDeCloro.getControlDeReposicionDeCloroCantidadDeCloroAdicionado());
            controlDeReposicionDeCloroData.get().setControlDeReposicionDeCloroFecha(controlDeReposicionDeCloro.getControlDeReposicionDeCloroFecha());
            controlDeReposicionDeCloroData.get().setControlDeReposicionDeCloroObservaciones(controlDeReposicionDeCloro.getControlDeReposicionDeCloroObservaciones());
            controlDeReposicionDeCloroData.get().setControlDeReposicionDeCloroResponsable(controlDeReposicionDeCloro.getControlDeReposicionDeCloroResponsable());
            return new ResponseEntity<>(controlDeReposicionDeCloroServicioImpl.save(controlDeReposicionDeCloroData.get()), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //#endregion

    //#region ABM PControl_de_Temperatura_de_Esteralizadores

    @Autowired
    private PControl_de_Temperatura_de_EsterilizadoresServicioImpl controlDeTemperaturaDeEsterilizadoresServicioImpl;

    @GetMapping("/listar-control-de-temperatura-de-esterilizadores")
    public List<PControl_de_Temperatura_de_Esterilizadores> listadoControlDeTemperaturaDeEsterilizadores(){
        List<PControl_de_Temperatura_de_Esterilizadores> controlDeTemperaturaDeEsterilizadores = StreamSupport
        .stream(controlDeTemperaturaDeEsterilizadoresServicioImpl.findAll().spliterator(), false)
        .collect(Collectors.toList());
        return controlDeTemperaturaDeEsterilizadores;
    }

    @GetMapping("/buscar-control-de-temperatura-de-esterilizadores/{controlDeTemperaturaDeEsterilizadoresId}")
    public ResponseEntity<?> buscarControlDeTemperaturaDeEsterilizadoresPorId(@PathVariable(value="controlDeTemperaturaDeEsterilizadoresId") Long controlDeTemperaturaDeEsterilizadoresId){
        Optional<PControl_de_Temperatura_de_Esterilizadores> controlDeTemperaturaDeEsterilizadores = controlDeTemperaturaDeEsterilizadoresServicioImpl.findById(controlDeTemperaturaDeEsterilizadoresId);
        if(!controlDeTemperaturaDeEsterilizadores.isPresent()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(controlDeTemperaturaDeEsterilizadores);
    }

    @PostMapping("/agregar-control-de-temperatura-de-esterilizadores")
    public ResponseEntity<?> agregarControlDeTemperaturaDeEsterilizadores(@RequestBody PControl_de_Temperatura_de_Esterilizadores controlDeTemperaturaDeEsterilizadores){
        try{
            Usuario responsable = controlDeTemperaturaDeEsterilizadores.getControlDeTemperaturaDeEsterilizadoresResponsable();
            if (responsable != null && responsable.getUsuarioNombre() != null) {
                Usuario usuarioExistente = usuarioRepositorio.findByUsuarioNombre(responsable.getUsuarioNombre());
                if (usuarioExistente != null) {
                    controlDeTemperaturaDeEsterilizadores.setControlDeTemperaturaDeEsterilizadoresResponsable(usuarioExistente);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Surgió un problema con el usuario, intete logearse de nuevo.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No tiene un usuario asignado.");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(controlDeTemperaturaDeEsterilizadoresServicioImpl.save(controlDeTemperaturaDeEsterilizadores));
        }
        catch(Exception e){
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-control-de-temperatura-de-esterilizadores/{controlDeTemperaturaDeEsterilizadoresId}")
    public ResponseEntity<HttpStatus> eliminarControlDeTemperaturaDeEsterilizadores(@PathVariable Long controlDeTemperaturaDeEsterilizadoresId){
        try{
            controlDeTemperaturaDeEsterilizadoresServicioImpl.deleteById(controlDeTemperaturaDeEsterilizadoresId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-control-de-temperatura-de-esterilizadores/{controlDeTemperaturaDeEsterilizadoresId}")
    public ResponseEntity<PControl_de_Temperatura_de_Esterilizadores> modificarControlDeTemperaturaDeEsterilizadores(@RequestBody PControl_de_Temperatura_de_Esterilizadores controlDeTemperaturaDeEsterilizadores, @PathVariable(value="controlDeTemperaturaDeEsterilizadoresId") Long controlDeTemperaturaDeEsterilizadoresId){
        Optional<PControl_de_Temperatura_de_Esterilizadores> controlDeTemperaturaDeEsterilizadoresData = controlDeTemperaturaDeEsterilizadoresServicioImpl.findById(controlDeTemperaturaDeEsterilizadoresId);
        if(controlDeTemperaturaDeEsterilizadoresData.isPresent()){
            controlDeTemperaturaDeEsterilizadoresData.get().setControlDeTemperaturaDeEsterilizadoresFecha(controlDeTemperaturaDeEsterilizadores.getControlDeTemperaturaDeEsterilizadoresFecha());
            controlDeTemperaturaDeEsterilizadoresData.get().setControlDeTemperaturaDeEsterilizadoresObservaciones(controlDeTemperaturaDeEsterilizadores.getControlDeTemperaturaDeEsterilizadoresObservaciones());
            controlDeTemperaturaDeEsterilizadoresData.get().setControlDeTemperaturaDeEsterilizadoresResponsable(controlDeTemperaturaDeEsterilizadores.getControlDeTemperaturaDeEsterilizadoresResponsable());
            controlDeTemperaturaDeEsterilizadoresData.get().setControlDeTemperaturaDeEsterilizadoresTemperatura1(controlDeTemperaturaDeEsterilizadores.getControlDeTemperaturaDeEsterilizadoresTemperatura1());
            controlDeTemperaturaDeEsterilizadoresData.get().setControlDeTemperaturaDeEsterilizadoresTemperatura2(controlDeTemperaturaDeEsterilizadores.getControlDeTemperaturaDeEsterilizadoresTemperatura2());
            controlDeTemperaturaDeEsterilizadoresData.get().setControlDeTemperaturaDeEsterilizadoresTemperatura3(controlDeTemperaturaDeEsterilizadores.getControlDeTemperaturaDeEsterilizadoresTemperatura3());
            return new ResponseEntity<>(controlDeTemperaturaDeEsterilizadoresServicioImpl.save(controlDeTemperaturaDeEsterilizadoresData.get()), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //#endregion

    //#region ABM PControl_de_Temperatura_en_Camaras

    @Autowired
    private PControl_de_Temperatura_en_CamarasServicioImpl controlDeTemperaturaEnCamarasServicioImpl;

    @GetMapping("/listar-control-de-temperatura-en-camaras")
    public List<PControl_de_Temperatura_en_Camaras> listadoControlDeTemperaturaEnCamaras(){
        List<PControl_de_Temperatura_en_Camaras> controlDeTemperaturaEnCamaras = StreamSupport
        .stream(controlDeTemperaturaEnCamarasServicioImpl.findAll().spliterator(), false)
        .collect(Collectors.toList());
        return controlDeTemperaturaEnCamaras;
    }

    @GetMapping("/buscar-control-de-temperatura-en-camaras/{controlDeTemperaturaEnCamarasId}")
    public ResponseEntity<?> buscarControlDeTemperaturaEnCamarasPorId(@PathVariable(value="controlDeTemperaturaEnCamarasId") Long controlDeTemperaturaEnCamarasId){
        Optional<PControl_de_Temperatura_en_Camaras> controlDeTemperaturaEnCamaras = controlDeTemperaturaEnCamarasServicioImpl.findById(controlDeTemperaturaEnCamarasId);
        if(!controlDeTemperaturaEnCamaras.isPresent()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(controlDeTemperaturaEnCamaras);
    }

    @PostMapping("/agregar-control-de-temperatura-en-camaras")
    public ResponseEntity<?> agregarControlDeTemperaturaEnCamaras(@RequestBody PControl_de_Temperatura_en_Camaras controlDeTemperaturaEnCamaras){
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(controlDeTemperaturaEnCamarasServicioImpl.save(controlDeTemperaturaEnCamaras));
        }
        catch(Exception e){
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-control-de-temperatura-en-camaras/{controlDeTemperaturaEnCamarasId}")
    public ResponseEntity<HttpStatus> eliminarControlDeTemperaturaEnCamaras(@PathVariable Long controlDeTemperaturaEnCamarasId){
        try{
            controlDeTemperaturaEnCamarasServicioImpl.deleteById(controlDeTemperaturaEnCamarasId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-control-de-temperatura-en-camaras/{controlDeTemperaturaEnCamarasId}")
    public ResponseEntity<PControl_de_Temperatura_en_Camaras> modificarControlDeTemperaturaEnCamaras(@RequestBody PControl_de_Temperatura_en_Camaras controlDeTemperaturaEnCamaras, @PathVariable(value="controlDeTemperaturaEnCamarasId") Long controlDeTemperaturaEnCamarasId){
        Optional<PControl_de_Temperatura_en_Camaras> controlDeTemperaturaEnCamarasData = controlDeTemperaturaEnCamarasServicioImpl.findById(controlDeTemperaturaEnCamarasId);
        if(controlDeTemperaturaEnCamarasData.isPresent()){
            controlDeTemperaturaEnCamarasData.get().setControlDeTemperaturaEnCamaraTempExterna(controlDeTemperaturaEnCamaras.getControlDeTemperaturaEnCamaraTempExterna());
            controlDeTemperaturaEnCamarasData.get().setControlDeTemperaturaEnCamarasFecha(controlDeTemperaturaEnCamaras.getControlDeTemperaturaEnCamarasFecha());
            controlDeTemperaturaEnCamarasData.get().setControlDeTemperaturaEnCamarasHora(controlDeTemperaturaEnCamaras.getControlDeTemperaturaEnCamarasHora());
            controlDeTemperaturaEnCamarasData.get().setControlDeTemperaturaEnCamarasNroCamara(controlDeTemperaturaEnCamaras.getControlDeTemperaturaEnCamarasNroCamara());
            controlDeTemperaturaEnCamarasData.get().setControlDeTemperaturaEnCamarasTempInterna(controlDeTemperaturaEnCamaras.getControlDeTemperaturaEnCamarasTempInterna());
            return new ResponseEntity<>(controlDeTemperaturaEnCamarasServicioImpl.save(controlDeTemperaturaEnCamarasData.get()), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //#endregion

}
