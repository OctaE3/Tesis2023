package com.chacineria.marcelina.servicio.control;

import java.util.Optional;

import com.chacineria.marcelina.entidad.control.PControl_de_Mejoras_en_Instalaciones;

public interface PControl_de_Mejoras_en_InstalacionesServicio {
    public Iterable<PControl_de_Mejoras_en_Instalaciones> findAll();
    public Optional<PControl_de_Mejoras_en_Instalaciones> findById(Long Id);
    public PControl_de_Mejoras_en_Instalaciones save(PControl_de_Mejoras_en_Instalaciones save);
    public void deleteById(Long Id);
}
