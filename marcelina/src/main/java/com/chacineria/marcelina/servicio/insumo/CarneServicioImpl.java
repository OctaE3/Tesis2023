package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chacineria.marcelina.entidad.insumo.Carne;
import com.chacineria.marcelina.repositorio.insumo.CarneRepositorio;

@Service
public class CarneServicioImpl implements CarneServicio{
    
    @Autowired
    private CarneRepositorio carneRepositorio;

    @Override
    @Transactional
    public Iterable<Carne> findAll(){
        return carneRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<Carne> findById(Long Id){
        return carneRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public Carne save(Carne save){
        return carneRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        carneRepositorio.deleteById(Id);
    }
}
