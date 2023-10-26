package com.chacineria.marcelina.servicio.trazabilidad;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chacineria.marcelina.entidad.insumo.Carne;
import com.chacineria.marcelina.entidad.trazabilidad.PAnual_de_Insumos_Carnicos;
import com.chacineria.marcelina.repositorio.trazabilidad.PAnual_de_Insumos_CarnicosRepositorio;
import com.chacineria.marcelina.servicio.insumo.CarneServicioImpl;

@Service
public class PAnual_de_Insumos_CarnicosServicioImpl implements PAnual_de_Insumos_CarnicosServicio {

    @Autowired
    private PAnual_de_Insumos_CarnicosRepositorio anualDeInsumosCarnicosRepositorio;

    @Autowired
    private CarneServicioImpl carneServicioImpl;

    @Override
    @Transactional
    public Iterable<PAnual_de_Insumos_Carnicos> findAll() {
        return anualDeInsumosCarnicosRepositorio.findAll();
    }

    @Override
    @Transactional
    public Optional<PAnual_de_Insumos_Carnicos> findById(Long Id) {
        return anualDeInsumosCarnicosRepositorio.findById(Id);
    }

    @Override
    @Transactional
    public PAnual_de_Insumos_Carnicos save(PAnual_de_Insumos_Carnicos save) {
        return anualDeInsumosCarnicosRepositorio.save(save);
    }

    @Override
    @Transactional
    public void deleteById(Long Id) {
        anualDeInsumosCarnicosRepositorio.deleteById(Id);
    }

    @Transactional
    public PAnual_de_Insumos_Carnicos findLastAnualDeInsumosCarnicos() {
        return anualDeInsumosCarnicosRepositorio.findLastAnualDeInsumosCarnicos();
    }

    public Double totalPorMes(List<Carne> lista) {
        Double total = 0.0;
        if (lista.isEmpty()) {
            return total;
        } else {
            for (Carne carne : lista) {
                total = total + carne.getCarneCantidad();
            }
            return total;
        }
    }

    public String nombreMes(Date fecha) {
        SimpleDateFormat sdf = new SimpleDateFormat("MMMM");
        return sdf.format(fecha);
    }

    public Integer numeroAnio(Date fecha) {
        Calendar calendario = Calendar.getInstance();
        calendario.setTime(fecha);
        return calendario.get(Calendar.YEAR);
    }

    @Transactional
    public String saveAnualDeInsumosCarnicosAutomatico() {
        Date fechaActual = new Date(System.currentTimeMillis());
        Calendar calendario = Calendar.getInstance();
        calendario.setTime(fechaActual);

        calendario.add(Calendar.MONTH, -1);
        calendario.set(Calendar.DAY_OF_MONTH, calendario.getActualMaximum(Calendar.DAY_OF_MONTH));
        Date ultimoDiaMesAnterior = new Date(calendario.getTimeInMillis());

        calendario.add(Calendar.MONTH, 2);
        calendario.set(Calendar.DAY_OF_MONTH, 1);
        Date primerDiaProximoMes = new Date(calendario.getTimeInMillis());

        PAnual_de_Insumos_Carnicos ultimoAnual = findLastAnualDeInsumosCarnicos();

        String mes = nombreMes(fechaActual);
        String mensaje = "";
        Boolean check = false;

        if (ultimoAnual != null) {
            if (ultimoAnual.getAnualDeInsumosCarnicosMes().toLowerCase() == mes.toLowerCase()) {
                mensaje = "Ya se dio de Alta, el Anual de insumos carnicos del mes de " + mes;
            } else {
                check = true;
            }
        } 
        else if (ultimoAnual == null || check == true) {
            List<Carne> carneBovinaSH = carneServicioImpl
                    .findAllByCarneTipoAndCarneCategoriaAndCarneFechaBetween("Bovino",
                            "CarneSH", ultimoDiaMesAnterior, primerDiaProximoMes);

            List<Carne> carneBovinaCH = carneServicioImpl
                    .findAllByCarneTipoAndCarneCategoriaAndCarneFechaBetween("Bovino",
                            "CarneCH", ultimoDiaMesAnterior, primerDiaProximoMes);

            List<Carne> carnePorcinaSH = carneServicioImpl
                    .findAllByCarneTipoAndCarneCategoriaAndCarneFechaBetween("Porcino",
                            "CarneSH", ultimoDiaMesAnterior, primerDiaProximoMes);

            List<Carne> carnePorcinaCH = carneServicioImpl
                    .findAllByCarneTipoAndCarneCategoriaAndCarneFechaBetween("Porcino",
                            "CarneCH", ultimoDiaMesAnterior, primerDiaProximoMes);

            List<Carne> carnePorcinaGrasa = carneServicioImpl
                    .findAllByCarneTipoAndCarneCategoriaAndCarneFechaBetween("Porcino",
                            "Grasa", ultimoDiaMesAnterior, primerDiaProximoMes);

            List<Carne> carneHigado = carneServicioImpl
                    .findAllByCarneTipoAndCarneCategoriaAndCarneFechaBetween("Higado",
                            "Higado", ultimoDiaMesAnterior, primerDiaProximoMes);

            List<Carne> carneTripas = carneServicioImpl
                    .findAllByCarneTipoAndCarneCategoriaAndCarneFechaBetween("Tripas",
                            "Tripas", ultimoDiaMesAnterior, primerDiaProximoMes);

            List<Carne> carneSangre = carneServicioImpl
                    .findAllByCarneTipoAndCarneCategoriaAndCarneFechaBetween("Sangre",
                            "Sangre", ultimoDiaMesAnterior, primerDiaProximoMes);

            Integer totalCarneBovinaSH = Double.valueOf(totalPorMes(carneBovinaSH)).intValue();
            Integer totalCarneBovinaCH = Double.valueOf(totalPorMes(carneBovinaCH)).intValue();
            Integer totalCarnePorcinaSH = Double.valueOf(totalPorMes(carnePorcinaSH)).intValue();
            Integer totalCarnePorcinaCH = Double.valueOf(totalPorMes(carnePorcinaCH)).intValue();
            Integer totalCarnePorcinaGrasa = Double.valueOf(totalPorMes(carnePorcinaGrasa)).intValue();
            Integer totalCarneHigado = Double.valueOf(totalPorMes(carneHigado)).intValue();
            Integer totalCarneTripas = Double.valueOf(totalPorMes(carneTripas)).intValue();
            Integer totalCarneSangre = Double.valueOf(totalPorMes(carneSangre)).intValue();

            if (totalCarneBovinaSH != null && totalCarneBovinaCH != null && totalCarnePorcinaSH != null
                    && totalCarnePorcinaCH != null && totalCarnePorcinaGrasa != null && totalCarneHigado != null
                    && totalCarneTripas != null && totalCarneSangre != null) {

                Integer anio = numeroAnio(fechaActual);

                PAnual_de_Insumos_Carnicos anualDeInsumosCarnicos = new PAnual_de_Insumos_Carnicos();
                anualDeInsumosCarnicos.setAnualDeInsumosCarnicosCarneBovinaCH(totalCarneBovinaCH);
                anualDeInsumosCarnicos.setAnualDeInsumosCarnicosCarneBovinaSH(totalCarneBovinaSH);
                anualDeInsumosCarnicos.setAnualDeInsumosCarnicosCarnePorcinaCH(totalCarnePorcinaCH);
                anualDeInsumosCarnicos.setAnualDeInsumosCarnicosCarnePorcinaGrasa(totalCarnePorcinaGrasa);
                anualDeInsumosCarnicos.setAnualDeInsumosCarnicosCarnePorcinaSH(totalCarnePorcinaSH);
                anualDeInsumosCarnicos.setAnualDeInsumosCarnicosHigado(totalCarneHigado);
                anualDeInsumosCarnicos.setAnualDeInsumosCarnicosLitrosSangre(totalCarneSangre);
                anualDeInsumosCarnicos.setAnualDeInsumosCarnicosTripasMadejas(totalCarneTripas);
                anualDeInsumosCarnicos.setAnualDeInsumosCarnicosAnio(anio);
                anualDeInsumosCarnicos.setAnualDeInsumosCarnicosMes(mes);

                PAnual_de_Insumos_Carnicos anualAgregado = anualDeInsumosCarnicosRepositorio
                        .save(anualDeInsumosCarnicos);

                if (anualAgregado != null) {
                    mensaje = "Anual de Insumos Carnicos Agregado con exito.";
                } else {
                    mensaje = "No se logro dar de Alta el Anual de Insumos Carnicos.";
                }
            } else {
                mensaje = "Se encontro un tipo de dato, no valido en los totales.";
            }
        }
        return mensaje;
    }
}
