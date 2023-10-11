package com.chacineria.marcelina.entidad.trazabilidad;

import com.chacineria.marcelina.entidad.insumo.Lote;
import com.chacineria.marcelina.entidad.insumo.Producto;
import com.chacineria.marcelina.entidad.persona.Cliente;
import com.chacineria.marcelina.entidad.persona.Usuario;
import com.chacineria.marcelina.entidad.insumo.Control_de_Insumos;
import com.chacineria.marcelina.entidad.insumo.Carne;

import java.io.Serializable;
import java.util.Set;
import java.util.HashSet;
import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity(name = "resumen_de_trazabilidad")
public class PResumen_de_Trazabilidad implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resumen_de_trazabilidad_id")
    private Long resumenDeTrazabilidadId;

    @Column(name = "resumen_de_trazabilidad_fecha", nullable = false)
    private Date resumenDeTrazabilidadFecha;

    @ManyToOne
    @JoinColumn(name = "resumen_de_trazabilidad_lote", nullable = false)
    private Lote resumenDeTrazabilidadLote;

    @ManyToOne
    @JoinColumn(name = "resumen_de_trazabilidad_producto")
    private Producto resumenDeTrazabilidadProducto;

    @Column(name = "resumen_de_trazabilidad_cantidad_producida", nullable = false)
    private Double resumenDeTrazabilidadCantidadProducida;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "resumen_de_trazabilidad_carnes", joinColumns = @JoinColumn(name = "resumen_de_trazabilidad_id"), inverseJoinColumns = @JoinColumn(name = "carne_id"))
    private Set<Carne> resumenDeTrazabilidadMatPrimaCarnica = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "resumen_de_trazabilidad_insumos", joinColumns = @JoinColumn(name = "resumen_de_trazabilidad_id"), inverseJoinColumns = @JoinColumn(name = "insumo_id"))
    private Set<Control_de_Insumos> resumenDeTrazabilidadMatPrimaNoCarnica = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "resumen_de_trazabilidad_destinos", joinColumns = @JoinColumn(name = "resumen_de_trazabilidad_id"), inverseJoinColumns = @JoinColumn(name = "cliente_id"))
    private Set<Cliente> resumenDeTrazabilidadDestino = new HashSet<>();

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

    public Producto getResumenDeTrazabilidadProducto() {
        return resumenDeTrazabilidadProducto;
    }

    public void setResumenDeTrazabilidadProducto(Producto resumenDeTrazabilidadProducto) {
        this.resumenDeTrazabilidadProducto = resumenDeTrazabilidadProducto;
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

    public void setResumenDeTrazabilidadMatPrimaNoCarnica(
            Set<Control_de_Insumos> resumenDeTrazabilidadMatPrimaNoCarnica) {
        this.resumenDeTrazabilidadMatPrimaNoCarnica = resumenDeTrazabilidadMatPrimaNoCarnica;
    }

    public Set<Cliente> getResumenDeTrazabilidadDestino() {
        return resumenDeTrazabilidadDestino;
    }

    public void setResumenDeTrazabilidadDestino(Set<Cliente> resumenDeTrazabilidadDestino) {
        this.resumenDeTrazabilidadDestino = resumenDeTrazabilidadDestino;
    }

    public Usuario getResumenDeTrazabilidadResponsable() {
        return resumenDeTrazabilidadResponsable;
    }

    public void setResumenDeTrazabilidadResponsable(Usuario resumenDeTrazabilidadResponsable) {
        this.resumenDeTrazabilidadResponsable = resumenDeTrazabilidadResponsable;
    }

    public PResumen_de_Trazabilidad(Long resumenDeTrazabilidadId, Date resumenDeTrazabilidadFecha,
            Lote resumenDeTrazabilidadLote, Producto resumenDeTrazabilidadProducto,
            Double resumenDeTrazabilidadCantidadProducida, Set<Carne> resumenDeTrazabilidadMatPrimaCarnica,
            Set<Control_de_Insumos> resumenDeTrazabilidadMatPrimaNoCarnica, Set<Cliente> resumenDeTrazabilidadDestino,
            Usuario resumenDeTrazabilidadResponsable) {
        this.resumenDeTrazabilidadId = resumenDeTrazabilidadId;
        this.resumenDeTrazabilidadFecha = resumenDeTrazabilidadFecha;
        this.resumenDeTrazabilidadLote = resumenDeTrazabilidadLote;
        this.resumenDeTrazabilidadProducto = resumenDeTrazabilidadProducto;
        this.resumenDeTrazabilidadCantidadProducida = resumenDeTrazabilidadCantidadProducida;
        this.resumenDeTrazabilidadMatPrimaCarnica = resumenDeTrazabilidadMatPrimaCarnica;
        this.resumenDeTrazabilidadMatPrimaNoCarnica = resumenDeTrazabilidadMatPrimaNoCarnica;
        this.resumenDeTrazabilidadDestino = resumenDeTrazabilidadDestino;
        this.resumenDeTrazabilidadResponsable = resumenDeTrazabilidadResponsable;
    }

    public PResumen_de_Trazabilidad(Date resumenDeTrazabilidadFecha,
            Lote resumenDeTrazabilidadLote, Producto resumenDeTrazabilidadProducto,
            Double resumenDeTrazabilidadCantidadProducida, Set<Carne> resumenDeTrazabilidadMatPrimaCarnica,
            Set<Control_de_Insumos> resumenDeTrazabilidadMatPrimaNoCarnica, Set<Cliente> resumenDeTrazabilidadDestino,
            Usuario resumenDeTrazabilidadResponsable) {
        this.resumenDeTrazabilidadFecha = resumenDeTrazabilidadFecha;
        this.resumenDeTrazabilidadLote = resumenDeTrazabilidadLote;
        this.resumenDeTrazabilidadProducto = resumenDeTrazabilidadProducto;
        this.resumenDeTrazabilidadCantidadProducida = resumenDeTrazabilidadCantidadProducida;
        this.resumenDeTrazabilidadMatPrimaCarnica = resumenDeTrazabilidadMatPrimaCarnica;
        this.resumenDeTrazabilidadMatPrimaNoCarnica = resumenDeTrazabilidadMatPrimaNoCarnica;
        this.resumenDeTrazabilidadDestino = resumenDeTrazabilidadDestino;
        this.resumenDeTrazabilidadResponsable = resumenDeTrazabilidadResponsable;
    }

    public PResumen_de_Trazabilidad() {
    }

}
