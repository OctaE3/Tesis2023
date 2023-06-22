package com.chacineria.marcelina.entidad.insumo;
import com.chacineria.marcelina.entidad.persona.Usuario;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.GenerationType;

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
