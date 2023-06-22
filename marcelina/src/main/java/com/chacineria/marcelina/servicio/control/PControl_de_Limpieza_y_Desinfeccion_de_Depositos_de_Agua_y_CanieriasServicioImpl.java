package com.chacineria.marcelina.servicio.control;

import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chacineria.marcelina.entidad.control.PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias;
import com.chacineria.marcelina.repositorio.control.PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_CanieriasRepositorio;

@Service
public class PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_CanieriasServicioImpl implements PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_CanieriasServicio{
    @Autowired
    private PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_CanieriasRepositorio control_de_limpieza_y_desinfeccion_de_depositos_de_agua_y_canierias;

    @Override
    @Transactional
    public Iterable<PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias> findAll(){
        return control_de_limpieza_y_desinfeccion_de_depositos_de_agua_y_canierias.findAll();
    }

    @Override
    @Transactional
    public Optional<PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias> findById(Long Id){
        return control_de_limpieza_y_desinfeccion_de_depositos_de_agua_y_canierias.findById(Id);
    }

    @Override
    @Transactional
    public PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias save(PControl_de_Limpieza_y_Desinfeccion_de_Depositos_de_Agua_y_Canierias save){
        return control_de_limpieza_y_desinfeccion_de_depositos_de_agua_y_canierias.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        control_de_limpieza_y_desinfeccion_de_depositos_de_agua_y_canierias.deleteById(Id);
    }
}
