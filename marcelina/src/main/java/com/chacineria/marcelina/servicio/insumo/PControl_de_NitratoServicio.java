package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import com.chacineria.marcelina.entidad.insumo.PControl_de_Nitrato;

public interface PControl_de_NitratoServicio {
    public Iterable<PControl_de_Nitrato> findAll();
    public Optional<PControl_de_Nitrato> findById(Long Id);
    public PControl_de_Nitrato save(PControl_de_Nitrato save);
    public void deleteById(Long Id);
}
