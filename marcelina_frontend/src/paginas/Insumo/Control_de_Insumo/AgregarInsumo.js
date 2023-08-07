import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import { Container, Box, Grid, Typography, FormControl, InputLabel, Select, makeStyles, CssBaseline, Tooltip, IconButton, createTheme } from '@material-ui/core';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Logo from "../../../assets/images/Logo.png";
import axios from 'axios';

const theme = createTheme({
    palette: {
      primary: {
        main: '#2C2C71'
      }
    }
  });
  
  const useStyles = makeStyles(theme => ({
    title: {
      textAlign: 'center',
    },
  }));

const AgregarInsumo = () => {
    const formFields = [
        { name: 'insumoNombre', label: 'Nombre', type: 'text' },
        { name: 'insumoFecha', label: 'Fecha', type: 'date', format: 'yyyy-MM-dd' },
        { name: 'insumoProveedor', label: 'Proveedor', type: 'selector' },
        { name: 'insumoTipo', label: 'Tipo', type: 'selector' },
        { name: 'insumoCantidad', label: 'Cantidad', type: 'number' },
        { name: 'insumoUnidad', label: 'Unidad', type: 'selector' },
        { name: 'insumoNroLote', label: 'Lote', type: 'text' },
        { name: 'insumoMotivoDeRechazo', label: 'Motivo de rechazo', type: 'text', multi: '3' },
        { name: 'insumoFechaVencimiento', label: 'Fecha Vencimiento', type: 'date', format: 'yyyy-MM-dd' },
    ];

    const classes = useStyles();
    const [insumo, setInsumo] = useState({});
    const [proveedores, setProveedores] = useState([]);
    const [insumoProveedoresSelect, setInsumoProveedoresSelect] = useState([]);
    const [insumoTipoSelect, setInsumoTipoSelect] = useState([
        { value: 'Aditivo', label: 'Aditivo' },
        { value: 'Insumo', label: 'Insumo' },
        { value: 'Mat.Prima no Cárnica', label: 'Mat.Prima no Cárnica' },
        { value: 'Otros', label: 'Otros' }
    ]);
    const [insumoUnidadSelect, setInsumoUnidadSelect] = useState([
        { value: 'Kg', label: 'Kg' },
        { value: 'Metros', label: 'Metros' },
        { value: 'Litros', label: 'Litros' },
    ]);

    useEffect(() => {
        const obtenerProveedores = () => {
            axios.get('/listar-proveedores', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setProveedores(response.data);
                    setInsumoProveedoresSelect(
                        response.data.map((proveedor) => ({
                            value: proveedor.proveedorId,
                            label: proveedor.proveedorNombre,
                        }))
                    );
                })
                .catch(error => {
                    console.error(error);
                });
        };

        obtenerProveedores();
    }, []);

    const handleFormSubmit = (formData) => {
        const proveedorSeleccionadaObj = proveedores.filter((proveedor) => proveedor.proveedorId.toString() === formData.insumoProveedor)[0];

        const insumoFecha = new Date(formData.insumoFecha);
        const insumoFechaVencimiento = new Date(formData.insumoFechaVencimiento);

        const insumoFechaISO = insumoFecha.toISOString().slice(0, 10);
        const insumoFechaVencimientoISO = insumoFechaVencimiento.toISOString().slice(0, 10);

        const insumoConProveedor = {
            ...formData,
            insumoProveedor: proveedorSeleccionadaObj ? proveedorSeleccionadaObj : null,
            insumoResponsable: window.localStorage.getItem('user'),
            insumoFecha: insumoFechaISO,
            insumoFechaVencimiento: insumoFechaVencimientoISO
        };

        setInsumo(insumoConProveedor);
        console.log(insumoConProveedor);
        if (insumoConProveedor.insumoTipo == null || insumoConProveedor.insumoTipo === 'Seleccionar'
            || insumoConProveedor.insumoProveedor == null || insumoConProveedor.insumoProveedor === 'Seleccionar') {
            console.log("Seleccione un tipo de Insumo");
        }
        else {
            axios.post('/agregar-control-de-insumos', insumoConProveedor, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    if (response.status === 201) {
                        console.log("Insumo agregada con éxito!");
                    } else {
                        console.log("No se logro agregar el Insumo.");
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        }
    }


    return (
        <div>
            <CssBaseline>
                <Grid>
                    <Navbar />
                    <Container style={{ marginTop: 30 }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={0}>
                                <Grid item lg={2} md={2} ></Grid>
                                <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
                                    <Typography component='h1' variant='h4'>Agregar Insumo</Typography>
                                    <Tooltip title={
                                        <Typography fontSize={16}>
                                            En esta pagina puedes registrar los distintos Insumos, Aditivos que compran.
                                        </Typography>
                                    }>
                                        <IconButton>
                                            <HelpOutlineIcon fontSize="large" color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid item lg={2} md={2}></Grid>
                            </Grid>
                        </Box>
                    </Container>
                    <FormularioReutilizable
                        fields={formFields}
                        onSubmit={handleFormSubmit}
                        selectOptions={{
                            insumoProveedor: insumoProveedoresSelect,
                            insumoTipo: insumoTipoSelect,
                            insumoUnidad: insumoUnidadSelect
                        }}
                    />
                </Grid>
            </CssBaseline>
        </div>
    );
}

export default AgregarInsumo;