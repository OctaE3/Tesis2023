package com.chacineria.marcelina.servicio.control;

import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chacineria.marcelina.entidad.control.PControl_de_Mejoras_en_Instalaciones;
import com.chacineria.marcelina.repositorio.control.PControl_de_Mejoras_en_InstalacionesRepositorio;

@Service
public class PControl_de_Mejoras_en_InstalacionesServicioImpl implements PControl_de_Mejoras_en_InstalacionesServicio{
    
    @Autowired
    private PControl_de_Mejoras_en_InstalacionesRepositorio control_de_Mejoras_en_InstalacionesRepositorio;

    @Override
    @Transactional
    public Iterable<PControl_de_Mejoras_en_Instalaciones> findAll(){
        return control_de_Mejoras_en_InstalacionesRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PControl_de_Mejoras_en_Instalaciones> findById(Long Id){
        return control_de_Mejoras_en_InstalacionesRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PControl_de_Mejoras_en_Instalaciones save(PControl_de_Mejoras_en_Instalaciones save){
        return control_de_Mejoras_en_InstalacionesRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        control_de_Mejoras_en_InstalacionesRepositorio.deleteById(Id);
    }
}
