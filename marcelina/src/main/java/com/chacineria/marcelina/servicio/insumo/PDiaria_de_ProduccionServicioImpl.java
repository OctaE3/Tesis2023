package com.chacineria.marcelina.servicio.insumo;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Carne;
import com.chacineria.marcelina.entidad.auxiliares.Detalle_Cantidad_Insumo;
import com.chacineria.marcelina.entidad.insumo.Carne;
import com.chacineria.marcelina.entidad.insumo.Control_de_Insumos;
import com.chacineria.marcelina.entidad.insumo.Lote;
import com.chacineria.marcelina.entidad.insumo.PDiaria_de_Produccion;
import com.chacineria.marcelina.repositorio.auixiliares.Detalle_Cantidad_CarneRepositorio;
import com.chacineria.marcelina.repositorio.auixiliares.Detalle_Cantidad_InsumoRepositorio;
import com.chacineria.marcelina.repositorio.insumo.CarneRepositorio;
import com.chacineria.marcelina.repositorio.insumo.Control_de_InsumosRepositorio;
import com.chacineria.marcelina.repositorio.insumo.LoteRepositorio;
import com.chacineria.marcelina.repositorio.insumo.PDiaria_de_ProduccionRepositorio;

@Service
public class PDiaria_de_ProduccionServicioImpl implements PDiaria_de_ProduccionServicio{
    
    @Autowired
    private PDiaria_de_ProduccionRepositorio diariaDeProduccionRepositorio;

    @Autowired
    private Detalle_Cantidad_CarneRepositorio detalleCantidadCarneRepositorio;

    @Autowired
    private Detalle_Cantidad_InsumoRepositorio detalleCantidadInsumoRepositorio;

    @Autowired
    private CarneRepositorio carneRepositorio;

    @Autowired
    private Control_de_InsumosRepositorio insumoRepositorio;

    @Autowired
    private LoteRepositorio loteRepositorio;

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

    @Transactional
    public PDiaria_de_Produccion findByDiariaDeProduccionLote(Long loteId) {
        Iterable<PDiaria_de_Produccion> listaDiaria = findAll();

        for (PDiaria_de_Produccion diaria : listaDiaria) {
            if (diaria.getDiariaDeProduccionLote().getLoteId().equals(loteId)) {
                return diaria;
            }
        }
        return null;
    }

    @Override
    @Transactional
    public PDiaria_de_Produccion save(PDiaria_de_Produccion save){
        return diariaDeProduccionRepositorio.save(save);
    }

    @Override
    @Transactional
    public PDiaria_de_Produccion saveDiariaCantidad(PDiaria_de_Produccion diariaDeProduccion, Set<Detalle_Cantidad_Carne> listaCantidadCarne, Set<Detalle_Cantidad_Insumo> listaCantidadInsumo, Lote lote) {
        Set<PDiaria_de_Produccion> diaria = new HashSet<>();
        diaria.add(diariaDeProduccion);
        for (Carne carne : diariaDeProduccion.getDiariaDeProduccionInsumosCarnicos()) {
            if (carne.getCarneCantidad().equals(0)) {
                carne.setCarneEliminado(true);
                carneRepositorio.save(carne);
            } else {
                carneRepositorio.save(carne);
            }
        }

        for (Control_de_Insumos insumo : diariaDeProduccion.getDiariaDeProduccionAditivos()) {
            if (insumo.getInsumoCantidad().equals(0)) {
                insumo.setInsumoEliminado(true);
                insumoRepositorio.save(insumo);
            } else {
                insumoRepositorio.save(insumo);
            }
        }

        for(Detalle_Cantidad_Carne carneCantidad : listaCantidadCarne) {
            carneCantidad.setDetalleCantidadCarneDiariaDeProd(diaria);
            detalleCantidadCarneRepositorio.save(carneCantidad);
        }
        
        for(Detalle_Cantidad_Insumo insumoCantidad : listaCantidadInsumo) {
            insumoCantidad.setDetalleCantidadInsumoDiariaDeProd(diaria);
            detalleCantidadInsumoRepositorio.save(insumoCantidad);
        }

        Lote loteAgregado = loteRepositorio.save(lote);

        diariaDeProduccion.setDiariaDeProduccionCantidadUtilizadaCarnes(listaCantidadCarne);
        diariaDeProduccion.setDiariaDeProduccionCantidadUtilizadaInsumos(listaCantidadInsumo);
        diariaDeProduccion.setDiariaDeProduccionLote(loteAgregado);
        return diariaDeProduccionRepositorio.save(diariaDeProduccion);
    }

    @Override
    @Transactional
    public void deleteById(Long Id){
        diariaDeProduccionRepositorio.deleteById(Id);
    }
}
