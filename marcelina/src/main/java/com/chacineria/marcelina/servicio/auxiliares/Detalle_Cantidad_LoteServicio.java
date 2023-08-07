package com.chacineria.marcelina.servicio.auxiliares;

import java.util.Optional;
import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Lote;

public interface Detalle_Cantidad_LoteServicio {
    public Iterable<Detalle_Cantidad_Lote> findAll();
    public Optional<Detalle_Cantidad_Lote> findById(Long id);
    public Detalle_Cantidad_Lote save(Detalle_Cantidad_Lote save);
    public void deleteById(Long Id);
}
