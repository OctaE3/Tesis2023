package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chacineria.marcelina.entidad.insumo.Control_de_Insumos;
import com.chacineria.marcelina.repositorio.insumo.Control_de_InsumosRepositorio;

@Service
public class Control_de_InsumosServicioImpl implements Control_de_InsumosServicio{
    
    @Autowired
    private Control_de_InsumosRepositorio controlDeInsumosRepositorio;

    @Override
    @Transactional
    public Iterable<Control_de_Insumos> findAll(){
        return controlDeInsumosRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<Control_de_Insumos> findById(Long Id){
        return controlDeInsumosRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public Control_de_Insumos save(Control_de_Insumos save){
        return controlDeInsumosRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        controlDeInsumosRepositorio.deleteById(Id);
    }
}
