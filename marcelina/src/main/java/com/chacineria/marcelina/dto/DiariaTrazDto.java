package com.chacineria.marcelina.dto;

import java.sql.Date;
import java.util.Set;

import com.chacineria.marcelina.entidad.insumo.Carne;
import com.chacineria.marcelina.entidad.insumo.Control_de_Insumos;
import com.chacineria.marcelina.entidad.insumo.Lote;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiariaTrazDto {
    private Date fechaProd;
    private Set<Control_de_Insumos> aditivos;
    private Set<Carne> carnes;
    private Lote lote;
    private Double cantidadProd;
}
