package com.chacineria.marcelina.entidad.control;
import com.chacineria.marcelina.entidad.persona.Usuario;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity(name = "control_de_alarma_luminica_y_sonara_de_cloro")
public class PControl_de_Alarma_Luminica_y_Sonora_de_Cloro implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "control_de_alarma_luminica_y_sonara_de_cloro")
    private Long controlDeAlarmaLuminicaYSonaraDeCloroId;

    @Column(name = "control_de_alarma_luminica_y_sonora_de_cloro_fecha_hora", nullable = false)
    private LocalDateTime controlDeAlarmaLumincaYSonoraDeCloroFechaHora;

    @Column(name = "control_de_alarma_luminica_y_sonora_de_cloro_alarma_luminica", nullable = false)
    private Boolean controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica;

    @Column(name = "control_de_alarma_luminica_y_sonora_de_cloro_alarma_sonora", nullable = false)
    private Boolean controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora;

    @Column(name = "control_de_alarma_luminica_y_sonora_de_cloro_observaciones", length = 150)
    private String controlDeAlarmaLuminicaYSonoraDeCloroObservaciones;

    @ManyToOne
    @JoinColumn(name = "control_de_alarma_luminica_y_sonora_de_cloro_responsable", nullable = false)
    private Usuario controlDeAlarmaLumincaYSonoraDeCloroResponsable;

    public Long getControlDeAlarmaLuminicaYSonaraDeCloroId() {
        return controlDeAlarmaLuminicaYSonaraDeCloroId;
    }

    public void setControlDeAlarmaLuminicaYSonaraDeCloroId(Long controlDeAlarmaLuminicaYSonaraDeCloroId) {
        this.controlDeAlarmaLuminicaYSonaraDeCloroId = controlDeAlarmaLuminicaYSonaraDeCloroId;
    }

    public LocalDateTime getControlDeAlarmaLumincaYSonoraDeCloroFechaHora() {
        return controlDeAlarmaLumincaYSonoraDeCloroFechaHora;
    }

    public void setControlDeAlarmaLumincaYSonoraDeCloroFechaHora(
            LocalDateTime controlDeAlarmaLumincaYSonoraDeCloroFechaHora) {
        this.controlDeAlarmaLumincaYSonoraDeCloroFechaHora = controlDeAlarmaLumincaYSonoraDeCloroFechaHora;
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

    public Usuario getControlDeAlarmaLumincaYSonoraDeCloroResponsable() {
        return controlDeAlarmaLumincaYSonoraDeCloroResponsable;
    }

    public void setControlDeAlarmaLumincaYSonoraDeCloroResponsable(
            Usuario controlDeAlarmaLumincaYSonoraDeCloroResponsable) {
        this.controlDeAlarmaLumincaYSonoraDeCloroResponsable = controlDeAlarmaLumincaYSonoraDeCloroResponsable;
    }

    public PControl_de_Alarma_Luminica_y_Sonora_de_Cloro(Long controlDeAlarmaLuminicaYSonaraDeCloroId,
            LocalDateTime controlDeAlarmaLumincaYSonoraDeCloroFechaHora,
            Boolean controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica,
            Boolean controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora,
            String controlDeAlarmaLuminicaYSonoraDeCloroObservaciones,
            Usuario controlDeAlarmaLumincaYSonoraDeCloroResponsable) {
        this.controlDeAlarmaLuminicaYSonaraDeCloroId = controlDeAlarmaLuminicaYSonaraDeCloroId;
        this.controlDeAlarmaLumincaYSonoraDeCloroFechaHora = controlDeAlarmaLumincaYSonoraDeCloroFechaHora;
        this.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica = controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica;
        this.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora = controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora;
        this.controlDeAlarmaLuminicaYSonoraDeCloroObservaciones = controlDeAlarmaLuminicaYSonoraDeCloroObservaciones;
        this.controlDeAlarmaLumincaYSonoraDeCloroResponsable = controlDeAlarmaLumincaYSonoraDeCloroResponsable;
    }

    public PControl_de_Alarma_Luminica_y_Sonora_de_Cloro() { }
}
