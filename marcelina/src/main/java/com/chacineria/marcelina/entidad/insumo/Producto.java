package com.chacineria.marcelina.entidad.insumo;
import com.chacineria.marcelina.entidad.trazabilidad.PResumen_de_Trazabilidad;
import com.chacineria.marcelina.entidad.trazabilidad.PExpedicion_de_Producto;

import java.io.Serializable;
import java.util.Set;
import java.util.HashSet;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity(name = "productos")
public class Producto implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "producto_id")
    private Long productoId;

    @Column(name = "producto_nombre", length = 50, nullable = false)
    private String productoNombre;

    @Column(name = "producto_eliminado")
    private Boolean productoEliminado;

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

    public Boolean getProductoEliminado() {
        return productoEliminado;
    }

    public void setProductoEliminado(Boolean productoEliminado) {
        this.productoEliminado = productoEliminado;
    }

    public Producto(Long productoId, String productoNombre, Boolean productoEliminado) {
        this.productoId = productoId;
        this.productoNombre = productoNombre;
        this.productoEliminado = productoEliminado;
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
