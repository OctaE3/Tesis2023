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

@Entity(name = "control_de_cloro_libre")
public class PControl_de_Cloro_Libre implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "control_de_cloro_libre_id")
    private Long controlDeCloroLibreId;

    @Column(name = "control_de_cloro_libre_fecha", nullable = false)
    private LocalDateTime controlDeCloroLibreFecha;

    @Column(name = "control_de_cloro_libre_grifo_pico", nullable = false)
    private Integer controlDeCloroLibreGrifoPico;

    @Column(name = "control_de_cloro_libre_resultado", nullable = false)
    private Double controlDeCloroLibreResultado;

    @Column(name = "control_de_cloro_libre_obsevaciones", length = 150)
    private String controlDeCloroLibreObservaciones;

    @ManyToOne
    @JoinColumn(name = "control_de_cloro_libre_responsable", nullable = false)
    private Usuario controlDeCloroLibreResponsable;

    public Long getControlDeCloroLibreId() {
        return controlDeCloroLibreId;
    }

    public void setControlDeCloroLibreId(Long controlDeCloroLibreId) {
        this.controlDeCloroLibreId = controlDeCloroLibreId;
    }

    public LocalDateTime getControlDeCloroLibreFecha() {
        return controlDeCloroLibreFecha;
    }

    public void setControlDeCloroLibreFecha(LocalDateTime controlDeCloroLibreFecha) {
        this.controlDeCloroLibreFecha = controlDeCloroLibreFecha;
    }

    public Integer getControlDeCloroLibreGrifoPico() {
        return controlDeCloroLibreGrifoPico;
    }

    public void setControlDeCloroLibreGrifoPico(Integer controlDeCloroLibreGrifoPico) {
        this.controlDeCloroLibreGrifoPico = controlDeCloroLibreGrifoPico;
    }

    public Double getControlDeCloroLibreResultado() {
        return controlDeCloroLibreResultado;
    }

    public void setControlDeCloroLibreResultado(Double controlDeCloroLibreResultado) {
        this.controlDeCloroLibreResultado = controlDeCloroLibreResultado;
    }

    public String getControlDeCloroLibreObservaciones() {
        return controlDeCloroLibreObservaciones;
    }

    public void setControlDeCloroLibreObservaciones(String controlDeCloroLibreObservaciones) {
        this.controlDeCloroLibreObservaciones = controlDeCloroLibreObservaciones;
    }

    public Usuario getControlDeCloroLibreResponsable() {
        return controlDeCloroLibreResponsable;
    }

    public void setControlDeCloroLibreResponsable(Usuario controlDeCloroLibreResponsable) {
        this.controlDeCloroLibreResponsable = controlDeCloroLibreResponsable;
    }

    public PControl_de_Cloro_Libre(Long controlDeCloroLibreId, LocalDateTime controlDeCloroLibreFecha,
            Integer controlDeCloroLibreGrifoPico, Double controlDeCloroLibreResultado,
            String controlDeCloroLibreObservaciones, Usuario controlDeCloroLibreResponsable) {
        this.controlDeCloroLibreId = controlDeCloroLibreId;
        this.controlDeCloroLibreFecha = controlDeCloroLibreFecha;
        this.controlDeCloroLibreGrifoPico = controlDeCloroLibreGrifoPico;
        this.controlDeCloroLibreResultado = controlDeCloroLibreResultado;
        this.controlDeCloroLibreObservaciones = controlDeCloroLibreObservaciones;
        this.controlDeCloroLibreResponsable = controlDeCloroLibreResponsable;
    }

    public PControl_de_Cloro_Libre() { }
    
}
