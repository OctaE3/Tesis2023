package com.chacineria.marcelina.servicio.trazabilidad;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.dto.ModificarExpedicionDto;
import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Lote;
import com.chacineria.marcelina.entidad.insumo.Lote;
import com.chacineria.marcelina.entidad.trazabilidad.PExpedicion_de_Producto;
import com.chacineria.marcelina.repositorio.auixiliares.Detalle_Cantidad_LoteRepositorio;
import com.chacineria.marcelina.repositorio.insumo.LoteRepositorio;
import com.chacineria.marcelina.repositorio.trazabilidad.PExpedicion_de_ProductoRepositorio;

@Service
public class PExpedicion_de_ProductoServicioImpl implements PExpedicion_de_ProductoServicio {

    @Autowired
    private PExpedicion_de_ProductoRepositorio expedicionDeProductoRepositorio;

    @Autowired
    private Detalle_Cantidad_LoteRepositorio detalleCantidadLoteRepositorio;

    @Autowired
    private LoteRepositorio loteRepositorio;

    @Override
    @Transactional
    public Iterable<PExpedicion_de_Producto> findAll() {
        return expedicionDeProductoRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PExpedicion_de_Producto> findById(Long Id) {
        return expedicionDeProductoRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PExpedicion_de_Producto save(PExpedicion_de_Producto save) {
        return expedicionDeProductoRepositorio.save(save);
    }

    @Transactional
    public void eliminarDetallesSinAsignar() {
        List<PExpedicion_de_Producto> listaExpedicion = expedicionDeProductoRepositorio.findAll();
        List<Detalle_Cantidad_Lote> listaDetalleLote = detalleCantidadLoteRepositorio.findAll();

        List<Detalle_Cantidad_Lote> detalleLoteDeExpedicion = new ArrayList<>();
        List<Detalle_Cantidad_Lote> detalleLoteSinAsignar = new ArrayList<>();

        for (PExpedicion_de_Producto expedicion : listaExpedicion) {
            detalleLoteDeExpedicion.addAll(expedicion.getExpedicionDeProductoCantidad());
        }

        for (Detalle_Cantidad_Lote detalle : listaDetalleLote) {
            if (!detalleLoteDeExpedicion.contains(detalle)) {
                detalleLoteSinAsignar.add(detalle);
            }
        }

        for (Detalle_Cantidad_Lote detalleEliminar : detalleLoteSinAsignar) {
            detalleCantidadLoteRepositorio.deleteById(detalleEliminar.getDetalleCantidadLoteId());
        }
    }

    @Transactional
    public PExpedicion_de_Producto saveExpModificar(ModificarExpedicionDto save) {
        Set<PExpedicion_de_Producto> exp = new HashSet<>();
        Set<Lote> lotes = save.getExpedicionDeProducto().getExpedicionDeProductoLotes();
        List<Lote> lotesDesusados = save.getListaLotesDesusados();
        Set<Detalle_Cantidad_Lote> detalleLotes = save.getExpedicionDeProducto().getExpedicionDeProductoCantidad();

        for (Lote lote : lotes) {
            if (lote.getLoteCantidad() == 0) {
                lote.setLoteEliminado(true);
            }
            loteRepositorio.save(lote);
        }

        if (lotesDesusados.size() > 0) {
            for (Lote lote : lotesDesusados) {
                if (lote.getLoteCantidad() > 0) {
                    lote.setLoteEliminado(false);
                    loteRepositorio.save(lote);
                } else {
                    lote.setLoteEliminado(true);
                    loteRepositorio.save(lote);
                }
            }
        }

        exp.add(save.getExpedicionDeProducto());

        for (Detalle_Cantidad_Lote detalle : detalleLotes) {
            detalle.setDetalleCantidadLoteExpDeProducto(exp);
            detalleCantidadLoteRepositorio.save(detalle);
        }

        PExpedicion_de_Producto guardado = expedicionDeProductoRepositorio.save(save.getExpedicionDeProducto());
        eliminarDetallesSinAsignar();
        return guardado;
    }

    @Override
    @Transactional
    public PExpedicion_de_Producto saveExpCantidad(PExpedicion_de_Producto expedicionDeProducto,
            Set<Detalle_Cantidad_Lote> listaCantidad) {
        Set<PExpedicion_de_Producto> exp = new HashSet<>();
        exp.add(expedicionDeProducto);

        for (Lote lote : expedicionDeProducto.getExpedicionDeProductoLotes()) {
            if (lote.getLoteCantidad().equals(0)) {
                lote.setLoteEliminado(true);
                loteRepositorio.save(lote);
            } else {
                loteRepositorio.save(lote);
            }
        }

        for (Detalle_Cantidad_Lote cantidad : listaCantidad) {
            cantidad.setDetalleCantidadLoteExpDeProducto(exp);
            detalleCantidadLoteRepositorio.save(cantidad);
        }

        expedicionDeProducto.setExpedicionDeProductoCantidad(listaCantidad);
        return expedicionDeProductoRepositorio.save(expedicionDeProducto);
    }

    @Override
    @Transactional
    public void deleteById(Long Id) {
        expedicionDeProductoRepositorio.deleteById(Id);
    }
}
