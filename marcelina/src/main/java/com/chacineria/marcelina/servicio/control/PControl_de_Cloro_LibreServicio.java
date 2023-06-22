package com.chacineria.marcelina.servicio.control;

import java.util.Optional;

import com.chacineria.marcelina.entidad.control.PControl_de_Cloro_Libre;

public interface PControl_de_Cloro_LibreServicio {
    public Iterable<PControl_de_Cloro_Libre> findAll();
    public Optional<PControl_de_Cloro_Libre> findById(Long Id);
    public PControl_de_Cloro_Libre save(PControl_de_Cloro_Libre save);
    public void deleteById(Long Id);
}
