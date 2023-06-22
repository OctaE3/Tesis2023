package com.chacineria.marcelina.entidad.persona;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity(name = "localidadades")
public class Localidad implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "localidad_id")
    private Long localidadId;

    @Column(name = "localidad_nombre", length = 40, nullable = false)
    private String localidadNombre;

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

    public Localidad(Long localidadId, String localidadNombre) {
        this.localidadId = localidadId;
        this.localidadNombre = localidadNombre;
    }

    public Localidad() { }
}
