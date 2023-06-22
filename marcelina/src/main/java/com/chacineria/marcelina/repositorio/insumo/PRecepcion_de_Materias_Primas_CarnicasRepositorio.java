package com.chacineria.marcelina.repositorio.insumo;
import com.chacineria.marcelina.entidad.insumo.PRecepcion_de_Materias_Primas_Carnicas;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PRecepcion_de_Materias_Primas_CarnicasRepositorio extends JpaRepository<PRecepcion_de_Materias_Primas_Carnicas, Long>{
    
}
