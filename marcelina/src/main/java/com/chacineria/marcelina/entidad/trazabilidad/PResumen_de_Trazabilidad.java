package com.chacineria.marcelina.entidad.trazabilidad;
import com.chacineria.marcelina.entidad.insumo.Lote;
import com.chacineria.marcelina.entidad.insumo.Producto;
import com.chacineria.marcelina.entidad.insumo.Control_de_Insumos;
import com.chacineria.marcelina.entidad.insumo.Carne;
import com.chacineria.marcelina.entidad.persona.Usuario;

import java.io.Serializable;
import java.util.Set;
import java.util.HashSet;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

@Entity(name = "resumen_de_trazabilidad")
public class PResumen_de_Trazabilidad implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resumen_de_trazabilidad_id")
    private Long resumenDeTrazabilidadId;

    @Column(name = "resumen_de_trazabilidad_fecha", nullable = false)
    private Date resumenDeTrazabilidadFecha;

    @ManyToOne
    @JoinColumn(name = "resumen_de_trazabilidad_lote", nullable = false)
    private Lote resumenDeTrazabilidadLote;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "resumen_de_trazabilidad_productos",
        joinColumns = @JoinColumn(name = "resumen_de_trazabilidad_id"),
        inverseJoinColumns = @JoinColumn(name = "producto_id"))
    private Set<Producto> resumenDeTrazabilidadProductos = new HashSet<>();

    @Column(name = "resumen_de_trazabilidad_cantidad_producida", nullable = false)
    private Double resumenDeTrazabilidadCantidadProducida;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "resumen_de_trazabilidad_carnes",
        joinColumns = @JoinColumn(name = "resumen_de_trazabilidad_id"),
        inverseJoinColumns = @JoinColumn(name = "carne_id"))
    private Set<Carne> resumenDeTrazabilidadMatPrimaCarnica = new HashSet<>();


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "resumen_de_trazabilidad_insumos",
        joinColumns = @JoinColumn(name = "resumen_de_trazabilidad_id"),
        inverseJoinColumns = @JoinColumn(name = "control_de_insumos_id"))
    private Set<Control_de_Insumos> resumenDeTrazabilidadMatPrimaNoCarnica = new HashSet<>();

    @Column(name = "resumen_de_tazabilidad_destino", length = 60, nullable = false)
    private String resumenDeTrazabilidadDestino;

    @ManyToOne
    @JoinColumn(name = "resumen_de_trazabilidad_responsable", nullable = false)
    private Usuario resumenDeTrazabilidadResponsable;

    public Long getResumenDeTrazabilidadId() {
        return resumenDeTrazabilidadId;
    }

    public void setResumenDeTrazabilidadId(Long resumenDeTrazabilidadId) {
        this.resumenDeTrazabilidadId = resumenDeTrazabilidadId;
    }

    public Date getResumenDeTrazabilidadFecha() {
        return resumenDeTrazabilidadFecha;
    }

    public void setResumenDeTrazabilidadFecha(Date resumenDeTrazabilidadFecha) {
        this.resumenDeTrazabilidadFecha = resumenDeTrazabilidadFecha;
    }

    public Lote getResumenDeTrazabilidadLote() {
        return resumenDeTrazabilidadLote;
    }

    public void setResumenDeTrazabilidadLote(Lote resumenDeTrazabilidadLote) {
        this.resumenDeTrazabilidadLote = resumenDeTrazabilidadLote;
    }

    public Set<Producto> getResumenDeTrazabilidadProductos() {
        return resumenDeTrazabilidadProductos;
    }

    public void setResumenDeTrazabilidadProductos(Set<Producto> resumenDeTrazabilidadProductos) {
        this.resumenDeTrazabilidadProductos = resumenDeTrazabilidadProductos;
    }

    public Double getResumenDeTrazabilidadCantidadProducida() {
        return resumenDeTrazabilidadCantidadProducida;
    }

    public void setResumenDeTrazabilidadCantidadProducida(Double resumenDeTrazabilidadCantidadProducida) {
        this.resumenDeTrazabilidadCantidadProducida = resumenDeTrazabilidadCantidadProducida;
    }

    public Set<Carne> getResumenDeTrazabilidadMatPrimaCarnica() {
        return resumenDeTrazabilidadMatPrimaCarnica;
    }

    public void setResumenDeTrazabilidadMatPrimaCarnica(Set<Carne> resumenDeTrazabilidadMatPrimaCarnica) {
        this.resumenDeTrazabilidadMatPrimaCarnica = resumenDeTrazabilidadMatPrimaCarnica;
    }

    public Set<Control_de_Insumos> getResumenDeTrazabilidadMatPrimaNoCarnica() {
        return resumenDeTrazabilidadMatPrimaNoCarnica;
    }

    public void setResumenDeTrazabilidadMatPrimaNoCarnica(Set<Control_de_Insumos> resumenDeTrazabilidadMatPrimaNoCarnica) {
        this.resumenDeTrazabilidadMatPrimaNoCarnica = resumenDeTrazabilidadMatPrimaNoCarnica;
    }

    public String getResumenDeTrazabilidadDestino() {
        return resumenDeTrazabilidadDestino;
    }

    public void setResumenDeTrazabilidadDestino(String resumenDeTrazabilidadDestino) {
        this.resumenDeTrazabilidadDestino = resumenDeTrazabilidadDestino;
    }

    public Usuario getResumenDeTrazabilidadResponsable() {
        return resumenDeTrazabilidadResponsable;
    }

    public void setResumenDeTrazabilidadResponsable(Usuario resumenDeTrazabilidadResponsable) {
        this.resumenDeTrazabilidadResponsable = resumenDeTrazabilidadResponsable;
    }

    public PResumen_de_Trazabilidad(Long resumenDeTrazabilidadId, Date resumenDeTrazabilidadFecha,
            Lote resumenDeTrazabilidadLote, Set<Producto> resumenDeTrazabilidadProductos,
            Double resumenDeTrazabilidadCantidadProducida, Set<Carne> resumenDeTrazabilidadMatPrimaCarnica,
            Set<Control_de_Insumos> resumenDeTrazabilidadMatPrimaNoCarnica, String resumenDeTrazabilidadDestino,
            Usuario resumenDeTrazabilidadResponsable) {
        this.resumenDeTrazabilidadId = resumenDeTrazabilidadId;
        this.resumenDeTrazabilidadFecha = resumenDeTrazabilidadFecha;
        this.resumenDeTrazabilidadLote = resumenDeTrazabilidadLote;
        this.resumenDeTrazabilidadProductos = resumenDeTrazabilidadProductos;
        this.resumenDeTrazabilidadCantidadProducida = resumenDeTrazabilidadCantidadProducida;
        this.resumenDeTrazabilidadMatPrimaCarnica = resumenDeTrazabilidadMatPrimaCarnica;
        this.resumenDeTrazabilidadMatPrimaNoCarnica = resumenDeTrazabilidadMatPrimaNoCarnica;
        this.resumenDeTrazabilidadDestino = resumenDeTrazabilidadDestino;
        this.resumenDeTrazabilidadResponsable = resumenDeTrazabilidadResponsable;
    }

   public PResumen_de_Trazabilidad() { }
    
}
