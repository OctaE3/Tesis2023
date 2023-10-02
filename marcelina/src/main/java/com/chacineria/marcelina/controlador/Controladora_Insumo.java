package com.chacineria.marcelina.controlador;

import com.chacineria.marcelina.dto.Control_de_NitratoDto;
import com.chacineria.marcelina.dto.Control_de_NitritoDto;
import com.chacineria.marcelina.dto.DiariaDeProdCarneInsumoCantidadDto;
import com.chacineria.marcelina.dto.ModificarDiariaDto;
import com.chacineria.marcelina.dto.RecepcionConCarnesDto;
import com.chacineria.marcelina.entidad.insumo.Carne;
import com.chacineria.marcelina.entidad.insumo.Control_de_Insumos;
import com.chacineria.marcelina.entidad.insumo.Lote;
import com.chacineria.marcelina.entidad.insumo.PControl_de_Nitrato;
import com.chacineria.marcelina.entidad.insumo.PControl_de_Nitrito;
import com.chacineria.marcelina.entidad.insumo.PControl_de_Productos_Quimicos;
import com.chacineria.marcelina.entidad.insumo.PDiaria_de_Produccion;
import com.chacineria.marcelina.entidad.insumo.PRecepcion_de_Materias_Primas_Carnicas;
import com.chacineria.marcelina.entidad.insumo.Producto;
import com.chacineria.marcelina.entidad.persona.Usuario;
import com.chacineria.marcelina.repositorio.persona.UsuarioRepositorio;

import java.util.ArrayList;
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

import com.chacineria.marcelina.servicio.insumo.CarneServicioImpl;
import com.chacineria.marcelina.servicio.insumo.Control_de_InsumosServicioImpl;
import com.chacineria.marcelina.servicio.insumo.LoteServicioImpl;
import com.chacineria.marcelina.servicio.insumo.PControl_de_NitratoServicioImpl;
import com.chacineria.marcelina.servicio.insumo.PControl_de_NitritoServicioImpl;
import com.chacineria.marcelina.servicio.insumo.PControl_de_Productos_QuimicosServicioImpl;
import com.chacineria.marcelina.servicio.insumo.PDiaria_de_ProduccionServicioImpl;
import com.chacineria.marcelina.servicio.insumo.PRecepcion_de_Materias_Primas_CarnicasServicioImpl;
import com.chacineria.marcelina.servicio.insumo.ProductoServicioImpl;

@Controller
@RequestMapping("/marcelina")
@RestController
public class Controladora_Insumo {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    // #region ABM Carne

    @Autowired
    private CarneServicioImpl carneServicioImpl;

    @GetMapping("/listar-carnes")
    public List<Carne> listadoCarneTodas() {
        List<Carne> carnes = StreamSupport
                .stream(carneServicioImpl.findAll().spliterator(), false)
                .collect(Collectors.toList());
        Collections.reverse(carnes);
        return carnes;
    }

    @GetMapping("/listar-carnes-no-eliminadas")
    public List<Carne> listadoCarne() {
        List<Carne> carnes = StreamSupport
                .stream(carneServicioImpl.findAllByCarneEliminado(false).spliterator(), false)
                .collect(Collectors.toList());
        Collections.reverse(carnes);
        return carnes;
    }

    @GetMapping("/listar-ultimas-carnes")
    public List<Carne> listadoCarneUltimas30() {
        List<Carne> carnes = StreamSupport
                .stream(carneServicioImpl.findAllByCarneEliminado(false).spliterator(), false)
                .collect(Collectors.toList());

        Collections.reverse(carnes);
        List<Carne> listaCarnes = new ArrayList<>();
        int length = carnes.size();

        for (int i = 0; i < length; i++) {
            if (i < 30 && carnes.get(i).getCarneCantidad() > 0 && carnes.get(i).getCarneEliminado() == false) {
                listaCarnes.add(carnes.get(i));
            } else {
                break;
            }
        }
        return listaCarnes;
    }

    @GetMapping("/buscar-carne/{carneId}")
    public ResponseEntity<?> buscarCarnePorId(@PathVariable(value = "carneId") Long carneId) {
        Optional<Carne> carne = carneServicioImpl.findById(carneId);
        if (!carne.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(carne);
    }

    @PostMapping("/agregar-carne")
    public ResponseEntity<?> agregarCarne(@RequestBody Carne carne) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(carneServicioImpl.save(carne));
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/borrar-carne/{carneId}")
    public ResponseEntity<HttpStatus> eliminarCarne(@PathVariable Long carneId) {
        try {
            Optional<Carne> carne = carneServicioImpl.findById(carneId);
            if (carne.isPresent()) {
                carne.get().setCarneEliminado(true);
                carneServicioImpl.save(carne.get());
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-carne/{carneId}")
    public ResponseEntity<Carne> modificarCarne(@RequestBody Carne carne,
            @PathVariable(value = "carneId") Long carneId) {
        Optional<Carne> carneData = carneServicioImpl.findById(carneId);
        if (carneData.isPresent()) {
            if (carne.getCarneCantidad() == 0) {
                carneData.get().setCarneNombre(carne.getCarneNombre());
                carneData.get().setCarneCantidad(carne.getCarneCantidad());
                carneData.get().setCarneCategoria(carne.getCarneCategoria());
                carneData.get().setCarneCorte(carne.getCarneCorte());
                carneData.get().setCarneTipo(carne.getCarneTipo());
                carneData.get().setCarnePaseSanitario(carne.getCarnePaseSanitario());
                carneData.get().setCarneEliminado(true);
            } else {
                carneData.get().setCarneNombre(carne.getCarneNombre());
                carneData.get().setCarneCantidad(carne.getCarneCantidad());
                carneData.get().setCarneCategoria(carne.getCarneCategoria());
                carneData.get().setCarneCorte(carne.getCarneCorte());
                carneData.get().setCarneTipo(carne.getCarneTipo());
                carneData.get().setCarnePaseSanitario(carne.getCarnePaseSanitario());
                carneData.get().setCarneEliminado(false);
            }
            return new ResponseEntity<>(carneServicioImpl.save(carneData.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // #endregion

    // #region ABM Control_de_Insumos

    @Autowired
    private Control_de_InsumosServicioImpl controlDeInsumosServicioImpl;

    @GetMapping("/listar-control-de-insumos")
    public List<Control_de_Insumos> listadoControlDeInsumosTodos() {
        List<Control_de_Insumos> controlDeInsumos = StreamSupport
                .stream(controlDeInsumosServicioImpl.findAll().spliterator(), false)
                .collect(Collectors.toList());
        Collections.reverse(controlDeInsumos);
        return controlDeInsumos;
    }

    @GetMapping("/listar-control-de-insumos-no-eliminados")
    public List<Control_de_Insumos> listadoControlDeInsumos() {
        List<Control_de_Insumos> controlDeInsumos = StreamSupport
                .stream(controlDeInsumosServicioImpl.findAllByInsumoEliminado(false).spliterator(), false)
                .collect(Collectors.toList());
        Collections.reverse(controlDeInsumos);
        return controlDeInsumos;
    }

    @GetMapping("/listar-aditivos")
    public List<Control_de_Insumos> listadoAditivos() {
        List<Control_de_Insumos> controlDeInsumos = StreamSupport
                .stream(controlDeInsumosServicioImpl.findAllByInsumoEliminadoAndInsumoTipo(false, "Aditivo")
                        .spliterator(), false)
                .collect(Collectors.toList());
        Collections.reverse(controlDeInsumos);
        return controlDeInsumos;
    }

    @GetMapping("/listar-aditivos-todos")
    public List<Control_de_Insumos> listadoAditivosTodos() {
        List<Control_de_Insumos> controlDeInsumos = StreamSupport
                .stream(controlDeInsumosServicioImpl.findAllByInsumoTipo("Aditivo")
                        .spliterator(), false)
                .collect(Collectors.toList());
        return controlDeInsumos;
    }

    @GetMapping("/buscar-control-de-insumos/{controlDeInsumosId}")
    public ResponseEntity<?> buscarControlDeInsumosPorId(
            @PathVariable(value = "controlDeInsumosId") Long controlDeInsumosId) {
        Optional<Control_de_Insumos> controlDeInsumos = controlDeInsumosServicioImpl.findById(controlDeInsumosId);
        if (!controlDeInsumos.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(controlDeInsumos);
    }

    @PostMapping("/agregar-control-de-insumos")
    public ResponseEntity<?> agregarControlDeInsumos(@RequestBody Control_de_Insumos controlDeInsumos) {
        try {
            Usuario resposable = controlDeInsumos.getInsumoResponsable();
            if (resposable != null && resposable.getUsuarioNombre() != null) {
                Usuario usuarioExistente = usuarioRepositorio.findByUsuarioNombre(resposable.getUsuarioNombre());
                if (usuarioExistente != null) {
                    controlDeInsumos.setInsumoResponsable(usuarioExistente);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Surgió un problema con el usuario, intete logearse de nuevo.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No tiene un usuario asignado.");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(controlDeInsumosServicioImpl.save(controlDeInsumos));
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/borrar-control-de-insumos/{controlDeInsumosId}")
    public ResponseEntity<HttpStatus> eliminarControlDeInsumos(@PathVariable Long controlDeInsumosId) {
        try {
            Optional<Control_de_Insumos> controlDeInsumos = controlDeInsumosServicioImpl.findById(controlDeInsumosId);
            if (controlDeInsumos.isPresent()) {
                controlDeInsumos.get().setInsumoEliminado(true);
                controlDeInsumosServicioImpl.save(controlDeInsumos.get());
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-control-de-insumos/{controlDeInsumosId}")
    public ResponseEntity<Control_de_Insumos> modificarCarne(@RequestBody Control_de_Insumos controlDeInsumos,
            @PathVariable(value = "controlDeInsumosId") Long controlDeInsumosId) {
        Optional<Control_de_Insumos> controlDeInsumosData = controlDeInsumosServicioImpl.findById(controlDeInsumosId);
        if (controlDeInsumosData.isPresent()) {
            controlDeInsumosData.get().setInsumoNombre(controlDeInsumos.getInsumoNombre());
            controlDeInsumosData.get().setInsumoFecha(controlDeInsumos.getInsumoFecha());
            controlDeInsumosData.get().setInsumoFechaVencimiento(controlDeInsumos.getInsumoFechaVencimiento());
            controlDeInsumosData.get().setInsumoNroLote(controlDeInsumos.getInsumoNroLote());
            controlDeInsumosData.get().setInsumoProveedor(controlDeInsumos.getInsumoProveedor());
            controlDeInsumosData.get().setInsumoTipo(controlDeInsumos.getInsumoTipo());
            controlDeInsumosData.get().setInsumoCantidad(controlDeInsumos.getInsumoCantidad());
            controlDeInsumosData.get().setInsumoUnidad(controlDeInsumos.getInsumoUnidad());
            controlDeInsumosData.get().setInsumoResponsable(controlDeInsumos.getInsumoResponsable());
            controlDeInsumosData.get().setInsumoMotivoDeRechazo(controlDeInsumos.getInsumoMotivoDeRechazo());

            return new ResponseEntity<>(controlDeInsumosServicioImpl.save(controlDeInsumosData.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // #endregion

    // #region ABM Lote

    @Autowired
    private LoteServicioImpl loteServicioImpl;

    @GetMapping("/listar-lotes")
    public List<Lote> listadoLoteTodos() {
        List<Lote> lotes = StreamSupport
                .stream(loteServicioImpl.findAll().spliterator(), false)
                .collect(Collectors.toList());
        Collections.reverse(lotes);
        return lotes;
    }

    @GetMapping("/listar-lotes-no-eliminados")
    public List<Lote> listadoLote() {
        List<Lote> lotes = StreamSupport
                .stream(loteServicioImpl.findAllByLoteEliminado(false).spliterator(), false)
                .collect(Collectors.toList());
        return lotes;
    }

    @GetMapping("/buscar-lote/{loteId}")
    public ResponseEntity<?> buscarLotePorId(@PathVariable(value = "loteId") Long loteId) {
        Optional<Lote> lote = loteServicioImpl.findById(loteId);
        if (!lote.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lote);
    }

    @PostMapping("/agregar-lote")
    public ResponseEntity<?> agregarLote(@RequestBody Lote lote) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(loteServicioImpl.save(lote));
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/borrar-lote/{loteId}")
    public ResponseEntity<HttpStatus> eliminarLote(@PathVariable Long loteId) {
        try {
            Optional<Lote> lote = loteServicioImpl.findById(loteId);
            if (lote.isPresent()) {
                lote.get().setLoteEliminado(true);
                lote.get().setLoteCantidad(0);
                loteServicioImpl.save(lote.get());
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-lote/{loteId}")
    public ResponseEntity<Lote> modificarLote(@RequestBody Lote lote, @PathVariable(value = "loteId") Long loteId) {
        Optional<Lote> loteData = loteServicioImpl.findById(loteId);
        if (loteData.isPresent()) {
            loteData.get().setLoteProducto(lote.getLoteProducto());
            loteData.get().setLoteCantidad(lote.getLoteCantidad());
            return new ResponseEntity<>(loteServicioImpl.save(loteData.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // #endregion

    // #region ABM PControl_de_Nitrato

    @Autowired
    private PControl_de_NitratoServicioImpl controlDeNitratoServicioImpl;

    @GetMapping("/listar-control-de-nitrato")
    public List<PControl_de_Nitrato> listadoControlDeNitrato() {
        List<PControl_de_Nitrato> controlDeNitrato = StreamSupport
                .stream(controlDeNitratoServicioImpl.findAll().spliterator(), false)
                .collect(Collectors.toList());
        Collections.reverse(controlDeNitrato);
        return controlDeNitrato;
    }

    @GetMapping("/listar-ultimos-control-de-nitrato")
    public List<PControl_de_Nitrato> listadoControlDeNitratoUltimos30() {
        List<PControl_de_Nitrato> controlDeNitrato = StreamSupport
                .stream(controlDeNitratoServicioImpl.findAll().spliterator(), false)
                .collect(Collectors.toList());

        Collections.reverse(controlDeNitrato);
        List<PControl_de_Nitrato> listaNitratos = new ArrayList<>();
        int length = controlDeNitrato.size();

        for (int i = 0; i < length; i++) {
            if (i < 30) {
                listaNitratos.add(controlDeNitrato.get(i));
            } else {
                break;
            }
        }
        return listaNitratos;
    }

    @GetMapping("/buscar-control-de-nitrato/{controlDeNitratoId}")
    public ResponseEntity<?> buscarcontrolDeNitratoPorId(
            @PathVariable(value = "controlDeNitratoId") Long controlDeNitratoId) {
        Optional<PControl_de_Nitrato> controlDeNitrato = controlDeNitratoServicioImpl.findById(controlDeNitratoId);
        if (!controlDeNitrato.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(controlDeNitrato);
    }

    @PostMapping("/agregar-control-de-nitrato")
    public ResponseEntity<?> agregarControlDeNitrato(@RequestBody PControl_de_Nitrato controlDeNitrato) {
        try {
            Usuario responsable = controlDeNitrato.getControlDeNitratoResponsable();
            if (responsable != null && responsable.getUsuarioNombre() != null) {
                Usuario usuarioExistente = usuarioRepositorio.findByUsuarioNombre(responsable.getUsuarioNombre());
                if (usuarioExistente != null) {
                    controlDeNitrato.setControlDeNitratoResponsable(usuarioExistente);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Surgió un problema con el usuario, intete logearse de nuevo.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No tiene un usuario asignado.");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(controlDeNitratoServicioImpl.save(controlDeNitrato));
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-control-de-nitrato/{controlDeNitratoId}")
    public ResponseEntity<HttpStatus> eliminarControlDeNitrato(@PathVariable Long controlDeNitratoId) {
        try {
            controlDeNitratoServicioImpl.deleteById(controlDeNitratoId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-control-de-nitrato/{controlDeNitratoId}")
    public ResponseEntity<PControl_de_Nitrato> modificarControlDeNitrato(
            @RequestBody PControl_de_Nitrato controlDeNitrato,
            @PathVariable(value = "controlDeNitratoId") Long controlDeNitratoId) {
        Optional<PControl_de_Nitrato> controlDeNitratoData = controlDeNitratoServicioImpl.findById(controlDeNitratoId);
        if (controlDeNitratoData.isPresent()) {
            controlDeNitratoData.get().setControlDeNitratoFecha(controlDeNitrato.getControlDeNitratoFecha());
            controlDeNitratoData.get()
                    .setControlDeNitratoCantidadUtilizada(controlDeNitrato.getControlDeNitratoCantidadUtilizada());
            controlDeNitratoData.get()
                    .setControlDeNitratoProductoLote(controlDeNitrato.getControlDeNitratoProductoLote());
            controlDeNitratoData.get().setControlDeNitratoStock(controlDeNitrato.getControlDeNitratoStock());
            controlDeNitratoData.get()
                    .setControlDeNitratoObservaciones(controlDeNitrato.getControlDeNitratoObservaciones());
            controlDeNitratoData.get()
                    .setControlDeNitratoResponsable(controlDeNitrato.getControlDeNitratoResponsable());
            return new ResponseEntity<>(controlDeNitratoServicioImpl.save(controlDeNitratoData.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/ultimo-nitrato")
    public Control_de_NitratoDto ultimoNitratoIngresado() {
        PControl_de_Nitrato ultimoNitrato = controlDeNitratoServicioImpl.findLastNitrato();
        if (ultimoNitrato != null) {
            Control_de_NitratoDto dto = new Control_de_NitratoDto();
            dto.setControlDeNitratoId(ultimoNitrato.getControlDeNitratoId());
            dto.setControlDeNitratoStock(ultimoNitrato.getControlDeNitratoStock());
            return dto;
        } else {
            return null;
        }
    }

    @PutMapping("/actualizar-stock-nitrato/{controlDeNitratoStock}/{controlDeNitratoId}")
    public ResponseEntity<?> actualizarStockNitrato(@PathVariable Double controlDeNitratoStock,
            @PathVariable Long controlDeNitratoId) {
        Integer resultado = controlDeNitratoServicioImpl.updateStockNitrato(controlDeNitratoStock, controlDeNitratoId);
        if (resultado > 0) {
            return ResponseEntity.status(HttpStatus.OK).body("Se actualizo el stock correctamente.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se logro actualizar el stock.");
        }
    }

    // #endregion

    // #region ABM PControl_de_Nitrito

    @Autowired
    private PControl_de_NitritoServicioImpl controlDeNitritoServicioImpl;

    @GetMapping("/listar-control-de-nitrito")
    public List<PControl_de_Nitrito> listadoControlDeNitrito() {
        List<PControl_de_Nitrito> controlDeNitrito = StreamSupport
                .stream(controlDeNitritoServicioImpl.findAll().spliterator(), false)
                .collect(Collectors.toList());
        Collections.reverse(controlDeNitrito);
        return controlDeNitrito;
    }

    @GetMapping("/buscar-control-de-nitrito/{controlDeNitritoId}")
    public ResponseEntity<?> buscarControlDeNitritoPorId(
            @PathVariable(value = "controlDeNitritoId") Long controlDeNitritoId) {
        Optional<PControl_de_Nitrito> controlDeNitrito = controlDeNitritoServicioImpl.findById(controlDeNitritoId);
        if (!controlDeNitrito.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(controlDeNitrito);
    }

    @PostMapping("/agregar-control-de-nitrito")
    public ResponseEntity<?> agregarControlDeNitrito(@RequestBody PControl_de_Nitrito controlDeNitrito) {
        try {
            Usuario responsable = controlDeNitrito.getControlDeNitritoResponsable();
            if (responsable != null && responsable.getUsuarioNombre() != null) {
                Usuario usuarioExistente = usuarioRepositorio.findByUsuarioNombre(responsable.getUsuarioNombre());
                if (usuarioExistente != null) {
                    controlDeNitrito.setControlDeNitritoResponsable(usuarioExistente);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Surgió un problema con el usuario, intete logearse de nuevo.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No tiene un usuario asignado.");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(controlDeNitritoServicioImpl.save(controlDeNitrito));
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-control-de-nitrito/{controlDeNitritoId}")
    public ResponseEntity<HttpStatus> eliminarControlDeNitrito(@PathVariable Long controlDeNitritoId) {
        try {
            controlDeNitritoServicioImpl.deleteById(controlDeNitritoId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-control-de-nitrito/{controlDeNitritoId}")
    public ResponseEntity<PControl_de_Nitrito> modificarControlDeNitrito(
            @RequestBody PControl_de_Nitrito controlDeNitrito,
            @PathVariable(value = "controlDeNitritoId") Long controlDeNitritoId) {
        Optional<PControl_de_Nitrito> controlDeNitritoData = controlDeNitritoServicioImpl.findById(controlDeNitritoId);
        if (controlDeNitritoData.isPresent()) {
            controlDeNitritoData.get().setControlDeNitritoFecha(controlDeNitrito.getControlDeNitritoFecha());
            controlDeNitritoData.get()
                    .setControlDeNitritoProductoLote(controlDeNitrito.getControlDeNitritoProductoLote());
            controlDeNitritoData.get()
                    .setControlDeNitritoCantidadUtilizada(controlDeNitrito.getControlDeNitritoCantidadUtilizada());
            controlDeNitritoData.get().setControlDeNitritoStock(controlDeNitrito.getControlDeNitritoStock());
            controlDeNitritoData.get()
                    .setControlDeNitritoObservaciones(controlDeNitrito.getControlDeNitritoObservaciones());
            controlDeNitritoData.get()
                    .setControlDeNitritoResponsable(controlDeNitrito.getControlDeNitritoResponsable());
            return new ResponseEntity<>(controlDeNitritoServicioImpl.save(controlDeNitritoData.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/ultimo-nitrito")
    public Control_de_NitritoDto ultimoNitritoIngresado() {
        PControl_de_Nitrito ultimoNitrito = controlDeNitritoServicioImpl.findLastNitrito();
        if (ultimoNitrito != null) {
            Control_de_NitritoDto dto = new Control_de_NitritoDto();
            dto.setControlDeNitritoId(ultimoNitrito.getControlDeNitritoId());
            dto.setControlDeNitritoStock(ultimoNitrito.getControlDeNitritoStock());
            return dto;
        } else {
            return null;
        }
    }

    @PutMapping("/actualizar-stock-nitrito/{controlDeNitritoStock}/{controlDeNitritoId}")
    public ResponseEntity<?> actualizarStockNitrito(@PathVariable Double controlDeNitritoStock,
            @PathVariable Long controlDeNitritoId) {
        Integer resultado = controlDeNitritoServicioImpl.updateStockNitrito(controlDeNitritoStock, controlDeNitritoId);
        if (resultado > 0) {
            return ResponseEntity.status(HttpStatus.OK).body("Se actualizo el stock correctamente.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se logro actualizar el stock.");
        }
    }

    // #endregion

    // #region ABM PControl_de_Productos_Quimicos

    @Autowired
    private PControl_de_Productos_QuimicosServicioImpl controlDeProductosQuimicosServicioImpl;

    @GetMapping("/listar-control-de-productos-quimicos")
    public List<PControl_de_Productos_Quimicos> listadoControlDeProductosQuimicos() {
        List<PControl_de_Productos_Quimicos> controlDeProductosQuimicos = StreamSupport
                .stream(controlDeProductosQuimicosServicioImpl.findAll().spliterator(), false)
                .collect(Collectors.toList());
        Collections.reverse(controlDeProductosQuimicos);
        return controlDeProductosQuimicos;
    }

    @GetMapping("/buscar-control-de-productos-quimicos/{controlDeProductosQuimicosId}")
    public ResponseEntity<?> buscarcontrolDeProductosQuimicosPorId(
            @PathVariable(value = "controlDeProductosQuimicosId") Long controlDeProductosQuimicosId) {
        Optional<PControl_de_Productos_Quimicos> controlDeProductosQuimicos = controlDeProductosQuimicosServicioImpl
                .findById(controlDeProductosQuimicosId);
        if (!controlDeProductosQuimicos.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(controlDeProductosQuimicos);
    }

    @PostMapping("/agregar-control-de-productos-quimicos")
    public ResponseEntity<?> agregarControlDeProductosQuimicos(
            @RequestBody PControl_de_Productos_Quimicos controlDeProductosQuimicos) {
        try {
            Usuario responsable = controlDeProductosQuimicos.getControlDeProductosQuimicosResponsable();
            if (responsable != null && responsable.getUsuarioNombre() != null) {
                Usuario usuarioExistente = usuarioRepositorio.findByUsuarioNombre(responsable.getUsuarioNombre());
                if (usuarioExistente != null) {
                    controlDeProductosQuimicos.setControlDeProductosQuimicosResponsable(usuarioExistente);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Surgio un problema intente logearse de nuevo.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No tiene un usuario asignado.");
            }
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(controlDeProductosQuimicosServicioImpl.save(controlDeProductosQuimicos));
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-control-de-productos-quimicos/{controlDeProductosQuimicosId}")
    public ResponseEntity<HttpStatus> eliminarControlDeProductosQuimicos(
            @PathVariable Long controlDeProductosQuimicosId) {
        try {
            controlDeProductosQuimicosServicioImpl.deleteById(controlDeProductosQuimicosId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-control-de-productos-quimicos/{controlDeProductosQuimicosId}")
    public ResponseEntity<PControl_de_Productos_Quimicos> modificarControlDeProductosQuimicos(
            @RequestBody PControl_de_Productos_Quimicos controlDeProductosQuimicos,
            @PathVariable(value = "controlDeProductosQuimicosId") Long controlDeProductosQuimicosId) {
        Optional<PControl_de_Productos_Quimicos> controlDeProductosQuimicosData = controlDeProductosQuimicosServicioImpl
                .findById(controlDeProductosQuimicosId);
        if (controlDeProductosQuimicosData.isPresent()) {
            controlDeProductosQuimicosData.get().setControlDeProductosQuimicosFecha(
                    controlDeProductosQuimicos.getControlDeProductosQuimicosFecha());
            controlDeProductosQuimicosData.get()
                    .setControlDeProductosQuimicosLote(controlDeProductosQuimicos.getControlDeProductosQuimicosLote());
            controlDeProductosQuimicosData.get().setControlDeProductosQuimicosMotivoDeRechazo(
                    controlDeProductosQuimicos.getControlDeProductosQuimicosMotivoDeRechazo());
            controlDeProductosQuimicosData.get().setControlDeProductosQuimicosProductoQuimico(
                    controlDeProductosQuimicos.getControlDeProductosQuimicosProductoQuimico());
            controlDeProductosQuimicosData.get().setControlDeProductosQuimicosProveedor(
                    controlDeProductosQuimicos.getControlDeProductosQuimicosProveedor());
            controlDeProductosQuimicosData.get().setControlDeProductosQuimicosResponsable(
                    controlDeProductosQuimicos.getControlDeProductosQuimicosResponsable());
            return new ResponseEntity<>(
                    controlDeProductosQuimicosServicioImpl.save(controlDeProductosQuimicosData.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // #endregion

    // #region ABM PDiaria_de_Produccion

    @Autowired
    private PDiaria_de_ProduccionServicioImpl diariaDeProduccionServicioImpl;

    @GetMapping("/listar-diaria-de-produccion")
    public List<PDiaria_de_Produccion> listadoDiariaDeProduccion() {
        List<PDiaria_de_Produccion> diariaDeProduccion = StreamSupport
                .stream(diariaDeProduccionServicioImpl.findAll().spliterator(), false)
                .collect(Collectors.toList());

        Collections.reverse(diariaDeProduccion);
        return diariaDeProduccion;
    }

    @GetMapping("/buscar-diaria-de-produccion/{diariaDeProduccionId}")
    public ResponseEntity<?> buscarDiariaDeProduccionPorId(
            @PathVariable(value = "diariaDeProduccionId") Long diariaDeProduccionId) {
        Optional<PDiaria_de_Produccion> diariaDeProduccion = diariaDeProduccionServicioImpl
                .findById(diariaDeProduccionId);
        if (!diariaDeProduccion.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(diariaDeProduccion);
    }

    @GetMapping("/buscar-diaria-de-produccion-lote/{loteId}")
    public ResponseEntity<?> buscarDiariaDeProduccionPorLote(
            @PathVariable(value = "loteId") Long loteId) {
        PDiaria_de_Produccion diaria = diariaDeProduccionServicioImpl.findByDiariaDeProduccionLote(loteId);
        if (diaria == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(diaria);
    }

    @PostMapping("/agregar-diaria-de-produccion")
    public ResponseEntity<?> agregarDiariaDeProduccion(@RequestBody DiariaDeProdCarneInsumoCantidadDto dto) {
        try {
            Usuario responsable = dto.getDiariaDeProduccion().getDiariaDeProduccionResponsable();
            if (responsable != null && responsable.getUsuarioNombre() != null) {
                Usuario usuarioExistente = usuarioRepositorio.findByUsuarioNombre(responsable.getUsuarioNombre());
                if (usuarioExistente != null) {
                    dto.getDiariaDeProduccion().setDiariaDeProduccionResponsable(usuarioExistente);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Surgio un problema con el usuario, intete lograrse de nuevo.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No tiene un usuario asignado.");
            }

            if (dto.getDiariaDeProduccion() != null && dto.getListaCarneCantidad() != null
                    && dto.getListaInsumoCantidad() != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(diariaDeProduccionServicioImpl.saveDiariaCantidad(
                        dto.getDiariaDeProduccion(), dto.getListaCarneCantidad(), dto.getListaInsumoCantidad(),
                        dto.getLote()));
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

    @DeleteMapping("/borrar-diaria-de-produccion/{diariaDeProduccionId}")
    public ResponseEntity<HttpStatus> eliminarDiariaDeProduccion(@PathVariable Long diariaDeProduccionId) {
        try {
            diariaDeProduccionServicioImpl.deleteById(diariaDeProduccionId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-diaria-de-produccion/{diariaDeProduccionId}")
    public ResponseEntity<PDiaria_de_Produccion> modificarDiariaDeProduccion(
            @RequestBody ModificarDiariaDto modificarDto,
            @PathVariable(value = "diariaDeProduccionId") Long diariaDeProduccionId) {
        Optional<PDiaria_de_Produccion> diariaDeProduccionData = diariaDeProduccionServicioImpl
                .findById(diariaDeProduccionId);
        if (diariaDeProduccionData.isPresent()) {
            diariaDeProduccionData.get()
                    .setDiariaDeProduccionAditivos(
                            modificarDto.getDiariaDeProduccion().getDiariaDeProduccionAditivos());
            diariaDeProduccionData.get().setDiariaDeProduccionCantidadProducida(
                    modificarDto.getDiariaDeProduccion().getDiariaDeProduccionCantidadProducida());
            diariaDeProduccionData.get()
                    .setDiariaDeProduccionEnvasado(
                            modificarDto.getDiariaDeProduccion().getDiariaDeProduccionEnvasado());
            diariaDeProduccionData.get()
                    .setDiariaDeProduccionFecha(modificarDto.getDiariaDeProduccion().getDiariaDeProduccionFecha());
            diariaDeProduccionData.get()
                    .setDiariaDeProduccionFechaVencimiento(
                            modificarDto.getDiariaDeProduccion().getDiariaDeProduccionFechaVencimiento());
            diariaDeProduccionData.get()
                    .setDiariaDeProduccionInsumosCarnicos(
                            modificarDto.getDiariaDeProduccion().getDiariaDeProduccionInsumosCarnicos());
            diariaDeProduccionData.get()
                    .setDiariaDeProduccionLote(modificarDto.getDiariaDeProduccion().getDiariaDeProduccionLote());
            diariaDeProduccionData.get()
                    .setDiariaDeProduccionProducto(
                            modificarDto.getDiariaDeProduccion().getDiariaDeProduccionProducto());
            diariaDeProduccionData.get().setDiariaDeProduccionCantidadUtilizadaCarnes(
                    modificarDto.getDiariaDeProduccion().getDiariaDeProduccionCantidadUtilizadaCarnes());
            diariaDeProduccionData.get().setDiariaDeProduccionCantidadUtilizadaInsumos(
                    modificarDto.getDiariaDeProduccion().getDiariaDeProduccionCantidadUtilizadaInsumos());
            diariaDeProduccionData.get()
                    .setDiariaDeProduccionResponsable(
                            modificarDto.getDiariaDeProduccion().getDiariaDeProduccionResponsable());
            modificarDto.setDiariaDeProduccion(diariaDeProduccionData.get());
            return new ResponseEntity<>(diariaDeProduccionServicioImpl.saveModificarDiaria(modificarDto),
                    HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // #endregion

    // #region ABM PRecepcion_de_Materias_Primas_Carnicas

    @Autowired
    private PRecepcion_de_Materias_Primas_CarnicasServicioImpl recepcionDeMateriasPrimasCarnicasServicioImpl;

    @GetMapping("/listar-recepcion-de-materias-primas-carnicas")
    public List<PRecepcion_de_Materias_Primas_Carnicas> listadoRecepcionDeMateriasPrimasCarnicas() {
        List<PRecepcion_de_Materias_Primas_Carnicas> recepcionDeMateriasPrimasCarnicas = StreamSupport
                .stream(recepcionDeMateriasPrimasCarnicasServicioImpl.findAll().spliterator(), false)
                .collect(Collectors.toList());
        Collections.reverse(recepcionDeMateriasPrimasCarnicas);
        return recepcionDeMateriasPrimasCarnicas;
    }

    @GetMapping("/buscar-recepcion-de-materias-primas-carnicas/{recepcionDeMateriasPrimasCarnicasId}")
    public ResponseEntity<?> buscarRecepcionDeMateriasPrimasCarnicasPorId(
            @PathVariable(value = "recepcionDeMateriasPrimasCarnicasId") Long recepcionDeMateriasPrimasCarnicasId) {
        Optional<PRecepcion_de_Materias_Primas_Carnicas> recepcionDeMateriasPrimasCarnicas = recepcionDeMateriasPrimasCarnicasServicioImpl
                .findById(recepcionDeMateriasPrimasCarnicasId);
        if (!recepcionDeMateriasPrimasCarnicas.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(recepcionDeMateriasPrimasCarnicas);
    }

    @PostMapping("/agregar-recepcion-de-materias-primas-carnicas")
    public ResponseEntity<?> agregarRecepcionDeMateriasPrimasCarnicas(
            @RequestBody RecepcionConCarnesDto dto) {
        try {
            Usuario responsable = dto.getRecepcionDeMateriasPrimasCarnicas()
                    .getRecepcionDeMateriasPrimasCarnicasResponsable();
            if (responsable != null && responsable.getUsuarioNombre() != null) {
                Usuario usuarioExistente = usuarioRepositorio.findByUsuarioNombre(responsable.getUsuarioNombre());
                if (usuarioExistente != null) {
                    dto.getRecepcionDeMateriasPrimasCarnicas()
                            .setRecepcionDeMateriasPrimasCarnicasResponsable(usuarioExistente);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Surgio un problema intente logearse de nuevo.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No tiene un usuario asignado.");
            }

            if (dto.getListaCarne() != null && dto.getRecepcionDeMateriasPrimasCarnicas() != null) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(recepcionDeMateriasPrimasCarnicasServicioImpl
                                .saveRecepcionCarnes(dto.getRecepcionDeMateriasPrimasCarnicas(), dto.getListaCarne()));
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

    @DeleteMapping("/borrar-recepcion-de-materias-primas-carnicas/{recepcionDeMateriasPrimasCarnicasId}")
    public ResponseEntity<HttpStatus> eliminarRecepcionDeMateriasPrimasCarnicas(
            @PathVariable Long recepcionDeMateriasPrimasCarnicasId) {
        try {
            recepcionDeMateriasPrimasCarnicasServicioImpl.deleteById(recepcionDeMateriasPrimasCarnicasId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-recepcion-de-materias-primas-carnicas/{recepcionDeMateriasPrimasCarnicasId}")
    public ResponseEntity<PRecepcion_de_Materias_Primas_Carnicas> modificarRecepcionDeMateriasPrimasCarnicas(
            @RequestBody PRecepcion_de_Materias_Primas_Carnicas recepcionDeMateriasPrimasCarnicas,
            @PathVariable(value = "recepcionDeMateriasPrimasCarnicasId") Long recepcionDeMateriasPrimasCarnicasId) {
        Optional<PRecepcion_de_Materias_Primas_Carnicas> recepcionDeMateriasPrimasCarnicasData = recepcionDeMateriasPrimasCarnicasServicioImpl
                .findById(recepcionDeMateriasPrimasCarnicasId);
        if (recepcionDeMateriasPrimasCarnicasData.isPresent()) {
            recepcionDeMateriasPrimasCarnicasData.get().setRecepcionDeMateriasPrimasCarnicasFecha(
                    recepcionDeMateriasPrimasCarnicas.getRecepcionDeMateriasPrimasCarnicasFecha());
            recepcionDeMateriasPrimasCarnicasData.get().setRecepcionDeMateriasPrimasCarnicasMotivoDeRechazo(
                    recepcionDeMateriasPrimasCarnicas.getRecepcionDeMateriasPrimasCarnicasMotivoDeRechazo());
            recepcionDeMateriasPrimasCarnicasData.get().setRecepcionDeMateriasPrimasCarnicasPaseSanitario(
                    recepcionDeMateriasPrimasCarnicas.getRecepcionDeMateriasPrimasCarnicasPaseSanitario());
            recepcionDeMateriasPrimasCarnicasData.get().setRecepcionDeMateriasPrimasCarnicasProductos(
                    recepcionDeMateriasPrimasCarnicas.getRecepcionDeMateriasPrimasCarnicasProductos());
            recepcionDeMateriasPrimasCarnicasData.get().setRecepcionDeMateriasPrimasCarnicasProveedor(
                    recepcionDeMateriasPrimasCarnicas.getRecepcionDeMateriasPrimasCarnicasProveedor());
            recepcionDeMateriasPrimasCarnicasData.get().setRecepcionDeMateriasPrimasCarnicasResponsable(
                    recepcionDeMateriasPrimasCarnicas.getRecepcionDeMateriasPrimasCarnicasResponsable());
            recepcionDeMateriasPrimasCarnicasData.get().setRecepcionDeMateriasPrimasCarnicasTemperatura(
                    recepcionDeMateriasPrimasCarnicas.getRecepcionDeMateriasPrimasCarnicasTemperatura());
            return new ResponseEntity<>(
                    recepcionDeMateriasPrimasCarnicasServicioImpl.saveModificar(recepcionDeMateriasPrimasCarnicasData.get()),
                    HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // #endregion

    // #region ABM Producto

    @Autowired
    private ProductoServicioImpl productoServicioImpl;

    @GetMapping("/listar-productos")
    public List<Producto> listadoProducto() {
        List<Producto> producto = StreamSupport
                .stream(productoServicioImpl.findAll().spliterator(), false)
                .collect(Collectors.toList());
        Collections.reverse(producto);
        return producto;
    }

    @GetMapping("/buscar-producto/{productoId}")
    public ResponseEntity<?> buscarProductoPorId(@PathVariable(value = "productoId") Long productoId) {
        Optional<Producto> producto = productoServicioImpl.findById(productoId);
        if (!producto.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(producto);
    }

    @PostMapping("/agregar-producto")
    public ResponseEntity<?> agregarProducto(@RequestBody Producto producto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(productoServicioImpl.save(producto));
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/borrar-producto/{productoId}")
    public ResponseEntity<HttpStatus> eliminarProducto(@PathVariable Long productoId) {
        try {
            Optional<Producto> producto = productoServicioImpl.findById(productoId);
            if (producto.isPresent()) {
                producto.get().setProductoEliminado(true);
                productoServicioImpl.save(producto.get());
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/añadir-producto/{productoId}")
    public ResponseEntity<HttpStatus> añadirProducto(@PathVariable Long productoId) {
        try {
            Optional<Producto> producto = productoServicioImpl.findById(productoId);
            if (producto.isPresent()) {
                producto.get().setProductoEliminado(false);
                productoServicioImpl.save(producto.get());
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-producto/{productoId}")
    public ResponseEntity<Producto> modificarProducto(@RequestBody Producto producto,
            @PathVariable(value = "productoId") Long productoId) {
        Optional<Producto> productoData = productoServicioImpl.findById(productoId);
        if (productoData.isPresent()) {
            productoData.get().setProductoNombre(producto.getProductoNombre());
            return new ResponseEntity<>(productoServicioImpl.save(productoData.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // #endregion

}
