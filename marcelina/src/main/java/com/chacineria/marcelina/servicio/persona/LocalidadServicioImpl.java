package com.chacineria.marcelina.servicio.persona;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.persona.Localidad;
import com.chacineria.marcelina.repositorio.persona.LocalidadRepositorio;

@Service
public class LocalidadServicioImpl implements LocalidadServicio{
    
    @Autowired
    private LocalidadRepositorio localidadRepositorio;

    @Override
    @Transactional
    public Iterable<Localidad> findAll(){
        return localidadRepositorio.findAll();
    }

    @Override
    @Transactional
    public Iterable<Localidad> findAllByLocalidadEliminado(Boolean eliminado){
        return localidadRepositorio.findAllByLocalidadEliminado(eliminado);
    }

    @Override
    @Transactional
    public Optional<Localidad> findById(Long Id){
        return localidadRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public Localidad save(Localidad save){
        return localidadRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        localidadRepositorio.deleteById(Id);
    }
}
