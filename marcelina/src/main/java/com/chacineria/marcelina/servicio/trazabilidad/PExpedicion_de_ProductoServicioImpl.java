package com.chacineria.marcelina.servicio.trazabilidad;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Lote;
import com.chacineria.marcelina.entidad.trazabilidad.PExpedicion_de_Producto;
import com.chacineria.marcelina.repositorio.auixiliares.Detalle_Cantidad_LoteRepositorio;
import com.chacineria.marcelina.repositorio.trazabilidad.PExpedicion_de_ProductoRepositorio;

@Service
public class PExpedicion_de_ProductoServicioImpl implements PExpedicion_de_ProductoServicio{
    
    @Autowired
    private PExpedicion_de_ProductoRepositorio expedicionDeProductoRepositorio;

    @Autowired
    private Detalle_Cantidad_LoteRepositorio detalleCantidadLoteRepositorio;

    @Override
    @Transactional
    public Iterable<PExpedicion_de_Producto> findAll(){
        return expedicionDeProductoRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PExpedicion_de_Producto> findById(Long Id){
        return expedicionDeProductoRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PExpedicion_de_Producto save(PExpedicion_de_Producto save) {
        return expedicionDeProductoRepositorio.save(save);
    }

    @Override
    @Transactional
    public PExpedicion_de_Producto saveExpCantidad(PExpedicion_de_Producto expedicionDeProducto, Set<Detalle_Cantidad_Lote> listaCantidad){
        Set<PExpedicion_de_Producto> exp = new HashSet<>();
        exp.add(expedicionDeProducto);
        for(Detalle_Cantidad_Lote cantidad : listaCantidad) {
            cantidad.setDetalleCantidadLoteExpDeProducto(exp);
            detalleCantidadLoteRepositorio.save(cantidad);
        }

        expedicionDeProducto.setExpedicionDeProductoCantidad(listaCantidad);
        return expedicionDeProductoRepositorio.save(expedicionDeProducto);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        expedicionDeProductoRepositorio.deleteById(Id);
    }
}
