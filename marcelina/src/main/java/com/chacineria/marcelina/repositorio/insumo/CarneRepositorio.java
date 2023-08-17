package com.chacineria.marcelina.repositorio.insumo;

import com.chacineria.marcelina.entidad.insumo.Carne;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarneRepositorio extends JpaRepository<Carne, Long> {
    public Iterable<Carne> findAllByCarneEliminado(Boolean eliminado);

    public List<Carne> findAllByCarneEliminadoAndCarneTipoAndCarneCategoriaAndCarneFechaBetween(Boolean eliminado,
            String tipo, String categoria, Date fecha1, Date fecha2);
}
