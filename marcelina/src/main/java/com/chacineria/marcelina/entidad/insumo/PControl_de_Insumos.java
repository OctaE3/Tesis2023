package com.chacineria.marcelina.entidad.insumo;

import java.io.Serializable;
import java.sql.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class PControl_de_Insumos implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long controlDeInsumosId;

    @Column(nullable = false)
    private Date controlDeInsumosFecha;

    

    @Column(length = 150, nullable = true)
    private String controlDeInsumoMotivoDeRechazo;
}
