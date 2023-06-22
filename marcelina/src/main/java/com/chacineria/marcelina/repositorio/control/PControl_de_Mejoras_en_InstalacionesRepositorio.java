package com.chacineria.marcelina.repositorio.control;
import com.chacineria.marcelina.entidad.control.PControl_de_Mejoras_en_Instalaciones;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PControl_de_Mejoras_en_InstalacionesRepositorio extends JpaRepository<PControl_de_Mejoras_en_Instalaciones, Long>{
    
}
