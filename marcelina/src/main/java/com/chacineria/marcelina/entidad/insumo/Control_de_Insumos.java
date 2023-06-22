package com.chacineria.marcelina.entidad.insumo;
import com.chacineria.marcelina.entidad.persona.Proveedor;
import com.chacineria.marcelina.entidad.trazabilidad.PResumen_de_Trazabilidad;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.sql.Date;
import java.util.Set;
import java.util.HashSet;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

@Entity(name = "control_de_insumos")
public class Control_de_Insumos implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "control_de_insumos_id")
    private Long insumoId;

    @Column(name = "control_de_insumos_nombre", length = 50, nullable = false)
    private String insumoNombre;

    @Column(name = "control_de_insumos_fecha", nullable = false)
    private Date insumoFecha;

    @ManyToOne
    @JoinColumn(name = "control_de_insumos_proveedor", nullable = false)
    private Proveedor insumoProveedor;

    @Column(name = "control_de_insumos_tipo", length = 20, nullable = false)
    private String insumoTipo;

    @Column(name = "control_de_insumos_lote", length = 30, nullable = false)
    private String insumoNroLote;

    @Column(name = "control_de_insumos_motivo_rechazo", length = 150, nullable = true)
    private String insumoMotivoDeRechazo;

    @Column(name = "control_de_insumos_responsable", length = 50, nullable = false)
    private String insumoResponsable;

    @Column(name = "control_de_insumos_fecha_vencimiento", nullable = false)
    private Date insumoFechaVencimiento;

    public Long getInsumoId() {
        return insumoId;
    }

    public void setInsumoId(Long insumoId) {
        this.insumoId = insumoId;
    }

    public String getInsumoNombre() {
        return insumoNombre;
    }

    public void setInsumoNombre(String insumoNombre) {
        this.insumoNombre = insumoNombre;
    }

    public Date getInsumoFecha() {
        return insumoFecha;
    }

    public void setInsumoFecha(Date insumoFecha) {
        this.insumoFecha = insumoFecha;
    }

    public Proveedor getInsumoProveedor() {
        return insumoProveedor;
    }

    public void setInsumoProveedor(Proveedor insumoProveedor) {
        this.insumoProveedor = insumoProveedor;
    }

    public String getInsumoTipo() {
        return insumoTipo;
    }

    public void setInsumoTipo(String insumoTipo) {
        this.insumoTipo = insumoTipo;
    }

    public String getInsumoNroLote() {
        return insumoNroLote;
    }

    public void setInsumoNroLote(String insumoNroLote) {
        this.insumoNroLote = insumoNroLote;
    }

    public String getInsumoMotivoDeRechazo() {
        return insumoMotivoDeRechazo;
    }

    public void setInsumoMotivoDeRechazo(String insumoMotivoDeRechazo) {
        this.insumoMotivoDeRechazo = insumoMotivoDeRechazo;
    }

    public String getInsumoResponsable() {
        return insumoResponsable;
    }

    public void setInsumoResponsable(String insumoResponsable) {
        this.insumoResponsable = insumoResponsable;
    }

    public Date getInsumoFechaVencimiento() {
        return insumoFechaVencimiento;
    }

    public void setInsumoFechaVencimiento(Date insumoFechaVencimiento) {
        this.insumoFechaVencimiento = insumoFechaVencimiento;
    }

    public Control_de_Insumos(Long insumoId, String insumoNombre, Date insumoFecha, Proveedor insumoProveedor, String insumoTipo,
            String insumoNroLote, String insumoMotivoDeRechazo, String insumoResponsable, Date insumoFechaVencimiento) {
        this.insumoId = insumoId;
        this.insumoNombre = insumoNombre;
        this.insumoFecha = insumoFecha;
        this.insumoProveedor = insumoProveedor;
        this.insumoTipo = insumoTipo;
        this.insumoNroLote = insumoNroLote;
        this.insumoMotivoDeRechazo = insumoMotivoDeRechazo;
        this.insumoResponsable = insumoResponsable;
        this.insumoFechaVencimiento = insumoFechaVencimiento;
    }

    public Control_de_Insumos() { }
    
    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "diariaDeProduccionAditivos")
    @JsonIgnore
    private Set<PDiaria_de_Produccion> diariaDeProduccion = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "resumenDeTrazabilidadMatPrimaNoCarnica")
    @JsonIgnore
    private Set<PResumen_de_Trazabilidad> resumenDeTrazabilidad = new HashSet<>();

}
