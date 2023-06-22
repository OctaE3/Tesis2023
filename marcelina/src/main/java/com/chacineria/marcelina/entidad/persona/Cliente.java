package com.chacineria.marcelina.entidad.persona;
import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

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

    public Cliente(Long clienteId, String clienteNombre, String clienteContacto, String clienteObservaciones,
            Localidad clienteLocalidad) {
        this.clienteId = clienteId;
        this.clienteNombre = clienteNombre;
        this.clienteContacto = clienteContacto;
        this.clienteObservaciones = clienteObservaciones;
        this.clienteLocalidad = clienteLocalidad;
    }

    public Cliente() { }
}
