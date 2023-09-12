package com.chacineria.marcelina.dto;

import java.util.List;

import com.chacineria.marcelina.entidad.insumo.Lote;
import com.chacineria.marcelina.entidad.trazabilidad.PExpedicion_de_Producto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ModificarExpedicionDto {
    public PExpedicion_de_Producto expedicionDeProducto;
    public List<Lote> listaLotesDesusados;
}
