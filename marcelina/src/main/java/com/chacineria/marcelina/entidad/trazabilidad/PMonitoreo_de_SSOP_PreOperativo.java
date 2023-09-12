package com.chacineria.marcelina.entidad.trazabilidad;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import com.chacineria.marcelina.entidad.persona.Usuario;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity(name = "monitoreo_de_ssop_preoperativo")
public class PMonitoreo_de_SSOP_PreOperativo implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "monitoreo_de_ssop_preoperativo_id")
    private Long monitoreoDeSSOPPreOperativoId;

    @Column(name = "monitoreo_de_ssop_preoperativo_fecha", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime monitoreoDeSSOPPreOperativoFecha;

    @ElementCollection
    @CollectionTable(name = "monitoreo_de_ssop_preoperativo_dias_realizados", joinColumns = @JoinColumn(name = "monitoreo_de_ssop_preoperativo_id"))
    @Column(name = "monitoreo_de_ssop_preoperativo_dias")
    private List<String> monitoreoDeSSOPPreOperativoDias;

    @Column(name = "monitoreo_de_ssop_preoperativo_sector", length = 50, nullable = false)
    private String monitoreoDeSSOPPreOperativoSector;

    @Column(name = "monitoreo_de_ssop_preoperativo_area", length = 50, nullable = false)
    private String monitoreoDeSSOPPreOperativoArea;

    @Column(name = "monitoreo_de_ssop_preoperativo_observaciones", length = 150, nullable = true)
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

    public List<String> getMonitoreoDeSSOPPreOperativoDias() {
        return monitoreoDeSSOPPreOperativoDias;
    }

    public void setMonitoreoDeSSOPPreOperativoDias(List<String> monitoreoDeSSOPPreOperativoDias) {
        this.monitoreoDeSSOPPreOperativoDias = monitoreoDeSSOPPreOperativoDias;
    }

    public LocalDateTime getMonitoreoDeSSOPPreOperativoFecha() {
        return monitoreoDeSSOPPreOperativoFecha;
    }

    public void setMonitoreoDeSSOPPreOperativoFecha(LocalDateTime monitoreoDeSSOPPreOperativoFecha) {
        this.monitoreoDeSSOPPreOperativoFecha = monitoreoDeSSOPPreOperativoFecha;
    }

    public String getMonitoreoDeSSOPPreOperativoSector() {
        return monitoreoDeSSOPPreOperativoSector;
    }

    public void setMonitoreoDeSSOPPreOperativoSector(String monitoreoDeSSOPPreOperativoSector) {
        this.monitoreoDeSSOPPreOperativoSector = monitoreoDeSSOPPreOperativoSector;
    }

    public PMonitoreo_de_SSOP_PreOperativo(Long monitoreoDeSSOPPreOperativoId,
            LocalDateTime monitoreoDeSSOPPreOperativoFecha, List<String> monitoreoDeSSOPPreOperativoDias,
            String monitoreoDeSSOPPreOperativoSector, String monitoreoDeSSOPPreOperativoArea,
            String monitoreoDeSSOPPreOperativoObservaciones, String monitoreoDeSSOPPreOperativoAccCorrectivas,
            String monitoreoDeSSOPPreOperativoAccPreventivas, Usuario monitoreoDeSSOPPreOperativoResponsable) {
        this.monitoreoDeSSOPPreOperativoId = monitoreoDeSSOPPreOperativoId;
        this.monitoreoDeSSOPPreOperativoFecha = monitoreoDeSSOPPreOperativoFecha;
        this.monitoreoDeSSOPPreOperativoDias = monitoreoDeSSOPPreOperativoDias;
        this.monitoreoDeSSOPPreOperativoSector = monitoreoDeSSOPPreOperativoSector;
        this.monitoreoDeSSOPPreOperativoArea = monitoreoDeSSOPPreOperativoArea;
        this.monitoreoDeSSOPPreOperativoObservaciones = monitoreoDeSSOPPreOperativoObservaciones;
        this.monitoreoDeSSOPPreOperativoAccCorrectivas = monitoreoDeSSOPPreOperativoAccCorrectivas;
        this.monitoreoDeSSOPPreOperativoAccPreventivas = monitoreoDeSSOPPreOperativoAccPreventivas;
        this.monitoreoDeSSOPPreOperativoResponsable = monitoreoDeSSOPPreOperativoResponsable;
    }

    public PMonitoreo_de_SSOP_PreOperativo() {
    }
}
