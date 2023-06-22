package com.chacineria.marcelina.repositorio.trazabilidad;
import com.chacineria.marcelina.entidad.trazabilidad.PExpedicion_de_Producto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PExpedicion_de_ProductoRepositorio extends JpaRepository<PExpedicion_de_Producto, Long>{
    
}
