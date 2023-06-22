package com.chacineria.marcelina.servicio.control;

import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chacineria.marcelina.entidad.control.PControl_de_Reposicion_de_Cloro;
import com.chacineria.marcelina.repositorio.control.PControl_de_Reposicion_de_CloroRepositorio;

@Service
public class PControl_de_Reposicion_de_CloroServicioImpl implements PControl_de_Reposicion_de_CloroServicio{
    
    @Autowired
    private PControl_de_Reposicion_de_CloroRepositorio control_de_Reposicion_de_CloroRepositorio;

    @Override
    @Transactional
    public Iterable<PControl_de_Reposicion_de_Cloro> findAll(){
        return control_de_Reposicion_de_CloroRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PControl_de_Reposicion_de_Cloro> findById(Long Id){
        return control_de_Reposicion_de_CloroRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PControl_de_Reposicion_de_Cloro save(PControl_de_Reposicion_de_Cloro save){
        return control_de_Reposicion_de_CloroRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        control_de_Reposicion_de_CloroRepositorio.deleteById(Id);
    }
}
