package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.insumo.Producto;
import com.chacineria.marcelina.repositorio.insumo.ProductoRepositorio;

@Service
public class ProductoServicioImpl implements ProductoServicio{
    
    @Autowired
    private ProductoRepositorio productoRepositorio;

    @Override
    @Transactional
    public Iterable<Producto> findAllByProductoEliminado(Boolean eliminado){
        return productoRepositorio.findAllByProductoEliminado(eliminado);
    }

    @Override
    @Transactional
    public Optional<Producto> findById(Long Id){
        return productoRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public Producto save(Producto save){
        return productoRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        productoRepositorio.deleteById(Id);
    }
}
