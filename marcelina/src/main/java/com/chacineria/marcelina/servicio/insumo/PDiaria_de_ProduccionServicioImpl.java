package com.chacineria.marcelina.servicio.insumo;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.dto.ModificarDiariaDto;
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
public class PDiaria_de_ProduccionServicioImpl implements PDiaria_de_ProduccionServicio {

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
    public Iterable<PDiaria_de_Produccion> findAll() {
        return diariaDeProduccionRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PDiaria_de_Produccion> findById(Long Id) {
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
    public PDiaria_de_Produccion save(PDiaria_de_Produccion save) {
        return diariaDeProduccionRepositorio.save(save);
    }

    @Transactional
    public void eliminarDetallesSinAsignar() {
        List<PDiaria_de_Produccion> listaDiarias = diariaDeProduccionRepositorio.findAll();
        List<Detalle_Cantidad_Carne> listaDetalleCarne = detalleCantidadCarneRepositorio.findAll();
        List<Detalle_Cantidad_Insumo> listaDetalleAditivo = detalleCantidadInsumoRepositorio.findAll();

        List<Detalle_Cantidad_Carne> detalleCarneDeDiarias = new ArrayList<>();
        List<Detalle_Cantidad_Carne> detalleCarneSinAsignar = new ArrayList<>();
        List<Detalle_Cantidad_Insumo> detalleAditivoDeDiarias = new ArrayList<>();
        List<Detalle_Cantidad_Insumo> detalleAditivoSinAsignar = new ArrayList<>();

        for (PDiaria_de_Produccion diaria : listaDiarias) {
            detalleCarneDeDiarias.addAll(diaria.getDiariaDeProduccionCantidadUtilizadaCarnes());
            detalleAditivoDeDiarias.addAll(diaria.getDiariaDeProduccionCantidadUtilizadaInsumos());
        }

        for (Detalle_Cantidad_Carne detalle : listaDetalleCarne) {
            if (!detalleCarneDeDiarias.contains(detalle)) {
                detalleCarneSinAsignar.add(detalle);
            }
        }

        for (Detalle_Cantidad_Insumo detalle : listaDetalleAditivo) {
            if (!detalleAditivoDeDiarias.contains(detalle)) {
                detalleAditivoSinAsignar.add(detalle);
            }
        }

        for (Detalle_Cantidad_Insumo detalleEliminar : detalleAditivoSinAsignar) {
            detalleCantidadInsumoRepositorio.deleteById(detalleEliminar.getDetalleCantidadInsumoId());
        }

        for (Detalle_Cantidad_Carne detalleEliminar : detalleCarneSinAsignar) {
            detalleCantidadCarneRepositorio.deleteById(detalleEliminar.getDetalleCantidadCarneId());
        }

    }

    @Transactional
    public PDiaria_de_Produccion saveModificarDiaria(ModificarDiariaDto save) {
        Set<Carne> carnes = save.getDiariaDeProduccion().getDiariaDeProduccionInsumosCarnicos();
        Set<Control_de_Insumos> aditivos = save.getDiariaDeProduccion().getDiariaDeProduccionAditivos();
        List<Carne> carnesDesusadas = save.getListaCarneDesusadas();
        List<Control_de_Insumos> aditivosDesusados = save.getListaAditivosDesusadas();
        Set<Detalle_Cantidad_Carne> detalleCarne = save.getDiariaDeProduccion()
                .getDiariaDeProduccionCantidadUtilizadaCarnes();
        Set<Detalle_Cantidad_Insumo> detalleAditivo = save.getDiariaDeProduccion()
                .getDiariaDeProduccionCantidadUtilizadaInsumos();
        for (Carne carne : carnes) {
            if (carne.getCarneCantidad() == 0) {
                carne.setCarneEliminado(true);
            }
            else if (carne.getCarneCantidad() > 0) {
                carne.setCarneEliminado(false);
            } 
            carneRepositorio.save(carne);
        }

        for (Control_de_Insumos aditivo : aditivos) {
            if (aditivo.getInsumoCantidad() == 0) {
                aditivo.setInsumoEliminado(true);
            }
            else if (aditivo.getInsumoCantidad() > 0) {
                aditivo.setInsumoEliminado(false);
            }
            insumoRepositorio.save(aditivo);
        }

        if (carnesDesusadas.size() > 0) {
            for (Carne car : carnesDesusadas) {
                if (car.getCarneCantidad() > 0) {
                    car.setCarneEliminado(false);
                    carneRepositorio.save(car);
                } else {
                    car.setCarneEliminado(true);
                    carneRepositorio.save(car);
                }
            }
        }

        if (aditivosDesusados.size() > 0) {
            for (Control_de_Insumos adi : aditivosDesusados) {
                if (adi.getInsumoCantidad() > 0) {
                    adi.setInsumoEliminado(false);
                    insumoRepositorio.save(adi);
                } else {
                    adi.setInsumoEliminado(true);
                    insumoRepositorio.save(adi);
                }
            }
        }

        for (Detalle_Cantidad_Carne detalleC : detalleCarne) {
            detalleCantidadCarneRepositorio.save(detalleC);
        }

        for (Detalle_Cantidad_Insumo detalleA : detalleAditivo) {
            detalleCantidadInsumoRepositorio.save(detalleA);
        }

        loteRepositorio.save(save.getDiariaDeProduccion().getDiariaDeProduccionLote());
        PDiaria_de_Produccion guardado = diariaDeProduccionRepositorio.save(save.getDiariaDeProduccion());
        eliminarDetallesSinAsignar();
        return guardado;
    }

    @Override
    @Transactional
    public PDiaria_de_Produccion saveDiariaCantidad(PDiaria_de_Produccion diariaDeProduccion,
            Set<Detalle_Cantidad_Carne> listaCantidadCarne, Set<Detalle_Cantidad_Insumo> listaCantidadInsumo,
            Lote lote) {
        Set<PDiaria_de_Produccion> diaria = new HashSet<>();
        diaria.add(diariaDeProduccion);
        for (Carne carne : diariaDeProduccion.getDiariaDeProduccionInsumosCarnicos()) {
            int cantidadEnt = carne.getCarneCantidad().intValue();
            if (cantidadEnt == 0) {
                carne.setCarneEliminado(true);
                carneRepositorio.save(carne);
            } else {
                carneRepositorio.save(carne);
            }
        }

        for (Control_de_Insumos insumo : diariaDeProduccion.getDiariaDeProduccionAditivos()) {
            if (insumo.getInsumoCantidad() == 0) {
                insumo.setInsumoEliminado(true);
                insumoRepositorio.save(insumo);
            } else {
                insumoRepositorio.save(insumo);
            }
        }

        for (Detalle_Cantidad_Carne carneCantidad : listaCantidadCarne) {
            carneCantidad.setDetalleCantidadCarneDiariaDeProd(diaria);
            detalleCantidadCarneRepositorio.save(carneCantidad);
        }

        for (Detalle_Cantidad_Insumo insumoCantidad : listaCantidadInsumo) {
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
    public void deleteById(Long Id) {
        diariaDeProduccionRepositorio.deleteById(Id);
    }
}
