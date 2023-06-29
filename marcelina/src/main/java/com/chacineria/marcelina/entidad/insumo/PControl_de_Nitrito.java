package com.chacineria.marcelina.entidad.insumo;
import java.io.Serializable;
import java.sql.Date;

import com.chacineria.marcelina.entidad.persona.Usuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.GenerationType;

@Entity(name = "control_de_nitritos")
public class PControl_de_Nitrito implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "control_de_nitrito_id")
    private Long controlDeNitritoId;

    @Column(name ="control_de_nitrito_fecha", nullable = false)
    private Date controlDeNitritoFecha;

    @Column(name = "control_de_nitrito_producto_lote", length = 30, nullable = false)
    private String controlDeNitritoProductoLote;

    @Column(name = "control_de_nitrito_cantidad_utilizada", nullable = false)
    private Integer controlDeNitritoCantidadUtilizada;

    @Column(name = "control_de_nitrito_stock", nullable = false)
    private Double controlDeNitritoStock;

    @Column(name = "control_de_nitrito_observaciones", length = 150)
    private String controlDeNitritoObservaciones;

    @ManyToOne
    @JoinColumn(name = "control_de_nitrito_reponsable", nullable = false)
    private Usuario controlDeNitritoResponsable;

    public Long getControlDeNitritoId() {
        return controlDeNitritoId;
    }

    public void setControlDeNitritoId(Long controlDeNitritoId) {
        this.controlDeNitritoId = controlDeNitritoId;
    }

    public Date getControlDeNitritoFecha() {
        return controlDeNitritoFecha;
    }

    public void setControlDeNitritoFecha(Date controlDeNitritoFecha) {
        this.controlDeNitritoFecha = controlDeNitritoFecha;
    }

    public String getControlDeNitritoProductoLote() {
        return controlDeNitritoProductoLote;
    }

    public void setControlDeNitritoProductoLote(String controlDeNitritoProductoLote) {
        this.controlDeNitritoProductoLote = controlDeNitritoProductoLote;
    }

    public Integer getControlDeNitritoCantidadUtilizada() {
        return controlDeNitritoCantidadUtilizada;
    }

    public void setControlDeNitritoCantidadUtilizada(Integer controlDeNitritoCantidadUtilizada) {
        this.controlDeNitritoCantidadUtilizada = controlDeNitritoCantidadUtilizada;
    }

    public Double getControlDeNitritoStock() {
        return controlDeNitritoStock;
    }

    public void setControlDeNitritoStock(Double controlDeNitritoStock) {
        this.controlDeNitritoStock = controlDeNitritoStock;
    }

    public String getControlDeNitritoObservaciones() {
        return controlDeNitritoObservaciones;
    }

    public void setControlDeNitritoObservaciones(String controlDeNitritoObservaciones) {
        this.controlDeNitritoObservaciones = controlDeNitritoObservaciones;
    }

    public Usuario getControlDeNitritoResponsable() {
        return controlDeNitritoResponsable;
    }

    public void setControlDeNitritoResponsable(Usuario controlDeNitritoResponsable) {
        this.controlDeNitritoResponsable = controlDeNitritoResponsable;
    }

    public PControl_de_Nitrito(Long controlDeNitritoId, Date controlDeNitritoFecha, String controlDeNitritoProductoLote,
            Integer controlDeNitritoCantidadUtilizada, Double controlDeNitritoStock,
            String controlDeNitritoObservaciones, Usuario controlDeNitritoResponsable) {
        this.controlDeNitritoId = controlDeNitritoId;
        this.controlDeNitritoFecha = controlDeNitritoFecha;
        this.controlDeNitritoProductoLote = controlDeNitritoProductoLote;
        this.controlDeNitritoCantidadUtilizada = controlDeNitritoCantidadUtilizada;
        this.controlDeNitritoStock = controlDeNitritoStock;
        this.controlDeNitritoObservaciones = controlDeNitritoObservaciones;
        this.controlDeNitritoResponsable = controlDeNitritoResponsable;
    }

    public PControl_de_Nitrito() { }
}
