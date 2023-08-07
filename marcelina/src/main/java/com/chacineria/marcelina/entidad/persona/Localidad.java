package com.chacineria.marcelina.entidad.persona;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "localidadades")
public class Localidad implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "localidad_id")
    private Long localidadId;

    @Column(name = "localidad_departamento", length = 40, nullable = false)
    private String localidadDepartamento;

    @Column(name = "localidad_ciudad", length = 50, nullable = false)
    private String localidadCiudad;

    @Column(name = "localidad_eliminado")
    private Boolean localidadEliminado = false;

    public Long getLocalidadId() {
        return localidadId;
    }

    public void setLocalidadId(Long localidadId) {
        this.localidadId = localidadId;
    }

    public String getLocalidadDepartamento() {
        return localidadDepartamento;
    }

    public void setLocalidadDepartamento(String localidadDepartamento) {
        this.localidadDepartamento = localidadDepartamento;
    }

    public String getLocalidadCiudad() {
        return localidadCiudad;
    }

    public void setLocalidadCiudad(String localidadCiudad) {
        this.localidadCiudad = localidadCiudad;
    }

    public Boolean getLocalidadEliminado() {
        return localidadEliminado;
    }

    public void setLocalidadEliminado(Boolean localidadEliminado) {
        this.localidadEliminado = localidadEliminado;
    }

    public Localidad(Long localidadId, String localidadDepartamento, String localidadCiudad,
            Boolean localidadEliminado) {
        this.localidadId = localidadId;
        this.localidadDepartamento = localidadDepartamento;
        this.localidadCiudad = localidadCiudad;
        this.localidadEliminado = localidadEliminado;
    }

    public Localidad() {
    }
    
}
