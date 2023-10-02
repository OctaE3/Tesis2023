import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
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

const ModificarLocalidad = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [localidad, setLocalidad] = useState({});
    const [localidadDepartamento, setLocalidadDepartamento] = useState({});
    const [localidades, setLocalidades] = useState([]);
    const [checkToken, setCheckToken] = useState(false);
    const departamentosUruguay = [
        { value: 'Artigas', label: 'Artigas' },
        { value: 'Canelones', label: 'Canelones' },
        { value: 'Cerro Largo', label: 'Cerro Largo' },
        { value: 'Colonia', label: 'Colonia' },
        { value: 'Durazno', label: 'Durazno' },
        { value: 'Flores', label: 'Flores' },
        { value: 'Florida', label: 'Florida' },
        { value: 'Lavalleja', label: 'Lavalleja' },
        { value: 'Maldonado', label: 'Maldonado' },
        { value: 'Montevideo', label: 'Montevideo' },
        { value: 'Paysandú', label: 'Paysandú' },
        { value: 'Río Negro', label: 'Río Negro' },
        { value: 'Rivera', label: 'Rivera' },
        { value: 'Rocha', label: 'Rocha' },
        { value: 'Salto', label: 'Salto' },
        { value: 'San José', label: 'San José' },
        { value: 'Soriano', label: 'Soriano' },
        { value: 'Tacuarembó', label: 'Tacuarembó' },
        { value: 'Treinta y Tres', label: 'Treinta y Tres' },
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
        title: 'Correcto', body: 'Localidad modificada con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró modificar la localidad, revise los datos ingresados.', severity: 'error', type: 'description'
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
        const obtenerLocalidades = () => {
            axios.get('/listar-localidades', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const localidadesData = response.data;
                    const localidadEncontrada = localidadesData.find((localidad) => localidad.localidadId.toString() === id.toString());
                    if (!localidadEncontrada) {
                        navigate('/listar-localidad');
                    }
                    setLocalidadDepartamento({
                        value: localidadEncontrada.localidadDepartamento,
                        label: localidadEncontrada.localidadDepartamento,
                    });
                    const localidades = localidadesData.filter((data) => data.localidadId.toString() !== id.toString());
                    setLocalidades(localidades);
                    setLocalidad(localidadEncontrada);
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

        obtenerLocalidades();
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
        const pattern = "^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\\s]{0,40}$";
        const regex = new RegExp(pattern);
        if (name === "localidadCiudad") {
            if (regex.test(value)) {
                setLocalidad(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        } else {
            setLocalidad(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    }

    const checkErrorLocalidad = (ciudad, departamento) => {
        if (ciudad === undefined || ciudad === null || ciudad === '') {
            return false;
        }
        else if (departamento === undefined || departamento === null || departamento === 'Seleccionar') {
            return false;
        }
        return true;
    }

    const handleFormSubmit = () => {
        const data = {
            ...localidad,
            localidadDepartamento: localidadDepartamento.value,
        };

        const localidadesExisten = localidades.some(localidad => {
            return localidad.localidadDepartamento.toString().toLowerCase() === data.localidadDepartamento.toString().toLowerCase() && localidad.localidadCiudad.toString().toLowerCase() === data.localidadCiudad.toString().toLowerCase();
        });

        const checkLocalidad = checkErrorLocalidad(data.localidadCiudad, data.localidadDepartamento);

        if (checkLocalidad === false) {
            updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 2000);
        } else {
            if (localidadesExisten === false) {
                axios.put(`/modificar-localidad/${data.localidadId}`, data, {
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
                                navigate('/listar-localidad');
                            }, 2000)
                        } else {
                            updateErrorAlert('No se logró modificar la localidad, revise los datos ingresados.');
                            setShowAlertError(true);
                            setTimeout(() => {
                                setShowAlertError(false);
                            }, 2000);
                        }
                    })
                    .catch(error => {
                        if (error.request.status === 401) {
                            setCheckToken(true);
                        }
                        else if (error.request.status === 500) {
                            updateErrorAlert('No se logró modificar la localidad, revise los datos ingresados.');
                            setShowAlertError(true);
                            setTimeout(() => {
                                setShowAlertError(false);
                            }, 2000);
                        }
                    })
            } else {
                updateErrorAlert('La localidad que intenta ingresar ya existe.');
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 2000);
            }
        }
    };

    const redirect = () => {
        navigate('/listar-localidad')
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
                                    <Typography component='h1' variant='h4'>Modificar Localidad</Typography>
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
                                                        En esta página puedes modificar una localidad, asegúrate de completar los campos necesarios para registrar la modificación.
                                                    </span>
                                                    <br />
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 2 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Departamento</span>: En este campo se debe ingresar el nombre de departamento donde esta ubicada la ciudad,
                                                                este campo acepta solo palabras y cuenta con una longitud de 40 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Ciudad</span>: En este campo se debe ingresar la ciudad en la que se ubica el departamento,
                                                                este campo acepta solo palabras y cuenta con una longitud de 40 caracteres.
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
                                                            <li>Solo modifiqué los campos que necesite.</li>
                                                            <li>No se acepta que los campos con contorno azul se dejen vacíos.</li>
                                                            <li>No se puede ingresar una localidad que ya esté registrada.</li>
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
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-departamento-native-simple`}>Departamento *</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={localidadDepartamento.value}
                                                label="Departamento *"
                                                inputProps={{
                                                    name: "localidadDepartamento",
                                                    id: `outlined-departamento-native-simple`,
                                                }}
                                                onChange={(e) => setLocalidadDepartamento({
                                                    value: e.target.value,
                                                    label: e.target.value,
                                                })}
                                            >
                                                <option>Seleccionar</option>
                                                {departamentosUruguay.map((option, ind) => (
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
                                            required={true}
                                            label="Ciudad"
                                            defaultValue="Ciudad"
                                            type="text"
                                            name="localidadCiudad"
                                            value={localidad.localidadCiudad}
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

export default ModificarLocalidad;