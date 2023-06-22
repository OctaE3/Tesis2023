package com.chacineria.marcelina.servicio.insumo;
import com.chacineria.marcelina.entidad.insumo.Lote;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.repositorio.insumo.LoteRepositorio;

@Service
public class LoteServicioImpl implements LoteServicio{
    
    @Autowired
    private LoteRepositorio loteRepositorio;

    @Override
    @Transactional
    public Iterable<Lote> findAll(){
        return loteRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<Lote> findById(Long Id){
        return loteRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public Lote save(Lote save){
        return loteRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        loteRepositorio.deleteById(Id);
    }
}
