import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, Dialog, IconButton, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
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
    customTooltip: {
        maxWidth: 800,
        fontSize: 16,
        [theme.breakpoints.down('sm')]: {
            maxWidth: '80vw',
        },

        [theme.breakpoints.up('md')]: {
            maxWidth: 800,
        },
    },
    text: {
        color: '#2D2D2D',
    },
    liTitle: {
        color: 'black',
        fontWeight: 'bold',
    },
}));

const AgregarResumenDeTrazabilidad = () => {

    const formFields = [
        { name: 'resumenDeTrazabilidadFecha', label: 'Fecha', type: 'date', color: 'primary' },
        { name: 'resumenDeTrazabilidadLote', label: 'Lote', type: 'selector', color: 'primary' },
        { name: 'resumenDeTrazabilidadDestino', label: 'Destino', type: 'selector', multiple: 'si', color: 'primary' },
    ];

    const alertSuccess = [
        { title: 'Correcto', body: 'Localidad agregada con éxito!', severity: 'success', type: 'description' },
    ];

    const alertError = [
        { title: 'Error', body: 'No se logro agregar la localidad, revise los datos ingresados', severity: 'error', type: 'description' },
    ];

    const classes = useStyles();
    const [lotes, setLotes] = useState('');
    const [loteSelect, setLoteSelect] = useState('');
    const [clientes, setClientes] = useState('');
    const [clienteSelect, setClienteSelect] = useState('');
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

        const obtenerClientes = () => {
            axios.get('/listar-clientes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setClientes(response.data);
                    setClienteSelect(
                        response.data.map((cliente) => ({
                            value: cliente.clienteId,
                            label: `${cliente.clienteNombre} - ${cliente.clienteEmail}`,
                        }))
                    );
                })
                .catch(error => {
                    console.error(error);
                });
        };

        obtenerClientes();
        obtenerLotes();

    }, []);

    const handleFormSubmit = (formData) => {

        const loteId = formData.resumenDeTrazabilidadLote;
        const loteCompleto = lotes.filter((lote) => lote.loteId.toString() === formData.resumenDeTrazabilidadLote)[0];

        const clientesId = formData.resumenDeTrazabilidadDestino.map(cliente => cliente.value);
        const clientesCompletos = clientes.filter(cliente => clientesId.includes(cliente.clienteId));

        console.log(clientesCompletos);

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
                    resumenDeTrazabilidadDestino: clientesCompletos,
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
                            setShowAlertSuccess(true);
                            setTimeout(() => {
                                setShowAlertSuccess(false);
                            }, 5000);
                        } else {
                            setShowAlertError(true);
                            setTimeout(() => {
                                setShowAlertError(false);
                            }, 5000);
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
                            <div>
                                <Button color="primary" onClick={handleClickOpen}>
                                    <IconButton>
                                        <HelpOutlineIcon fontSize="large" color="primary" />
                                    </IconButton>
                                </Button>
                                <Dialog
                                    fullScreen={fullScreen}
                                    fullWidth='md'
                                    maxWidth='md'
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="responsive-dialog-title"
                                >
                                    <DialogTitle id="responsive-dialog-title">Explicación del formulario.</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText className={classes.text}>
                                            <span>
                                                En esta página puedes registrar los lotes realizados, de que está hecho y a donde se va a vender, asegúrate de completar los campos necesarios para registrar el estado.
                                            </span>
                                            <br />
                                            <span>
                                                Este formulario cuenta con 3 campos:
                                                <ul>
                                                    <li>
                                                        <span className={classes.liTitle}>Fecha</span>: en este campo se debe ingresar la fecha en la que se esa documentando el resumen de trazabilidad.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitle}>Área</span>: en este campo se selecciona el lote.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitle}>Días implementados</span>: en este campo se ingresa a que empresas se le va a vender el lote.
                                                    </li>
                                                </ul>
                                            </span>
                                            <span>
                                                Campos obligatorios y no obligatorios:
                                                <ul>
                                                    <li>
                                                        <span className={classes.liTitle}>Campos con contorno azul</span>: los campos con contorno azul son obligatorio, se tienen que completar sin excepción.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitle}>Campos con contorno rojo</span>: en cambio, los campos con contorno rojo no son obligatorios, se pueden dejar vacíos de ser necesario.
                                                    </li>
                                                </ul>
                                            </span>
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary" autoFocus>
                                            Cerrar
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </Grid>
                        <Grid item lg={2} md={2}></Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
                        <Grid item lg={4} md={4} sm={4} xs={4}>
                            <AlertasReutilizable alert={alertSuccess} isVisible={showAlertSuccess} />
                            <AlertasReutilizable alert={alertError} isVisible={showAlertError} />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
                    </Grid>
                </Box>
            </Container>
            <FormularioReutilizable
                fields={formFields}
                onSubmit={handleFormSubmit}
                selectOptions={{
                    resumenDeTrazabilidadLote: loteSelect,
                    resumenDeTrazabilidadDestino: clienteSelect,
                }}
            />
        </Grid>
    )
}

export default AgregarResumenDeTrazabilidad;