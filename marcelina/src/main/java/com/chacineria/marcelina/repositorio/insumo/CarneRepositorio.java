package com.chacineria.marcelina.repositorio.insumo;
import com.chacineria.marcelina.entidad.insumo.Carne;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarneRepositorio extends JpaRepository<Carne, Long>{
    public Iterable<Carne> findAllByCarneEliminado(Boolean eliminado);
}
