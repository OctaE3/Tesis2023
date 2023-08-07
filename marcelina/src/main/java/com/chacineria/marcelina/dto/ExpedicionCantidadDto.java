package com.chacineria.marcelina.dto;

import java.util.Set;

import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Lote;
import com.chacineria.marcelina.entidad.trazabilidad.PExpedicion_de_Producto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpedicionCantidadDto {
    private PExpedicion_de_Producto expedicionDeProducto;
    private Set<Detalle_Cantidad_Lote> listaCantidad;
}
