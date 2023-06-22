package com.chacineria.marcelina.repositorio.trazabilidad;
import com.chacineria.marcelina.entidad.trazabilidad.PMonitoreo_de_SSOP_Operativo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PMonitoreo_de_SSOP_OperativoRepositorio extends JpaRepository<PMonitoreo_de_SSOP_Operativo, Long>{
    
}
