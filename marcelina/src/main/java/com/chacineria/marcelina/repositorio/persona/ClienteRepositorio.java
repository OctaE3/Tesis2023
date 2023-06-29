package com.chacineria.marcelina.repositorio.persona;
import com.chacineria.marcelina.entidad.persona.Cliente;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ClienteRepositorio extends JpaRepository<Cliente, Long>{
    public Iterable<Cliente> findAllByClienteEliminado(Boolean eliminado);
}
