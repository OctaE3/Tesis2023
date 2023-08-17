package com.chacineria.marcelina.servicio.insumo;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chacineria.marcelina.entidad.insumo.Carne;
import com.chacineria.marcelina.repositorio.insumo.CarneRepositorio;

@Service
public class CarneServicioImpl implements CarneServicio {

    @Autowired
    private CarneRepositorio carneRepositorio;

    @Override
    @Transactional
    public Iterable<Carne> findAllByCarneEliminado(Boolean eliminado) {
        return carneRepositorio.findAllByCarneEliminado(eliminado);
    }

    @Override
    @Transactional
    public List<Carne> findAllByCarneEliminadoAndCarneTipoAndCarneCategoriaAndCarneFechaBetween(Boolean eliminado,
            String tipo, String categoria, Date fecha1, Date fecha2) {
        return carneRepositorio.findAllByCarneEliminadoAndCarneTipoAndCarneCategoriaAndCarneFechaBetween(eliminado, tipo,
                categoria, fecha1, fecha2);
    }

    @Override
    @Transactional
    public Optional<Carne> findById(Long Id) {
        return carneRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public Carne save(Carne save) {
        return carneRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id) {
        carneRepositorio.deleteById(Id);
    }
}
