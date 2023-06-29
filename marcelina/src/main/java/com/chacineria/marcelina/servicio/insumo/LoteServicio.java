package com.chacineria.marcelina.servicio.insumo;
import java.util.Optional;

import com.chacineria.marcelina.entidad.insumo.Lote;

public interface LoteServicio {
    public Iterable<Lote> findAllByLoteEliminado(Boolean eliminado);
    public Optional<Lote> findById(Long Id);
    public Lote save(Lote save);
    public void deleteById(Long Id);
}
