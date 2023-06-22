package com.chacineria.marcelina.servicio.trazabilidad;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.trazabilidad.PAnual_de_Insumos_Carnicos;
import com.chacineria.marcelina.repositorio.trazabilidad.PAnual_de_Insumos_CarnicosRepositorio;

@Service
public class PAnual_de_Insumos_CarnicosServicioImpl implements PAnual_de_Insumos_CarnicosServicio{
    
    @Autowired
    private PAnual_de_Insumos_CarnicosRepositorio anualDeInsumosCarnicosRepositorio;

    @Override
    @Transactional
    public Iterable<PAnual_de_Insumos_Carnicos> findAll(){
        return anualDeInsumosCarnicosRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PAnual_de_Insumos_Carnicos> findById(Long Id){
        return anualDeInsumosCarnicosRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PAnual_de_Insumos_Carnicos save(PAnual_de_Insumos_Carnicos save){
        return anualDeInsumosCarnicosRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        anualDeInsumosCarnicosRepositorio.deleteById(Id);
    }
}
