import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

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
    },
    sendButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    sendButtonMargin: {
        margin: theme.spacing(1),
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

const ModificarControlDeCloroLibre = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);
    const [checkToken, setCheckToken] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const [alertSuccess] = useState({
        title: 'Correcto', body: 'Se modificó el control de cloro libre con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró modificar el control de cloro libre, revise los datos ingresados', severity: 'error', type: 'description'
    });

    const [alertWarning] = useState({
        title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
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
        }
    }, [checkToken]);

    useEffect(() => {
        const obtenerControles = () => {
            axios.get('/listar-control-de-cloro-libre', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    const controlEncontrado = controlesData.find((control) => control.controlDeCloroLibreId.toString() === id.toString());
                    if (!controlEncontrado) {
                        navigate('/listar-control-de-cloro-libre');
                    }
                    const fechaArray = controlEncontrado.controlDeCloroLibreFecha;
                    const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
                    const fechaParseada = format(fecha, 'yyyy-MM-dd HH:mm');
                    const controlConFechaParseada = {
                        ...controlEncontrado,
                        controlDeCloroLibreFecha: fechaParseada,
                    }
                    setControl(controlConFechaParseada);
                })
                .catch(error => {
                    if (error.request.status === 401) {
                        setCheckToken(true);
                    } else {
                        updateErrorAlert('No se logró cargar los datos del registro, intente nuevamente.')
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2000);
                    }
                });
        };

        obtenerControles();
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
        if (name === "controlDeCloroLibreFecha") {
            setControl(prevState => ({
                ...prevState,
                [name]: value,
            }));
        } else if (name === "controlDeCloroLibreGrifoPico") {
            const regex = new RegExp("^[0-9]{0,10}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        } else if (name === "controlDeCloroLibreResultado") {
            const regex = new RegExp("^[0-9]{0,2}\\.?[0-9]{0,3}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        } else if (name === "controlDeCloroLibreObservaciones") {
            const regex = new RegExp("^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,250}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
    }

    const checkError = (fecha, grifo, resultado) => {
        if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date' || fecha.toString() === 'Invalid date') {
            return false;
        }
        else if (grifo === undefined || grifo === "" || grifo === null) {
            return false;
        }
        else if (resultado === undefined || resultado === "" || resultado === null) {
            return false;
        }
        return true;
    }

    const handleFormSubmit = () => {
        const numResultado = control.controlDeCloroLibreResultado;
        const fecha = control.controlDeCloroLibreFecha;
        const fechaFormateada = moment(fecha, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm');
        const data = {
            ...control,
            controlDeCloroLibreResultado: numResultado,
            controlDeCloroLibreFecha: fechaFormateada,
        };
        const fechaHora = data.controlDeCloroLibreFecha;
        const grifo = data.controlDeCloroLibreGrifoPico;
        const resultado = data.controlDeCloroLibreResultado;

        const check = checkError(fechaHora, grifo, resultado);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 3000);
        } else {
            axios.put(`/modificar-control-de-cloro-libre/${id}`, data, {
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
                            navigate('/listar-control-de-cloro-libre');
                        }, 2000);
                    } else {
                        updateErrorAlert('No se logró registrar el estado de las alarmas, revise los datos ingresados');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 3000);
                    }
                })
                .catch(error => {
                    if (error.request.status === 401) {
                        setCheckToken(true);
                    }
                    else if (error.request.status === 500) {
                        updateErrorAlert('No se logró registrar el estado de las alarmas, revise los datos ingresados');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 3000);
                    }
                })
        }
    };

    const redirect = () => {
        navigate('/listar-control-de-cloro-libre')
    }

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
                                    <Typography component='h1' variant='h4'>Modificar Control De Cloro Libre</Typography>
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
                                                        En esta página puedes modificar un control de cloro libre, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 4 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha y Hora</span>: En el campo 'Fecha y Hora', se debe registrarár la fecha y la hora en que se registró el chequeo de los grifos.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Número del Grifo</span>: En el campo 'Número del Grifo', se debe registrarár el número del grifo que se revisó, este campo solo acepta números enteros y tiene una longitud máxima de 10 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Resultado</span>: En el campo 'Resultado', se debe registrarár la cantidad de cloro medido en el agua, este campo solo acepta números enteros y decimales, el campo cuenta con una longitud máxima de 5 caracteres incluyendo el punto.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Observaciones</span>: En el campo 'Observaciones', se debe registrarár las observaciones o detalles necesarios que se encontraron al momento de medir el cloro en el agua,
                                                                este campo acepta palabras minúsculas, mayúsculas y también números,  el campo cuenta con una longitud máxima de 250 caracteres.
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
                                                        Aclaraciones y Recomendaciones:
                                                        <ul>
                                                            <li>Solo modifique los campos que necesite.</li>
                                                            <li>No se acepta que los campos con contorno azul se dejen vacíos.</li>
                                                            <li>Los números decimales en Resultado se deben ingresar con punto y no coma.</li>
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
                                    <AlertasReutilizable alert={alertWarning} isVisible={showAlertWarning} />
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
                                            margin="normal"
                                            required
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true, }}
                                            color="primary"
                                            variant="outlined"
                                            label="Fecha y Hora"
                                            type="datetime-local"
                                            name="controlDeCloroLibreFecha"
                                            value={control.controlDeCloroLibreFecha}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            required
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true, }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Número del Grifo"
                                            type="text"
                                            name="controlDeCloroLibreGrifoPico"
                                            value={control.controlDeCloroLibreGrifoPico}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            required
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true, }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Resultado"
                                            type="text"
                                            name="controlDeCloroLibreResultado"
                                            value={control.controlDeCloroLibreResultado}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            minRows={3}
                                            multiline
                                            autoFocus
                                            className={classes.customOutlinedRed}
                                            InputLabelProps={{ className: classes.customLabelRed, shrink: true, }}
                                            color="secondary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Observaciones"
                                            type="text"
                                            name="controlDeCloroLibreObservaciones"
                                            value={
                                                control.controlDeCloroLibreObservaciones ?
                                                    control.controlDeCloroLibreObservaciones :
                                                    ''
                                            }
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                            </Grid>
                            <Grid container justifyContent='flex-start' alignItems="center">
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                <Grid item lg={8} md={8} sm={8} xs={8} className={classes.sendButton}>
                                    <Button type="submit" variant="contained" color="primary" onClick={handleFormSubmit} className={classes.sendButtonMargin}>Modificar</Button>
                                    <Button type="submit" variant="contained" color="primary" onClick={redirect} className={classes.sendButtonMargin}>Volver</Button>
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

export default ModificarControlDeCloroLibre;