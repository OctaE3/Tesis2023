package com.chacineria.marcelina.repositorio.control;
import com.chacineria.marcelina.entidad.control.PControl_de_Reposicion_de_Cloro;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PControl_de_Reposicion_de_CloroRepositorio extends JpaRepository<PControl_de_Reposicion_de_Cloro, Long>{
    
}
