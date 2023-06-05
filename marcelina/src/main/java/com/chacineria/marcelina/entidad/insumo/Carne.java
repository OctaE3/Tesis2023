package com.chacineria.marcelina.entidad.insumo;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Carne implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long carneId;

    @Column(length = 80, nullable = false)
    private String carneNombre;

    @Column(length = 30, nullable = false)
    private String carneTipo;

    @Column(length = 60, nullable = false)
    private String carneCorte;

    @Column(nullable = false)
    private Double carneCantidad;

    @Column(length = 999999999, nullable = false, unique = true)
    private String carnePaseSanitario;

    public Long getCarneId() {
        return carneId;
    }

    public void setCarneId(Long carneId) {
        this.carneId = carneId;
    }

    public String getCarneNombre() {
        return carneNombre;
    }

    public void setCarneNombre(String carneNombre) {
        this.carneNombre = carneNombre;
    }

    public String getCarneTipo() {
        return carneTipo;
    }

    public void setCarneTipo(String carneTipo) {
        this.carneTipo = carneTipo;
    }

    public String getCarneCorte() {
        return carneCorte;
    }

    public void setCarneCorte(String carneCorte) {
        this.carneCorte = carneCorte;
    }

    public Double getCarneCantidad() {
        return carneCantidad;
    }

    public void setCarneCantidad(Double carneCantidad) {
        this.carneCantidad = carneCantidad;
    }

    public String getCarnePaseSanitario() {
        return carnePaseSanitario;
    }

    public void setCarnePaseSanitario(String carnePaseSanitario) {
        this.carnePaseSanitario = carnePaseSanitario;
    }

    public Carne(Long carneId, String carneNombre, String carneTipo, String carneCorte, Double carneCantidad,
            String carnePaseSanitario) {
        this.carneId = carneId;
        this.carneNombre = carneNombre;
        this.carneTipo = carneTipo;
        this.carneCorte = carneCorte;
        this.carneCantidad = carneCantidad;
        this.carnePaseSanitario = carnePaseSanitario;
    }

    
}
