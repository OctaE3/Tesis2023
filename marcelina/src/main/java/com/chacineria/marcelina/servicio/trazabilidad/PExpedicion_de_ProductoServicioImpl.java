package com.chacineria.marcelina.servicio.trazabilidad;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.trazabilidad.PExpedicion_de_Producto;
import com.chacineria.marcelina.repositorio.trazabilidad.PExpedicion_de_ProductoRepositorio;

@Service
public class PExpedicion_de_ProductoServicioImpl implements PExpedicion_de_ProductoServicio{
    
    @Autowired
    private PExpedicion_de_ProductoRepositorio expedicionDeProductoRepositorio;

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
    public PExpedicion_de_Producto save(PExpedicion_de_Producto save){
        return expedicionDeProductoRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        expedicionDeProductoRepositorio.deleteById(Id);
    }
}
