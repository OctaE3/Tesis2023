package com.chacineria.marcelina.servicio.control;
import java.util.Optional;

import com.chacineria.marcelina.entidad.control.PControl_de_Alarma_Luminica_y_Sonora_de_Cloro;

public interface PControl_de_Alarma_Luminica_y_Sonora_de_CloroServicio {
    public Iterable<PControl_de_Alarma_Luminica_y_Sonora_de_Cloro> findAll();
    public Optional<PControl_de_Alarma_Luminica_y_Sonora_de_Cloro> findById(Long Id);
    public PControl_de_Alarma_Luminica_y_Sonora_de_Cloro save(PControl_de_Alarma_Luminica_y_Sonora_de_Cloro save);
    public void deleteById(Long Id);
}
