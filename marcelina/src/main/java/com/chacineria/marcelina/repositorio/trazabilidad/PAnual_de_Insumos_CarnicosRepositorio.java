package com.chacineria.marcelina.repositorio.trazabilidad;
import com.chacineria.marcelina.entidad.trazabilidad.PAnual_de_Insumos_Carnicos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PAnual_de_Insumos_CarnicosRepositorio extends JpaRepository<PAnual_de_Insumos_Carnicos, Long>{
    
}
