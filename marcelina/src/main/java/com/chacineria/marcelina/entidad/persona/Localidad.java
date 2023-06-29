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

    @Column(name = "localidad_nombre", length = 40, nullable = false)
    private String localidadNombre;

    @Column(name = "localidad_eliminado")
    private Boolean localidadEliminado;

    public Long getLocalidadId() {
        return localidadId;
    }

    public void setLocalidadId(Long localidadId) {
        this.localidadId = localidadId;
    }

    public String getLocalidadNombre() {
        return localidadNombre;
    }

    public void setLocalidadNombre(String localidadNombre) {
        this.localidadNombre = localidadNombre;
    }

    public Boolean getLocalidadEliminado() {
        return localidadEliminado;
    }

    public void setLocalidadEliminado(Boolean localidadEliminado) {
        this.localidadEliminado = localidadEliminado;
    }

    public Localidad(Long localidadId, String localidadNombre, Boolean localidadEliminado) {
        this.localidadId = localidadId;
        this.localidadNombre = localidadNombre;
        this.localidadEliminado = localidadEliminado;
    }

    public Localidad() { }
}
