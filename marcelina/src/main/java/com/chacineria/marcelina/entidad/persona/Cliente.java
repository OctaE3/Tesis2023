package com.chacineria.marcelina.entidad.persona;
import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "clientes")
public class Cliente implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(name = "cliente_nombre", length = 30, nullable = false)
    private String clienteNombre;

    @Column(name = "cliente_contacto", length = 9, nullable = false, unique = true)
    private String clienteContacto;

    @Column(name = "cliente_observaciones", length = 150, nullable = true)
    private String clienteObservaciones;

    @ManyToOne
    @JoinColumn(name = "cliente_localidad")
    private Localidad clienteLocalidad;

    @Column(name = "cliente_eliminado")
    private Boolean clienteEliminado = false;

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public String getClienteNombre() {
        return clienteNombre;
    }

    public void setClienteNombre(String clienteNombre) {
        this.clienteNombre = clienteNombre;
    }

    public String getClienteContacto() {
        return clienteContacto;
    }

    public void setClienteContacto(String clienteContacto) {
        this.clienteContacto = clienteContacto;
    }

    public String getClienteObservaciones() {
        return clienteObservaciones;
    }

    public void setClienteObservaciones(String clienteObservaciones) {
        this.clienteObservaciones = clienteObservaciones;
    }

    public Localidad getClienteLocalidad() {
        return clienteLocalidad;
    }

    public void setClienteLocalidad(Localidad clienteLocalidad) {
        this.clienteLocalidad = clienteLocalidad;
    }

    public Boolean getClienteEliminado() {
        return clienteEliminado;
    }

    public void setClienteEliminado(Boolean clienteEliminado) {
        this.clienteEliminado = clienteEliminado;
    }

    public Cliente(Long clienteId, String clienteNombre, String clienteContacto, String clienteObservaciones,
            Localidad clienteLocalidad, Boolean clienteEliminado) {
        this.clienteId = clienteId;
        this.clienteNombre = clienteNombre;
        this.clienteContacto = clienteContacto;
        this.clienteObservaciones = clienteObservaciones;
        this.clienteLocalidad = clienteLocalidad;
        this.clienteEliminado = clienteEliminado;
    }

    public Cliente() { }

    
}
