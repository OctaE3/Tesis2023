package com.chacineria.marcelina.repositorio.trazabilidad;
import com.chacineria.marcelina.entidad.trazabilidad.PResumen_de_Trazabilidad;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PResumen_de_TrazabilidadRepositorio extends JpaRepository<PResumen_de_Trazabilidad, Long>{
    
}
