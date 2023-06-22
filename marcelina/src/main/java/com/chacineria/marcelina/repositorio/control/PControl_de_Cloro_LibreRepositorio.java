package com.chacineria.marcelina.repositorio.control;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chacineria.marcelina.entidad.control.PControl_de_Cloro_Libre;

@Repository
public interface PControl_de_Cloro_LibreRepositorio extends JpaRepository<PControl_de_Cloro_Libre, Long>{
    
}
