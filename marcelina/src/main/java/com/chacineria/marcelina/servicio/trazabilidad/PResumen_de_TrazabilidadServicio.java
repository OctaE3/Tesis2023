package com.chacineria.marcelina.servicio.trazabilidad;

import java.util.List;
import java.util.Optional;

import com.chacineria.marcelina.entidad.trazabilidad.PResumen_de_Trazabilidad;

public interface PResumen_de_TrazabilidadServicio {
    public Iterable<PResumen_de_Trazabilidad> findAll();
    public Optional<PResumen_de_Trazabilidad> findById(Long Id);
    public PResumen_de_Trazabilidad save(PResumen_de_Trazabilidad save);
    public List<PResumen_de_Trazabilidad> saveAll(List<PResumen_de_Trazabilidad> save);
    public void deleteById(Long Id);
}
