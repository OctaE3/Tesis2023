package com.chacineria.marcelina.servicio.control;

import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chacineria.marcelina.entidad.control.PControl_de_Cloro_Libre;
import com.chacineria.marcelina.repositorio.control.PControl_de_Cloro_LibreRepositorio;

@Service
public class PControl_de_Cloro_LibreServicioImpl implements PControl_de_Cloro_LibreServicio{
    
    @Autowired
    private PControl_de_Cloro_LibreRepositorio control_de_Cloro_LibreRepositorio;

    @Override
    @Transactional
    public Iterable<PControl_de_Cloro_Libre> findAll(){
        return control_de_Cloro_LibreRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PControl_de_Cloro_Libre> findById(Long Id){
        return control_de_Cloro_LibreRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PControl_de_Cloro_Libre save(PControl_de_Cloro_Libre save){
        return control_de_Cloro_LibreRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        control_de_Cloro_LibreRepositorio.deleteById(Id);
    }
}
