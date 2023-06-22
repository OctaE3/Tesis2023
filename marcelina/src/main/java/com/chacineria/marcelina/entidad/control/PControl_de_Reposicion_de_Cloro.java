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

@Entity(name = "control_de_reposicion_de_cloro")
public class PControl_de_Reposicion_de_Cloro implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "control_de_reposicion_de_cloro_id")
    private Long controlDeReposicionDeCloroId;

    @Column(name = "control_de_reposicion_de_cloro_fecha", nullable = false)
    private Date controlDeReposicionDeCloroFecha;

    @Column(name = "control_de_reposicion_de_cloro_cantidad_de_agua", length = 30, nullable = false)
    private String controlDeReposicionDeCloroCantidadDeAgua;

    @Column(name = "control_de_reposicion_de_cloro_cantidad_de_cloro_adicionado", length = 30, nullable = false)
    private String controlDeReposicionDeCloroCantidadDeCloroAdicionado;

    @Column(name = "control_de_reposicion_de_cloro_observaciones", length = 150)
    private String controlDeReposicionDeCloroObservaciones;

    @ManyToOne
    @JoinColumn(name = "control_de_reposicion_de_cloro_responsable", nullable = false)
    private Usuario controlDeReposicionDeCloroResponsable;

    public Long getControlDeReposicionDeCloroId() {
        return controlDeReposicionDeCloroId;
    }

    public void setControlDeReposicionDeCloroId(Long controlDeReposicionDeCloroId) {
        this.controlDeReposicionDeCloroId = controlDeReposicionDeCloroId;
    }

    public Date getControlDeReposicionDeCloroFecha() {
        return controlDeReposicionDeCloroFecha;
    }

    public void setControlDeReposicionDeCloroFecha(Date controlDeReposicionDeCloroFecha) {
        this.controlDeReposicionDeCloroFecha = controlDeReposicionDeCloroFecha;
    }

    public String getControlDeReposicionDeCloroCantidadDeAgua() {
        return controlDeReposicionDeCloroCantidadDeAgua;
    }

    public void setControlDeReposicionDeCloroCantidadDeAgua(String controlDeReposicionDeCloroCantidadDeAgua) {
        this.controlDeReposicionDeCloroCantidadDeAgua = controlDeReposicionDeCloroCantidadDeAgua;
    }

    public String getControlDeReposicionDeCloroCantidadDeCloroAdicionado() {
        return controlDeReposicionDeCloroCantidadDeCloroAdicionado;
    }

    public void setControlDeReposicionDeCloroCantidadDeCloroAdicionado(
            String controlDeReposicionDeCloroCantidadDeCloroAdicionado) {
        this.controlDeReposicionDeCloroCantidadDeCloroAdicionado = controlDeReposicionDeCloroCantidadDeCloroAdicionado;
    }

    public String getControlDeReposicionDeCloroObservaciones() {
        return controlDeReposicionDeCloroObservaciones;
    }

    public void setControlDeReposicionDeCloroObservaciones(String controlDeReposicionDeCloroObservaciones) {
        this.controlDeReposicionDeCloroObservaciones = controlDeReposicionDeCloroObservaciones;
    }

    public Usuario getControlDeReposicionDeCloroResponsable() {
        return controlDeReposicionDeCloroResponsable;
    }

    public void setControlDeReposicionDeCloroResponsable(Usuario controlDeReposicionDeCloroResponsable) {
        this.controlDeReposicionDeCloroResponsable = controlDeReposicionDeCloroResponsable;
    }

    public PControl_de_Reposicion_de_Cloro(Long controlDeReposicionDeCloroId, Date controlDeReposicionDeCloroFecha,
            String controlDeReposicionDeCloroCantidadDeAgua, String controlDeReposicionDeCloroCantidadDeCloroAdicionado,
            String controlDeReposicionDeCloroObservaciones, Usuario controlDeReposicionDeCloroResponsable) {
        this.controlDeReposicionDeCloroId = controlDeReposicionDeCloroId;
        this.controlDeReposicionDeCloroFecha = controlDeReposicionDeCloroFecha;
        this.controlDeReposicionDeCloroCantidadDeAgua = controlDeReposicionDeCloroCantidadDeAgua;
        this.controlDeReposicionDeCloroCantidadDeCloroAdicionado = controlDeReposicionDeCloroCantidadDeCloroAdicionado;
        this.controlDeReposicionDeCloroObservaciones = controlDeReposicionDeCloroObservaciones;
        this.controlDeReposicionDeCloroResponsable = controlDeReposicionDeCloroResponsable;
    }

    public PControl_de_Reposicion_de_Cloro() { }
}
