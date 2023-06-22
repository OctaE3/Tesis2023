package com.chacineria.marcelina.entidad.insumo;
import com.chacineria.marcelina.entidad.persona.Proveedor;
import com.chacineria.marcelina.entidad.persona.Usuario;

import java.io.Serializable;
import java.util.Set;
import java.util.HashSet;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.ManyToMany;

@Entity(name = "recepcion_materias_primas_carnicas")
public class PRecepcion_de_Materias_Primas_Carnicas implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recepcion_materias_primas_carnicas_id")
    private Long recepcionDeMateriasPrimasCarnicasId;

    @Column(name = "recepcion_materias_primas_carnicas_fecha", nullable = false)
    private Date recepcionDeMateriasPrimasCarnicasFecha;

    @ManyToOne
    @JoinColumn(name = "recepcion_materias_primas_carnicas_proveedor", nullable = false)
    private Proveedor recepcionDeMateriasPrimasCarnicasProveedor;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "recepcion_materias_primas_carnicas_carnes",
        joinColumns = @JoinColumn(name = "recepcion_materias_primas_carnicas_id"),
        inverseJoinColumns = @JoinColumn(name = "carne_id"))
    private Set<Carne> recepcionDeMateriasPrimasCarnicasProductos = new HashSet<>();

    @Column(name = "recepcion_materias_primas_carnicas_paseSanitario", nullable = false, unique = true)
    private String recepcionDeMateriasPrimasCarnicasPaseSanitario;

    @Column(name = "recepcion_materias_primas_carnicas_temperatura", nullable = false)
    private String recepcionDeMateriasPrimasCarnicasTemperatura;

    @Column(name = "recepcion_materias_primas_carnicas_motivoDeRechazo", length = 150)
    private String recepcionDeMateriasPrimasCarnicasMotivoDeRechazo;

    @ManyToOne
    @JoinColumn(name = "recepcion_materias_primas_carnicas_responsable", nullable = false)
    private Usuario recepcionDeMateriasPrimasCarnicasResponsable;

    public Long getRecepcionDeMateriasPrimasCarnicasId() {
        return recepcionDeMateriasPrimasCarnicasId;
    }

    public void setRecepcionDeMateriasPrimasCarnicasId(Long recepcionDeMateriasPrimasCarnicasId) {
        this.recepcionDeMateriasPrimasCarnicasId = recepcionDeMateriasPrimasCarnicasId;
    }

    public Date getRecepcionDeMateriasPrimasCarnicasFecha() {
        return recepcionDeMateriasPrimasCarnicasFecha;
    }

    public void setRecepcionDeMateriasPrimasCarnicasFecha(Date recepcionDeMateriasPrimasCarnicasFecha) {
        this.recepcionDeMateriasPrimasCarnicasFecha = recepcionDeMateriasPrimasCarnicasFecha;
    }

    public Proveedor getRecepcionDeMateriasPrimasCarnicasProveedor() {
        return recepcionDeMateriasPrimasCarnicasProveedor;
    }

    public void setRecepcionDeMateriasPrimasCarnicasProveedor(Proveedor recepcionDeMateriasPrimasCarnicasProveedor) {
        this.recepcionDeMateriasPrimasCarnicasProveedor = recepcionDeMateriasPrimasCarnicasProveedor;
    }

    public Set<Carne> getRecepcionDeMateriasPrimasCarnicasProductos() {
        return recepcionDeMateriasPrimasCarnicasProductos;
    }

    public void setRecepcionDeMateriasPrimasCarnicasProductos(Set<Carne> recepcionDeMateriasPrimasCarnicasProductos) {
        this.recepcionDeMateriasPrimasCarnicasProductos = recepcionDeMateriasPrimasCarnicasProductos;
    }

    public String getRecepcionDeMateriasPrimasCarnicasPaseSanitario() {
        return recepcionDeMateriasPrimasCarnicasPaseSanitario;
    }

    public void setRecepcionDeMateriasPrimasCarnicasPaseSanitario(String recepcionDeMateriasPrimasCarnicasPaseSanitario) {
        this.recepcionDeMateriasPrimasCarnicasPaseSanitario = recepcionDeMateriasPrimasCarnicasPaseSanitario;
    }

    public String getRecepcionDeMateriasPrimasCarnicasTemperatura() {
        return recepcionDeMateriasPrimasCarnicasTemperatura;
    }

    public void setRecepcionDeMateriasPrimasCarnicasTemperatura(String recepcionDeMateriasPrimasCarnicasTemperatura) {
        this.recepcionDeMateriasPrimasCarnicasTemperatura = recepcionDeMateriasPrimasCarnicasTemperatura;
    }

    public String getRecepcionDeMateriasPrimasCarnicasMotivoDeRechazo() {
        return recepcionDeMateriasPrimasCarnicasMotivoDeRechazo;
    }

    public void setRecepcionDeMateriasPrimasCarnicasMotivoDeRechazo(
            String recepcionDeMateriasPrimasCarnicasMotivoDeRechazo) {
        this.recepcionDeMateriasPrimasCarnicasMotivoDeRechazo = recepcionDeMateriasPrimasCarnicasMotivoDeRechazo;
    }

    public Usuario getRecepcionDeMateriasPrimasCarnicasResponsable() {
        return recepcionDeMateriasPrimasCarnicasResponsable;
    }

    public void setRecepcionDeMateriasPrimasCarnicasResponsable(Usuario recepcionDeMateriasPrimasCarnicasResponsable) {
        this.recepcionDeMateriasPrimasCarnicasResponsable = recepcionDeMateriasPrimasCarnicasResponsable;
    }

    public PRecepcion_de_Materias_Primas_Carnicas(Long recepcionDeMateriasPrimasCarnicasId,
            Date recepcionDeMateriasPrimasCarnicasFecha, Proveedor recepcionDeMateriasPrimasCarnicasProveedor,
            Set<Carne> recepcionDeMateriasPrimasCarnicasProductos,
            String recepcionDeMateriasPrimasCarnicasPaseSanitario, String recepcionDeMateriasPrimasCarnicasTemperatura,
            String recepcionDeMateriasPrimasCarnicasMotivoDeRechazo,
            Usuario recepcionDeMateriasPrimasCarnicasResponsable) {
        this.recepcionDeMateriasPrimasCarnicasId = recepcionDeMateriasPrimasCarnicasId;
        this.recepcionDeMateriasPrimasCarnicasFecha = recepcionDeMateriasPrimasCarnicasFecha;
        this.recepcionDeMateriasPrimasCarnicasProveedor = recepcionDeMateriasPrimasCarnicasProveedor;
        this.recepcionDeMateriasPrimasCarnicasProductos = recepcionDeMateriasPrimasCarnicasProductos;
        this.recepcionDeMateriasPrimasCarnicasPaseSanitario = recepcionDeMateriasPrimasCarnicasPaseSanitario;
        this.recepcionDeMateriasPrimasCarnicasTemperatura = recepcionDeMateriasPrimasCarnicasTemperatura;
        this.recepcionDeMateriasPrimasCarnicasMotivoDeRechazo = recepcionDeMateriasPrimasCarnicasMotivoDeRechazo;
        this.recepcionDeMateriasPrimasCarnicasResponsable = recepcionDeMateriasPrimasCarnicasResponsable;
    }

    public PRecepcion_de_Materias_Primas_Carnicas() { }
}
