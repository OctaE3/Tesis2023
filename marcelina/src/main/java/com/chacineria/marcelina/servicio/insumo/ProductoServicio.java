package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import com.chacineria.marcelina.entidad.insumo.Producto;

public interface ProductoServicio {
    public Iterable<Producto> findAllByProductoEliminado(Boolean eliminado);
    public Iterable<Producto> findAll();
    public Optional<Producto> findById(Long Id);
    public Producto save(Producto save);
    public void deleteById(Long Id);
}
