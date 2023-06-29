package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import com.chacineria.marcelina.entidad.insumo.Carne;

public interface CarneServicio {
    public Iterable<Carne> findAllByCarneEliminado(Boolean eliminado);
    public Optional<Carne> findById(Long Id);
    public Carne save(Carne save);
    public void deleteById(Long Id);
}
