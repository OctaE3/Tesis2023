package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import com.chacineria.marcelina.entidad.insumo.PControl_de_Nitrito;

public interface PControl_de_NitritoServicio {
    public Iterable<PControl_de_Nitrito> findAll();
    public Optional<PControl_de_Nitrito> findById(Long Id);
    public PControl_de_Nitrito save(PControl_de_Nitrito save);
    public void deleteById(Long Id);
}
