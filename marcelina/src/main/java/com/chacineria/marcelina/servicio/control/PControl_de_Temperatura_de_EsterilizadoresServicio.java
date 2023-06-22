package com.chacineria.marcelina.servicio.control;
import com.chacineria.marcelina.entidad.control.PControl_de_Temperatura_de_Esterilizadores;

import java.util.Optional;

public interface PControl_de_Temperatura_de_EsterilizadoresServicio {
    public Iterable<PControl_de_Temperatura_de_Esterilizadores> findAll();
    public Optional<PControl_de_Temperatura_de_Esterilizadores> findById(Long Id);
    public PControl_de_Temperatura_de_Esterilizadores save(PControl_de_Temperatura_de_Esterilizadores save);
    public void deleteById(Long Id); 
}
