package com.chacineria.marcelina.servicio.persona;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.persona.Cliente;
import com.chacineria.marcelina.repositorio.persona.ClienteRepositorio;

@Service
public class ClienteServicioImpl implements ClienteServicio{
    
    @Autowired
    private ClienteRepositorio clienteRepositorio;

    @Override
    @Transactional
    public Iterable<Cliente> findAll(){
        return clienteRepositorio.findAll();
    }

    @Override
    @Transactional
    public Iterable<Cliente> findAllByClienteEliminado(Boolean eliminado){
        return clienteRepositorio.findAllByClienteEliminado(eliminado);
    }

    @Override
    @Transactional
    public Optional<Cliente> findById(Long Id){
        return clienteRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public Cliente save(Cliente save){
        return clienteRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        clienteRepositorio.deleteById(Id);
    }
}
