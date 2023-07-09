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
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity(name = "lotes")
public class Lote {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lote_id")
    private Long loteId;

    @Column(name = "lote_codigo", nullable = false, unique = true)
    private Integer loteCodigo;

    @ManyToMany
    @JoinTable(
        name = "lote_productos",
        joinColumns = @JoinColumn(name = "lote_id"),
        inverseJoinColumns = @JoinColumn(name = "producto_id"))
    private Set<Producto> loteProductos = new HashSet<>();

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

    public Set<Producto> getLoteProductos() {
        return loteProductos;
    }

    public void setLoteProductos(Set<Producto> loteProductos) {
        this.loteProductos = loteProductos;
    }

    public Boolean getLoteEliminado() {
        return loteEliminado;
    }

    public void setLoteEliminado(Boolean loteEliminado) {
        this.loteEliminado = loteEliminado;
    }

    public Lote(Long loteId, Integer loteCodigo, Set<Producto> loteProductos, Boolean loteEliminado) {
        this.loteId = loteId;
        this.loteCodigo = loteCodigo;
        this.loteProductos = loteProductos;
        this.loteEliminado = loteEliminado;
    }

    public Lote() { }

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "expedicionDeProductoLotes")
    @JsonIgnore
    private Set<PExpedicion_de_Producto> expedicionDeProducto = new HashSet<>();
    
}
