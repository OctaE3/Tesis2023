package com.chacineria.marcelina.servicio.control;

import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chacineria.marcelina.entidad.control.PControl_de_Temperatura_de_Esterilizadores;
import com.chacineria.marcelina.repositorio.control.PControl_de_Temperatura_de_EsterilizadoresRepositorio;

@Service
public class PControl_de_Temperatura_de_EsterilizadoresServicioImpl implements PControl_de_Temperatura_de_EsterilizadoresServicio{
    
    @Autowired
    private PControl_de_Temperatura_de_EsterilizadoresRepositorio control_de_Temperatura_de_EsterilizadoresRepositorio;

    @Override
    @Transactional
    public Iterable<PControl_de_Temperatura_de_Esterilizadores> findAll(){
        return control_de_Temperatura_de_EsterilizadoresRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PControl_de_Temperatura_de_Esterilizadores> findById(Long Id){
        return control_de_Temperatura_de_EsterilizadoresRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PControl_de_Temperatura_de_Esterilizadores save(PControl_de_Temperatura_de_Esterilizadores save){
        return control_de_Temperatura_de_EsterilizadoresRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        control_de_Temperatura_de_EsterilizadoresRepositorio.deleteById(Id);
    }
}
