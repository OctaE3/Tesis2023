package com.chacineria.marcelina.repositorio.persona;
import com.chacineria.marcelina.entidad.persona.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long>{
    
}
