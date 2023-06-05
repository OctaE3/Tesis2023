package com.chacineria.marcelina.entidad.insumo;

import java.io.Serializable;
import java.sql.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

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
