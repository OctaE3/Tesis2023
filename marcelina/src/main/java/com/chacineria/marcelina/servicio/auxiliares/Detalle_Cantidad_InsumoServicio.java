package com.chacineria.marcelina.servicio.auxiliares;

import java.util.Optional;

import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Insumo;

public interface Detalle_Cantidad_InsumoServicio {
    public Iterable<Detalle_Cantidad_Insumo> findAll();
    public Optional<Detalle_Cantidad_Insumo> findById(Long id);
    public Detalle_Cantidad_Insumo save(Detalle_Cantidad_Insumo save);
    public void deleteById(Long Id);
}
