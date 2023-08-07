package com.chacineria.marcelina.repositorio.insumo;
import com.chacineria.marcelina.entidad.insumo.PControl_de_Nitrito;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PControl_de_NitritoRepositorio extends JpaRepository<PControl_de_Nitrito, Long>{
    @Query(value = "SELECT * FROM control_de_nitritos ORDER BY control_de_nitrito_id DESC LIMIT 1", nativeQuery = true)
    public PControl_de_Nitrito findLastNitrito();

    @Query(value = "UPDATE control_de_nitritos SET control_de_nitritos_stock = :stock WHERE control_de_nitrito_id = :id ", nativeQuery = true)
    @Modifying
    public Integer updateStockNitrito(@Param("stock") Double stock, @Param("id") Long id);
}
