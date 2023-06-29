package com.chacineria.marcelina.servicio.persona;

import java.util.Optional;

import com.chacineria.marcelina.entidad.persona.Cliente;

public interface ClienteServicio {
    public Iterable<Cliente> findAllByClienteEliminado(Boolean eliminado);
    public Optional<Cliente> findById(Long Id);
    public Cliente save(Cliente save);
    public void deleteById(Long Id);
}
