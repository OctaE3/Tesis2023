package com.chacineria.marcelina.entidad.insumo;

import java.util.*;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Column;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;

@Entity(name = "lotes")
public class Lote {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lote_id")
    private Long loteId;

    @Column(name = "lote_codigo", nullable = false, unique = true)
    private Integer loteCodigo;

    @OneToMany
    @JoinColumn(name = "lote_producto")
    private List<Producto> loteProductos;

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

    public List<Producto> getLoteProductos() {
        return loteProductos;
    }

    public void setLoteProductos(List<Producto> loteProductos) {
        this.loteProductos = loteProductos;
    }

    public Lote(Long loteId, Integer loteCodigo, List<Producto> loteProductos) {
        this.loteId = loteId;
        this.loteCodigo = loteCodigo;
        this.loteProductos = loteProductos;
    }

    
}
