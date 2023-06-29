package com.chacineria.marcelina.mapper;

import org.mapstruct.Mapper;

import com.chacineria.marcelina.dto.UsuarioDto;
import com.chacineria.marcelina.entidad.persona.Usuario;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    
    UsuarioDto toUsuarioDto(Usuario usuario);
    
}
