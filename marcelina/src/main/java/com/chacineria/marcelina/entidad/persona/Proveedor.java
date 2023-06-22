package com.chacineria.marcelina.entidad.persona;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Column;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

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
    @JoinColumn(name = "proveedor_localidad")
    private Localidad proveedorLocalidad;

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

    public Proveedor(Long proveedorId, String proveedorNombre, String proveedorRUT, String proveedorContacto,
            Localidad proveedorLocalidad) {
        this.proveedorId = proveedorId;
        this.proveedorNombre = proveedorNombre;
        this.proveedorRUT = proveedorRUT;
        this.proveedorContacto = proveedorContacto;
        this.proveedorLocalidad = proveedorLocalidad;
    }

    public Proveedor() { }
}
