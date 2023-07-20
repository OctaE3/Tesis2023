package com.chacineria.marcelina.entidad.insumo;
import com.chacineria.marcelina.entidad.persona.Proveedor;
import com.chacineria.marcelina.entidad.persona.Usuario;
import com.chacineria.marcelina.entidad.trazabilidad.PResumen_de_Trazabilidad;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.sql.Date;
import java.util.Set;
import java.util.HashSet;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity(name = "insumos")
public class Control_de_Insumos implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "insumo_id")
    private Long insumoId;

    @Column(name = "insumo_nombre", length = 50, nullable = false)
    private String insumoNombre;

    @Column(name = "insumo_fecha", nullable = false)
    private Date insumoFecha;

    @ManyToOne
    @JoinColumn(name = "insumo_proveedor", nullable = false)
    private Proveedor insumoProveedor;

    @Column(name = "insumo_tipo", length = 30, nullable = false)
    private String insumoTipo;

    @Column(name = "insumo_lote", length = 30, nullable = false)
    private String insumoNroLote;

    @Column(name = "insumo_motivo_de_rechazo", length = 150, nullable = true)
    private String insumoMotivoDeRechazo;

    @ManyToOne
    @JoinColumn(name = "insumo_responsable", nullable = false)
    private Usuario insumoResponsable;

    @Column(name = "insumo_fecha_vencimiento", nullable = false)
    private Date insumoFechaVencimiento;

    @Column(name = "insumo_eliminado")
    private Boolean insumoEliminado = false;

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

    public Usuario getInsumoResponsable() {
        return insumoResponsable;
    }

    public void setInsumoResponsable(Usuario insumoResponsable) {
        this.insumoResponsable = insumoResponsable;
    }

    public Date getInsumoFechaVencimiento() {
        return insumoFechaVencimiento;
    }

    public void setInsumoFechaVencimiento(Date insumoFechaVencimiento) {
        this.insumoFechaVencimiento = insumoFechaVencimiento;
    }
    
    public Boolean getInsumoEliminado() {
        return insumoEliminado;
    }

    public void setInsumoEliminado(Boolean insumoEliminado) {
        this.insumoEliminado = insumoEliminado;
    }

    public Control_de_Insumos(Long insumoId, String insumoNombre, Date insumoFecha, Proveedor insumoProveedor, String insumoTipo,
            String insumoNroLote, String insumoMotivoDeRechazo, Usuario insumoResponsable, Date insumoFechaVencimiento, Boolean insumoEliminado) {
        this.insumoId = insumoId;
        this.insumoNombre = insumoNombre;
        this.insumoFecha = insumoFecha;
        this.insumoProveedor = insumoProveedor;
        this.insumoTipo = insumoTipo;
        this.insumoNroLote = insumoNroLote;
        this.insumoMotivoDeRechazo = insumoMotivoDeRechazo;
        this.insumoResponsable = insumoResponsable;
        this.insumoFechaVencimiento = insumoFechaVencimiento;
        this.insumoEliminado = insumoEliminado;
    }

    public Control_de_Insumos() { }
    
    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "diariaDeProduccionAditivos")
    @JsonIgnore
    private Set<PDiaria_de_Produccion> diariaDeProduccion = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "resumenDeTrazabilidadMatPrimaNoCarnica")
    @JsonIgnore
    private Set<PResumen_de_Trazabilidad> resumenDeTrazabilidad = new HashSet<>();

}
