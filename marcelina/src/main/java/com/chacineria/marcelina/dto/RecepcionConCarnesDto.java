package com.chacineria.marcelina.dto;

import java.util.List;

import com.chacineria.marcelina.entidad.insumo.PRecepcion_de_Materias_Primas_Carnicas;
import com.chacineria.marcelina.entidad.insumo.Carne;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecepcionConCarnesDto {
    private PRecepcion_de_Materias_Primas_Carnicas recepcionDeMateriasPrimasCarnicas;
    private List<Carne> listaCarne;
}
