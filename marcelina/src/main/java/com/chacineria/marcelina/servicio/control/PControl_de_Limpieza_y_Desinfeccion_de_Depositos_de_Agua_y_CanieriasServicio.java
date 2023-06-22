package com.chacineria.marcelina.servicio.control;

import java.util.Optional;

import com.chacineria.marcelina.entidad.control.PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias;

public interface PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_CanieriasServicio {
    public Iterable<PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias> findAll();
    public Optional<PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias> findById(Long Id);
    public PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias save(PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias save);
    public void deleteById(Long Id);
}
