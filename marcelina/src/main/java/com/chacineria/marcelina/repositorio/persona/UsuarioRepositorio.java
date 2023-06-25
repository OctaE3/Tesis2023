package com.chacineria.marcelina.repositorio.persona;
import com.chacineria.marcelina.entidad.persona.Usuario;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long>{
   @Query(value = "SELECT u.* FROM usuarios u WHERE u.usuario_nombre = :usuarioNombre", nativeQuery = true)
   public Optional<Usuario> findUsuarioByName(@Param("usuarioNombre") String usuarioNombre);
   
}
