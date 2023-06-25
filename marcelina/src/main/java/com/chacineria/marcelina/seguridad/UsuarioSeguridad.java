package com.chacineria.marcelina.seguridad;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.chacineria.marcelina.entidad.persona.Usuario;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UsuarioSeguridad implements UserDetails{


    private final Usuario usuario;

    @Override
    public String getUsername() {
        return usuario.getUsuarioNombre();
    }

    @Override
    public String getPassword() {
        return usuario.getUsuarioContrasenia();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public boolean isAccountNonExpired(){
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    
}
