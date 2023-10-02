import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, CssBaseline, Dialog, IconButton, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
    formControl: {
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        minWidth: '100%',
        marginBottom: theme.spacing(1)
    },
    sendButtonMargin: {
        margin: theme.spacing(1),
    },
    select: {
        width: '100%',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'blue',
        },
    },
    auto: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1),
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

const ModificarMoniteoreoDeSSOPOperativo = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [diasControl, setDiasControl] = useState([]);
    const [dias] = useState([
        { value: 'Lunes', label: 'Lunes' },
        { value: 'Martes', label: 'Martes' },
        { value: 'Miercoles', label: 'Miércoles' },
        { value: 'Jueves', label: 'Jueves' },
        { value: 'Viernes', label: 'Viernes' },
        { value: 'Sabado', label: 'Sábado' },
    ]);
    const [area, setArea] = useState([
        { value: 'Mesadas', label: 'Mesadas' },
        { value: 'Pisos', label: 'Pisos' },
        { value: 'Utensilios', label: 'Utensilios' },
        { value: 'Equipos', label: 'Equipos' },
        { value: 'Lavamanos', label: 'Lavamanos' },
        { value: 'Bandejas Plasticas', label: 'Bandejas Plasticas' },
        { value: 'Personal', label: 'Personal' },
        { value: 'Otras', label: 'Otras' },
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
        title: 'Correcto', body: 'Monitoreo de ssop operativo modificado con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró modificar el monitoreo de ssop operativo, revise los datos ingresados.', severity: 'error', type: 'description'
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
            axios.get('/listar-monitoreo-de-ssop-operativo', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    const controlEncontrado = controlesData.find((control) => control.monitoreoDeSSOPOperativoId.toString() === id.toString());
                    if (!controlEncontrado) {
                        navigate('/listar-monitoreo-de-ssop-operativo');
                    }

                    const fechaControl = controlEncontrado.monitoreoDeSSOPOperativoFechaInicio;
                    const fecha = new Date(fechaControl);
                    const fechaFormateada = format(fecha, 'yyyy-MM-dd');

                    const opciones = dias.filter((item) =>
                        controlEncontrado.monitoreoDeSSOPOperativoDias.includes(item.value)
                    );

                    const controlConFechaParseada = {
                        ...controlEncontrado,
                        monitoreoDeSSOPOperativoFechaInicio: fechaFormateada,
                    }
                    setDiasControl(opciones);
                    setControl(controlConFechaParseada);
                })
                .catch(error => {
                    if (error.request.status === 401) {
                        setCheckToken(true);
                    } else {
                        updateErrorAlert('No se logró cargar los datos del registro, intente nuevamente.')
                        setShowAlertError(true);
                        setTimeout(() => {
                            redirect();
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
        if (name === "monitoreoDeSSOPOperativoObservaciones" || name === "monitoreoDeSSOPOperativoAccCorrectivas" || name === "monitoreoDeSSOPOperativoAccPreventivas") {
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

    const handleDiasChange = (event, newValue) => {
        const uniqueList = [...new Set(newValue)];
        setDiasControl(uniqueList);
    };

    const checkError = (fecha, area, dias, correc, prevent) => {
        if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
            return false;
        }
        else if (area === undefined || area === null || area === "Seleccionar") {
            return false;
        }
        else if (dias === undefined || dias === null || dias.length === 0) {
            return false;
        }
        else if (correc === undefined || correc === null || correc === '') {
            return false;
        }
        else if (prevent === undefined || prevent === null || prevent === '') {
            return false;
        }
        return true;
    }

    const handleFormSubmit = () => {
        const fechaFinal = control.monitoreoDeSSOPOperativoFechaInicio;
        const fecha = new Date(fechaFinal);
        fecha.setDate(fecha.getDate() + 6);

        const fecha2 = new Date(fechaFinal);
        fecha2.setDate(fecha2.getDate() + 2);

        const dias = diasControl;

        const valoresDias = dias.map(dia => dia.value);

        const data = {
            ...control,
            monitoreoDeSSOPOperativoDias: valoresDias,
            monitoreoDeSSOPOperativoFechaInicio: fecha2,
            monitoreoDeSSOPOperativoFechaFinal: fecha,
        };

        const check = checkError(data.monitoreoDeSSOPOperativoFechaInicio, data.monitoreoDeSSOPOperativoArea,
            data.monitoreoDeSSOPOperativoDias, data.monitoreoDeSSOPOperativoAccCorrectivas, data.monitoreoDeSSOPOperativoAccPreventivas);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 2500);
        } else {
            axios.put(`/modificar-monitoreo-de-ssop-operativo/${id}`, data, {
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
                            navigate('/listar-monitoreo-de-ssop-operativo');
                        }, 2500)
                    } else {
                        updateErrorAlert('No se logró modificar el monitoreo de ssop operativo, revise los datos ingresados.')
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
                        updateErrorAlert('No se logró modificar el monitoreo de ssop operativo, revise los datos ingresados.');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 3000);
                    }
                })
        }
    };

    const redirect = () => {
        navigate('/listar-monitoreo-de-ssop-operativo')
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
                                    <Typography component='h1' variant='h4'>Modificar Monitoreo de SSOP Operativo</Typography>
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
                                                        En esta página puedes modificar un monitoreo de ssop operativo, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 6 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha de incio de la semana</span>: en este campo se debe ingresar la fecha en la que inicia el monitoreo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Área</span>: en este campo se selecciona el área en la que se realiza el monitoreo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Días implementados</span>: en este campo se selecciona el o los dias en los que se realizo el monitoreo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Observaciones</span>: en este campo se pueden registrar las observaciones o detalles necesarios que se encontraron en el momento que se realizo el monitoreo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Acciones Correctivas</span>: en este campo se ingresa las acciones que se implementaron para corregir el inconveniente.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Acciones Preventivas</span>: en este campo se ingresa las acciones que se implementarán para solucionar posibles problemas a futuro.
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
                                                        <ul>
                                                            <li>Los campos de Observaciones, Acciones Correctivas y Acciones Preventivas cuentan con una longitud máxima de 250 caracteres y se podrán ingresar letras y números.</li>
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
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Fecha de Inicio de la Semana"
                                            type="date"
                                            name="monitoreoDeSSOPOperativoFechaInicio"
                                            value={control.monitoreoDeSSOPOperativoFechaInicio}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-monitoreoDeSSOPOperativoArea-native-simple`}>Área *</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={control.monitoreoDeSSOPOperativoArea}
                                                name="monitoreoDeSSOPOperativoArea"
                                                label="Área *"
                                                inputProps={{
                                                    name: "monitoreoDeSSOPOperativoArea",
                                                    id: `outlined-monitoreoDeSSOPOperativoArea-native-simple`,
                                                }}
                                                onChange={handleChange}
                                            >
                                                <option>Seleccionar</option>
                                                {area.map((option, ind) => (
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
                                            options={dias}
                                            getOptionLabel={(opcion) => opcion.label}
                                            value={diasControl}
                                            onChange={handleDiasChange}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Días"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                        className: classes.customLabelBlue,
                                                    }}
                                                />
                                            )}
                                        />
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
                                            name="monitoreoDeSSOPOperativoObservaciones"
                                            value={
                                                control.monitoreoDeSSOPOperativoObservaciones ?
                                                    control.monitoreoDeSSOPOperativoObservaciones :
                                                    ''
                                            }
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            minRows={3}
                                            multiline
                                            autoFocus
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Acciones Correctivas"
                                            type="text"
                                            name="monitoreoDeSSOPOperativoAccCorrectivas"
                                            value={control.monitoreoDeSSOPOperativoAccCorrectivas}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            minRows={3}
                                            multiline
                                            autoFocus
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Acciones Preventivas"
                                            type="text"
                                            name="monitoreoDeSSOPOperativoAccPreventivas"
                                            value={control.monitoreoDeSSOPOperativoAccPreventivas}
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

export default ModificarMoniteoreoDeSSOPOperativo;