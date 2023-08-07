package com.chacineria.marcelina.entidad.insumo;
import com.chacineria.marcelina.entidad.trazabilidad.PExpedicion_de_Producto;

import java.util.Set;
import java.util.HashSet;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Column;
import jakarta.persistence.GenerationType;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity(name = "lotes")
public class Lote {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lote_id")
    private Long loteId;

    @Column(name = "lote_codigo", nullable = false, unique = true)
    private Integer loteCodigo;

    @ManyToOne
    @JoinColumn(name = "lote_producto", nullable = false)
    private Producto loteProducto;

    @Column(name = "lote_cantidad", nullable = false)
    private Integer loteCantidad;

    @Column(name = "lote_eliminado")
    private Boolean loteEliminado = false;

    public Long getLoteId() {
        return loteId;
    }

    public void setLoteId(Long loteId) {
        this.loteId = loteId;
    }

    public Integer getLoteCodigo() {
        return loteCodigo;
    }

    public void setLoteCodigo(Integer loteCodigo) {
        this.loteCodigo = loteCodigo;
    }

    public Producto getLoteProducto() {
        return loteProducto;
    }

    public void setLoteProducto(Producto loteProducto) {
        this.loteProducto = loteProducto;
    }

    public Integer getLoteCantidad() {
        return loteCantidad;
    }

    public void setLoteCantidad(Integer loteCantidad) {
        this.loteCantidad = loteCantidad;
    }

    public Boolean getLoteEliminado() {
        return loteEliminado;
    }

    public void setLoteEliminado(Boolean loteEliminado) {
        this.loteEliminado = loteEliminado;
    }

    public Lote(Long loteId, Integer loteCodigo, Producto loteProducto, Integer loteCantidad, Boolean loteEliminado) {
        this.loteId = loteId;
        this.loteCodigo = loteCodigo;
        this.loteProducto = loteProducto;
        this.loteCantidad = loteCantidad;
        this.loteEliminado = loteEliminado;
    }

    public Lote() { }

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "expedicionDeProductoLotes")
    @JsonIgnore
    private Set<PExpedicion_de_Producto> expedicionDeProducto = new HashSet<>();
    
}
