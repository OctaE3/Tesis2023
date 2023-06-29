package com.chacineria.marcelina.entidad.insumo;
import com.chacineria.marcelina.entidad.persona.Proveedor;
import com.chacineria.marcelina.entidad.persona.Usuario;

import java.io.Serializable;
import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "control_productos_quimicos")
public class PControl_de_Productos_Quimicos implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "control_productos_quimicos_id")
    private Long controlDeProductosQuimicosId;

    @Column(name = "control_productos_quimicos_fecha",nullable = false)
    private Date controlDeProductosQuimicosFecha;

    @Column(name = "control_productos_quimicos_productoQuimico", length = 50, nullable = false)
    private String controlDeProductosQuimicosProductoQuimico;

    @ManyToOne
    @JoinColumn(name = "control_productos_quimicos_proveedor", nullable = false)
    private Proveedor controlDeProductosQuimicosProveedor;

    @Column(name = "control_productos_quimicos_lote", length = 30, nullable = false)
    private String controlDeProductosQuimicosLote;

    @Column(name = "control_productos_quimicos_motivoDeRechazo", length = 150, nullable = true)
    private String controlDeProductosQuimicosMotivoDeRechazo;

    @ManyToOne
    @JoinColumn(name = "control_productos_quimicos_responsable", nullable = false)
    private Usuario controlDeProductosQuimicosResponsable;

    public Long getControlDeProductosQuimicosId() {
        return controlDeProductosQuimicosId;
    }

    public void setControlDeProductosQuimicosId(Long controlDeProductosQuimicosId) {
        this.controlDeProductosQuimicosId = controlDeProductosQuimicosId;
    }

    public Date getControlDeProductosQuimicosFecha() {
        return controlDeProductosQuimicosFecha;
    }

    public void setControlDeProductosQuimicosFecha(Date controlDeProductosQuimicosFecha) {
        this.controlDeProductosQuimicosFecha = controlDeProductosQuimicosFecha;
    }

    public String getControlDeProductosQuimicosProductoQuimico() {
        return controlDeProductosQuimicosProductoQuimico;
    }

    public void setControlDeProductosQuimicosProductoQuimico(String controlDeProductosQuimicosProductoQuimico) {
        this.controlDeProductosQuimicosProductoQuimico = controlDeProductosQuimicosProductoQuimico;
    }

    public Proveedor getControlDeProductosQuimicosProveedor() {
        return controlDeProductosQuimicosProveedor;
    }

    public void setControlDeProductosQuimicosProveedor(Proveedor controlDeProductosQuimicosProveedor) {
        this.controlDeProductosQuimicosProveedor = controlDeProductosQuimicosProveedor;
    }

    public String getControlDeProductosQuimicosLote() {
        return controlDeProductosQuimicosLote;
    }

    public void setControlDeProductosQuimicosLote(String controlDeProductosQuimicosLote) {
        this.controlDeProductosQuimicosLote = controlDeProductosQuimicosLote;
    }

    public String getControlDeProductosQuimicosMotivoDeRechazo() {
        return controlDeProductosQuimicosMotivoDeRechazo;
    }

    public void setControlDeProductosQuimicosMotivoDeRechazo(String controlDeProductosQuimicosMotivoDeRechazo) {
        this.controlDeProductosQuimicosMotivoDeRechazo = controlDeProductosQuimicosMotivoDeRechazo;
    }

    public Usuario getControlDeProductosQuimicosResponsable() {
        return controlDeProductosQuimicosResponsable;
    }

    public void setControlDeProductosQuimicosResponsable(Usuario controlDeProductosQuimicosResponsable) {
        this.controlDeProductosQuimicosResponsable = controlDeProductosQuimicosResponsable;
    }

    public PControl_de_Productos_Quimicos(Long controlDeProductosQuimicosId, Date controlDeProductosQuimicosFecha,
            String controlDeProductosQuimicosProductoQuimico, Proveedor controlDeProductosQuimicosProveedor,
            String controlDeProductosQuimicosLote, String controlDeProductosQuimicosMotivoDeRechazo,
            Usuario controlDeProductosQuimicosResponsable) {
        this.controlDeProductosQuimicosId = controlDeProductosQuimicosId;
        this.controlDeProductosQuimicosFecha = controlDeProductosQuimicosFecha;
        this.controlDeProductosQuimicosProductoQuimico = controlDeProductosQuimicosProductoQuimico;
        this.controlDeProductosQuimicosProveedor = controlDeProductosQuimicosProveedor;
        this.controlDeProductosQuimicosLote = controlDeProductosQuimicosLote;
        this.controlDeProductosQuimicosMotivoDeRechazo = controlDeProductosQuimicosMotivoDeRechazo;
        this.controlDeProductosQuimicosResponsable = controlDeProductosQuimicosResponsable;
    }

    public PControl_de_Productos_Quimicos() { }
}
