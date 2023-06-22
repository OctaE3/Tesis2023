package com.chacineria.marcelina.servicio.trazabilidad;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.trazabilidad.PMonitoreo_de_SSOP_PreOperativo;
import com.chacineria.marcelina.repositorio.trazabilidad.PMonitoreo_de_SSOP_PreOperativoRepositorio;

@Service
public class PMonitoreo_de_SSOP_PreOperativoServicioImpl implements PMonitoreo_de_SSOP_PreOperativoServicio{
    
    @Autowired
    private PMonitoreo_de_SSOP_PreOperativoRepositorio monitoreoDeSSOPPreOperativoRepositorio;

    @Override
    @Transactional
    public Iterable<PMonitoreo_de_SSOP_PreOperativo> findAll(){
        return monitoreoDeSSOPPreOperativoRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PMonitoreo_de_SSOP_PreOperativo> findById(Long Id){
        return monitoreoDeSSOPPreOperativoRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PMonitoreo_de_SSOP_PreOperativo save(PMonitoreo_de_SSOP_PreOperativo save){
        return monitoreoDeSSOPPreOperativoRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        monitoreoDeSSOPPreOperativoRepositorio.deleteById(Id);
    }
}
