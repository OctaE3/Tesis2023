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

import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Carne;
import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Insumo;
import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Lote;
import com.chacineria.marcelina.servicio.auxiliares.Detalle_Cantidad_CarneServicioImpl;
import com.chacineria.marcelina.servicio.auxiliares.Detalle_Cantidad_InsumoServicioImpl;
import com.chacineria.marcelina.servicio.auxiliares.Detalle_Cantidad_LoteServicioImpl;

@Controller
@RequestMapping("/marcelina")
@RestController
public class Controladora_Auxiliar {

    // #region ABM Detalle_Cantidad_Carne

    @Autowired
    private Detalle_Cantidad_CarneServicioImpl detalleCantidadCarneServicioImpl;

    @GetMapping("/listar-detalle-cantidad-carne")
    public List<Detalle_Cantidad_Carne> listadoDetalleCantidadCarne() {
        List<Detalle_Cantidad_Carne> detalleCantidadCarnes = StreamSupport
                .stream(detalleCantidadCarneServicioImpl.findAll().spliterator(), false)
                .collect(Collectors.toList());
        return detalleCantidadCarnes;
    }

    @GetMapping("/buscar-detalle-cantidad-carne/{detalleCantidadCarneId}")
    public ResponseEntity<?> buscarDetalleCantidadCarnePorId(@PathVariable(value = "detalleCantidadCarneId") Long detalleCantidadCarneId) {
        Optional<Detalle_Cantidad_Carne> detalleCantidadCarne = detalleCantidadCarneServicioImpl.findById(detalleCantidadCarneId);
        if (!detalleCantidadCarne.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(detalleCantidadCarne);
    }

    @PostMapping("/agregar-detalle-cantidad-carne")
    public ResponseEntity<?> agregarDetalleCantidadCarne(@RequestBody Detalle_Cantidad_Carne detalleCantidadCarne) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(detalleCantidadCarneServicioImpl.save(detalleCantidadCarne));
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-detalle-cantidad-carne/{detalleCantidadCarneId}")
    public ResponseEntity<HttpStatus> eliminarDetalleCantidadCarne(@PathVariable Long detalleCantidadCarneId) {
        try {
            detalleCantidadCarneServicioImpl.deleteById(detalleCantidadCarneId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-detalle-cantidad-carne/{detalleCantidadCarneId}")
    public ResponseEntity<Detalle_Cantidad_Carne> modificarDetalleCantidadCarne(@RequestBody Detalle_Cantidad_Carne detalleCantidadCarne,
            @PathVariable(value = "detalleCantidadCarneId") Long detalleCantidadCarneId) {
        Optional<Detalle_Cantidad_Carne> detalleCantidadCarneData = detalleCantidadCarneServicioImpl.findById(detalleCantidadCarneId);
        if (detalleCantidadCarneData.isPresent()) {
            detalleCantidadCarneData.get().setDetalleCantidadCarneCarne(detalleCantidadCarne.getDetalleCantidadCarneCarne());
            detalleCantidadCarneData.get().setDetalleCantidadCarneDiariaDeProd(detalleCantidadCarne.getDetalleCantidadCarneDiariaDeProd());
            detalleCantidadCarneData.get().setDetalleCantidadCarneCantidad(detalleCantidadCarne.getDetalleCantidadCarneCantidad());
            return new ResponseEntity<>(detalleCantidadCarneServicioImpl.save(detalleCantidadCarneData.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // #endregion

    //#region ABM Detalle_Cantidad_Insumo

    @Autowired
    private Detalle_Cantidad_InsumoServicioImpl detalleCantidadInsumoServicioImpl;

    @GetMapping("/listar-detalle-cantidad-insumo")
    public List<Detalle_Cantidad_Insumo> listadoDetalleCantidadInsumo() {
        List<Detalle_Cantidad_Insumo> detalleCantidadInsumos = StreamSupport
                .stream(detalleCantidadInsumoServicioImpl.findAll().spliterator(), false)
                .collect(Collectors.toList());
        return detalleCantidadInsumos;
    }

    @GetMapping("/buscar-detalle-cantidad-insumo/{detalleCantidadInsumoId}")
    public ResponseEntity<?> buscarDetalleCantidadInsumoPorId(@PathVariable(value = "detalleCantidadInsumoId") Long detalleCantidadInsumoId) {
        Optional<Detalle_Cantidad_Insumo> detalleCantidadInsumo = detalleCantidadInsumoServicioImpl.findById(detalleCantidadInsumoId);
        if (!detalleCantidadInsumo.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(detalleCantidadInsumo);
    }

    @PostMapping("/agregar-detalle-cantidad-insumo")
    public ResponseEntity<?> agregarDetalleCantidadInsumo(@RequestBody Detalle_Cantidad_Insumo detalleCantidadInsumo) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(detalleCantidadInsumoServicioImpl.save(detalleCantidadInsumo));
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-detalle-cantidad-insumo/{detalleCantidadInsumoId}")
    public ResponseEntity<HttpStatus> eliminarDetalleCantidadInsumo(@PathVariable Long detalleCantidadInsumoId) {
        try {
            detalleCantidadInsumoServicioImpl.deleteById(detalleCantidadInsumoId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-detalle-cantidad-insumo/{detalleCantidadInsumoId}")
    public ResponseEntity<Detalle_Cantidad_Insumo> modificarDetalleCantidadInsumo(@RequestBody Detalle_Cantidad_Insumo detalleCantidadInsumo,
            @PathVariable(value = "detalleCantidadInsumoId") Long detalleCantidadInsumoId) {
        Optional<Detalle_Cantidad_Insumo> detalleCantidadInsumoData = detalleCantidadInsumoServicioImpl.findById(detalleCantidadInsumoId);
        if (detalleCantidadInsumoData.isPresent()) {
            detalleCantidadInsumoData.get().setDetalleCantidadInsumoInsumo(detalleCantidadInsumo.getDetalleCantidadInsumoInsumo());
            detalleCantidadInsumoData.get().setDetalleCantidadInsumoDiariaDeProd(detalleCantidadInsumo.getDetalleCantidadInsumoDiariaDeProd());
            detalleCantidadInsumoData.get().setDetalleCantidadInsumoCantidad(detalleCantidadInsumo.getDetalleCantidadInsumoCantidad());
            return new ResponseEntity<>(detalleCantidadInsumoServicioImpl.save(detalleCantidadInsumoData.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //#endregion

    //#region ABM Detalle_Cantida_Lote

    @Autowired
    private Detalle_Cantidad_LoteServicioImpl detalleCantidadLoteServicioImpl;

    @GetMapping("/listar-detalle-cantidad-lote")
    public List<Detalle_Cantidad_Lote> listadoDetalleCantidadLote() {
        List<Detalle_Cantidad_Lote> detalleCantidadLotes = StreamSupport
                .stream(detalleCantidadLoteServicioImpl.findAll().spliterator(), false)
                .collect(Collectors.toList());
        return detalleCantidadLotes;
    }

    @GetMapping("/buscar-detalle-cantidad-lote/{detalleCantidadLoteId}")
    public ResponseEntity<?> buscarDetalleCantidadLotePorId(@PathVariable(value = "detalleCantidadLoteId") Long detalleCantidadLoteId) {
        Optional<Detalle_Cantidad_Lote> detalleCantidadLote = detalleCantidadLoteServicioImpl.findById(detalleCantidadLoteId);
        if (!detalleCantidadLote.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(detalleCantidadLote);
    }

    @PostMapping("/agregar-detalle-cantidad-lote")
    public ResponseEntity<?> agregarDetalleCantidadLote(@RequestBody Detalle_Cantidad_Lote detalleCantidadLote) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(detalleCantidadLoteServicioImpl.save(detalleCantidadLote));
        } catch (Exception e) {
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-detalle-cantidad-lote/{detalleCantidadLoteId}")
    public ResponseEntity<HttpStatus> eliminarDetalleCantidadLote(@PathVariable Long detalleCantidadLoteId) {
        try {
            detalleCantidadLoteServicioImpl.deleteById(detalleCantidadLoteId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-detalle-cantidad-lote/{detalleCantidadLoteId}")
    public ResponseEntity<Detalle_Cantidad_Lote> modificarDetalleCantidadLote(@RequestBody Detalle_Cantidad_Lote detalleCantidadLote,
            @PathVariable(value = "detalleCantidadLoteId") Long detalleCantidadLoteId) {
        Optional<Detalle_Cantidad_Lote> detalleCantidadLoteData = detalleCantidadLoteServicioImpl.findById(detalleCantidadLoteId);
        if (detalleCantidadLoteData.isPresent()) {
            detalleCantidadLoteData.get().setDetalleCantidadLoteLote(detalleCantidadLote.getDetalleCantidadLoteLote());
            detalleCantidadLoteData.get().setDetalleCantidadLoteExpDeProducto(detalleCantidadLote.getDetalleCantidadLoteExpDeProducto());
            detalleCantidadLoteData.get().setDetalleCantidadLoteCantidadVendida(detalleCantidadLote.getDetalleCantidadLoteCantidadVendida());
            return new ResponseEntity<>(detalleCantidadLoteServicioImpl.save(detalleCantidadLoteData.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //#endregion

}
