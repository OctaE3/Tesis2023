package com.chacineria.marcelina.servicio.auxiliares;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Lote;
import com.chacineria.marcelina.repositorio.auixiliares.Detalle_Cantidad_LoteRepositorio;

@Service
public class Detalle_Cantidad_LoteServicioImpl implements Detalle_Cantidad_LoteServicio {

    @Autowired
    private Detalle_Cantidad_LoteRepositorio detalleCantidadLoteRepositorio;

    @Override
    @Transactional
    public Iterable<Detalle_Cantidad_Lote> findAll() {
        return detalleCantidadLoteRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<Detalle_Cantidad_Lote> findById(Long id) {
        return detalleCantidadLoteRepositorio.findById(id);
    }

    @Override
    @Transactional
    public Detalle_Cantidad_Lote save(Detalle_Cantidad_Lote save) {
        return detalleCantidadLoteRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id) {
        detalleCantidadLoteRepositorio.deleteById(Id);
    }
}
