package com.chacineria.marcelina.servicio.persona;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.persona.Proveedor;
import com.chacineria.marcelina.repositorio.persona.ProveedorRepositorio;

@Service
public class ProveedorServicioImpl implements ProveedorServicio{

    @Autowired
    private ProveedorRepositorio proveedorRepositorio;

    @Override
    @Transactional
    public Iterable<Proveedor> findAllByProveedorEliminado(Boolean eliminado){
        return proveedorRepositorio.findAllByProveedorEliminado(eliminado);
    }

    @Override
    @Transactional
    public Iterable<Proveedor> findAll(){
        return proveedorRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<Proveedor> findById(Long Id){
        return proveedorRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public Proveedor save(Proveedor save){
        return proveedorRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        proveedorRepositorio.deleteById(Id);
    }
}
