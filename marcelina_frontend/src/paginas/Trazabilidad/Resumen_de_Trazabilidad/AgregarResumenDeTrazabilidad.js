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
    liTitleBlue: {
        color: 'blue',
        fontWeight: 'bold',
    },
    liTitleRed: {
        color: 'red',
        fontWeight: 'bold',
    },
    blinkingButton: {
        animation: '$blink 1s infinite',
    },
    '@keyframes blink': {
        '0%': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
        },
        '50%': {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.primary.main,
        },
        '100%': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
        },
    },
}));

const AgregarResumenDeTrazabilidad = () => {

    const formFields = [
        { name: 'resumenDeTrazabilidadFecha', label: 'Fecha', type: 'date', color: 'primary' },
        { name: 'resumenDeTrazabilidadLote', label: 'Lote *', type: 'selector', color: 'primary' },
        { name: 'resumenDeTrazabilidadDestino', label: 'Destino *', type: 'selector', multiple: 'si', color: 'primary' },
    ];

    const [alertSuccess, setAlertSuccess] = useState({
        title: 'Correcto', body: 'Resumen de trazabilidad registrado con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logro registrar el resumen de trazabilidad, revise los datos ingresados.', severity: 'error', type: 'description'
    });

    const [alertWarning, setAlertWarning] = useState({
        title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
    });

    const classes = useStyles();
    const [lotes, setLotes] = useState('');
    const [loteSelect, setLoteSelect] = useState('');
    const [clientes, setClientes] = useState('');
    const [clienteSelect, setClienteSelect] = useState('');
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

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

    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlinking((prevBlinking) => !prevBlinking);
        }, 500);

        setTimeout(() => {
            clearInterval(blinkInterval);
            setBlinking(false);
        }, 5000);

        return () => {
            clearInterval(blinkInterval);
        };
    }, []);

    const updateErrorAlert = (newBody) => {
        setAlertError((prevAlert) => ({
            ...prevAlert,
            body: newBody,
        }));
    };

    const checkError = (fecha, lote, destino) => {
        if (fecha === undefined || fecha === null) {
            return false;
        }
        else if (lote === undefined || lote === null || lote === "Seleccionar") {
            return false;
        }
        else if (destino === undefined || destino === null) {
            return false;
        }
        return true;
    }

    const handleFormSubmit = (formData) => {
        console.log(formData);
        const res = formData;

        const check = checkError(res.resumenDeTrazabilidadFecha, res.resumenDeTrazabilidadLote, res.resumenDeTrazabilidadDestino);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados, no se permite seleccionar la opción "Seleccionar" y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 7000);
        } else {
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
                    if (response.status === 200) {
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
                                    updateErrorAlert('No se logro registrar el resumen de trazabilidad, revise los datos ingresados.')
                                    setShowAlertError(true);
                                    setTimeout(() => {
                                        setShowAlertError(false);
                                    }, 5000);
                                }
                            })
                            .catch(error => {
                                if (error.request.status === 401) {
                                    setShowAlertWarning(true);
                                    setTimeout(() => {
                                        setShowAlertWarning(false);
                                    }, 5000);
                                }
                                else if (error.request.status === 500) {
                                    updateErrorAlert('No se logro registrar el resumen de trazabilidad, revise los datos ingresados.');
                                    setShowAlertError(true);
                                    setTimeout(() => {
                                        setShowAlertError(false);
                                    }, 5000);
                                }
                            })
                    } else {
                        updateErrorAlert(`Ingrese un lote válido.`);
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 7000);
                    }
                })
                .catch(error => {
                    if (error.request.status === 401) {
                        setShowAlertWarning(true);
                        setTimeout(() => {
                            setShowAlertWarning(false);
                        }, 5000);
                    }
                    else if (error.request.status === 500) {
                        updateErrorAlert('El lote seleccionado no es válido.');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 5000);
                    }
                });
        }
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
                                    <IconButton className={blinking ? classes.blinkingButton : ''}>
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
                                                        <span className={classes.liTitleBlue}>Fecha</span>: en este campo se debe ingresar la fecha en la que se esa documentando el resumen de trazabilidad.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitleBlue}>Área</span>: en este campo se selecciona el lote.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitleBlue}>Días implementados</span>: en este campo se ingresa a que empresas se le va a vender el lote.
                                                    </li>
                                                </ul>
                                            </span>
                                            <span>
                                                Campos obligatorios y no obligatorios:
                                                <ul>
                                                    <li>
                                                        <span className={classes.liTitleBlue}>Campos con contorno azul y con asterisco en su nombre</span>: los campos con contorno azul y asterisco son obligatorios, se tienen que completar sin excepción.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitleRed}>Campos con contorno rojo</span>: en cambio, los campos con contorno rojo no son obligatorios, se pueden dejar vacíos de ser necesario.
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
                            <AlertasReutilizable alert={showAlertWarning} isVisible={showAlertWarning} />
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