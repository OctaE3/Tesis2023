package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import com.chacineria.marcelina.entidad.insumo.PDiaria_de_Produccion;

public interface PDiaria_de_ProduccionServicio {
    public Iterable<PDiaria_de_Produccion> findAll();
    public Optional<PDiaria_de_Produccion> findById(Long Id);
    public PDiaria_de_Produccion save(PDiaria_de_Produccion save);
    public void deleteById(Long Id);
}
