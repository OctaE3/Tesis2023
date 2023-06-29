package com.chacineria.marcelina.seguridad;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.chacineria.marcelina.repositorio.persona.UsuarioRepositorio;

@Service
public class ServicioDeSeguridadDeUsuario implements UserDetailsService{

    private final UsuarioRepositorio usuarioRepositorio;

    public ServicioDeSeguridadDeUsuario(UsuarioRepositorio usuarioRepositorio){
        this.usuarioRepositorio = usuarioRepositorio;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var optUsuario = this.usuarioRepositorio.findByUsuarioNombre(username);
        
        if(optUsuario != null){
            return new UsuarioSeguridad(optUsuario);
        }
        throw new UsernameNotFoundException("Usuario no encontrado: " + username);
    }
}
