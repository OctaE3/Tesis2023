package com.chacineria.marcelina.servicio.persona;

import java.util.Optional;

import com.chacineria.marcelina.entidad.persona.Proveedor;

public interface ProveedorServicio {
    public Iterable<Proveedor> findAll();
    public Optional<Proveedor> findById(Long Id);
    public Proveedor save(Proveedor save);
    public void deleteById(Long Id);
}
