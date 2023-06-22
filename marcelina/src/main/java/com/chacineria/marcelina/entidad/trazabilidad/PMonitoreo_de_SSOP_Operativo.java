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

@Entity(name = "monitoreo_de_ssop_operativo")
public class PMonitoreo_de_SSOP_Operativo implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "monitoreo_de_ssop_operativo_id")
    private Long monitoreoDeSSOPOperativoId;

    @Column(name = "monitoreo_de_ssop_operativo_fecha", nullable = false)
    private LocalDateTime monitoreoDeSSOPOperativoFecha;

    @Column(name = "monitoreo_de_ssop_operativo_area", length = 50, nullable = false)
    private String monitoreoDeSSOPOperativoArea;

    @Column(name = "monitoreo_de_ssop_operativo_observaciones", length = 150, nullable = false)
    private String monitoreoDeSSOPOperativoObservaciones;

    @Column(name = "monitoreo_de_ssop_operativo_acc_correctivas", length = 150, nullable = false)
    private String monitoreoDeSSOPOperativoAccCorrectivas;

    @Column(name = "monitoreo_de_ssop_operativo_acc_preventivas", length = 150, nullable = false)
    private String monitoreoDeSSOPOperativoAccPreventivas;

    @ManyToOne
    @JoinColumn(name = "monitoreo_de_ssop_operativo_responsable", nullable = false)
    private Usuario monitoreoDeSSOPOperativoResponsable;

    public Long getMonitoreoDeSSOPOperativoId() {
        return monitoreoDeSSOPOperativoId;
    }

    public void setMonitoreoDeSSOPOperativoId(Long monitoreoDeSSOPOperativoId) {
        this.monitoreoDeSSOPOperativoId = monitoreoDeSSOPOperativoId;
    }

    public LocalDateTime getMonitoreoDeSSOPOperativoFecha() {
        return monitoreoDeSSOPOperativoFecha;
    }

    public void setMonitoreoDeSSOPOperativoFecha(LocalDateTime monitoreoDeSSOPOperativoFecha) {
        this.monitoreoDeSSOPOperativoFecha = monitoreoDeSSOPOperativoFecha;
    }

    public String getMonitoreoDeSSOPOperativoArea() {
        return monitoreoDeSSOPOperativoArea;
    }

    public void setMonitoreoDeSSOPOperativoArea(String monitoreoDeSSOPOperativoArea) {
        this.monitoreoDeSSOPOperativoArea = monitoreoDeSSOPOperativoArea;
    }

    public String getMonitoreoDeSSOPOperativoObservaciones() {
        return monitoreoDeSSOPOperativoObservaciones;
    }

    public void setMonitoreoDeSSOPOperativoObservaciones(String monitoreoDeSSOPOperativoObservaciones) {
        this.monitoreoDeSSOPOperativoObservaciones = monitoreoDeSSOPOperativoObservaciones;
    }

    public String getMonitoreoDeSSOPOperativoAccCorrectivas() {
        return monitoreoDeSSOPOperativoAccCorrectivas;
    }

    public void setMonitoreoDeSSOPOperativoAccCorrectivas(String monitoreoDeSSOPOperativoAccCorrectivas) {
        this.monitoreoDeSSOPOperativoAccCorrectivas = monitoreoDeSSOPOperativoAccCorrectivas;
    }

    public String getMonitoreoDeSSOPOperativoAccPreventivas() {
        return monitoreoDeSSOPOperativoAccPreventivas;
    }

    public void setMonitoreoDeSSOPOperativoAccPreventivas(String monitoreoDeSSOPOperativoAccPreventivas) {
        this.monitoreoDeSSOPOperativoAccPreventivas = monitoreoDeSSOPOperativoAccPreventivas;
    }

    public Usuario getMonitoreoDeSSOPOperativoResponsable() {
        return monitoreoDeSSOPOperativoResponsable;
    }

    public void setMonitoreoDeSSOPOperativoResponsable(Usuario monitoreoDeSSOPOperativoResponsable) {
        this.monitoreoDeSSOPOperativoResponsable = monitoreoDeSSOPOperativoResponsable;
    }

    public PMonitoreo_de_SSOP_Operativo(Long monitoreoDeSSOPOperativoId, LocalDateTime monitoreoDeSSOPOperativoFecha,
            String monitoreoDeSSOPOperativoArea, String monitoreoDeSSOPOperativoObservaciones,
            String monitoreoDeSSOPOperativoAccCorrectivas, String monitoreoDeSSOPOperativoAccPreventivas,
            Usuario monitoreoDeSSOPOperativoResponsable) {
        this.monitoreoDeSSOPOperativoId = monitoreoDeSSOPOperativoId;
        this.monitoreoDeSSOPOperativoFecha = monitoreoDeSSOPOperativoFecha;
        this.monitoreoDeSSOPOperativoArea = monitoreoDeSSOPOperativoArea;
        this.monitoreoDeSSOPOperativoObservaciones = monitoreoDeSSOPOperativoObservaciones;
        this.monitoreoDeSSOPOperativoAccCorrectivas = monitoreoDeSSOPOperativoAccCorrectivas;
        this.monitoreoDeSSOPOperativoAccPreventivas = monitoreoDeSSOPOperativoAccPreventivas;
        this.monitoreoDeSSOPOperativoResponsable = monitoreoDeSSOPOperativoResponsable;
    }
    
    public PMonitoreo_de_SSOP_Operativo() { }
}
