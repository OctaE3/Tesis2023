package com.chacineria.marcelina.servicio.trazabilidad;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.insumo.Lote;
import com.chacineria.marcelina.entidad.trazabilidad.PResumen_de_Trazabilidad;
import com.chacineria.marcelina.repositorio.insumo.LoteRepositorio;
import com.chacineria.marcelina.repositorio.trazabilidad.PResumen_de_TrazabilidadRepositorio;

@Service
public class PResumen_de_TrazabilidadServicioImpl implements PResumen_de_TrazabilidadServicio {

    @Autowired
    private PResumen_de_TrazabilidadRepositorio resumenDeTrazabilidadRepositorio;

    @Autowired
    private LoteRepositorio loteRepositorio;

    @Override
    @Transactional
    public Iterable<PResumen_de_Trazabilidad> findAll() {
        return resumenDeTrazabilidadRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PResumen_de_Trazabilidad> findById(Long Id) {
        return resumenDeTrazabilidadRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PResumen_de_Trazabilidad save(PResumen_de_Trazabilidad save) {
        return resumenDeTrazabilidadRepositorio.save(save);
    }

    @Override
    @Transactional
    public List<PResumen_de_Trazabilidad> saveAll(List<PResumen_de_Trazabilidad> save) {
        return resumenDeTrazabilidadRepositorio.saveAll(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id) {
        resumenDeTrazabilidadRepositorio.deleteById(Id);
    }

    @Transactional
    public void deleteResumenTraz() {
        List<PResumen_de_Trazabilidad> listaResumenes = resumenDeTrazabilidadRepositorio.findAll();
        List<Lote> listaLotes = loteRepositorio.findAll();
        
        List<PResumen_de_Trazabilidad> resumenesRegistrados = new ArrayList<>();

        for (PResumen_de_Trazabilidad resuemen : listaResumenes) {
            for (Lote lote : listaLotes) {
                if (resuemen.getResumenDeTrazabilidadLote().getLoteId() == lote.getLoteId()) {
                    if (lote.getLoteCantidad() > 0) {
                        resumenesRegistrados.add(resuemen);
                    }
                }
            }
        }

        for (PResumen_de_Trazabilidad resumenRegistrado : resumenesRegistrados) {
            resumenDeTrazabilidadRepositorio.deleteById(resumenRegistrado.getResumenDeTrazabilidadId());
        }
    }

}
