package com.chacineria.marcelina.repositorio.insumo;
import com.chacineria.marcelina.entidad.insumo.Control_de_Insumos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Control_de_InsumosRepositorio extends JpaRepository<Control_de_Insumos, Long> {
    
}
