package com.chacineria.marcelina.dto;

import com.chacineria.marcelina.entidad.insumo.PDiaria_de_Produccion;

import java.util.List;

import com.chacineria.marcelina.entidad.insumo.Carne;
import com.chacineria.marcelina.entidad.insumo.Control_de_Insumos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ModificarDiariaDto {
    public PDiaria_de_Produccion diariaDeProduccion;
    public List<Carne> listaCarneDesusadas;
    public List<Control_de_Insumos> listaAditivosDesusadas;
}
