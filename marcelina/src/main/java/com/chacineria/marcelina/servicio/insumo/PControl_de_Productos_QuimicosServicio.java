package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import com.chacineria.marcelina.entidad.insumo.PControl_de_Productos_Quimicos;

public interface PControl_de_Productos_QuimicosServicio {
    public Iterable<PControl_de_Productos_Quimicos> findAll();
    public Optional<PControl_de_Productos_Quimicos> findById(Long Id);
    public PControl_de_Productos_Quimicos save(PControl_de_Productos_Quimicos save);
    public void deleteById(Long Id);
}
