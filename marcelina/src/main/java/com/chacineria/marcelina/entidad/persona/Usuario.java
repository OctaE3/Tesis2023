package com.chacineria.marcelina.entidad.persona;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "usuarios")
public class Usuario implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "usuario_nombre", length = 50, nullable = false, unique = true)
    private String usuarioNombre;

    @Column(name = "usuario_contrasenia", length = 150, nullable = false)
    private String usuarioContrasenia;

    @Column(name = "usuario_eliminado")
    private Boolean usuarioEliminado = false;

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getUsuarioNombre() {
        return usuarioNombre;
    }

    public void setUsuarioNombre(String usuarioNombre) {
        this.usuarioNombre = usuarioNombre;
    }

    public String getUsuarioContrasenia() {
        return usuarioContrasenia;
    }

    public void setUsuarioContrasenia(String usuarioContrasenia) {
        this.usuarioContrasenia = usuarioContrasenia;
    }

    public Boolean getUsuarioEliminado() {
        return usuarioEliminado;
    }

    public void setUsuarioEliminado(boolean usuarioEliminado) {
        this.usuarioEliminado = usuarioEliminado;
    }

    public Usuario(Long usuarioId, String usuarioNombre, String usuarioContrasenia, Boolean usuarioEliminado) {
        this.usuarioId = usuarioId;
        this.usuarioNombre = usuarioNombre;
        this.usuarioContrasenia = usuarioContrasenia;
        this.usuarioEliminado = usuarioEliminado;
    }

    public Usuario() { }
}
