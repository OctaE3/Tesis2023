package com.chacineria.marcelina.repositorio.auixiliares;

import org.springframework.stereotype.Repository;
import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Carne;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface Detalle_Cantidad_CarneRepositorio extends JpaRepository<Detalle_Cantidad_Carne, Long>{
    
}
