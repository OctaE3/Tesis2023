package com.chacineria.marcelina.entidad.insumo;
import com.chacineria.marcelina.entidad.trazabilidad.PResumen_de_Trazabilidad;
import com.chacineria.marcelina.entidad.trazabilidad.PExpedicion_de_Producto;

import java.io.Serializable;
import java.util.Set;
import java.util.HashSet;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity(name = "productos")
public class Producto implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "producto_id")
    private Long productoId;

    @Column(name = "producto_nombre", length = 50, nullable = false)
    private String productoNombre;

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public String getProductoNombre() {
        return productoNombre;
    }

    public void setProductoNombre(String productoNombre) {
        this.productoNombre = productoNombre;
    }

    public Producto(Long productoId, String productoNombre) {
        this.productoId = productoId;
        this.productoNombre = productoNombre;
    }

    public Producto() { }

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "loteProductos")
    @JsonIgnore
    private Set<Lote> lotes = new HashSet<>();
    
    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "resumenDeTrazabilidadProductos")
    @JsonIgnore
    private Set<PResumen_de_Trazabilidad> resumenDeTrazabilidad = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "expedicionDeProductoProductos")
    @JsonIgnore
    private Set<PExpedicion_de_Producto> expedicionDeProducto = new HashSet<>();
}
