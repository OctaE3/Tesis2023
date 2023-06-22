package com.chacineria.marcelina.entidad.insumo;

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
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

@Entity(name = "diaria_de_produccion")
public class PDiaria_de_Produccion implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diaria_de_produccion_id")
    private Long diariaDeProduccionId;

    @ManyToOne
    @JoinColumn(name = "diaria_de_produccion_producto", nullable = false)
    private Producto diariaDeProduccionProducto;

    @ManyToMany
    @JoinTable(
        name = "diaria_de_produccion_carnes",
        joinColumns = @JoinColumn(name = "diaria_de_produccion_id"),
        inverseJoinColumns = @JoinColumn(name = "carne_id"))
    private Set<Carne> diariaDeProduccionInsumosCarnicos = new HashSet<>();
    
    @ManyToMany
    @JoinTable(
        name = "diaria_de_produccion_insumos_aditivos",
        joinColumns = @JoinColumn(name = "diaria_de_produccion_id"),
        inverseJoinColumns = @JoinColumn(name = "control_de_insumos_id"))
    private Set<Control_de_Insumos> diariaDeProduccionAditivos = new HashSet<>();

    @Column(name = "diaria_de_produccion_cantidad_producida", nullable = false)
    private Double diariaDeProduccionCantidadProducida;

    @Column(name = "diara_de_produccion_fecha", nullable = false)
    private Date diariaDeProduccionFecha;

    @Column(name = "diaria_de_produccion_lote", nullable = false, unique = true)
    private Integer diariaDeProduccionLote;

    @Column(name = "diaria_de_produccion_responsable", length = 50, nullable = false)
    private String diariaDeProduccionResponsable;

    @Column(name = "diaria_de_produccion_envasado", nullable = false)
    private Boolean diariaDeProduccionEnvasado;

    @Column(name = "diaria_de_produccion_fecha_vencimiento", nullable = false)
    private Date diariaDeProduccionFechaVencimiento;

    public Long getDiariaDeProduccionId() {
        return diariaDeProduccionId;
    }

    public void setDiariaDeProduccionId(Long diariaDeProduccionId) {
        this.diariaDeProduccionId = diariaDeProduccionId;
    }

    public Producto getDiariaDeProduccionProducto() {
        return diariaDeProduccionProducto;
    }

    public void setDiariaDeProduccionProducto(Producto diariaDeProduccionProducto) {
        this.diariaDeProduccionProducto = diariaDeProduccionProducto;
    }

    public Set<Carne> getDiariaDeProduccionInsumosCarnicos() {
        return diariaDeProduccionInsumosCarnicos;
    }

    public void setDiariaDeProduccionInsumosCarnicos(Set<Carne> diariaDeProduccionInsumosCarnicos) {
        this.diariaDeProduccionInsumosCarnicos = diariaDeProduccionInsumosCarnicos;
    }

    public Set<Control_de_Insumos> getDiariaDeProduccionAditivos() {
        return diariaDeProduccionAditivos;
    }

    public void setDiariaDeProduccionAditivos(Set<Control_de_Insumos> diariaDeProduccionAditivos) {
        this.diariaDeProduccionAditivos = diariaDeProduccionAditivos;
    }

    public Double getDiariaDeProduccionCantidadProducida() {
        return diariaDeProduccionCantidadProducida;
    }

    public void setDiariaDeProduccionCantidadProducida(Double diariaDeProduccionCantidadProducida) {
        this.diariaDeProduccionCantidadProducida = diariaDeProduccionCantidadProducida;
    }

    public Date getDiariaDeProduccionFecha() {
        return diariaDeProduccionFecha;
    }

    public void setDiariaDeProduccionFecha(Date diariaDeProduccionFecha) {
        this.diariaDeProduccionFecha = diariaDeProduccionFecha;
    }

    public Integer getDiariaDeProduccionLote() {
        return diariaDeProduccionLote;
    }

    public void setDiariaDeProduccionLote(Integer diariaDeProduccionLote) {
        this.diariaDeProduccionLote = diariaDeProduccionLote;
    }

    public String getDiariaDeProduccionResponsable() {
        return diariaDeProduccionResponsable;
    }

    public void setDiariaDeProduccionResponsable(String diariaDeProduccionResponsable) {
        this.diariaDeProduccionResponsable = diariaDeProduccionResponsable;
    }

    public Boolean getDiariaDeProduccionEnvasado() {
        return diariaDeProduccionEnvasado;
    }

    public void setDiariaDeProduccionEnvasado(Boolean diariaDeProduccionEnvasado) {
        this.diariaDeProduccionEnvasado = diariaDeProduccionEnvasado;
    }

    public Date getDiariaDeProduccionFechaVencimiento() {
        return diariaDeProduccionFechaVencimiento;
    }

    public void setDiariaDeProduccionFechaVencimiento(Date diariaDeProduccionFechaVencimiento) {
        this.diariaDeProduccionFechaVencimiento = diariaDeProduccionFechaVencimiento;
    }

    public PDiaria_de_Produccion(Long diariaDeProduccionId, Producto diariaDeProduccionProducto,
            Set<Carne> diariaDeProduccionInsumosCarnicos, Set<Control_de_Insumos> diariaDeProduccionAditivos,
            Double diariaDeProduccionCantidadProducida, Date diariaDeProduccionFecha, Integer diariaDeProduccionLote,
            String diariaDeProduccionResponsable, Boolean diariaDeProduccionEnvasado,
            Date diariaDeProduccionFechaVencimiento) {
        this.diariaDeProduccionId = diariaDeProduccionId;
        this.diariaDeProduccionProducto = diariaDeProduccionProducto;
        this.diariaDeProduccionInsumosCarnicos = diariaDeProduccionInsumosCarnicos;
        this.diariaDeProduccionAditivos = diariaDeProduccionAditivos;
        this.diariaDeProduccionCantidadProducida = diariaDeProduccionCantidadProducida;
        this.diariaDeProduccionFecha = diariaDeProduccionFecha;
        this.diariaDeProduccionLote = diariaDeProduccionLote;
        this.diariaDeProduccionResponsable = diariaDeProduccionResponsable;
        this.diariaDeProduccionEnvasado = diariaDeProduccionEnvasado;
        this.diariaDeProduccionFechaVencimiento = diariaDeProduccionFechaVencimiento;
    }

    public PDiaria_de_Produccion() { }
}
