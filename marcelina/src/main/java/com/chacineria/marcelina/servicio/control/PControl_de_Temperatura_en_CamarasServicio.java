package com.chacineria.marcelina.servicio.control;

import java.util.Optional;

import com.chacineria.marcelina.entidad.control.PControl_de_Temperatura_en_Camaras;

public interface PControl_de_Temperatura_en_CamarasServicio {
    public Iterable<PControl_de_Temperatura_en_Camaras> findAll();
    public Optional<PControl_de_Temperatura_en_Camaras> findById(Long Id);
    public PControl_de_Temperatura_en_Camaras save(PControl_de_Temperatura_en_Camaras save);
    public void deleteById(Long Id);
}
