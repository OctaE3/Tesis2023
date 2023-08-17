package com.chacineria.marcelina.repositorio.trazabilidad;
import com.chacineria.marcelina.entidad.trazabilidad.PAnual_de_Insumos_Carnicos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PAnual_de_Insumos_CarnicosRepositorio extends JpaRepository<PAnual_de_Insumos_Carnicos, Long>{
    @Query(value = "SELECT * FROM anual_de_insumos_carnicos ORDER BY anual_de_insumos_carnicos_id DESC LIMIT 1", nativeQuery = true)
    public PAnual_de_Insumos_Carnicos findLastAnualDeInsumosCarnicos();
}
