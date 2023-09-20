import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, CssBaseline, Dialog, IconButton, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
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
    }
});

const useStyles = makeStyles(theme => ({
    title: {
        textAlign: 'center',
    },
    contenedor: {
        marginTop: theme.spacing(2),
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
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
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

const ModificarControlDeTemperaturaEnCamaras = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [controlOpcion, setControlOpcion] = ('');
    const [controles, setControles] = useState([]);
    const selectNroCamara = [
        { value: 'Camara 1', label: 'Camara 1' },
        { value: 'Camara 2', label: 'Camara 2' },
        { value: 'Camara 3', label: 'Camara 3' },
        { value: 'Camara 4', label: 'Camara 4' },
        { value: 'Camara 5', label: 'Camara 5' },
        { value: 'Camara 6', label: 'Camara 6' },
    ];

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const [alertSuccess, setAlertSuccess] = useState({
        title: 'Correcto', body: 'Se modifico el control de temperatura en camaras con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logro modificar el control de temperatura en camaras, revise los datos ingresados.', severity: 'error', type: 'description'
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
            axios.get('/listar-control-de-temperatura-en-camaras', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    console.log(controlesData);
                    const controlEncontrado = controlesData.find((control) => control.controlDeTemperaturaEnCamarasId.toString() === id.toString());
                    if (!controlEncontrado) {
                        navigate('/listar-control-de-temperatura-en-camaras')
                    }
                    const fechaControl = controlEncontrado.controlDeTemperaturaEnCamarasFecha;
                    const fecha = new Date(fechaControl);
                    const fechaFormateada = fecha.toISOString().split('T')[0];
                    const controlConFecha = {
                        ...controlEncontrado,
                        controlDeTemperaturaEnCamarasFecha: fechaFormateada,
                    }
                    setControl(controlConFecha);
                    console.log(controlConFecha)
                })
                .catch(error => {
                    console.error(error);
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
        const { name, value, id, type } = event.target;
        const regex = new RegExp(id);
        if (type === "date" || name === "controlDeTemperaturaEnCamarasNroCamara") {
            setControl(prevState => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
    }

    const checkError = (nroC, fecha, hora, tempI, tempE) => {
        if (nroC === undefined || nroC === null || nroC === "Seleccionar") {
            return false;
        }
        else if (fecha === undefined || fecha === null || fecha === '') {
            return false;
        }
        else if (hora === undefined || hora === null || hora === '') {
            return false;
        }
        else if (tempI === undefined || tempI === null || tempI === '') {
            return false;
        }
        else if (tempE === undefined || tempE === null || tempE === '') {
            return false;
        }
        return true;
    }

    const handleFormSubmit = () => {
        let fechaControl = new Date(control.controlDeReposicionDeCloroFecha);
        let fechaPars = '';
        if (fechaControl.toString() === 'Invalid Date') { }
        else {
            fechaControl.setDate(fechaControl.getDate() + 2);
            fechaPars = format(fechaControl, 'yyyy-MM-dd');
        }
        const data = {
            ...control,
            controlDeTemperaturaEnCamarasFecha: fechaPars === fechaPars === '' ? fechaControl : fechaPars,
        };
        console.log(data);

        const nroC = data.controlDeTemperaturaEnCamarasNroCamara;
        const fechaData = data.controlDeTemperaturaEnCamarasFecha;
        const hora = data.controlDeTemperaturaEnCamarasHora.toString();
        const tempI = data.controlDeTemperaturaEnCamarasTempInterna.toString();
        const tempE = data.controlDeTemperaturaEnCamaraTempExterna.toString();

        const check = checkError(nroC, fechaData, hora, tempI, tempE);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 7000);
        } else {
            axios.put(`/modificar-control-de-temperatura-en-camaras/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    console.log(response.status);
                    if (response.status === 200) {
                        setShowAlertSuccess(true);
                        setTimeout(() => {
                            setShowAlertSuccess(false);
                            navigate('/listar-control-de-temperatura-en-camaras');
                        }, 3000)
                    } else {
                        updateErrorAlert('No se logro modificar el control de temperatura en camaras, revise los datos ingresados.');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 5000);
                    }
                })
                .catch(error => {
                    console.error(error);
                    if (error.request.status === 401) {
                        setShowAlertWarning(true);
                        setTimeout(() => {
                            setShowAlertWarning(false);
                        }, 5000);
                    }
                    else if (error.request.status === 500) {
                        updateErrorAlert('No se logro modificar el control de temperatura en camaras, revise los datos ingresados.');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 5000);
                    }
                })
        }
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
                                    <Typography component='h1' variant='h4'>Modificar Control de Temperatura en Camaras</Typography>
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
                                                        En esta página puedes registrar la temperatura interna y externa de las distintas cámaras, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 5 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Número de la cámara</span>: en este campo se debe seleccionar la cámara de la cual se midió su temperatura interna y externa.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha</span>: en este campo se debe registrar la fecha en la que se midió la temperatura de la cámara.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Hora</span>: en este campo se registrará la hora en la que se midió la temperatura de la cámara.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Temperatura Interna</span>: en este campo se registrará la temperatura interna de la cámara seleccionada.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Temperatura Externa</span>: en este campo se registrará la temperatura externa de la cámara seleccionada.
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
                                    <AlertasReutilizable alert={alertWarning} isVisible={showAlertWarning} />
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
                            </Grid>
                            <Grid container className={classes.contenedor}>
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-controlDeTemperaturaEnCamarasNroCamara-native-simple`}>Número de Camara</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={control.controlDeTemperaturaEnCamarasNroCamara}
                                                name="controlDeTemperaturaEnCamarasNroCamara"
                                                label="Número de Camara"
                                                inputProps={{
                                                    name: "controlDeTemperaturaEnCamarasNroCamara",
                                                    id: `outlined-controlDeTemperaturaEnCamarasNroCamara-native-simple`,
                                                }}
                                                onChange={handleChange}
                                            >
                                                <option>Seleccionar</option>
                                                {selectNroCamara.map((option, ind) => (
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
                                            autoFocus
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Fecha"
                                            defaultValue={new Date()}
                                            type="date"
                                            name="controlDeTemperaturaEnCamarasFecha"
                                            value={control.controlDeTemperaturaEnCamarasFecha}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Hora"
                                            id="^[0-9]{0,10}$"
                                            defaultValue={0}
                                            type="number"
                                            name="controlDeTemperaturaEnCamarasHora"
                                            value={control.controlDeTemperaturaEnCamarasHora}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Temperatura Interna"
                                            id="^-?[0-9]{0,10}"
                                            defaultValue={0}
                                            type="number"
                                            name="controlDeTemperaturaEnCamarasTempInterna"
                                            value={control.controlDeTemperaturaEnCamarasTempInterna}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Temperatura Externa"
                                            id="^-?[0-9]{0,10}$"
                                            defaultValue={0}
                                            type="number"
                                            name="controlDeTemperaturaEnCamaraTempExterna"
                                            value={control.controlDeTemperaturaEnCamaraTempExterna}
                                            onChange={handleChange}
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

export default ModificarControlDeTemperaturaEnCamaras;