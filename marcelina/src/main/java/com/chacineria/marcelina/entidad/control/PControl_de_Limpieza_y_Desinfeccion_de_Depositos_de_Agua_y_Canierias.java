package com.chacineria.marcelina.entidad.control;
import java.io.Serializable;
import java.sql.Date;

import com.chacineria.marcelina.entidad.persona.Usuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "control_de_limpieza_y_desinfeccion")
public class PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "control_de_limpieza_y_desinfeccion_id")
    private Long controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId;

    @Column(name = "control_de_limpieza_y_desinfeccion_fecha", nullable = false)
    private Date controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha;

    @Column(name = "control_de_limpieza_y_desinfeccion_deposito", length = 30 ,nullable = false)
    private String controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito;

    @Column(name = "control_de_limpieza_y_desinfeccion_canierias", length = 30, nullable = false)
    private String controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias;

    @Column(name = "control_de_limpieza_y_desinfeccion_observaciones", length = 150)
    private String controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones;

    @ManyToOne
    @JoinColumn(name = "control_de_limpieza_y_desinfeccion_responsable", nullable = false)
    private Usuario controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable;

    public Long getControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId() {
        return controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId;
    }

    public void setControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId(
            Long controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId) {
        this.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId;
    }

    public Date getControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha() {
        return controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha;
    }

    public void setControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha(
            Date controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha) {
        this.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha;
    }

    public String getControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito() {
        return controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito;
    }

    public void setControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito(
            String controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito) {
        this.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito;
    }

    public String getControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias() {
        return controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias;
    }

    public void setControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias(
            String controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias) {
        this.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias;
    }

    public String getControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones() {
        return controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones;
    }

    public void setControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones(
            String controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones) {
        this.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones;
    }

    public Usuario getControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable() {
        return controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable;
    }

    public void setControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable(
            Usuario controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable) {
        this.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable;
    }

    public PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias(
            Long controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId,
            Date controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha,
            String controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito,
            String controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias,
            String controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones,
            Usuario controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable) {
        this.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId;
        this.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha;
        this.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito;
        this.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias;
        this.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones;
        this.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable = controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable;
    }

    public PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias() { }
}
