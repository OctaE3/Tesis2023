package com.chacineria.marcelina.entidad.auxiliares;

import java.util.HashSet;
import java.util.Set;

import com.chacineria.marcelina.entidad.insumo.Lote;
import com.chacineria.marcelina.entidad.trazabilidad.PExpedicion_de_Producto;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity(name = "detalle_cantidad_lote")
public class Detalle_Cantidad_Lote {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detalle_cantidad_lote_id")
    private Long detalleCantidadLoteId;

    @ManyToOne
    @JoinColumn(name = "detalle_cantidad_lote_lote")
    private Lote detalleCantidadLoteLote;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "expedicionDeProductoCantidad")
    @JsonIgnore
    private Set<PExpedicion_de_Producto> detalleCantidadLoteExpDeProducto = new HashSet<>();

    @Column(name = "detalle_cantidad_lote_cantidad_vendida")
    private Integer detalleCantidadLoteCantidadVendida;

    public Long getDetalleCantidadLoteId() {
        return detalleCantidadLoteId;
    }

    public void setDetalleCantidadLoteId(Long detalleCantidadLoteId) {
        this.detalleCantidadLoteId = detalleCantidadLoteId;
    }

    public Lote getDetalleCantidadLoteLote() {
        return detalleCantidadLoteLote;
    }

    public void setDetalleCantidadLoteLote(Lote detalleCantidadLoteLote) {
        this.detalleCantidadLoteLote = detalleCantidadLoteLote;
    }

    public Set<PExpedicion_de_Producto> getDetalleCantidadLoteExpDeProducto() {
        return detalleCantidadLoteExpDeProducto;
    }

    public void setDetalleCantidadLoteExpDeProducto(Set<PExpedicion_de_Producto> detalleCantidadLoteExpDeProducto) {
        this.detalleCantidadLoteExpDeProducto = detalleCantidadLoteExpDeProducto;
    }

    public Integer getDetalleCantidadLoteCantidadVendida() {
        return detalleCantidadLoteCantidadVendida;
    }

    public void setDetalleCantidadLoteCantidadVendida(Integer detalleCantidadLoteCantidadVendida) {
        this.detalleCantidadLoteCantidadVendida = detalleCantidadLoteCantidadVendida;
    }

    public Detalle_Cantidad_Lote(Long detalleCantidadLoteId, Lote detalleCantidadLoteLote,
            Set<PExpedicion_de_Producto> detalleCantidadLoteExpDeProducto, Integer detalleCantidadLoteCantidadVendida) {
        this.detalleCantidadLoteId = detalleCantidadLoteId;
        this.detalleCantidadLoteLote = detalleCantidadLoteLote;
        this.detalleCantidadLoteExpDeProducto = detalleCantidadLoteExpDeProducto;
        this.detalleCantidadLoteCantidadVendida = detalleCantidadLoteCantidadVendida;
    }

    public Detalle_Cantidad_Lote() {
    }

    
}
