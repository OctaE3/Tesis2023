package com.chacineria.marcelina.dto;

import java.util.Set;

import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Carne;
import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Insumo;
import com.chacineria.marcelina.entidad.insumo.Lote;
import com.chacineria.marcelina.entidad.insumo.PDiaria_de_Produccion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiariaDeProdCarneInsumoCantidadDto {
    private PDiaria_de_Produccion diariaDeProduccion;
    private Set<Detalle_Cantidad_Carne> listaCarneCantidad;
    private Lote lote;
    private Set<Detalle_Cantidad_Insumo> listaInsumoCantidad;
}
