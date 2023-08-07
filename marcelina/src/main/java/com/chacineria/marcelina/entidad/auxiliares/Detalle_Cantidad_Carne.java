package com.chacineria.marcelina.entidad.auxiliares;

import java.util.Set;

import com.chacineria.marcelina.entidad.insumo.Carne;
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

@Entity(name = "detalle_cantidad_carne")
public class Detalle_Cantidad_Carne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detalle_cantidad_carne_id")
    private Long detalleCantidadCarneId;

    @ManyToOne
    @JoinColumn(name = "detalle_cantidad_carne_carne")
    private Carne detalleCantidadCarneCarne;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "diariaDeProduccionCantidadUtilizadaCarnes")
    @JsonIgnore
    private Set<PDiaria_de_Produccion> detalleCantidadCarneDiariaDeProd;

    @Column(name = "detalle_cantidad_carne_cantidad")
    private Integer detalleCantidadCarneCantidad;

    public Long getDetalleCantidadCarneId() {
        return detalleCantidadCarneId;
    }

    public void setDetalleCantidadCarneId(Long detalleCantidadCarneId) {
        this.detalleCantidadCarneId = detalleCantidadCarneId;
    }

    public Carne getDetalleCantidadCarneCarne() {
        return detalleCantidadCarneCarne;
    }

    public void setDetalleCantidadCarneCarne(Carne detalleCantidadCarneCarne) {
        this.detalleCantidadCarneCarne = detalleCantidadCarneCarne;
    }

    public Set<PDiaria_de_Produccion> getDetalleCantidadCarneDiariaDeProd() {
        return detalleCantidadCarneDiariaDeProd;
    }

    public void setDetalleCantidadCarneDiariaDeProd(Set<PDiaria_de_Produccion> detalleCantidadCarneDiariaDeProd) {
        this.detalleCantidadCarneDiariaDeProd = detalleCantidadCarneDiariaDeProd;
    }

    public Integer getDetalleCantidadCarneCantidad() {
        return detalleCantidadCarneCantidad;
    }

    public void setDetalleCantidadCarneCantidad(Integer detalleCantidadCarneCantidad) {
        this.detalleCantidadCarneCantidad = detalleCantidadCarneCantidad;
    }

    public Detalle_Cantidad_Carne(Long detalleCantidadCarneId, Carne detalleCantidadCarneCarne,
            Set<PDiaria_de_Produccion> detalleCantidadCarneDiariaDeProd, Integer detalleCantidadCarneCantidad) {
        this.detalleCantidadCarneId = detalleCantidadCarneId;
        this.detalleCantidadCarneCarne = detalleCantidadCarneCarne;
        this.detalleCantidadCarneDiariaDeProd = detalleCantidadCarneDiariaDeProd;
        this.detalleCantidadCarneCantidad = detalleCantidadCarneCantidad;
    }

    public Detalle_Cantidad_Carne() {
    }

}
