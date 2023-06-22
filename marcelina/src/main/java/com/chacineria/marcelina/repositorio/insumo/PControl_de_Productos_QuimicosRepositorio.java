package com.chacineria.marcelina.repositorio.insumo;
import com.chacineria.marcelina.entidad.insumo.PControl_de_Productos_Quimicos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PControl_de_Productos_QuimicosRepositorio extends JpaRepository<PControl_de_Productos_Quimicos, Long>{
    
}
