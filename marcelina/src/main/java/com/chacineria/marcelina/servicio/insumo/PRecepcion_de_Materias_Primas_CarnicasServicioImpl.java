package com.chacineria.marcelina.servicio.insumo;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.insumo.Carne;
import com.chacineria.marcelina.entidad.insumo.PRecepcion_de_Materias_Primas_Carnicas;
import com.chacineria.marcelina.repositorio.insumo.CarneRepositorio;
import com.chacineria.marcelina.repositorio.insumo.PRecepcion_de_Materias_Primas_CarnicasRepositorio;

@Service
public class PRecepcion_de_Materias_Primas_CarnicasServicioImpl implements PRecepcion_de_Materias_Primas_CarnicasServicio{
    
    @Autowired
    private PRecepcion_de_Materias_Primas_CarnicasRepositorio recepcionDeMateriasPrimasCarnicasRepositorio;

    @Autowired
    private CarneRepositorio carneRepositorio;

    @Override
    @Transactional
    public Iterable< PRecepcion_de_Materias_Primas_Carnicas> findAll(){
        return recepcionDeMateriasPrimasCarnicasRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional< PRecepcion_de_Materias_Primas_Carnicas> findById(Long Id){
        return recepcionDeMateriasPrimasCarnicasRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PRecepcion_de_Materias_Primas_Carnicas save(PRecepcion_de_Materias_Primas_Carnicas save){
        return recepcionDeMateriasPrimasCarnicasRepositorio.save(save);
    }

    @Transactional
    public PRecepcion_de_Materias_Primas_Carnicas saveModificar(PRecepcion_de_Materias_Primas_Carnicas save){
        List<Carne> carnes = save.getRecepcionDeMateriasPrimasCarnicasProductos();
        for (Carne carne : carnes) {
            carneRepositorio.save(carne);
        }
        return recepcionDeMateriasPrimasCarnicasRepositorio.save(save);
    }

    @Override
    @Transactional
    public PRecepcion_de_Materias_Primas_Carnicas saveRecepcionCarnes(PRecepcion_de_Materias_Primas_Carnicas recepcionDeMateriasPrimasCarnicas, List<Carne> listaCarne){
        for (Carne carne : listaCarne) {
            carneRepositorio.save(carne);
        }
        recepcionDeMateriasPrimasCarnicas.setRecepcionDeMateriasPrimasCarnicasProductos(listaCarne);
        return recepcionDeMateriasPrimasCarnicasRepositorio.save(recepcionDeMateriasPrimasCarnicas);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        recepcionDeMateriasPrimasCarnicasRepositorio.deleteById(Id);
    }
}
