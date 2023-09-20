import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, CssBaseline, Dialog, IconButton, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2C2C71'
        }
    },
});

const useStyles = makeStyles(theme => ({
    title: {
        textAlign: 'center',
    },
    formControl: {
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        minWidth: '100%',
        marginBottom: theme.spacing(1)
    },
    select: {
        width: '100%',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'blue',
        },
    },
    sendButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    auto: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1),
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'blue',
        },
    },
    customOutlinedRed: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'red',
        },
    },
    customOutlinedBlue: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'blue',
        },
    },
    customLabelBlue: {
        color: 'blue',
    },
    customLabelRed: {
        color: 'red',
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
    liTitleBlue: {
        color: 'blue',
        fontWeight: 'bold',
    },
    liTitleRed: {
        color: 'red',
        fontWeight: 'bold',
    },
    text: {
        color: '#2D2D2D',
    },
}));

const ModificarResumenDeTrazabilidad = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [controles, setControles] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [loteSelect, setLoteSelect] = useState([]);
    const [loteControl, setLoteControl] = useState({});
    const [destinos, setDestinos] = useState([]);
    const [destinoSelect, setDestinoSelect] = useState([]);
    const [destinoControl, setDestinoControl] = useState([]);

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const [alertSuccess, setAlertSuccess] = useState({
        title: 'Correcto', body: 'Resumen de trazabilidad modificado con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logro modificar el resumen de trazabilidad, revise los datos ingresados.', severity: 'error', type: 'description'
    });

    const [alertWarning, setAlertWarning] = useState({
        title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const updateErrorAlert = (newBody) => {
        setAlertError((prevAlert) => ({
            ...prevAlert,
            body: newBody,
        }));
    };

    useEffect(() => {
        const obtenerControles = () => {
            axios.get('/listar-resumen-de-trazabilidad', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    console.log(response.data);
                    const controlEncontrado = controlesData.find((control) => control.resumenDeTrazabilidadId.toString() === id.toString());
                    if (!controlEncontrado) {
                        navigate('/listar-resumen-de-trazabilidad')
                    }
                    setControles(controlesData);
                    console.log(controlEncontrado)

                    const fechaControl = controlEncontrado.resumenDeTrazabilidadFecha;
                    const fecha = new Date(fechaControl);
                    const fechaParseada = format(fecha, 'yyyy-MM-dd');

                    setLoteControl({
                        value: controlEncontrado.resumenDeTrazabilidadLote.loteId,
                        label: `${controlEncontrado.resumenDeTrazabilidadLote.loteCodigo} - ${controlEncontrado.resumenDeTrazabilidadLote.loteProducto.productoNombre}`,
                    });

                    axios.get('/listar-clientes', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then(response => {
                            const dataDestino = response.data;
                            console.log(dataDestino)
                            setDestinos(dataDestino);
                            const data = dataDestino.map(cliente => ({
                                value: cliente.clienteId,
                                label: `${cliente.clienteNombre} - ${cliente.clienteEmail}`,
                            }));

                            console.log(data);
                            setDestinoSelect(data);

                            const opciones = data.filter((elemento) =>
                                controlEncontrado.resumenDeTrazabilidadDestino.some((cliente) => cliente.clienteId.toString() === elemento.value.toString())
                            );

                            console.log(opciones);

                            setDestinoControl(opciones);

                            const controlConFechaParseada = {
                                ...controlEncontrado,
                                resumenDeTrazabilidadFecha: fechaParseada,
                            }

                            console.log(controlConFechaParseada);
                            setControl(controlConFechaParseada);
                        })
                        .catch(error => {
                            console.error(error);
                        });
                })
                .catch(error => {
                    console.error(error);
                });
        };

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

        obtenerControles();
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

    const handleChange = event => {
        const { name, value } = event.target;
        setControl(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleDestinoChange = (event, newValue) => {
        const uniqueList = [...new Set(newValue)];
        setDestinoControl(uniqueList);
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

    const handleFormSubmit = () => {
        const destinosSeleccionados = destinoControl ? destinoControl : [];

        const valoresDestinos = destinosSeleccionados.map(dia => dia.value.toString());

        const destinosCompletos = destinos.filter((destino) => valoresDestinos.includes(destino.clienteId.toString()));
        console.log(destinosCompletos);

        const loteCompleto = lotes.find((lote) => lote.loteId.toString() === loteControl.value.toString());
        console.log(loteCompleto);

        axios.get(`/buscar-diaria-de-produccion-lote/${loteCompleto.loteId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    const diariaDeProduccion = response.data;
                    console.log(diariaDeProduccion);

                    const data = {
                        ...control,
                        resumenDeTrazabilidadDestino: destinosCompletos,
                        resumenDeTrazabilidadLote: loteCompleto,
                        resumenDeTrazabilidadProducto: loteCompleto.loteProducto,
                        resumenDeTrazabilidadCantidadProducida: diariaDeProduccion.diariaDeProduccionCantidadProducida,
                        resumenDeTrazabilidadMatPrimaCarnica: diariaDeProduccion.diariaDeProduccionInsumosCarnicos,
                        resumenDeTrazabilidadMatPrimaNoCarnica: diariaDeProduccion.diariaDeProduccionAditivos,
                    }

                    console.log(data);

                    const check = checkError(data.resumenDeTrazabilidadFecha, data.resumenDeTrazabilidadLote, data.resumenDeTrazabilidadDestino);

                    if (check === false) {
                        updateErrorAlert(`Revise los datos ingresados, no se permite seleccionar la opción "Seleccionar" y no deje campos vacíos.`);
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 7000);
                    } else {
                        axios.put(`/modificar-monitoreo-de-ssop-pre-operativo/${id}`, data, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                "Content-Type": "application/json"
                            }
                        })
                            .then(response => {
                                if (response.status === 200) {
                                    setShowAlertSuccess(true);
                                    setTimeout(() => {
                                        setShowAlertSuccess(false);
                                        navigate('/listar-resumen-de-trazabilidad');
                                    }, 3000)
                                } else {
                                    updateErrorAlert('No se logro modificar el resumen de trazabilidad, revise los datos ingresados.')
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
                                    updateErrorAlert('No se logro modificar el resumen de trazabilidad, revise los datos ingresados.');
                                    setShowAlertError(true);
                                    setTimeout(() => {
                                        setShowAlertError(false);
                                    }, 5000);
                                }
                            })
                    }
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
    };

    return (
        <div>
            <CssBaseline>
                <Grid>
                    <Navbar />
                    <Container style={{ marginTop: 30 }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={0}>
                                <Grid item lg={2} md={2}></Grid>
                                <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title} >
                                    <Typography component='h1' variant='h4'>Modificar Monitoreo de SSOP Pre-Operativo</Typography>
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
                            <Grid container >
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            required
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Fecha"
                                            defaultValue={new Date()}
                                            type="date"
                                            name="resumenDeTrazabilidadFecha"
                                            value={control.resumenDeTrazabilidadFecha ? control.resumenDeTrazabilidadFecha : new Date()}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-lote-native-simple`}>Lote</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={loteControl.value}
                                                name="resumenDeTrazabilidadLote"
                                                label="Lote"
                                                inputProps={{
                                                    name: "resumenDeTrazabilidadLote",
                                                    id: `outlined-lote-native-simple`,
                                                }}
                                                onChange={(e) => setLoteControl(e.target.value)}
                                            >
                                                <option>Seleccionar</option>
                                                {loteSelect.map((option, ind) => (
                                                    <option key={ind} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Autocomplete
                                            multiple
                                            className={classes.auto}
                                            options={destinoSelect}
                                            getOptionLabel={(opcion) => opcion.label}
                                            value={destinoControl}
                                            onChange={handleDestinoChange}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Destino"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                        className: classes.customLabelBlue,
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                            </Grid>
                            <Grid container justifyContent='flex-start' alignItems="center">
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                <Grid item lg={8} md={8} sm={8} xs={8} className={classes.sendButton}>
                                    <Button type="submit" variant="contained" color="primary" onClick={handleFormSubmit}>Modificar</Button>
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                            </Grid>
                        </Box>
                    </Container>
                </Grid>
            </CssBaseline>
        </div>
    );
};

export default ModificarResumenDeTrazabilidad;