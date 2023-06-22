package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.insumo.PDiaria_de_Produccion;
import com.chacineria.marcelina.repositorio.insumo.PDiaria_de_ProduccionRepositorio;

@Service
public class PDiaria_de_ProduccionServicioImpl implements PDiaria_de_ProduccionServicio{
    
    @Autowired
    private PDiaria_de_ProduccionRepositorio diariaDeProduccionRepositorio;

    @Override
    @Transactional
    public Iterable<PDiaria_de_Produccion> findAll(){
        return diariaDeProduccionRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PDiaria_de_Produccion> findById(Long Id){
        return diariaDeProduccionRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PDiaria_de_Produccion save(PDiaria_de_Produccion save){
        return diariaDeProduccionRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        diariaDeProduccionRepositorio.deleteById(Id);
    }
}
