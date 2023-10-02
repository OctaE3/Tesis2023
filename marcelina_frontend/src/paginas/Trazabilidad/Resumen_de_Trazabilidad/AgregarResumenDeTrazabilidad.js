import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

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

    const [alertSuccess] = useState({
        title: 'Correcto', body: 'Resumen de trazabilidad registrado con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró registrar el resumen de trazabilidad, revise los datos ingresados.', severity: 'error', type: 'description'
    });

    const [alertWarning] = useState({
        title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
    });

    const classes = useStyles();
    const [lotes, setLotes] = useState('');
    const [loteSelect, setLoteSelect] = useState('');
    const [clientes, setClientes] = useState('');
    const [clienteSelect, setClienteSelect] = useState('');
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);
    const [checkToken, setCheckToken] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const navigate = useNavigate();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/')
        } else {
            const tokenParts = token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));

            const tokenExpiration = payload.exp * 1000;
            const currentTime = Date.now();

            if (tokenExpiration < currentTime) {
                setShowAlertWarning(true);
                setTimeout(() => {
                    setShowAlertWarning(false);
                    navigate('/')
                }, 2000);
            }
            setCheckToken(false)
        }
    }, [checkToken]);

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
                    if (error.request.status === 401) {
                        setCheckToken(true);
                    } else {
                        updateErrorAlert('No se logró cargar los lotes, recargue la página.')
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2000);
                    }
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
                    if (error.request.status === 401) {
                        setCheckToken(true);
                    } else {
                        updateErrorAlert('No se logró cargar los clientes, recargue la página.')
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2000);
                    }
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
        if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
            return false;
        }
        else if (lote === undefined || lote === null || lote === "Seleccionar") {
            return false;
        }
        else if (destino === undefined || destino === null || destino.length === 0) {
            return false;
        }
        return true;
    }

    const handleFormSubmit = (formData) => {
        const fecha = new Date(formData.resumenDeTrazabilidadFecha);
        fecha.setDate(fecha.getDate() + 2)
        const fechaPars = format(fecha, 'yyyy-MM-dd');
        const res = {
            ...formData,
            resumenDeTrazabilidadFecha: fechaPars,
        };
        console.log(res)

        const check = checkError(res.resumenDeTrazabilidadFecha, res.resumenDeTrazabilidadLote, res.resumenDeTrazabilidadDestino);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados, no se permite seleccionar la opción "Seleccionar" y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 3000);
        } else {
            const loteId = formData.resumenDeTrazabilidadLote;
            const loteCompleto = lotes.filter((lote) => lote.loteId.toString() === formData.resumenDeTrazabilidadLote)[0];

            const clientesId = formData.resumenDeTrazabilidadDestino.map(cliente => cliente.value);
            const clientesCompletos = clientes.filter(cliente => clientesId.includes(cliente.clienteId));

            axios.get(`/buscar-diaria-de-produccion-lote/${loteId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        const diariaDeProduccion = response.data;

                        const data = {
                            resumenDeTrazabilidadFecha: res.resumenDeTrazabilidadFecha,
                            resumenDeTrazabilidadLote: loteCompleto,
                            resumenDeTrazabilidadProducto: loteCompleto.loteProducto,
                            resumenDeTrazabilidadCantidadProducida: diariaDeProduccion.diariaDeProduccionCantidadProducida,
                            resumenDeTrazabilidadMatPrimaCarnica: diariaDeProduccion.diariaDeProduccionInsumosCarnicos,
                            resumenDeTrazabilidadMatPrimaNoCarnica: diariaDeProduccion.diariaDeProduccionAditivos,
                            resumenDeTrazabilidadDestino: clientesCompletos,
                            resumenDeTrazabilidadResponsable: window.localStorage.getItem('user'),
                        }

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
                                    }, 2500);
                                } else {
                                    updateErrorAlert('No se logró registrar el resumen de trazabilidad, revise los datos ingresados.')
                                    setShowAlertError(true);
                                    setTimeout(() => {
                                        setShowAlertError(false);
                                    }, 2500);
                                }
                            })
                            .catch(error => {
                                if (error.request.status === 401) {
                                    setCheckToken(true);
                                }
                                else if (error.request.status === 500) {
                                    updateErrorAlert('No se logró registrar el resumen de trazabilidad, revise los datos ingresados.');
                                    setShowAlertError(true);
                                    setTimeout(() => {
                                        setShowAlertError(false);
                                    }, 2500);
                                }
                            })
                    } else {
                        updateErrorAlert(`Ingrese un lote válido.`);
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2500);
                    }
                })
                .catch(error => {
                    if (error.request.status === 401) {
                        setCheckToken(true);
                    }
                    else if (error.request.status === 500) {
                        updateErrorAlert('El lote seleccionado no es válido.');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2500);
                    }
                });
        }
    }

    const redirect = () => {
        navigate('/listar-resumen-de-trazabilidad')
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
                                <IconButton className={blinking ? classes.blinkingButton : ''} onClick={handleClickOpen}>
                                    <HelpOutlineIcon fontSize="large" color="primary" />
                                </IconButton>
                                <Dialog
                                    fullScreen={fullScreen}
                                    fullWidth
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
                                                        <span className={classes.liTitleBlue}>Fecha</span>: En este campo se debe ingresar la fecha en la que se realizó el resumen de trazabilidad.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitleBlue}>Lote</span>: En este campo se debe seleccionar el lote.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitleBlue}>Destino</span>: En este campo se debe ingresar a que empresas se le vendió el lote.
                                                    </li>
                                                </ul>
                                            </span>
                                            <span>
                                                Campos obligatorios y no obligatorios:
                                                <ul>
                                                    <li>
                                                        <span className={classes.liTitleBlue}>Campos con contorno azul y con asterisco en su nombre</span>: Los campos con contorno azul y asterisco son obligatorios, se tienen que completar sin excepción.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitleRed}>Campos con contorno rojo</span>: Los campos con contorno rojo no son obligatorios, se pueden dejar vacíos de ser necesario.
                                                    </li>
                                                </ul>
                                            </span>
                                            <span>
                                                Aclaraciones:
                                                <br />
                                                - No se permite dejar los campos vacíos, excepto los de contorno rojo.
                                                <br />
                                                - Una vez se registre el resumen de trazabilidad, no se le redirigirá al listar. Se determinó así por si está buscando registrar otro resumen de trazabilidad.
                                                <br />
                                                - Los campos restantes se asignarán automáticamente a partir de los datos ingresados.
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
                handleRedirect={redirect}
                selectOptions={{
                    resumenDeTrazabilidadLote: loteSelect,
                    resumenDeTrazabilidadDestino: clienteSelect,
                }}
            />
        </Grid>
    )
}

export default AgregarResumenDeTrazabilidad;