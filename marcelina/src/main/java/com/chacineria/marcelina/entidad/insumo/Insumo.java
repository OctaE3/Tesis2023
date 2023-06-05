package com.chacineria.marcelina.entidad.insumo;
import com.chacineria.marcelina.entidad.persona.Proveedor;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Entity;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;



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

    public Insumo(Long insumoId, String insumoNombre, Proveedor insumoProveedor, String insumoTipo,
            String insumoNroLote, Date insumoFechaVencimiento) {
        this.insumoId = insumoId;
        this.insumoNombre = insumoNombre;
        this.insumoProveedor = insumoProveedor;
        this.insumoTipo = insumoTipo;
        this.insumoNroLote = insumoNroLote;
        this.insumoFechaVencimiento = insumoFechaVencimiento;
    }

    
}
