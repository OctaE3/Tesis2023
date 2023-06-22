package com.chacineria.marcelina.servicio.control;

import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chacineria.marcelina.entidad.control.PControl_de_Temperatura_en_Camaras;
import com.chacineria.marcelina.repositorio.control.PControl_de_Temperatura_en_CamarasRepositorio;

@Service
public class PControl_de_Temperatura_en_CamarasServicioImpl implements PControl_de_Temperatura_en_CamarasServicio{
   
    @Autowired
    private PControl_de_Temperatura_en_CamarasRepositorio control_de_Temperatura_en_CamarasRepositorio;

    @Override
    @Transactional
    public Iterable<PControl_de_Temperatura_en_Camaras> findAll(){
        return control_de_Temperatura_en_CamarasRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PControl_de_Temperatura_en_Camaras> findById(Long Id){
        return control_de_Temperatura_en_CamarasRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PControl_de_Temperatura_en_Camaras save(PControl_de_Temperatura_en_Camaras save){
        return control_de_Temperatura_en_CamarasRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        control_de_Temperatura_en_CamarasRepositorio.deleteById(Id);
    }
}
