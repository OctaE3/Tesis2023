package com.chacineria.marcelina.entidad.insumo;
import com.chacineria.marcelina.entidad.trazabilidad.PResumen_de_Trazabilidad;

import java.io.Serializable;
import java.util.Set;
import java.util.HashSet;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity(name = "carnes")
public class Carne implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "carne_id")
    private Long carneId;

    @Column(name = "carne_nombre", length = 80, nullable = false)
    private String carneNombre;

    @Column(name = "carne_tipo", length = 30, nullable = false)
    private String carneTipo;

    @Column(name = "carne_corte", length = 60, nullable = false)
    private String carneCorte;

    @Column(name = "carne_cantidad", nullable = false)
    private Double carneCantidad;

    @Column(name = "carne_pase_sanitario", length = 30, nullable = false, unique = true)
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

    public Carne(){ }

    public Carne(Long carneId, String carneNombre, String carneTipo, String carneCorte, Double carneCantidad,
            String carnePaseSanitario) {
        this.carneId = carneId;
        this.carneNombre = carneNombre;
        this.carneTipo = carneTipo;
        this.carneCorte = carneCorte;
        this.carneCantidad = carneCantidad;
        this.carnePaseSanitario = carnePaseSanitario;
    }

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "recepcionDeMateriasPrimasCarnicasProductos")
    @JsonIgnore
    private Set<PRecepcion_de_Materias_Primas_Carnicas> recepcion_materias_primas_carnicas = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "diariaDeProduccionInsumosCarnicos")
    @JsonIgnore
    private Set<PDiaria_de_Produccion> diariaDeProduccion = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "resumenDeTrazabilidadMatPrimaCarnica")
    @JsonIgnore
    private Set<PResumen_de_Trazabilidad> resumenDeTrazabilidad = new HashSet<>();
}
