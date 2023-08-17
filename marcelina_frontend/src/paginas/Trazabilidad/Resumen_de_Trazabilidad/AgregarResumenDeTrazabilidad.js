import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Tooltip, IconButton, makeStyles, createTheme } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import FormularioReutilizanle from '../../../components/Reutilizable/FormularioReutilizable'
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

const AgregarResumenDeTrazabilidad = () => {

    const formFields = [
        { name: 'resumenDeTrazabilidadFecha', label: 'Fecha', type: 'date' },
        { name: 'resumenDeTrazabilidadLote', label: 'Lote', type: 'selector' },
        { name: 'resumenDeTrazabilidadDestino', label: 'Destino', type: 'text' },
    ];

    const classes = useStyles();
    const [lotes, setLotes] = useState('');
    const [loteSelect, setLoteSelect] = useState('');

    useEffect(() => {
        const obtenerLotes = () => {
            axios.get('/listar-lotes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setLotes(response.data);
                    setLoteSelect(
                        response.data.map((lote) => ({
                            value: lote.loteId,
                            label: `${lote.loteCodigo} - ${lote.loteProducto.productoNombre}`,
                        }))
                    );
                })
                .catch(error => {
                    console.error(error);
                });
        };

        obtenerLotes();

    }, []);

    const handleFormSubmit = (formData) => {

        const loteId = formData.resumenDeTrazabilidadLote;
        const loteCompleto = lotes.filter((lote) => lote.loteId.toString() === formData.resumenDeTrazabilidadLote)[0];
        
        axios.get(`/buscar-diaria-de-produccion-lote/${loteId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                const diariaDeProduccion = response.data;
                console.log(diariaDeProduccion);

                const data = {
                    resumenDeTrazabilidadFecha: formData.resumenDeTrazabilidadFecha,
                    resumenDeTrazabilidadLote: loteCompleto,
                    resumenDeTrazabilidadProducto: loteCompleto.loteProducto,
                    resumenDeTrazabilidadCantidadProducida: diariaDeProduccion.diariaDeProduccionCantidadProducida,
                    resumenDeTrazabilidadMatPrimaCarnica: diariaDeProduccion.diariaDeProduccionInsumosCarnicos,
                    resumenDeTrazabilidadMatPrimaNoCarnica: diariaDeProduccion.diariaDeProduccionAditivos,
                    resumenDeTrazabilidadDestino: formData.resumenDeTrazabilidadDestino,
                    resumenDeTrazabilidadResponsable: window.localStorage.getItem('user'),
                }

                console.log(data);

                axios.post('/agregar-resumen-de-trazabilidad', data, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        if (response.status === 201) {
                            console.log(response.data);
                            console.log("Resumen de trazabilidad agregado con éxito!");
                        } else {
                            console.log("No se logro agregar el resumen de trazabilidad");
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    })
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <Grid>
            <Navbar />
            <Container style={{ marginTop: 30 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={0}>
                        <Grid item lg={2} md={2} ></Grid>
                        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
                            <Typography component='h1' variant='h4'>Agregar Resumen de Trazabilidad</Typography>
                            <Tooltip title={
                                <Typography fontSize={16}>
                                    En esta pagina puedes registrar las localidades, que se asignaran a los proveedores, clientes, etc.
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
            <FormularioReutilizanle
                fields={formFields}
                onSubmit={handleFormSubmit}
                selectOptions={{
                    resumenDeTrazabilidadLote: loteSelect,
                }}
            />
        </Grid>
    )
}

export default AgregarResumenDeTrazabilidad;