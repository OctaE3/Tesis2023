package com.chacineria.marcelina.repositorio.insumo;
import com.chacineria.marcelina.entidad.insumo.Producto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepositorio extends JpaRepository<Producto, Long>{
    
}
