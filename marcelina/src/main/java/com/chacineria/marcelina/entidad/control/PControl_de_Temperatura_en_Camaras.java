package com.chacineria.marcelina.entidad.control;

import java.io.Serializable;
import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "control_de_temperatura_en_camaras")
public class PControl_de_Temperatura_en_Camaras implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "control_de_temperatura_en_camara_id")
    private Long controlDeTemperaturaEnCamarasId;

    @Column(name = "control_de_temperatura_en_camara_nro_camara", nullable = false)
    private Integer controlDeTemperaturaEnCamarasNroCamara;

    @Column(name = "control_de_temperatura_en_camara_fecha", nullable = false)
    private Date controlDeTemperaturaEnCamarasFecha;

    @Column(name = "control_de_temperatura_en_camara_hora", nullable = false)
    private Integer controlDeTemperaturaEnCamarasHora;

    @Column(name = "control_de_temperatura_en_camara_temp_interna", nullable = false)
    private Integer controlDeTemperaturaEnCamarasTempInterna;

    @Column(name = "control_de_temperatura_en_camara_temp_externa", nullable = false)
    private Integer controlDeTemperaturaEnCamaraTempExterna;

    public Long getControlDeTemperaturaEnCamarasId() {
        return controlDeTemperaturaEnCamarasId;
    }

    public void setControlDeTemperaturaEnCamarasId(Long controlDeTemperaturaEnCamarasId) {
        this.controlDeTemperaturaEnCamarasId = controlDeTemperaturaEnCamarasId;
    }

    public Integer getControlDeTemperaturaEnCamarasNroCamara() {
        return controlDeTemperaturaEnCamarasNroCamara;
    }

    public void setControlDeTemperaturaEnCamarasNroCamara(Integer controlDeTemperaturaEnCamarasNroCamara) {
        this.controlDeTemperaturaEnCamarasNroCamara = controlDeTemperaturaEnCamarasNroCamara;
    }

    public Date getControlDeTemperaturaEnCamarasFecha() {
        return controlDeTemperaturaEnCamarasFecha;
    }

    public void setControlDeTemperaturaEnCamarasFecha(Date controlDeTemperaturaEnCamarasFecha) {
        this.controlDeTemperaturaEnCamarasFecha = controlDeTemperaturaEnCamarasFecha;
    }

    public Integer getControlDeTemperaturaEnCamarasHora() {
        return controlDeTemperaturaEnCamarasHora;
    }

    public void setControlDeTemperaturaEnCamarasHora(Integer controlDeTemperaturaEnCamarasHora) {
        this.controlDeTemperaturaEnCamarasHora = controlDeTemperaturaEnCamarasHora;
    }

    public Integer getControlDeTemperaturaEnCamarasTempInterna() {
        return controlDeTemperaturaEnCamarasTempInterna;
    }

    public void setControlDeTemperaturaEnCamarasTempInterna(Integer controlDeTemperaturaEnCamarasTempInterna) {
        this.controlDeTemperaturaEnCamarasTempInterna = controlDeTemperaturaEnCamarasTempInterna;
    }

    public Integer getControlDeTemperaturaEnCamaraTempExterna() {
        return controlDeTemperaturaEnCamaraTempExterna;
    }

    public void setControlDeTemperaturaEnCamaraTempExterna(Integer controlDeTemperaturaEnCamaraTempExterna) {
        this.controlDeTemperaturaEnCamaraTempExterna = controlDeTemperaturaEnCamaraTempExterna;
    }

    public PControl_de_Temperatura_en_Camaras(Long controlDeTemperaturaEnCamarasId,
            Integer controlDeTemperaturaEnCamarasNroCamara, Date controlDeTemperaturaEnCamarasFecha,
            Integer controlDeTemperaturaEnCamarasHora, Integer controlDeTemperaturaEnCamarasTempInterna,
            Integer controlDeTemperaturaEnCamaraTempExterna) {
        this.controlDeTemperaturaEnCamarasId = controlDeTemperaturaEnCamarasId;
        this.controlDeTemperaturaEnCamarasNroCamara = controlDeTemperaturaEnCamarasNroCamara;
        this.controlDeTemperaturaEnCamarasFecha = controlDeTemperaturaEnCamarasFecha;
        this.controlDeTemperaturaEnCamarasHora = controlDeTemperaturaEnCamarasHora;
        this.controlDeTemperaturaEnCamarasTempInterna = controlDeTemperaturaEnCamarasTempInterna;
        this.controlDeTemperaturaEnCamaraTempExterna = controlDeTemperaturaEnCamaraTempExterna;
    }

    public PControl_de_Temperatura_en_Camaras() { }
}
