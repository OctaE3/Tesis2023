package com.chacineria.marcelina.servicio.insumo;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import com.chacineria.marcelina.entidad.insumo.Carne;

public interface CarneServicio {
    public Iterable<Carne> findAll();

    public Iterable<Carne> findAllByCarneEliminado(Boolean eliminado);

    public List<Carne> findAllByCarneTipoAndCarneCategoriaAndCarneFechaBetween(String tipo, String categoria,
            Date fecha1, Date fecha2);

    public Optional<Carne> findById(Long Id);

    public Carne save(Carne save);

    public void deleteById(Long Id);
}
