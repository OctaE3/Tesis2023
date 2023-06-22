package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.insumo.PControl_de_Nitrato;
import com.chacineria.marcelina.repositorio.insumo.PControl_de_NitratoRepositorio;

@Service
public class PControl_de_NitratoServicioImpl implements PControl_de_NitratoServicio{
    
    @Autowired
    private PControl_de_NitratoRepositorio controlDeNitratoRepositorio;

    @Override
    @Transactional
    public Iterable<PControl_de_Nitrato> findAll(){
        return controlDeNitratoRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PControl_de_Nitrato> findById(Long Id){
        return controlDeNitratoRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PControl_de_Nitrato save(PControl_de_Nitrato save){
        return controlDeNitratoRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        controlDeNitratoRepositorio.deleteById(Id);
    }
}
