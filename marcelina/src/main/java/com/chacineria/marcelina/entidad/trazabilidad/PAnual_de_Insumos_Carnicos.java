package com.chacineria.marcelina.entidad.trazabilidad;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "anual_de_insumos_carnicos")
public class PAnual_de_Insumos_Carnicos implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "anual_de_insumos_carnicos_id")
    private Long anualDeInsumosCarnicosId;

    @Column(name = "anual_de_insumos_carnicos_mes", length = 10, nullable = false)
    private String anualDeInsumosCarnicosMes;

    @Column(name = "anual_de_insumos_carnicos_anio", nullable = false)
    private Integer anualDeInsumosCarnicosAnio;

    @Column(name = "anual_de_insumos_carnicos_carne_bovina_sh", nullable = false)
    private Integer anualDeInsumosCarnicosCarneBovinaSH;

    @Column(name = "anual_de_insumos_carnicos_carne_bovina_ch", nullable = false)
    private Integer anualDeInsumosCarnicosCarneBovinaCH;

    @Column(name = "anual_de_insumos_carnicos_higado", nullable = false)
    private Integer anualDeInsumosCarnicosHigado;

    @Column(name = "anual_de_insumos_carnicos_carne_porcina_sh", nullable = false)
    private Integer anualDeInsumosCarnicosCarnePorcinaSH;

    @Column(name = "anual_de_insumos_carnicos_carne_porcina_ch", nullable = false)
    private Integer anualDeInsumosCarnicosCarnePorcinaCH;

    @Column(name = "anual_de_insumos_carnicos_carne_porcina_grasa", nullable = false)
    private Integer anualDeInsumosCarnicosCarnePorcinaGrasa;

    @Column(name = "anual_de_insumos_carnicos_tripas_madejas", nullable = false)
    private Integer anualDeInsumosCarnicosTripasMadejas;

    @Column(name = "anual_de_insumos_carnicos_litros_sangre", nullable = false)
    private Integer anualDeInsumosCarnicosLitrosSangre;


    public Long getAnualDeInsumosCarnicosId() {
        return anualDeInsumosCarnicosId;
    }

    public void setAnualDeInsumosCarnicosId(Long anualDeInsumosCarnicosId) {
        this.anualDeInsumosCarnicosId = anualDeInsumosCarnicosId;
    }

    public String getAnualDeInsumosCarnicosMes() {
        return anualDeInsumosCarnicosMes;
    }

    public void setAnualDeInsumosCarnicosMes(String anualDeInsumosCarnicosMes) {
        this.anualDeInsumosCarnicosMes = anualDeInsumosCarnicosMes;
    }

    public Integer getAnualDeInsumosCarnicosAnio() {
        return anualDeInsumosCarnicosAnio;
    }

    public void setAnualDeInsumosCarnicosAnio(Integer anualDeInsumosCarnicosAnio) {
        this.anualDeInsumosCarnicosAnio = anualDeInsumosCarnicosAnio;
    }

    public Integer getAnualDeInsumosCarnicosCarneBovinaSH() {
        return anualDeInsumosCarnicosCarneBovinaSH;
    }

    public void setAnualDeInsumosCarnicosCarneBovinaSH(Integer anualDeInsumosCarnicosCarneBovinaSH) {
        this.anualDeInsumosCarnicosCarneBovinaSH = anualDeInsumosCarnicosCarneBovinaSH;
    }

    public Integer getAnualDeInsumosCarnicosCarneBovinaCH() {
        return anualDeInsumosCarnicosCarneBovinaCH;
    }

    public void setAnualDeInsumosCarnicosCarneBovinaCH(Integer anualDeInsumosCarnicosCarneBovinaCH) {
        this.anualDeInsumosCarnicosCarneBovinaCH = anualDeInsumosCarnicosCarneBovinaCH;
    }

    public Integer getAnualDeInsumosCarnicosHigado() {
        return anualDeInsumosCarnicosHigado;
    }

    public void setAnualDeInsumosCarnicosHigado(Integer anualDeInsumosCarnicosHigado) {
        this.anualDeInsumosCarnicosHigado = anualDeInsumosCarnicosHigado;
    }

    public Integer getAnualDeInsumosCarnicosCarnePorcinaSH() {
        return anualDeInsumosCarnicosCarnePorcinaSH;
    }

    public void setAnualDeInsumosCarnicosCarnePorcinaSH(Integer anualDeInsumosCarnicosCarnePorcinaSH) {
        this.anualDeInsumosCarnicosCarnePorcinaSH = anualDeInsumosCarnicosCarnePorcinaSH;
    }

    public Integer getAnualDeInsumosCarnicosCarnePorcinaCH() {
        return anualDeInsumosCarnicosCarnePorcinaCH;
    }

    public void setAnualDeInsumosCarnicosCarnePorcinaCH(Integer anualDeInsumosCarnicosCarnePorcinaCH) {
        this.anualDeInsumosCarnicosCarnePorcinaCH = anualDeInsumosCarnicosCarnePorcinaCH;
    }

    public Integer getAnualDeInsumosCarnicosCarnePorcinaGrasa() {
        return anualDeInsumosCarnicosCarnePorcinaGrasa;
    }

    public void setAnualDeInsumosCarnicosCarnePorcinaGrasa(Integer anualDeInsumosCarnicosCarnePorcinaGrasa) {
        this.anualDeInsumosCarnicosCarnePorcinaGrasa = anualDeInsumosCarnicosCarnePorcinaGrasa;
    }

    public Integer getAnualDeInsumosCarnicosTripasMadejas() {
        return anualDeInsumosCarnicosTripasMadejas;
    }

    public void setAnualDeInsumosCarnicosTripasMadejas(Integer anualDeInsumosCarnicosTripasMadejas) {
        this.anualDeInsumosCarnicosTripasMadejas = anualDeInsumosCarnicosTripasMadejas;
    }

    public Integer getAnualDeInsumosCarnicosLitrosSangre() {
        return anualDeInsumosCarnicosLitrosSangre;
    }

    public void setAnualDeInsumosCarnicosLitrosSangre(Integer anualDeInsumosCarnicosLitrosSangre) {
        this.anualDeInsumosCarnicosLitrosSangre = anualDeInsumosCarnicosLitrosSangre;
    }

    public PAnual_de_Insumos_Carnicos(Long anualDeInsumosCarnicosId, String anualDeInsumosCarnicosMes,
            Integer anualDeInsumosCarnicosAnio, Integer anualDeInsumosCarnicosCarneBovinaSH,
            Integer anualDeInsumosCarnicosCarneBovinaCH, Integer anualDeInsumosCarnicosHigado,
            Integer anualDeInsumosCarnicosCarnePorcinaSH, Integer anualDeInsumosCarnicosCarnePorcinaCH,
            Integer anualDeInsumosCarnicosCarnePorcinaGrasa, Integer anualDeInsumosCarnicosTripasMadejas,
            Integer anualDeInsumosCarnicosLitrosSangre, Integer anualDeInsumosCarnicosCarneAveSH,
            Integer anualDeInsumosCarnicosCarneAveCH) {
        this.anualDeInsumosCarnicosId = anualDeInsumosCarnicosId;
        this.anualDeInsumosCarnicosMes = anualDeInsumosCarnicosMes;
        this.anualDeInsumosCarnicosAnio = anualDeInsumosCarnicosAnio;
        this.anualDeInsumosCarnicosCarneBovinaSH = anualDeInsumosCarnicosCarneBovinaSH;
        this.anualDeInsumosCarnicosCarneBovinaCH = anualDeInsumosCarnicosCarneBovinaCH;
        this.anualDeInsumosCarnicosHigado = anualDeInsumosCarnicosHigado;
        this.anualDeInsumosCarnicosCarnePorcinaSH = anualDeInsumosCarnicosCarnePorcinaSH;
        this.anualDeInsumosCarnicosCarnePorcinaCH = anualDeInsumosCarnicosCarnePorcinaCH;
        this.anualDeInsumosCarnicosCarnePorcinaGrasa = anualDeInsumosCarnicosCarnePorcinaGrasa;
        this.anualDeInsumosCarnicosTripasMadejas = anualDeInsumosCarnicosTripasMadejas;
        this.anualDeInsumosCarnicosLitrosSangre = anualDeInsumosCarnicosLitrosSangre;
    }

    public PAnual_de_Insumos_Carnicos() { }
}
