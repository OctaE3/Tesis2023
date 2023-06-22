package com.chacineria.marcelina.servicio.trazabilidad;

import java.util.Optional;

import com.chacineria.marcelina.entidad.trazabilidad.PMonitoreo_de_SSOP_Operativo;

public interface PMonitoreo_de_SSOP_OperativoServicio {
    public Iterable<PMonitoreo_de_SSOP_Operativo> findAll();
    public Optional<PMonitoreo_de_SSOP_Operativo> findById(Long Id);
    public PMonitoreo_de_SSOP_Operativo save(PMonitoreo_de_SSOP_Operativo save);
    public void deleteById(Long Id);
}
