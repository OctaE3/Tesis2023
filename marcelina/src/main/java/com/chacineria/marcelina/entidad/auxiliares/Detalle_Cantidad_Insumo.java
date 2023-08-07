package com.chacineria.marcelina.entidad.auxiliares;

import java.util.Set;

import com.chacineria.marcelina.entidad.insumo.Control_de_Insumos;
import com.chacineria.marcelina.entidad.insumo.PDiaria_de_Produccion;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity(name = "detalle_cantidad_insumo")
public class Detalle_Cantidad_Insumo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detalle_cantidad_insumo_id")
    private Long detalleCantidadInsumoId;

    @ManyToOne
    @JoinColumn(name = "detalle_cantidad_insumo_insumo")
    private Control_de_Insumos detalleCantidadInsumoInsumo;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "diariaDeProduccionCantidadUtilizadaInsumos")
    @JsonIgnore
    private Set<PDiaria_de_Produccion> detalleCantidadInsumoDiariaDeProd;

    @Column(name = "detalle_cantidad_insumo_cantidad")
    private Integer detalleCantidadInsumoCantidad;

    public Long getDetalleCantidadInsumoId() {
        return detalleCantidadInsumoId;
    }

    public void setDetalleCantidadInsumoId(Long detalleCantidadInsumoId) {
        this.detalleCantidadInsumoId = detalleCantidadInsumoId;
    }

    public Control_de_Insumos getDetalleCantidadInsumoInsumo() {
        return detalleCantidadInsumoInsumo;
    }

    public void setDetalleCantidadInsumoInsumo(Control_de_Insumos detalleCantidadInsumoInsumo) {
        this.detalleCantidadInsumoInsumo = detalleCantidadInsumoInsumo;
    }

    public Set<PDiaria_de_Produccion> getDetalleCantidadInsumoDiariaDeProd() {
        return detalleCantidadInsumoDiariaDeProd;
    }

    public void setDetalleCantidadInsumoDiariaDeProd(Set<PDiaria_de_Produccion> detalleCantidadInsumoDiariaDeProd) {
        this.detalleCantidadInsumoDiariaDeProd = detalleCantidadInsumoDiariaDeProd;
    }

    public Integer getDetalleCantidadInsumoCantidad() {
        return detalleCantidadInsumoCantidad;
    }

    public void setDetalleCantidadInsumoCantidad(Integer detalleCantidadInsumoCantidad) {
        this.detalleCantidadInsumoCantidad = detalleCantidadInsumoCantidad;
    }

    public Detalle_Cantidad_Insumo(Long detalleCantidadInsumoId, Control_de_Insumos detalleCantidadInsumoInsumo,
            Set<PDiaria_de_Produccion> detalleCantidadInsumoDiariaDeProd, Integer detalleCantidadInsumoCantidad) {
        this.detalleCantidadInsumoId = detalleCantidadInsumoId;
        this.detalleCantidadInsumoInsumo = detalleCantidadInsumoInsumo;
        this.detalleCantidadInsumoDiariaDeProd = detalleCantidadInsumoDiariaDeProd;
        this.detalleCantidadInsumoCantidad = detalleCantidadInsumoCantidad;
    }

    public Detalle_Cantidad_Insumo() {
    }
    

}
