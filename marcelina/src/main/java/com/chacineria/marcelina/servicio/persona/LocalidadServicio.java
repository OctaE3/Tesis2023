package com.chacineria.marcelina.servicio.persona;

import java.util.Optional;

import com.chacineria.marcelina.entidad.persona.Localidad;

public interface LocalidadServicio {
    public Iterable<Localidad> findAllByLocalidadEliminado(Boolean eliminado);
    public Optional<Localidad> findById(Long Id);
    public Localidad save(Localidad save);
    public void deleteById(Long Id);
}
