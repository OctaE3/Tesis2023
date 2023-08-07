package com.chacineria.marcelina.entidad.insumo;

import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Carne;
import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Insumo;
import com.chacineria.marcelina.entidad.persona.Usuario;

import java.io.Serializable;
import java.util.Set;
import java.util.HashSet;
import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity(name = "diaria_de_produccion")
public class PDiaria_de_Produccion implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diaria_de_produccion_id")
    private Long diariaDeProduccionId;

    @ManyToOne
    @JoinColumn(name = "diaria_de_produccion_producto", nullable = false)
    private Producto diariaDeProduccionProducto;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "diaria_de_produccion_carnes",
        joinColumns = @JoinColumn(name = "diaria_de_produccion_id"),
        inverseJoinColumns = @JoinColumn(name = "carne_id"))
    private Set<Carne> diariaDeProduccionInsumosCarnicos = new HashSet<>();
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "diaria_de_produccion_carne_cantidad",
        joinColumns = @JoinColumn(name = "diaria_de_produccion_id"),
        inverseJoinColumns = @JoinColumn(name = "detalle_cantidad_carne_id")
    )
    private Set<Detalle_Cantidad_Carne> diariaDeProduccionCantidadUtilizadaCarnes;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "diaria_de_produccion_insumos_aditivos",
        joinColumns = @JoinColumn(name = "diaria_de_produccion_id"),
        inverseJoinColumns = @JoinColumn(name = "control_de_insumos_id"))
    private Set<Control_de_Insumos> diariaDeProduccionAditivos = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "diaria_de_produccion_insumo_cantidad",
        joinColumns = @JoinColumn(name = "diaria_de_produccion_id"),
        inverseJoinColumns = @JoinColumn(name = "detalle_cantidad_insumo_id")
    )
    private Set<Detalle_Cantidad_Insumo> diariaDeProduccionCantidadUtilizadaInsumos;

    @Column(name = "diaria_de_produccion_cantidad_producida", nullable = false)
    private Double diariaDeProduccionCantidadProducida;

    @Column(name = "diara_de_produccion_fecha", nullable = false)
    private Date diariaDeProduccionFecha;

    @ManyToOne
    @JoinColumn(name = "diaria_de_produccion_lote", nullable = false)
    private Lote diariaDeProduccionLote;

    @ManyToOne
    @JoinColumn(name = "diaria_de_produccion_responsable", nullable = false)
    private Usuario diariaDeProduccionResponsable;

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

    public Set<Detalle_Cantidad_Carne> getDiariaDeProduccionCantidadUtilizadaCarnes() {
        return diariaDeProduccionCantidadUtilizadaCarnes;
    }

    public void setDiariaDeProduccionCantidadUtilizadaCarnes(
            Set<Detalle_Cantidad_Carne> diariaDeProduccionCantidadUtilizadaCarnes) {
        this.diariaDeProduccionCantidadUtilizadaCarnes = diariaDeProduccionCantidadUtilizadaCarnes;
    }

    public Set<Control_de_Insumos> getDiariaDeProduccionAditivos() {
        return diariaDeProduccionAditivos;
    }

    public void setDiariaDeProduccionAditivos(Set<Control_de_Insumos> diariaDeProduccionAditivos) {
        this.diariaDeProduccionAditivos = diariaDeProduccionAditivos;
    }

    public Set<Detalle_Cantidad_Insumo> getDiariaDeProduccionCantidadUtilizadaInsumos() {
        return diariaDeProduccionCantidadUtilizadaInsumos;
    }

    public void setDiariaDeProduccionCantidadUtilizadaInsumos(
            Set<Detalle_Cantidad_Insumo> diariaDeProduccionCantidadUtilizadaInsumos) {
        this.diariaDeProduccionCantidadUtilizadaInsumos = diariaDeProduccionCantidadUtilizadaInsumos;
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

    public Lote getDiariaDeProduccionLote() {
        return diariaDeProduccionLote;
    }

    public void setDiariaDeProduccionLote(Lote diariaDeProduccionLote) {
        this.diariaDeProduccionLote = diariaDeProduccionLote;
    }

    public Usuario getDiariaDeProduccionResponsable() {
        return diariaDeProduccionResponsable;
    }

    public void setDiariaDeProduccionResponsable(Usuario diariaDeProduccionResponsable) {
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
            Set<Carne> diariaDeProduccionInsumosCarnicos,
            Set<Detalle_Cantidad_Carne> diariaDeProduccionCantidadUtilizadaCarnes,
            Set<Control_de_Insumos> diariaDeProduccionAditivos,
            Set<Detalle_Cantidad_Insumo> diariaDeProduccionCantidadUtilizadaInsumos,
            Double diariaDeProduccionCantidadProducida, Date diariaDeProduccionFecha, Lote diariaDeProduccionLote,
            Usuario diariaDeProduccionResponsable, Boolean diariaDeProduccionEnvasado,
            Date diariaDeProduccionFechaVencimiento) {
        this.diariaDeProduccionId = diariaDeProduccionId;
        this.diariaDeProduccionProducto = diariaDeProduccionProducto;
        this.diariaDeProduccionInsumosCarnicos = diariaDeProduccionInsumosCarnicos;
        this.diariaDeProduccionCantidadUtilizadaCarnes = diariaDeProduccionCantidadUtilizadaCarnes;
        this.diariaDeProduccionAditivos = diariaDeProduccionAditivos;
        this.diariaDeProduccionCantidadUtilizadaInsumos = diariaDeProduccionCantidadUtilizadaInsumos;
        this.diariaDeProduccionCantidadProducida = diariaDeProduccionCantidadProducida;
        this.diariaDeProduccionFecha = diariaDeProduccionFecha;
        this.diariaDeProduccionLote = diariaDeProduccionLote;
        this.diariaDeProduccionResponsable = diariaDeProduccionResponsable;
        this.diariaDeProduccionEnvasado = diariaDeProduccionEnvasado;
        this.diariaDeProduccionFechaVencimiento = diariaDeProduccionFechaVencimiento;
    }

    public PDiaria_de_Produccion() {
    }

}
