package com.chacineria.marcelina.repositorio.insumo;
import com.chacineria.marcelina.entidad.insumo.PControl_de_Nitrito;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PControl_de_NitritoRepositorio extends JpaRepository<PControl_de_Nitrito, Long>{
    
}
