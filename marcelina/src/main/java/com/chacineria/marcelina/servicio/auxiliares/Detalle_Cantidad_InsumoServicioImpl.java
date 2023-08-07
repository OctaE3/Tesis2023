package com.chacineria.marcelina.servicio.auxiliares;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Insumo;
import com.chacineria.marcelina.repositorio.auixiliares.Detalle_Cantidad_InsumoRepositorio;

@Service
public class Detalle_Cantidad_InsumoServicioImpl implements Detalle_Cantidad_InsumoServicio {
    
    @Autowired
    private Detalle_Cantidad_InsumoRepositorio detalleCantidadInsumoRepositorio;

    @Override
    @Transactional
    public Iterable<Detalle_Cantidad_Insumo> findAll() {
        return detalleCantidadInsumoRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<Detalle_Cantidad_Insumo> findById(Long id) {
        return detalleCantidadInsumoRepositorio.findById(id);
    }

    @Override
    @Transactional
    public Detalle_Cantidad_Insumo save(Detalle_Cantidad_Insumo save) {
        return detalleCantidadInsumoRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id) {
        detalleCantidadInsumoRepositorio.deleteById(Id);
    }
}
