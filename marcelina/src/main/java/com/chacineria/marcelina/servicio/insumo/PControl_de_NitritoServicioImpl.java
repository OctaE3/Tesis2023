package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.insumo.PControl_de_Nitrito;
import com.chacineria.marcelina.repositorio.insumo.PControl_de_NitritoRepositorio;

@Service
public class PControl_de_NitritoServicioImpl implements PControl_de_NitritoServicio{
    
    @Autowired
    private PControl_de_NitritoRepositorio controlDeNitritoRepositorio;

    @Override
    @Transactional
    public Iterable<PControl_de_Nitrito> findAll(){
        return controlDeNitritoRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PControl_de_Nitrito> findById(Long Id){
        return controlDeNitritoRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PControl_de_Nitrito save(PControl_de_Nitrito save){
        return controlDeNitritoRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        controlDeNitritoRepositorio.deleteById(Id);
    }

    public PControl_de_Nitrito findLastNitrito() {
        return controlDeNitritoRepositorio.findLastNitrito();
    }

    public Integer updateStockNitrito(Double Stock, Long Id) {
        return controlDeNitritoRepositorio.updateStockNitrito(Stock, Id);
    }
}
