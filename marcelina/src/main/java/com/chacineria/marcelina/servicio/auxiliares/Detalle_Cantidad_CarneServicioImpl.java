package com.chacineria.marcelina.servicio.auxiliares;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Carne;
import com.chacineria.marcelina.repositorio.auixiliares.Detalle_Cantidad_CarneRepositorio;

@Service
public class Detalle_Cantidad_CarneServicioImpl implements Detalle_Cantidad_CarneServicio{

    @Autowired
    private Detalle_Cantidad_CarneRepositorio detalleCantidadCarneRepositorio;

    @Override
    @Transactional
    public Iterable<Detalle_Cantidad_Carne> findAll() {
        return detalleCantidadCarneRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<Detalle_Cantidad_Carne> findById(Long id) {
        return detalleCantidadCarneRepositorio.findById(id);
    }

    @Override
    @Transactional
    public Detalle_Cantidad_Carne save(Detalle_Cantidad_Carne save) {
        return detalleCantidadCarneRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id) {
        detalleCantidadCarneRepositorio.deleteById(Id);
    }
    
}
