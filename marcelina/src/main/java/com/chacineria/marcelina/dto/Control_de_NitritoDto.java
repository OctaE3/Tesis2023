package com.chacineria.marcelina.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Control_de_NitritoDto {
    private Long controlDeNitritoId;
    private Double controlDeNitritoStock;
}
