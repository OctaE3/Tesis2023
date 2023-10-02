import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, CssBaseline, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    sendButtonMargin: {
        margin: theme.spacing(1),
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
    const selectNroCamara = [
        { value: 'Cámara 1', label: 'Cámara 1' },
        { value: 'Cámara 2', label: 'Cámara 2' },
        { value: 'Cámara 3', label: 'Cámara 3' },
        { value: 'Cámara 4', label: 'Cámara 4' },
        { value: 'Cámara 5', label: 'Cámara 5' },
        { value: 'Cámara 6', label: 'Cámara 6' },
    ];

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const [alertSuccess] = useState({
        title: 'Correcto', body: 'Se modificó el control de temperatura en cámaras con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró modificar el control de temperatura en cámaras, revise los datos ingresados.', severity: 'error', type: 'description'
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
    }, []);

    useEffect(() => {
        const obtenerControles = () => {
            axios.get('/listar-control-de-temperatura-en-camaras', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
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
                })
                .catch(error => {
                    updateErrorAlert('No se logró cargar los datos del registro, regrese a la lista y intente nuevamente.')
                    setShowAlertError(true);
                    setTimeout(() => {
                        setShowAlertError(false);
                    }, 2000);
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
        if (name === "controlDeTemperaturaEnCamarasFecha" || name === "controlDeTemperaturaEnCamarasNroCamara") {
            setControl(prevState => ({
                ...prevState,
                [name]: value,
            }));
        } else if (name === "controlDeTemperaturaEnCamarasTempInterna" || name === "controlDeTemperaturaEnCamaraTempExterna") {
            const regex = new RegExp("^-?[0-9]{0,4}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        } else {
            const regex = new RegExp("^[0-9]{0,2}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
    }

    const checkError = (nroC, fecha, hora, tempI, tempE) => {
        if (nroC === undefined || nroC === null || nroC === "Seleccionar" || nroC === '') {
            return false;
        }
        else if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
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
        let fechaControl = new Date(control.controlDeTemperaturaEnCamarasFecha);
        let fechaPars = '';
        if (fechaControl.toString() === 'Invalid Date') { 
            fechaControl.setDate(null);
        }
        else {
            fechaControl.setDate(fechaControl.getDate() + 2);
            fechaPars = format(fechaControl, 'yyyy-MM-dd');
        }
        const data = {
            ...control,
            controlDeTemperaturaEnCamarasFecha: fechaPars === '' ? fechaControl : fechaPars,
        };

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
            }, 2500);
        } else {
            axios.put(`/modificar-control-de-temperatura-en-camaras/${id}`, data, {
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
                            navigate('/listar-control-de-temperatura-en-camaras');
                        }, 2500)
                    } else {
                        updateErrorAlert('No se logró modificar el control de temperatura en cámaras, revise los datos ingresados.');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2500);
                    }
                })
                .catch(error => {
                    console.error(error);
                    if (error.request.status === 401) {
                        setShowAlertWarning(true);
                        setTimeout(() => {
                            setShowAlertWarning(false);
                        }, 2500);
                    }
                    else if (error.request.status === 500) {
                        updateErrorAlert('No se logró modificar el control de temperatura en cámaras, revise los datos ingresados.');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2500);
                    }
                })
        }
    };

    const redirect = () => {
        navigate('/listar-control-de-temperatura-en-camaras')
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
                                    <Typography component='h1' variant='h4'>Modificar Control de Temperatura en Cámaras</Typography>
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
                                                        En esta página puedes registrar la temperatura interna y externa de las distintas cámaras, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 5 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Número de la cámara</span>: En el campo 'Número de la cámara', se debe seleccionar la cámara de la cual se obtuvo la temperatura.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha</span>: En el campo 'Fecha', se debe ingresar la fecha en la que se registró el control de temperatura en cámaras.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Hora</span>: En el campo 'Hora', se debe ingresar la hora en la que se obtuvo la temperatura de la cámara, este campo solo acepta números y cuenta con una longitud máxima de 2 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Temperatura Interna</span>: En el campo 'Temperatura Interna', se debe ingresar la temperatura interna de la cámara, este campo solo acepta números postivos y negativos, este campo cuenta con una longitud máxima de 4 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Temperatura Externa</span>: En el campo 'Temperatura Externa', se debe ingresar la temperatura externa de la cámara, este campo solo acepta números postivos y negativos, este campo cuenta con una longitud máxima de 4 caracteres.
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
                                                            <li>El formato en el que se ingresa la hora es solo el número de la hora, ejemplo: 12.</li>
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
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-controlDeTemperaturaEnCamarasNroCamara-native-simple`}>Número de la Cámara</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={control.controlDeTemperaturaEnCamarasNroCamara}
                                                name="controlDeTemperaturaEnCamarasNroCamara"
                                                label="Número de la Cámara"
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
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Fecha"
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
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Hora"
                                            id="^[0-9]{0,2}$"
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
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Temperatura Interna"
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
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Temperatura Externa"
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

export default ModificarControlDeTemperaturaEnCamaras;