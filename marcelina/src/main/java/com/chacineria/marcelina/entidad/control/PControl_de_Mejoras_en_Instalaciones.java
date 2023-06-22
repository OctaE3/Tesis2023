package com.chacineria.marcelina.entidad.control;
import com.chacineria.marcelina.entidad.persona.Usuario;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity(name = "control_de_mejoras_en_instalaciones")
public class PControl_de_Mejoras_en_Instalaciones implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "control_de_mejoras_en_instalacion_id")
    private Long controlDeMejorasEnInstalacionesId;

    @Column(name = "control_de_mejoras_en_instalacion_fecha", nullable = false)
    private Date controlDeMejorasEnInstalacionesFecha;

    @Column(name = "control_de_mejoras_en_instalacion_sector", length = 50, nullable = false)
    private String controlDeMejorasEnInstalacionesSector;

    @Column(name = "control_de_mejoras_en_instalacion_defecto", length = 150, nullable = false)
    private String controlDeMejorasEnInstalacionesDefecto;

    @Column(name = "control_de_mejoras_en_instalacion_mejora_realizada", length = 150)
    private String controlDeMejorasEnInstalacionesMejoraRealizada;

    @ManyToOne
    @JoinColumn(name = "control_de_mejoras_en_instalacion_responsable", nullable = false)
    private Usuario controlDeMejorasEnInstalacionesResponsable;

    public Long getControlDeMejorasEnInstalacionesId() {
        return controlDeMejorasEnInstalacionesId;
    }

    public void setControlDeMejorasEnInstalacionesId(Long controlDeMejorasEnInstalacionesId) {
        this.controlDeMejorasEnInstalacionesId = controlDeMejorasEnInstalacionesId;
    }

    public Date getControlDeMejorasEnInstalacionesFecha() {
        return controlDeMejorasEnInstalacionesFecha;
    }

    public void setControlDeMejorasEnInstalacionesFecha(Date controlDeMejorasEnInstalacionesFecha) {
        this.controlDeMejorasEnInstalacionesFecha = controlDeMejorasEnInstalacionesFecha;
    }

    public String getControlDeMejorasEnInstalacionesSector() {
        return controlDeMejorasEnInstalacionesSector;
    }

    public void setControlDeMejorasEnInstalacionesSector(String controlDeMejorasEnInstalacionesSector) {
        this.controlDeMejorasEnInstalacionesSector = controlDeMejorasEnInstalacionesSector;
    }

    public String getControlDeMejorasEnInstalacionesDefecto() {
        return controlDeMejorasEnInstalacionesDefecto;
    }

    public void setControlDeMejorasEnInstalacionesDefecto(String controlDeMejorasEnInstalacionesDefecto) {
        this.controlDeMejorasEnInstalacionesDefecto = controlDeMejorasEnInstalacionesDefecto;
    }

    public String getControlDeMejorasEnInstalacionesMejoraRealizada() {
        return controlDeMejorasEnInstalacionesMejoraRealizada;
    }

    public void setControlDeMejorasEnInstalacionesMejoraRealizada(String controlDeMejorasEnInstalacionesMejoraRealizada) {
        this.controlDeMejorasEnInstalacionesMejoraRealizada = controlDeMejorasEnInstalacionesMejoraRealizada;
    }

    public Usuario getControlDeMejorasEnInstalacionesResponsable() {
        return controlDeMejorasEnInstalacionesResponsable;
    }

    public void setControlDeMejorasEnInstalacionesResponsable(Usuario controlDeMejorasEnInstalacionesResponsable) {
        this.controlDeMejorasEnInstalacionesResponsable = controlDeMejorasEnInstalacionesResponsable;
    }

    public PControl_de_Mejoras_en_Instalaciones(Long controlDeMejorasEnInstalacionesId,
            Date controlDeMejorasEnInstalacionesFecha, String controlDeMejorasEnInstalacionesSector,
            String controlDeMejorasEnInstalacionesDefecto, String controlDeMejorasEnInstalacionesMejoraRealizada,
            Usuario controlDeMejorasEnInstalacionesResponsable) {
        this.controlDeMejorasEnInstalacionesId = controlDeMejorasEnInstalacionesId;
        this.controlDeMejorasEnInstalacionesFecha = controlDeMejorasEnInstalacionesFecha;
        this.controlDeMejorasEnInstalacionesSector = controlDeMejorasEnInstalacionesSector;
        this.controlDeMejorasEnInstalacionesDefecto = controlDeMejorasEnInstalacionesDefecto;
        this.controlDeMejorasEnInstalacionesMejoraRealizada = controlDeMejorasEnInstalacionesMejoraRealizada;
        this.controlDeMejorasEnInstalacionesResponsable = controlDeMejorasEnInstalacionesResponsable;
    }

    public PControl_de_Mejoras_en_Instalaciones() { }
}
