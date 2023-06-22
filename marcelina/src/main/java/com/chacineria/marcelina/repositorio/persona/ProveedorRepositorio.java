package com.chacineria.marcelina.repositorio.persona;
import com.chacineria.marcelina.entidad.persona.Proveedor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProveedorRepositorio extends JpaRepository<Proveedor, Long>{
    
}
