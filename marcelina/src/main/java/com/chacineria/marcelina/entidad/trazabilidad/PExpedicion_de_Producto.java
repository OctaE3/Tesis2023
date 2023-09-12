package com.chacineria.marcelina.entidad.trazabilidad;
import com.chacineria.marcelina.entidad.insumo.Producto;
import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Lote;
import com.chacineria.marcelina.entidad.insumo.Lote;
import com.chacineria.marcelina.entidad.persona.Cliente;
import com.chacineria.marcelina.entidad.persona.Usuario;

import java.io.Serializable;
import java.sql.Date;
import java.util.Set;
import java.util.HashSet;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity(name = "expedicion_de_productos")
public class PExpedicion_de_Producto implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "expedicion_de_producto_id")
    private Long expedicionDeProductoId;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "expedicion_de_producto_productos",
        joinColumns = @JoinColumn(name = "expedicion_de_producto_id"),
        inverseJoinColumns = @JoinColumn(name = "producto_id"))
    private Set<Producto> expedicionDeProductoProductos = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "expedicion_de_producto_lotes",
        joinColumns = @JoinColumn(name = "expedicion_de_producto_id"),
        inverseJoinColumns = @JoinColumn(name = "lote_id"))
    private Set<Lote> expedicionDeProductoLotes = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "expedicion_de_producto_cantidad",
        joinColumns = @JoinColumn(name = "expedicion_de_producto_id"),
        inverseJoinColumns = @JoinColumn(name = "detalle_cantidad_lote_id"))
    private Set<Detalle_Cantidad_Lote> expedicionDeProductoCantidad = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "expedicion_de_producto_cliente", nullable = false)
    private Cliente expedicionDeProductoCliente;

    @Column(name = "expedicion_de_producto_documento", nullable = false, unique = true)
    private Integer expedicionDeProductoDocumento;

    @ManyToOne
    @JoinColumn(name = "expedicion_de_producto_responsable", nullable = false)
    private Usuario expedicionDeProductoUsuario;

    @Column(name = "expedicion_de_producto_fecha", nullable = false)
    private Date expedicionDeProductoFecha;

    public Long getExpedicionDeProductoId() {
        return expedicionDeProductoId;
    }

    public void setExpedicionDeProductoId(Long expedicionDeProductoId) {
        this.expedicionDeProductoId = expedicionDeProductoId;
    }

    public Set<Producto> getExpedicionDeProductoProductos() {
        return expedicionDeProductoProductos;
    }

    public void setExpedicionDeProductoProductos(Set<Producto> expedicionDeProductoProductos) {
        this.expedicionDeProductoProductos = expedicionDeProductoProductos;
    }

    public Set<Lote> getExpedicionDeProductoLotes() {
        return expedicionDeProductoLotes;
    }

    public void setExpedicionDeProductoLotes(Set<Lote> expedicionDeProductoLotes) {
        this.expedicionDeProductoLotes = expedicionDeProductoLotes;
    }

    public Set<Detalle_Cantidad_Lote> getExpedicionDeProductoCantidad() {
        return expedicionDeProductoCantidad;
    }

    public void setExpedicionDeProductoCantidad(Set<Detalle_Cantidad_Lote> expedicionDeProductoCantidad) {
        this.expedicionDeProductoCantidad = expedicionDeProductoCantidad;
    }

    public Cliente getExpedicionDeProductoCliente() {
        return expedicionDeProductoCliente;
    }

    public void setExpedicionDeProductoCliente(Cliente expedicionDeProductoCliente) {
        this.expedicionDeProductoCliente = expedicionDeProductoCliente;
    }

    public Integer getExpedicionDeProductoDocumento() {
        return expedicionDeProductoDocumento;
    }

    public void setExpedicionDeProductoDocumento(Integer expedicionDeProductoDocumento) {
        this.expedicionDeProductoDocumento = expedicionDeProductoDocumento;
    }

    public Usuario getExpedicionDeProductoUsuario() {
        return expedicionDeProductoUsuario;
    }

    public void setExpedicionDeProductoUsuario(Usuario expedicionDeProductoUsuario) {
        this.expedicionDeProductoUsuario = expedicionDeProductoUsuario;
    }

    public Date getExpedicionDeProductoFecha() {
        return expedicionDeProductoFecha;
    }

    public void setExpedicionDeProductoFecha(Date expedicionDeProductoFecha) {
        this.expedicionDeProductoFecha = expedicionDeProductoFecha;
    }

    public PExpedicion_de_Producto(Long expedicionDeProductoId, Set<Producto> expedicionDeProductoProductos,
            Set<Lote> expedicionDeProductoLotes, Set<Detalle_Cantidad_Lote> expedicionDeProductoCantidad,
            Cliente expedicionDeProductoCliente, Integer expedicionDeProductoDocumento,
            Usuario expedicionDeProductoUsuario, Date expedicionDeProductoFecha) {
        this.expedicionDeProductoId = expedicionDeProductoId;
        this.expedicionDeProductoProductos = expedicionDeProductoProductos;
        this.expedicionDeProductoLotes = expedicionDeProductoLotes;
        this.expedicionDeProductoCantidad = expedicionDeProductoCantidad;
        this.expedicionDeProductoCliente = expedicionDeProductoCliente;
        this.expedicionDeProductoDocumento = expedicionDeProductoDocumento;
        this.expedicionDeProductoUsuario = expedicionDeProductoUsuario;
        this.expedicionDeProductoFecha = expedicionDeProductoFecha;
    }

    public PExpedicion_de_Producto() {
    }


}
