package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.insumo.PControl_de_Productos_Quimicos;
import com.chacineria.marcelina.repositorio.insumo.PControl_de_Productos_QuimicosRepositorio;

@Service
public class PControl_de_Productos_QuimicosServicioImpl implements PControl_de_Productos_QuimicosServicio{
    
    @Autowired
    private PControl_de_Productos_QuimicosRepositorio controlDeProductosQuimicosRepositorio;

    @Override
    @Transactional
    public Iterable<PControl_de_Productos_Quimicos> findAll(){
        return controlDeProductosQuimicosRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PControl_de_Productos_Quimicos> findById(Long Id){
        return controlDeProductosQuimicosRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PControl_de_Productos_Quimicos save(PControl_de_Productos_Quimicos save){
        return controlDeProductosQuimicosRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        controlDeProductosQuimicosRepositorio.deleteById(Id);
    }
}
