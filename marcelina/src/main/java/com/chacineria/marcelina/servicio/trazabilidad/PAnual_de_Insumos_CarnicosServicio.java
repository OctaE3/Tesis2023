package com.chacineria.marcelina.servicio.trazabilidad;

import java.util.Optional;

import com.chacineria.marcelina.entidad.trazabilidad.PAnual_de_Insumos_Carnicos;

public interface PAnual_de_Insumos_CarnicosServicio {
    public Iterable<PAnual_de_Insumos_Carnicos> findAll();
    public Optional<PAnual_de_Insumos_Carnicos> findById(Long Id);
    public PAnual_de_Insumos_Carnicos save(PAnual_de_Insumos_Carnicos save);
    public void deleteById(Long Id);
}
