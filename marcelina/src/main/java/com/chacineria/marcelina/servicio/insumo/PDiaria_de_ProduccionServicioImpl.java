package com.chacineria.marcelina.servicio.insumo;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Carne;
import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Insumo;
import com.chacineria.marcelina.entidad.insumo.PDiaria_de_Produccion;
import com.chacineria.marcelina.repositorio.auixiliares.Detalle_Cantidad_CarneRepositorio;
import com.chacineria.marcelina.repositorio.auixiliares.Detalle_Cantidad_InsumoRepositorio;
import com.chacineria.marcelina.repositorio.insumo.PDiaria_de_ProduccionRepositorio;

@Service
public class PDiaria_de_ProduccionServicioImpl implements PDiaria_de_ProduccionServicio{
    
    @Autowired
    private PDiaria_de_ProduccionRepositorio diariaDeProduccionRepositorio;

    @Autowired
    private Detalle_Cantidad_CarneRepositorio detalleCantidadCarneRepositorio;

    @Autowired
    private Detalle_Cantidad_InsumoRepositorio detalleCantidadInsumoRepositorio;

    @Override
    @Transactional
    public Iterable<PDiaria_de_Produccion> findAll(){
        return diariaDeProduccionRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PDiaria_de_Produccion> findById(Long Id){
        return diariaDeProduccionRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PDiaria_de_Produccion save(PDiaria_de_Produccion save){
        return diariaDeProduccionRepositorio.save(save);
    }

    @Override
    @Transactional
    public PDiaria_de_Produccion saveDiariaCantidad(PDiaria_de_Produccion diariaDeProduccion, Set<Detalle_Cantidad_Carne> listaCantidadCarne, Set<Detalle_Cantidad_Insumo> listaCantidadInsumo) {
        Set<PDiaria_de_Produccion> diaria = new HashSet<>();
        diaria.add(diariaDeProduccion);
        for(Detalle_Cantidad_Carne carneCantidad : listaCantidadCarne) {
            carneCantidad.setDetalleCantidadCarneDiariaDeProd(diaria);
            detalleCantidadCarneRepositorio.save(carneCantidad);
        }
        
        for(Detalle_Cantidad_Insumo insumoCantidad : listaCantidadInsumo) {
            insumoCantidad.setDetalleCantidadInsumoDiariaDeProd(diaria);
            detalleCantidadInsumoRepositorio.save(insumoCantidad);
        }

        diariaDeProduccion.setDiariaDeProduccionCantidadUtilizadaCarnes(listaCantidadCarne);
        diariaDeProduccion.setDiariaDeProduccionCantidadUtilizadaInsumos(listaCantidadInsumo);
        return diariaDeProduccionRepositorio.save(diariaDeProduccion);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        diariaDeProduccionRepositorio.deleteById(Id);
    }
}
