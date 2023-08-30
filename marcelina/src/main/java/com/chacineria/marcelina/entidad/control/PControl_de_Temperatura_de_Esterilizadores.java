package com.chacineria.marcelina.entidad.control;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.chacineria.marcelina.entidad.persona.Usuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.GenerationType;

@Entity(name = "control_de_temperatura_de_esterilizadores")
public class PControl_de_Temperatura_de_Esterilizadores implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "control_de_temperatura_de_esterilizadores_id")
    private Long controlDeTemperaturaDeEsterilizadoresId;

    @Column(name = "control_de_temperatura_de_esterilizadores_fecha", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime controlDeTemperaturaDeEsterilizadoresFecha;

    @Column(name = "control_de_temperatura_de_esterilizadores_temperatura_1", nullable = false)
    private Integer controlDeTemperaturaDeEsterilizadoresTemperatura1;

    @Column(name = "control_de_temperatura_de_esterilizadores_temperatura_2", nullable = false)
    private Integer controlDeTemperaturaDeEsterilizadoresTemperatura2;

    @Column(name = "control_de_temperatura_de_esterilizadores_temperatura_3", nullable = false)
    private Integer controlDeTemperaturaDeEsterilizadoresTemperatura3;

    @Column(name = "control_de_temperatura_de_esterilizadores_observaciones", length = 150)
    private String controlDeTemperaturaDeEsterilizadoresObservaciones;

    @ManyToOne
    @JoinColumn(name = "control_de_temperatura_de_esterilizadores_responsable", nullable = false)
    private Usuario controlDeTemperaturaDeEsterilizadoresResponsable;

    public Long getControlDeTemperaturaDeEsterilizadoresId() {
        return controlDeTemperaturaDeEsterilizadoresId;
    }

    public void setControlDeTemperaturaDeEsterilizadoresId(Long controlDeTemperaturaDeEsterilizadoresId) {
        this.controlDeTemperaturaDeEsterilizadoresId = controlDeTemperaturaDeEsterilizadoresId;
    }

    public LocalDateTime getControlDeTemperaturaDeEsterilizadoresFecha() {
        return controlDeTemperaturaDeEsterilizadoresFecha;
    }

    public void setControlDeTemperaturaDeEsterilizadoresFecha(
            LocalDateTime controlDeTemperaturaDeEsterilizadoresFecha) {
        this.controlDeTemperaturaDeEsterilizadoresFecha = controlDeTemperaturaDeEsterilizadoresFecha;
    }

    public Integer getControlDeTemperaturaDeEsterilizadoresTemperatura1() {
        return controlDeTemperaturaDeEsterilizadoresTemperatura1;
    }

    public void setControlDeTemperaturaDeEsterilizadoresTemperatura1(
            Integer controlDeTemperaturaDeEsterilizadoresTemperatura1) {
        this.controlDeTemperaturaDeEsterilizadoresTemperatura1 = controlDeTemperaturaDeEsterilizadoresTemperatura1;
    }

    public Integer getControlDeTemperaturaDeEsterilizadoresTemperatura2() {
        return controlDeTemperaturaDeEsterilizadoresTemperatura2;
    }

    public void setControlDeTemperaturaDeEsterilizadoresTemperatura2(
            Integer controlDeTemperaturaDeEsterilizadoresTemperatura2) {
        this.controlDeTemperaturaDeEsterilizadoresTemperatura2 = controlDeTemperaturaDeEsterilizadoresTemperatura2;
    }

    public Integer getControlDeTemperaturaDeEsterilizadoresTemperatura3() {
        return controlDeTemperaturaDeEsterilizadoresTemperatura3;
    }

    public void setControlDeTemperaturaDeEsterilizadoresTemperatura3(
            Integer controlDeTemperaturaDeEsterilizadoresTemperatura3) {
        this.controlDeTemperaturaDeEsterilizadoresTemperatura3 = controlDeTemperaturaDeEsterilizadoresTemperatura3;
    }

    public String getControlDeTemperaturaDeEsterilizadoresObservaciones() {
        return controlDeTemperaturaDeEsterilizadoresObservaciones;
    }

    public void setControlDeTemperaturaDeEsterilizadoresObservaciones(
            String controlDeTemperaturaDeEsterilizadoresObservaciones) {
        this.controlDeTemperaturaDeEsterilizadoresObservaciones = controlDeTemperaturaDeEsterilizadoresObservaciones;
    }

    public Usuario getControlDeTemperaturaDeEsterilizadoresResponsable() {
        return controlDeTemperaturaDeEsterilizadoresResponsable;
    }

    public void setControlDeTemperaturaDeEsterilizadoresResponsable(
            Usuario controlDeTemperaturaDeEsterilizadoresResponsable) {
        this.controlDeTemperaturaDeEsterilizadoresResponsable = controlDeTemperaturaDeEsterilizadoresResponsable;
    }

    public PControl_de_Temperatura_de_Esterilizadores(Long controlDeTemperaturaDeEsterilizadoresId,
            LocalDateTime controlDeTemperaturaDeEsterilizadoresFecha,
            Integer controlDeTemperaturaDeEsterilizadoresTemperatura1,
            Integer controlDeTemperaturaDeEsterilizadoresTemperatura2,
            Integer controlDeTemperaturaDeEsterilizadoresTemperatura3,
            String controlDeTemperaturaDeEsterilizadoresObservaciones,
            Usuario controlDeTemperaturaDeEsterilizadoresResponsable) {
        this.controlDeTemperaturaDeEsterilizadoresId = controlDeTemperaturaDeEsterilizadoresId;
        this.controlDeTemperaturaDeEsterilizadoresFecha = controlDeTemperaturaDeEsterilizadoresFecha;
        this.controlDeTemperaturaDeEsterilizadoresTemperatura1 = controlDeTemperaturaDeEsterilizadoresTemperatura1;
        this.controlDeTemperaturaDeEsterilizadoresTemperatura2 = controlDeTemperaturaDeEsterilizadoresTemperatura2;
        this.controlDeTemperaturaDeEsterilizadoresTemperatura3 = controlDeTemperaturaDeEsterilizadoresTemperatura3;
        this.controlDeTemperaturaDeEsterilizadoresObservaciones = controlDeTemperaturaDeEsterilizadoresObservaciones;
        this.controlDeTemperaturaDeEsterilizadoresResponsable = controlDeTemperaturaDeEsterilizadoresResponsable;
    }

    public PControl_de_Temperatura_de_Esterilizadores() {
    }
}
