package com.chacineria.marcelina.servicio.trazabilidad;

import java.util.Optional;

import com.chacineria.marcelina.entidad.trazabilidad.PMonitoreo_de_SSOP_PreOperativo;

public interface PMonitoreo_de_SSOP_PreOperativoServicio {
    public Iterable<PMonitoreo_de_SSOP_PreOperativo> findAll();
    public Optional<PMonitoreo_de_SSOP_PreOperativo> findById(Long Id);
    public PMonitoreo_de_SSOP_PreOperativo save(PMonitoreo_de_SSOP_PreOperativo save);
    public void deleteById(Long Id);
}
