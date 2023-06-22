package com.chacineria.marcelina.servicio.trazabilidad;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.trazabilidad.PMonitoreo_de_SSOP_Operativo;
import com.chacineria.marcelina.repositorio.trazabilidad.PMonitoreo_de_SSOP_OperativoRepositorio;

@Service
public class PMonitoreo_de_SSOP_OperativoServicioImpl implements PMonitoreo_de_SSOP_OperativoServicio{
    
    @Autowired
    private PMonitoreo_de_SSOP_OperativoRepositorio monitoreoDeSSOPOperativoRepositorio;

    @Override
    @Transactional
    public Iterable<PMonitoreo_de_SSOP_Operativo> findAll(){
        return monitoreoDeSSOPOperativoRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PMonitoreo_de_SSOP_Operativo> findById(Long Id){
        return monitoreoDeSSOPOperativoRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PMonitoreo_de_SSOP_Operativo save(PMonitoreo_de_SSOP_Operativo save){
        return monitoreoDeSSOPOperativoRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        monitoreoDeSSOPOperativoRepositorio.deleteById(Id);
    }
}
