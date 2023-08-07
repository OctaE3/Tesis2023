package com.chacineria.marcelina.repositorio.insumo;
import com.chacineria.marcelina.entidad.insumo.PControl_de_Nitrato;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PControl_de_NitratoRepositorio extends JpaRepository<PControl_de_Nitrato, Long>{
    @Query(value = "SELECT * FROM control_de_nitratos ORDER BY control_de_nitrato_id DESC LIMIT 1", nativeQuery = true)
    public PControl_de_Nitrato findLastNitrato();

    @Query(value = "UPDATE control_de_nitratos SET control_de_nitrato_stock = :stock WHERE control_de_nitrato_id = :id ", nativeQuery = true)
    @Modifying
    public Integer updateStockNitrato(@Param("stock") Double stock, @Param("id") Long id); 
}
