package com.chacineria.marcelina.repositorio.control;
import com.chacineria.marcelina.entidad.control.PControl_de_Alarma_Luminica_y_Sonora_de_Cloro;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface PControl_de_Alarma_Luminica_y_Sonora_de_CloroRepositorio extends JpaRepository<PControl_de_Alarma_Luminica_y_Sonora_de_Cloro, Long>{
    
}
