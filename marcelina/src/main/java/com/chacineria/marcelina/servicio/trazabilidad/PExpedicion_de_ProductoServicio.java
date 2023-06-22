package com.chacineria.marcelina.servicio.trazabilidad;

import java.util.Optional;

import com.chacineria.marcelina.entidad.trazabilidad.PExpedicion_de_Producto;

public interface PExpedicion_de_ProductoServicio {
    public Iterable<PExpedicion_de_Producto> findAll();
    public Optional<PExpedicion_de_Producto> findById(Long Id);
    public PExpedicion_de_Producto save(PExpedicion_de_Producto save);
    public void deleteById(Long Id);
}
