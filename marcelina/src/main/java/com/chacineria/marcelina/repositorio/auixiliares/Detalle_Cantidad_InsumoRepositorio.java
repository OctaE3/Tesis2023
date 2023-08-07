package com.chacineria.marcelina.repositorio.auixiliares;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Insumo;

@Repository
public interface Detalle_Cantidad_InsumoRepositorio extends JpaRepository<Detalle_Cantidad_Insumo, Long>{
    
}
