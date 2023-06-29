package com.chacineria.marcelina.servicio.persona;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.dto.UsuarioDto;
import com.chacineria.marcelina.entidad.persona.Usuario;
import com.chacineria.marcelina.excepcion.AppException;
import com.chacineria.marcelina.mapper.UsuarioMapper;
import com.chacineria.marcelina.repositorio.persona.UsuarioRepositorio;

import lombok.RequiredArgsConstructor;

import java.nio.CharBuffer;

@RequiredArgsConstructor
@Service
public class UsuarioServicioImpl implements UsuarioServicio{
    
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;

    @Override
    @Transactional
    public Optional<Usuario> findById(Long Id){
        return usuarioRepositorio.findById(Id);
    }

    public UsuarioDto login(Usuario usuario){
        Usuario usuarioData = usuarioRepositorio.findByUsuarioNombre(usuario.getUsuarioNombre());
        if (usuarioData != null){
            if (passwordEncoder.matches(CharBuffer.wrap(usuario.getUsuarioContrasenia()), usuarioData.getUsuarioContrasenia())){
                return usuarioMapper.toUsuarioDto(usuarioData);
            }
            throw new AppException("Ususario o Contraseña incorrectos", HttpStatus.NOT_FOUND);
        }
        throw new AppException("Ususario o Contraseña incorrectos", HttpStatus.NOT_FOUND);
    }

    @Override
    @Transactional
    public Usuario save(Usuario usuario){
        Usuario usuarioData = usuarioRepositorio.findByUsuarioNombre(usuario.getUsuarioNombre());
        if(usuarioData != null){
            throw new AppException("El usuario que desea ingresar ya existe.", HttpStatus.BAD_REQUEST);
        }

        Usuario usuarioSave = usuario;
        usuarioSave.setUsuarioContrasenia(passwordEncoder.encode(CharBuffer.wrap(usuario.getUsuarioContrasenia())));

        return usuarioRepositorio.save(usuarioSave);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        usuarioRepositorio.deleteById(Id);
    }

    @Override
    public Iterable<Usuario> findAllByUsuarioEliminado(Boolean eliminado) {
        return usuarioRepositorio.findAllByUsuarioEliminado(eliminado);
    }
}
