package com.chacineria.marcelina.entidad.insumo;
import java.io.Serializable;
import java.sql.Date;

import com.chacineria.marcelina.entidad.persona.Usuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "control_de_nitratos")
public class PControl_de_Nitrato implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "control_de_nitrato_id")
    private Long controlDeNitratoId;

    @Column(name = "control_de_nitrato_fecha", nullable = false)
    private Date controlDeNitratoFecha;

    @Column(name = "control_de_nitrato_producto_lote", length = 30, nullable = false)
    private String controlDeNitratoProductoLote;

    @Column(name = "control_de_nitrato_cantidad_utilizada", nullable = false)
    private Integer controlDeNitratoCantidadUtilizada;

    @Column(name = "control_de_nitrato_stock", nullable = false)
    private Double controlDeNitratoStock;

    @Column(name = "control_de_nitrato_observaciones", length = 150)
    private String controlDeNitratoObservaciones;

    @ManyToOne
    @JoinColumn(name = "control_de_nitrato_responsable", nullable = false)
    private Usuario controlDeNitratoResponsable;

    public Long getControlDeNitratoId() {
        return controlDeNitratoId;
    }

    public void setControlDeNitratoId(Long controlDeNitratoId) {
        this.controlDeNitratoId = controlDeNitratoId;
    }

    public Date getControlDeNitratoFecha() {
        return controlDeNitratoFecha;
    }

    public void setControlDeNitratoFecha(Date controlDeNitratoFecha) {
        this.controlDeNitratoFecha = controlDeNitratoFecha;
    }

    public String getControlDeNitratoProductoLote() {
        return controlDeNitratoProductoLote;
    }

    public void setControlDeNitratoProductoLote(String controlDeNitratoProductoLote) {
        this.controlDeNitratoProductoLote = controlDeNitratoProductoLote;
    }

    public Integer getControlDeNitratoCantidadUtilizada() {
        return controlDeNitratoCantidadUtilizada;
    }

    public void setControlDeNitratoCantidadUtilizada(Integer controlDeNitratoCantidadUtilizada) {
        this.controlDeNitratoCantidadUtilizada = controlDeNitratoCantidadUtilizada;
    }

    public Double getControlDeNitratoStock() {
        return controlDeNitratoStock;
    }

    public void setControlDeNitratoStock(Double controlDeNitratoStock) {
        this.controlDeNitratoStock = controlDeNitratoStock;
    }

    public String getControlDeNitratoObservaciones() {
        return controlDeNitratoObservaciones;
    }

    public void setControlDeNitratoObservaciones(String controlDeNitratoObservaciones) {
        this.controlDeNitratoObservaciones = controlDeNitratoObservaciones;
    }

    public Usuario getControlDeNitratoResponsable() {
        return controlDeNitratoResponsable;
    }

    public void setControlDeNitratoResponsable(Usuario controlDeNitratoResponsable) {
        this.controlDeNitratoResponsable = controlDeNitratoResponsable;
    }

    public PControl_de_Nitrato(Long controlDeNitratoId, Date controlDeNitratoFecha, String controlDeNitratoProductoLote,
            Integer controlDeNitratoCantidadUtilizada, Double controlDeNitratoStock,
            String controlDeNitratoObservaciones, Usuario controlDeNitratoResponsable) {
        this.controlDeNitratoId = controlDeNitratoId;
        this.controlDeNitratoFecha = controlDeNitratoFecha;
        this.controlDeNitratoProductoLote = controlDeNitratoProductoLote;
        this.controlDeNitratoCantidadUtilizada = controlDeNitratoCantidadUtilizada;
        this.controlDeNitratoStock = controlDeNitratoStock;
        this.controlDeNitratoObservaciones = controlDeNitratoObservaciones;
        this.controlDeNitratoResponsable = controlDeNitratoResponsable;
    }

    public PControl_de_Nitrato() { }
}
