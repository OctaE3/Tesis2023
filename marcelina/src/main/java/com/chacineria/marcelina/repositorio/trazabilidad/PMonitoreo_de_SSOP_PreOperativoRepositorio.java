package com.chacineria.marcelina.repositorio.trazabilidad;
import com.chacineria.marcelina.entidad.trazabilidad.PMonitoreo_de_SSOP_PreOperativo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PMonitoreo_de_SSOP_PreOperativoRepositorio extends JpaRepository<PMonitoreo_de_SSOP_PreOperativo, Long>{
    
}
