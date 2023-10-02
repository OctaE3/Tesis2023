package com.chacineria.marcelina.entidad.control;
import java.io.Serializable;
import java.time.LocalDateTime;

import com.chacineria.marcelina.entidad.persona.Usuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity(name = "control_de_alarma_luminica_y_sonara_de_cloro")
public class PControl_de_Alarma_Luminica_y_Sonora_de_Cloro implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "control_de_alarma_luminica_y_sonara_de_cloro_id")
    private Long controlDeAlarmaLuminicaYSonaraDeCloroId;

    @Column(name = "control_de_alarma_luminica_y_sonora_de_cloro_fecha_hora", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime controlDeAlarmaLuminicaYSonoraDeCloroFechaHora;

    @Column(name = "control_de_alarma_luminica_y_sonora_de_cloro_alarma_luminica", nullable = false)
    private Boolean controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica;

    @Column(name = "control_de_alarma_luminica_y_sonora_de_cloro_alarma_sonora", nullable = false)
    private Boolean controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora;

    @Column(name = "control_de_alarma_luminica_y_sonora_de_cloro_observaciones", length = 150, nullable = true)
    private String controlDeAlarmaLuminicaYSonoraDeCloroObservaciones;

    @ManyToOne
    @JoinColumn(name = "control_de_alarma_luminica_y_sonora_de_cloro_responsable", nullable = false)
    private Usuario controlDeAlarmaLuminicaYSonoraDeCloroResponsable;

    public Long getControlDeAlarmaLuminicaYSonaraDeCloroId() {
        return controlDeAlarmaLuminicaYSonaraDeCloroId;
    }

    public void setControlDeAlarmaLuminicaYSonaraDeCloroId(Long controlDeAlarmaLuminicaYSonaraDeCloroId) {
        this.controlDeAlarmaLuminicaYSonaraDeCloroId = controlDeAlarmaLuminicaYSonaraDeCloroId;
    }

    public LocalDateTime getControlDeAlarmaLuminicaYSonoraDeCloroFechaHora() {
        return controlDeAlarmaLuminicaYSonoraDeCloroFechaHora;
    }

    public void setControlDeAlarmaLuminicaYSonoraDeCloroFechaHora(
            LocalDateTime controlDeAlarmaLuminicaYSonoraDeCloroFechaHora) {
        this.controlDeAlarmaLuminicaYSonoraDeCloroFechaHora = controlDeAlarmaLuminicaYSonoraDeCloroFechaHora;
    }

    public Boolean getControlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica() {
        return controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica;
    }

    public void setControlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica(
            Boolean controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica) {
        this.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica = controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica;
    }

    public Boolean getControlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora() {
        return controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora;
    }

    public void setControlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora(
            Boolean controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora) {
        this.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora = controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora;
    }

    public String getControlDeAlarmaLuminicaYSonoraDeCloroObservaciones() {
        return controlDeAlarmaLuminicaYSonoraDeCloroObservaciones;
    }

    public void setControlDeAlarmaLuminicaYSonoraDeCloroObservaciones(
            String controlDeAlarmaLuminicaYSonoraDeCloroObservaciones) {
        this.controlDeAlarmaLuminicaYSonoraDeCloroObservaciones = controlDeAlarmaLuminicaYSonoraDeCloroObservaciones;
    }

    public Usuario getControlDeAlarmaLuminicaYSonoraDeCloroResponsable() {
        return controlDeAlarmaLuminicaYSonoraDeCloroResponsable;
    }

    public void setControlDeAlarmaLuminicaYSonoraDeCloroResponsable(
            Usuario controlDeAlarmaLuminicaYSonoraDeCloroResponsable) {
        this.controlDeAlarmaLuminicaYSonoraDeCloroResponsable = controlDeAlarmaLuminicaYSonoraDeCloroResponsable;
    }

    public PControl_de_Alarma_Luminica_y_Sonora_de_Cloro(Long controlDeAlarmaLuminicaYSonaraDeCloroId,
            LocalDateTime controlDeAlarmaLuminicaYSonoraDeCloroFechaHora,
            Boolean controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica,
            Boolean controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora,
            String controlDeAlarmaLuminicaYSonoraDeCloroObservaciones,
            Usuario controlDeAlarmaLuminicaYSonoraDeCloroResponsable) {
        this.controlDeAlarmaLuminicaYSonaraDeCloroId = controlDeAlarmaLuminicaYSonaraDeCloroId;
        this.controlDeAlarmaLuminicaYSonoraDeCloroFechaHora = controlDeAlarmaLuminicaYSonoraDeCloroFechaHora;
        this.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica = controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica;
        this.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora = controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora;
        this.controlDeAlarmaLuminicaYSonoraDeCloroObservaciones = controlDeAlarmaLuminicaYSonoraDeCloroObservaciones;
        this.controlDeAlarmaLuminicaYSonoraDeCloroResponsable = controlDeAlarmaLuminicaYSonoraDeCloroResponsable;
    }

    public PControl_de_Alarma_Luminica_y_Sonora_de_Cloro() { }
}
