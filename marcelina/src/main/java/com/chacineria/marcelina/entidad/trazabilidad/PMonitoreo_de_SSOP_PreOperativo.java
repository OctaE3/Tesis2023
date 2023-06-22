package com.chacineria.marcelina.entidad.trazabilidad;
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

@Entity(name = "monitoreo_de_ssop_preoperativo")
public class PMonitoreo_de_SSOP_PreOperativo implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "monitoreo_de_ssop_preoperativo_id")
    private Long monitoreoDeSSOPPreOperativoId;

    @Column(name = "monitoreo_de_ssop_preoperativo_fecha", nullable = false)
    private LocalDateTime monitoreoDeSSOPPreOperativoFecha;

    @Column(name = "monitoreo_de_ssop_preoperativo_area", length = 50, nullable = false)
    private String monitoreoDeSSOPPreOperativoArea;

    @Column(name = "monitoreo_de_ssop_preoperativo_observaciones", length = 150, nullable = false)
    private String monitoreoDeSSOPPreOperativoObservaciones;

    @Column(name = "monitoreo_de_ssop_preoperativo_acc_correctivas", length = 150, nullable = false)
    private String monitoreoDeSSOPPreOperativoAccCorrectivas;

    @Column(name = "monitoreo_de_ssop_preoperativo_acc_preventivas", length = 150, nullable = false)
    private String monitoreoDeSSOPPreOperativoAccPreventivas;

    @ManyToOne
    @JoinColumn(name = "monitoreo_de_ssop_preoperativo_responsable", nullable = false)
    private Usuario monitoreoDeSSOPPreOperativoResponsable;

    public Long getMonitoreoDeSSOPPreOperativoId() {
        return monitoreoDeSSOPPreOperativoId;
    }

    public void setMonitoreoDeSSOPPreOperativoId(Long monitoreoDeSSOPPreOperativoId) {
        this.monitoreoDeSSOPPreOperativoId = monitoreoDeSSOPPreOperativoId;
    }

    public LocalDateTime getMonitoreoDeSSOPPreOperativoFecha() {
        return monitoreoDeSSOPPreOperativoFecha;
    }

    public void setMonitoreoDeSSOPPreOperativoFecha(LocalDateTime monitoreoDeSSOPPreOperativoFecha) {
        this.monitoreoDeSSOPPreOperativoFecha = monitoreoDeSSOPPreOperativoFecha;
    }

    public String getMonitoreoDeSSOPPreOperativoArea() {
        return monitoreoDeSSOPPreOperativoArea;
    }

    public void setMonitoreoDeSSOPPreOperativoArea(String monitoreoDeSSOPPreOperativoArea) {
        this.monitoreoDeSSOPPreOperativoArea = monitoreoDeSSOPPreOperativoArea;
    }

    public String getMonitoreoDeSSOPPreOperativoObservaciones() {
        return monitoreoDeSSOPPreOperativoObservaciones;
    }

    public void setMonitoreoDeSSOPPreOperativoObservaciones(String monitoreoDeSSOPPreOperativoObservaciones) {
        this.monitoreoDeSSOPPreOperativoObservaciones = monitoreoDeSSOPPreOperativoObservaciones;
    }

    public String getMonitoreoDeSSOPPreOperativoAccCorrectivas() {
        return monitoreoDeSSOPPreOperativoAccCorrectivas;
    }

    public void setMonitoreoDeSSOPPreOperativoAccCorrectivas(String monitoreoDeSSOPPreOperativoAccCorrectivas) {
        this.monitoreoDeSSOPPreOperativoAccCorrectivas = monitoreoDeSSOPPreOperativoAccCorrectivas;
    }

    public String getMonitoreoDeSSOPPreOperativoAccPreventivas() {
        return monitoreoDeSSOPPreOperativoAccPreventivas;
    }

    public void setMonitoreoDeSSOPPreOperativoAccPreventivas(String monitoreoDeSSOPPreOperativoAccPreventivas) {
        this.monitoreoDeSSOPPreOperativoAccPreventivas = monitoreoDeSSOPPreOperativoAccPreventivas;
    }

    public Usuario getMonitoreoDeSSOPPreOperativoResponsable() {
        return monitoreoDeSSOPPreOperativoResponsable;
    }

    public void setMonitoreoDeSSOPPreOperativoResponsable(Usuario monitoreoDeSSOPPreOperativoResponsable) {
        this.monitoreoDeSSOPPreOperativoResponsable = monitoreoDeSSOPPreOperativoResponsable;
    }

    public PMonitoreo_de_SSOP_PreOperativo(Long monitoreoDeSSOPPreOperativoId,
            LocalDateTime monitoreoDeSSOPPreOperativoFecha, String monitoreoDeSSOPPreOperativoArea,
            String monitoreoDeSSOPPreOperativoObservaciones, String monitoreoDeSSOPPreOperativoAccCorrectivas,
            String monitoreoDeSSOPPreOperativoAccPreventivas, Usuario monitoreoDeSSOPPreOperativoResponsable) {
        this.monitoreoDeSSOPPreOperativoId = monitoreoDeSSOPPreOperativoId;
        this.monitoreoDeSSOPPreOperativoFecha = monitoreoDeSSOPPreOperativoFecha;
        this.monitoreoDeSSOPPreOperativoArea = monitoreoDeSSOPPreOperativoArea;
        this.monitoreoDeSSOPPreOperativoObservaciones = monitoreoDeSSOPPreOperativoObservaciones;
        this.monitoreoDeSSOPPreOperativoAccCorrectivas = monitoreoDeSSOPPreOperativoAccCorrectivas;
        this.monitoreoDeSSOPPreOperativoAccPreventivas = monitoreoDeSSOPPreOperativoAccPreventivas;
        this.monitoreoDeSSOPPreOperativoResponsable = monitoreoDeSSOPPreOperativoResponsable;
    }

    public PMonitoreo_de_SSOP_PreOperativo() { }
}
