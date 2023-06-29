package com.chacineria.marcelina.repositorio.persona;
import com.chacineria.marcelina.entidad.persona.Localidad;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocalidadRepositorio extends JpaRepository<Localidad, Long>{
    public Iterable<Localidad> findAllByLocalidadEliminado(Boolean eliminado);
}
