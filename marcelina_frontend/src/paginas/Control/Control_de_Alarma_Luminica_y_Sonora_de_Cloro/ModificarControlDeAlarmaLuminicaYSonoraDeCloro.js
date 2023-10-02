import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
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
    gridSelect: {
        marginBottom: theme.spacing(3),
    },
    sendButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
}));

const ModificarControlDeAlarmaLuminicaYSonoraDeCloro = () => {

    const classes = useStyles();
    const navigate = useNavigate();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const opciones = [
        { value: true, label: 'Funciona' },
        { value: false, label: 'No Funciona' },
    ];

    const [alertSuccess] = useState({
        title: 'Correcto', body: 'Se modificó el estado de las alarmas con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró modificar el estado de las alarmas, revise los datos ingresados', severity: 'error', type: 'description'
    });

    const [alertWarning] = useState({
        title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
    });

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);
    const [checkToken, setCheckToken] = useState(false);

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
            axios.get('/listar-control-de-alarma-luminica-y-sonora-de-cloro', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    const controlEncontrado = controlesData.find((control) => control.controlDeAlarmaLuminicaYSonaraDeCloroId.toString() === id.toString());
                    if (!controlEncontrado) {
                        navigate('/listar-control-de-alarma-luminica-y-sonora-de-cloro');
                    }
                    const fechaArray = controlEncontrado.controlDeAlarmaLuminicaYSonoraDeCloroFechaHora;
                    const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
                    const fechaParseada = format(fecha, 'yyyy-MM-dd HH:mm');
                    const controlConFechaParseada = {
                        ...controlEncontrado,
                        controlDeAlarmaLuminicaYSonoraDeCloroFechaHora: fechaParseada,
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
        const regex = new RegExp("^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,250}$");
        if (name === "controlDeAlarmaLuminicaYSonoraDeCloroObservaciones") {
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        } else {
            setControl(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    }

    const handleFormSubmit = () => {
        const fecha = control.controlDeAlarmaLuminicaYSonoraDeCloroFechaHora;
        const fechaFormateada = moment(fecha, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm');
        const data = {
            ...control,
            controlDeAlarmaLuminicaYSonoraDeCloroFechaHora: fechaFormateada,
        };
        const alarmaL = data.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica;
        const alarmaS = data.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora;
        const fechaHora = data.controlDeAlarmaLuminicaYSonoraDeCloroFechaHora;

        if (alarmaL === "Seleccionar" || alarmaL === undefined || alarmaL === null || alarmaS === "Seleccionar" || alarmaS === undefined || alarmaS === null) {
            updateErrorAlert(`No se permite el valor de alarma "Seleccionar", seleccione una opción válida.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 3000);
        }
        else if (fechaHora === undefined || fechaHora === null || fechaHora === '' || fechaHora.toString() === 'Invalid Date' || fecha.toString() === 'Invalid date') {
            updateErrorAlert(`Seleccione una fecha y hora, no deje el campo vacío.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 3000);
        } else {
            const controlData = {
                ...data,
                controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica: control.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica === "false" ? false : true,
                controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora: control.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora === "false" ? false : true,
            }
            axios.put(`/modificar-control-de-alarma-luminica-y-sonora-de-cloro/${id}`, controlData, {
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
                            navigate('/listar-control-de-alarma-luminica-y-sonora-de-cloro');
                        }, 2000);
                    } else {
                        updateErrorAlert('No se logró modificar el estado de las alarmas, revise los datos ingresados');
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
                        updateErrorAlert('No se logró modificar el estado de las alarmas, revise los datos ingresados');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 3000);
                    }
                })
        }
    };

    const redirect = () => {
        navigate('/listar-control-de-alarma-luminica-y-sonora-de-cloro')
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
                                    <Typography component='h1' variant='h4'>Modificar Control De Alarma Luminica Y Sonora De Cloro</Typography>
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
                                                        En esta página puedes modificar un registro de control alarmas lumínicas y sonoras de cloro.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 4 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha y Hora</span>: En el campo 'Fecha y Hora', se muestra la fecha y hora en la que se registró el control de la alarma lumínica y sonora del cloro.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Alarma Lumínica</span>: En el campo 'Alarma Lumínca', se muestra el estado de la alarma lumínica.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Alarma Sonora</span>: En el campo 'Alarma Sonora', se muestra el estado de la alarma sonora.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Observaciones</span>: En el campo 'Observaciones', se muestran los detalles o observaciones que se encontraron al momento de revisar el estado de las alarmas,
                                                                este campo acepta palabras minúsculas, mayúsculas y también números, cuenta con una longitud máxima de 250 caracteres.
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
                                            variant="outlined"
                                            color="primary"
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            label="Fecha y Hora"
                                            type="datetime-local"
                                            name="controlDeAlarmaLuminicaYSonoraDeCloroFechaHora"
                                            value={control.controlDeAlarmaLuminicaYSonoraDeCloroFechaHora}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12} className={classes.gridSelect}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-Alarma-Lumínica-native-simple`}>Alarma Lumínica *</InputLabel>
                                            <Select
                                                className={classes.select}
                                                color="primary"
                                                native
                                                name="controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica"
                                                value={control.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica}
                                                label="Alarma Lumínica *"
                                                inputProps={{
                                                    name: "controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica",
                                                }}
                                                onChange={handleChange}

                                            >
                                                <option>Seleccionar</option>
                                                {opciones.map((option, ind) => (
                                                    <option key={ind} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-Alarma-Sonora-native-simple`}>Alarma Sonora *</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                color="primary"
                                                value={control.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora}
                                                name="controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora"
                                                label="Alarma Sonora *"
                                                inputProps={{
                                                    name: "controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora",
                                                }}
                                                onChange={handleChange}
                                            >
                                                <option>Seleccionar</option>
                                                {opciones.map((option, ind) => (
                                                    <option key={ind} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            minRows={3}
                                            multiline
                                            autoFocus
                                            className={classes.customOutlinedRed}
                                            InputLabelProps={{ className: classes.customLabelRed, shrink: true }}
                                            color="secondary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Observaciones"
                                            type="text"
                                            name="controlDeAlarmaLuminicaYSonoraDeCloroObservaciones"
                                            value={
                                                control.controlDeAlarmaLuminicaYSonoraDeCloroObservaciones ?
                                                    control.controlDeAlarmaLuminicaYSonoraDeCloroObservaciones :
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

export default ModificarControlDeAlarmaLuminicaYSonoraDeCloro;