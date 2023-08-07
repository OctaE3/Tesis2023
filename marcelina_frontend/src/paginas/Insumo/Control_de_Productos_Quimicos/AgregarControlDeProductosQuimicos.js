import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import { Container, Box, Grid, Typography, makeStyles, createTheme, CssBaseline, Tooltip, IconButton } from '@material-ui/core';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable';
import { useNavigate } from 'react-router-dom';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import axios from 'axios';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2C2C71'
        }
    }
});

const useStyles = makeStyles((theme) => ({
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: '100%',
        marginBottom: theme.spacing(1)
    },
    title: {
        textAlign: 'center',
    }
}));

const AgregarControlDeProductosQuimicos = () => {

    const formFields = [
        { name: 'controlDeProductosQuimicosFecha', label: 'Fecha', type: 'date' },
        { name: 'controlDeProductosQuimicosProveedor', label: 'Proveedor', type: 'selector' },
        { name: 'controlDeProductosQuimicosProductoQuimico', label: 'Producto Quimico', type: 'text' },
        { name: 'controlDeProductosQuimicosLote', label: 'Lote', type: 'text' },
        { name: 'controlDeProductosQuimicosMotivoDeRechazo', label: 'Motivo de rechazo', type: 'text', multi: '3' },
    ];

    const [quimicos, setQuimicos] = useState({});
    const [proveedor, setProveedor] = useState({});
    const [proveedores, setProveedores] = useState([]);
    const [proveedoresSelect, setProveedoresSelect] = useState('');
    const [reloadProveedores, setReloadProveedores] = useState(false);

    const classes = useStyles();

    useEffect(() => {
        const obtenerProveedores = () => {
            axios.get('/listar-proveedores', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setProveedores(response.data);
                    setProveedoresSelect(
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

        if (reloadProveedores) {
            obtenerProveedores();
            setReloadProveedores(false);
        }

    }, [reloadProveedores]);

    const handleFormSubmit = (formData) => {
        const proveedorSeleccionadaObj = proveedores.filter((proveedor) => proveedor.proveedorId.toString() === formData.controlDeProductosQuimicosProveedor)[0];

        const quimicosConProveedor = {
            ...formData,
            controlDeProductosQuimicosProveedor: proveedorSeleccionadaObj ? proveedorSeleccionadaObj : null,
            controlDeProductosQuimicosResponsable: window.localStorage.getItem('user'),
        };

        setProveedor(quimicosConProveedor);

        if (quimicosConProveedor.controlDeProductosQuimicosProveedor == null || quimicosConProveedor.controlDeProductosQuimicosProveedor === 'Seleccionar') {
            console.log("Seleccione una localidad valida.")
        }
        else {
            axios.post('/agregar-control-de-productos-quimicos', quimicosConProveedor, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    if (response.status === 201) {
                        console.log("Control de Productos Quimicos agregado con éxito!");
                    } else {
                        console.log("No se logro agregar el Control de Productos Quimicos, revise los datos ingresados.");
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
                                    <Typography component='h1' variant='h5'>Agregar Proveedor</Typography>
                                    <Tooltip title={
                                        <Typography fontSize={16}>
                                            En esta pagina puedes registrar los proveedores.
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
                        selectOptions={{ controlDeProductosQuimicosProveedor: proveedoresSelect }}
                    />
                </Grid>
            </CssBaseline>
        </div>
    );
};

export default AgregarControlDeProductosQuimicos;