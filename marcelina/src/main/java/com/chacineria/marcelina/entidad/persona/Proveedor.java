package com.chacineria.marcelina.entidad.persona;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Column;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "proveedores")
public class Proveedor implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "proveedor_id")
    private Long proveedorId;

    @Column(name = "proveedor_nombre", length = 30, nullable = false)
    private String proveedorNombre;

    @Column(name = "proveedor_rut", length = 12, nullable = false, unique = true)
    private String proveedorRUT;

    @Column(name = "proveedor_contacto", length = 9, nullable = false, unique = true)
    private String proveedorContacto;

    @ManyToOne
    @JoinColumn(name = "proveedor_localidad", nullable = false)
    private Localidad proveedorLocalidad;

    @Column(name = "proveedor_eliminado")
    private Boolean proveedorEliminado = false;

    public Long getProveedorId() {
        return proveedorId;
    }

    public void setProveedorId(Long proveedorId) {
        this.proveedorId = proveedorId;
    }

    public String getProveedorNombre() {
        return proveedorNombre;
    }

    public void setProveedorNombre(String proveedorNombre) {
        this.proveedorNombre = proveedorNombre;
    }

    public String getProveedorRUT() {
        return proveedorRUT;
    }

    public void setProveedorRUT(String proveedorRUT) {
        this.proveedorRUT = proveedorRUT;
    }

    public String getProveedorContacto() {
        return proveedorContacto;
    }

    public void setProveedorContacto(String proveedorContacto) {
        this.proveedorContacto = proveedorContacto;
    }

    public Localidad getProveedorLocalidad() {
        return proveedorLocalidad;
    }

    public void setProveedorLocalidad(Localidad proveedorLocalidad) {
        this.proveedorLocalidad = proveedorLocalidad;
    }

    public Boolean getProveedorEliminado() {
        return proveedorEliminado;
    }

    public void setProveedorEliminado(Boolean proveedorEliminado) {
        this.proveedorEliminado = proveedorEliminado;
    }

    public Proveedor(Long proveedorId, String proveedorNombre, String proveedorRUT, String proveedorContacto,
            Localidad proveedorLocalidad, Boolean proveedorEliminado) {
        this.proveedorId = proveedorId;
        this.proveedorNombre = proveedorNombre;
        this.proveedorRUT = proveedorRUT;
        this.proveedorContacto = proveedorContacto;
        this.proveedorLocalidad = proveedorLocalidad;
        this.proveedorEliminado = proveedorEliminado;
    }

    public Proveedor() { }
}
