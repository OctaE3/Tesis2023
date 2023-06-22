package com.chacineria.marcelina.entidad.insumo;
import com.chacineria.marcelina.entidad.trazabilidad.PExpedicion_de_Producto;

import java.util.Set;
import java.util.HashSet;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Column;
import javax.persistence.GenerationType;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

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

    public Lote(Long loteId, Integer loteCodigo, Set<Producto> loteProductos) {
        this.loteId = loteId;
        this.loteCodigo = loteCodigo;
        this.loteProductos = loteProductos;
    }

    public Lote() { }

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "expedicionDeProductoLotes")
    @JsonIgnore
    private Set<PExpedicion_de_Producto> expedicionDeProducto = new HashSet<>();
    
}
