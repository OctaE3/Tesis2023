package com.chacineria.marcelina.servicio.trazabilidad;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.trazabilidad.PResumen_de_Trazabilidad;
import com.chacineria.marcelina.repositorio.trazabilidad.PResumen_de_TrazabilidadRepositorio;

@Service
public class PResumen_de_TrazabilidadServicioImpl implements PResumen_de_TrazabilidadServicio {

    @Autowired
    private PResumen_de_TrazabilidadRepositorio resumenDeTrazabilidadRepositorio;

    @Override
    @Transactional
    public Iterable<PResumen_de_Trazabilidad> findAll() {
        return resumenDeTrazabilidadRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PResumen_de_Trazabilidad> findById(Long Id) {
        return resumenDeTrazabilidadRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PResumen_de_Trazabilidad save(PResumen_de_Trazabilidad save) {
        return resumenDeTrazabilidadRepositorio.save(save);
    }

    @Override
    @Transactional
    public List<PResumen_de_Trazabilidad> saveAll(List<PResumen_de_Trazabilidad> save) {
        return resumenDeTrazabilidadRepositorio.saveAll(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id) {
        resumenDeTrazabilidadRepositorio.deleteById(Id);
    }
}
