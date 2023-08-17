package com.chacineria.marcelina.repositorio.insumo;
import com.chacineria.marcelina.entidad.insumo.PDiaria_de_Produccion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PDiaria_de_ProduccionRepositorio extends JpaRepository<PDiaria_de_Produccion, Long>{

}
