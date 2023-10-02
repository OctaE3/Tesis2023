package com.chacineria.marcelina.entidad.persona;

import java.io.Serializable;
import java.util.List;

import com.chacineria.marcelina.entidad.insumo.PRecepcion_de_Materias_Primas_Carnicas;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity(name = "proveedores")
public class Proveedor implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "proveedor_id")
    private Long proveedorId;

    @Column(name = "proveedor_nombre", length = 30, nullable = false)
    private String proveedorNombre;

    @Column(name = "proveedor_rut", length = 12, nullable = false, unique = true)
    private String proveedorRUT;

    @Column(name = "proveedor_email", length = 50, nullable = true)
    private String proveedorEmail;

    @ElementCollection
    @CollectionTable(name = "proveedor_telefono", joinColumns = @JoinColumn(name = "proveedor_id"))
    @Column(name = "proveedor_contacto")
    private List<String> proveedorContacto;

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

    public String getProveedorEmail() {
        return proveedorEmail;
    }

    public void setProveedorEmail(String proveedorEmail) {
        this.proveedorEmail = proveedorEmail;
    }

    public List<String> getProveedorContacto() {
        return proveedorContacto;
    }

    public void setProveedorContacto(List<String> proveedorContacto) {
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

    public Proveedor(Long proveedorId, String proveedorNombre, String proveedorRUT, String proveedorEmail,
            List<String> proveedorContacto, Localidad proveedorLocalidad, Boolean proveedorEliminado) {
        this.proveedorId = proveedorId;
        this.proveedorNombre = proveedorNombre;
        this.proveedorRUT = proveedorRUT;
        this.proveedorEmail = proveedorEmail;
        this.proveedorContacto = proveedorContacto;
        this.proveedorLocalidad = proveedorLocalidad;
        this.proveedorEliminado = proveedorEliminado;
    }

    @OneToMany(mappedBy = "recepcionDeMateriasPrimasCarnicasProveedor")
    @JsonIgnore
    private List<PRecepcion_de_Materias_Primas_Carnicas> recepcionesDeMateriasPrimasCarnicas;

    public Proveedor() {
    }
}
