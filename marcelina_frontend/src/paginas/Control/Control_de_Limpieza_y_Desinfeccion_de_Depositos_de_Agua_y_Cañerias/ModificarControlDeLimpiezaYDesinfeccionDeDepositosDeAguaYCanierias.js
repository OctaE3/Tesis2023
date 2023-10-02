import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    auto: {
        marginTop: theme.spacing(2),
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

const ModificarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [depositos, setDepositos] = useState([]);
    const [opcion] = useState([
        { value: '1', label: 'Deposito de Agua 1' },
        { value: '2', label: 'Deposito de Agua 2' },
        { value: '3', label: 'Deposito de Agua 3' },
    ]);

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const [checkToken, setCheckToken] = useState(false);

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const [alertSuccess] = useState({
        title: 'Correcto', body: 'Se modificó el control de limpieza y desinfección con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró modificar el control de limpieza y desinfección, revise los datos ingresados', severity: 'error', type: 'description'
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
            axios.get('/listar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-canierias', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    const controlEncontrado = controlesData.find((control) => control.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId.toString() === id.toString());
                    if (!controlEncontrado) {
                        navigate('/listar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias');
                    }
                    const fechaControl = controlEncontrado.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha;
                    const fecha = new Date(fechaControl);
                    const fechaFormateada = fecha.toISOString().split('T')[0];
                    const controlConFecha = {
                        ...controlEncontrado,
                        controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha: fechaFormateada,
                    }
                    const opciones = opcion.filter((item) =>
                        controlEncontrado.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito.includes(item.value)
                    );
                    setDepositos(opciones);
                    setControl(controlConFecha);
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
        if (name === "controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias") {
            const regex = new RegExp("^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s]{0,30}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        } else if (name === "controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones") {
            const regex = new RegExp("^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\s,.]{0,250}$");
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

    const handleDepositosChange = (event, newValue) => {
        const uniqueList = [...new Set(newValue)];
        setDepositos(uniqueList);
    };

    const checkError = (fecha, depositos, canierias) => {
        if (fecha === undefined || fecha === null || fecha.toString() === 'Invalid Date') {
            return false;
        }
        else if (depositos.length === 0 || depositos === undefined || depositos === null) {
            return false;
        }
        else if (canierias === undefined || canierias === null || canierias === '') {
            return false;
        }
        return true;
    }

    const handleFormSubmit = () => {
        const valorDepositos = depositos.map(deposito => deposito.value);
        const fecha = control.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha === '' ? undefined : control.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha;
        const fechaNueva = new Date(fecha);
        fechaNueva.setDate(fechaNueva.getDate() + 1);
        const fechaFormateada = fechaNueva.toString() === 'Invalid Date' ? undefined : fechaNueva.toISOString().split('T')[0];
        const data = {
            ...control,
            controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha: fechaFormateada,
            controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito: valorDepositos,
        };

        const fechaData = data.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha;
        const deposito = data.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito;
        const canierias = data.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias;

        const check = checkError(fechaData, deposito, canierias);

        if (check === false) {
            updateErrorAlert('Revise los datos ingresados y no deje campos vacíos.');
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 2000);
        } else {
            axios.put(`/modificar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-canierias/${id}`, data, {
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
                            navigate('/listar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias');
                        }, 2000);
                    } else {
                        updateErrorAlert('No se logró modificar el control de limpieza y desinfección, revise los datos ingresados.');
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
                        updateErrorAlert('No se logró modificar el control de limpieza y desinfección, revise los datos ingresados.');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 3000);
                    }
                })
        }
    };

    const redirect = () => {
        navigate('/listar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias')
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
                                    <Typography component='h1' variant='h4'>Modificar Control de Limpieza y Desinfección</Typography>
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
                                                        En esta página puedes modificar un control de limpieza y desinfección, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 4 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha</span>: En el campo 'Fecha', se debe registrarár la fecha en la que se registró el control de limpieza y desinfección.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Depósitos</span>: En el campo 'Depósitos', se debe seleccionar los depósitos que se limpiaron y desinfectaron.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Cañerías</span>: En el campo 'Cañerías', se debe registrarár las cañerías que se limpiaron y desinfectaron,
                                                                este campo acepta palabras minúsculas, mayúsculas y también números, el campo cuenta con una longitud máxima de 30 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Observaciones</span>: En el campo 'Observaciones', se debe registrarár las observaciones o detalles necesarios que se encontraron al momento de medir el cloro en el agua,
                                                                este campo acepta palabras minúsculas, mayúsculas y también números, el campo cuenta con una longitud máxima de 250 caracteres.
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
                                            variant="outlined"
                                            label="Fecha"
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true, }}
                                            color="primary"
                                            type="date"
                                            name="controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha"
                                            value={control.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Autocomplete
                                            multiple
                                            className={classes.auto}
                                            options={opcion}
                                            getOptionLabel={(opcion) => opcion.label}
                                            value={depositos}
                                            onChange={handleDepositosChange}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Depósitos"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                        className: classes.customLabelBlue
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true, }}
                                            color="primary"
                                            label="Cañerías"
                                            type="text"
                                            name="controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias"
                                            value={control.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            minRows={3}
                                            multiline
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Observaciones"
                                            className={classes.customOutlinedRed}
                                            InputLabelProps={{ className: classes.customLabelRed, shrink: true, }}
                                            color="secondary"
                                            type="text"
                                            name="controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones"
                                            value={
                                                control.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones ?
                                                    control.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones :
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

export default ModificarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias;