package com.chacineria.marcelina.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ListadoCarnesDto {
    private String carneTipo;
    private String carneCategoria;
    private Date fecha1;
    private Date fecha2;
}
