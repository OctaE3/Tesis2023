package com.chacineria.marcelina.dto;

import com.chacineria.marcelina.entidad.insumo.Lote;
import com.chacineria.marcelina.entidad.persona.Usuario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpTrazDto {
    private Lote lote;
    private Usuario usuario;
}
