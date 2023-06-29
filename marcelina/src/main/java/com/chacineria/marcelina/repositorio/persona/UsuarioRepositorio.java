package com.chacineria.marcelina.repositorio.persona;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chacineria.marcelina.entidad.persona.Usuario;

@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long>{
   public Usuario findByUsuarioNombre(String nombre);
   public Iterable<Usuario> findAllByUsuarioEliminado(Boolean eliminado);
}
