package com.chacineria.marcelina.servicio.persona;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.persona.Usuario;
import com.chacineria.marcelina.repositorio.persona.UsuarioRepositorio;

@Service
public class UsuarioServicioImpl implements UsuarioServicio{
    
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Override
    @Transactional
    public Iterable<Usuario> findAll(){
        return usuarioRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<Usuario> findById(Long Id){
        return usuarioRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public Usuario save(Usuario save){
        return usuarioRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        usuarioRepositorio.deleteById(Id);
    }
}
