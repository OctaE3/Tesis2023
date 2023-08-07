package com.chacineria.marcelina.servicio.auxiliares;

import java.util.Optional;
import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Carne;

public interface Detalle_Cantidad_CarneServicio {
    public Iterable<Detalle_Cantidad_Carne> findAll();
    public Optional<Detalle_Cantidad_Carne> findById(Long id);
    public Detalle_Cantidad_Carne save(Detalle_Cantidad_Carne save);
    public void deleteById(Long Id);
}
