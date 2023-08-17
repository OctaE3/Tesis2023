package com.chacineria.marcelina.servicio.insumo;

import java.util.Optional;

import com.chacineria.marcelina.entidad.insumo.Control_de_Insumos;

public interface Control_de_InsumosServicio {
    public Iterable<Control_de_Insumos> findAllByInsumoEliminado(Boolean eliminado);
    public Iterable<Control_de_Insumos> findAllByInsumoEliminadoAndInsumoTipo(Boolean eliminado, String tipo);
    public Optional<Control_de_Insumos> findById(Long Id);
    public Control_de_Insumos save(Control_de_Insumos save);
    public void deleteById(Long Id);
}
