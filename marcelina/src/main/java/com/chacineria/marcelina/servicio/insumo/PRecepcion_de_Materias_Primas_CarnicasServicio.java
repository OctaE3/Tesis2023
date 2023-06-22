package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import com.chacineria.marcelina.entidad.insumo.PRecepcion_de_Materias_Primas_Carnicas;

public interface PRecepcion_de_Materias_Primas_CarnicasServicio {
    public Iterable<PRecepcion_de_Materias_Primas_Carnicas> findAll();
    public Optional<PRecepcion_de_Materias_Primas_Carnicas> findById(Long Id);
    public PRecepcion_de_Materias_Primas_Carnicas save(PRecepcion_de_Materias_Primas_Carnicas save);
    public void deleteById(Long Id);
}
