package com.chacineria.marcelina.servicio.persona;

import java.util.Optional;

import com.chacineria.marcelina.entidad.persona.Usuario;

public interface UsuarioServicio {
    public Iterable<Usuario> findAllByUsuarioEliminado(Boolean eliminado);
    public Optional<Usuario> findById(Long Id);
    public Usuario save(Usuario save);
    public void deleteById(Long Id); 
}
