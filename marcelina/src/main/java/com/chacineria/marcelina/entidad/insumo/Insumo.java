package com.chacineria.marcelina.entidad.insumo;
import com.chacineria.marcelina.entidad.persona.Proveedor;

import java.io.Serializable;
import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;



@Entity
public class Insumo implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long insumoId;

    @Column(length = 50, nullable = false)
    private String insumoNombre;

    @ManyToOne
    @JoinColumn(name = "insumoProveedor")
    private Proveedor insumoProveedor;

    @Column(length = 20, nullable = false)
    private String insumoTipo;

    @Column(length = 30, nullable = false)
    private String insumoNroLote;

    @Column(nullable = false)
    private Date insumoFechaVencimiento;

    @Column(name = "insumo_eliminado")
    private Boolean insumoEliminado;

    public Long getInsumoId() {
        return insumoId;
    }

    public void setInsumoId(Long insumoId) {
        this.insumoId = insumoId;
    }

    public String getInsumoNombre() {
        return insumoNombre;
    }

    public void setInsumoNombre(String insumoNombre) {
        this.insumoNombre = insumoNombre;
    }

    public Proveedor getInsumoProveedor() {
        return insumoProveedor;
    }

    public void setInsumoProveedor(Proveedor insumoProveedor) {
        this.insumoProveedor = insumoProveedor;
    }

    public String getInsumoTipo() {
        return insumoTipo;
    }

    public void setInsumoTipo(String insumoTipo) {
        this.insumoTipo = insumoTipo;
    }

    public String getInsumoNroLote() {
        return insumoNroLote;
    }

    public void setInsumoNroLote(String insumoNroLote) {
        this.insumoNroLote = insumoNroLote;
    }

    public Date getInsumoFechaVencimiento() {
        return insumoFechaVencimiento;
    }

    public void setInsumoFechaVencimiento(Date insumoFechaVencimiento) {
        this.insumoFechaVencimiento = insumoFechaVencimiento;
    }

    public Boolean getInsumoEliminado() {
        return insumoEliminado;
    }

    public void setInsumoEliminado(Boolean insumoEliminado) {
        this.insumoEliminado = insumoEliminado;
    }

    public Insumo(Long insumoId, String insumoNombre, Proveedor insumoProveedor, String insumoTipo,
            String insumoNroLote, Date insumoFechaVencimiento, Boolean insumoEliminado) {
        this.insumoId = insumoId;
        this.insumoNombre = insumoNombre;
        this.insumoProveedor = insumoProveedor;
        this.insumoTipo = insumoTipo;
        this.insumoNroLote = insumoNroLote;
        this.insumoFechaVencimiento = insumoFechaVencimiento;
        this.insumoEliminado = insumoEliminado;
    }
  
    public Insumo() { }
    
}
