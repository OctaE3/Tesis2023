package com.chacineria.marcelina.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UsuarioDto{

    private Long usuarioId;
    private String usuarioNombre;
    private String usuarioContrasenia;
    private String token;
}