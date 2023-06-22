package com.chacineria.marcelina.repositorio.control;
import com.chacineria.marcelina.entidad.control.PControl_de_Temperatura_en_Camaras;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PControl_de_Temperatura_en_CamarasRepositorio extends JpaRepository<PControl_de_Temperatura_en_Camaras, Long>{
    
}
