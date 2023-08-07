package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;
import java.util.Set;

import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Carne;
import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Insumo;
import com.chacineria.marcelina.entidad.insumo.PDiaria_de_Produccion;

public interface PDiaria_de_ProduccionServicio {
    public Iterable<PDiaria_de_Produccion> findAll();
    public Optional<PDiaria_de_Produccion> findById(Long Id);
    public PDiaria_de_Produccion save(PDiaria_de_Produccion save);
    public PDiaria_de_Produccion saveDiariaCantidad(PDiaria_de_Produccion diariaDeProduccion, Set<Detalle_Cantidad_Carne> listaCantidadCarne, Set<Detalle_Cantidad_Insumo> listaCantidadInsumo);
    public void deleteById(Long Id);
}
