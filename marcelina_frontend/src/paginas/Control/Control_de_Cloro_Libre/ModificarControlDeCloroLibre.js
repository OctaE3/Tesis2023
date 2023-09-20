import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, Dialog, IconButton, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import { format, parse } from 'date-fns';
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
    const [controles, setControles] = useState([]);

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const [alertSuccess, setAlertSuccess] = useState({
        title: 'Correcto', body: 'Se modifico el control de cloro libre con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logro modificar el control de cloro libre, revise los datos ingresados', severity: 'error', type: 'description'
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
                    console.log(controlEncontrado)
                    const fechaArray = controlEncontrado.controlDeCloroLibreFecha;
                    const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
                    const fechaParseada = format(fecha, 'yyyy-MM-dd HH:mm');
                    const controlConFechaParseada = {
                        ...controlEncontrado,
                        controlDeCloroLibreFecha: fechaParseada,
                    }
                    console.log(controlConFechaParseada);
                    setControl(controlConFechaParseada);
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
        if (type === "datetime-local") {
            setControl(prevState => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            const regex = new RegExp(id);
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
    }

    const checkError = (fecha, grifo, resultado) => {
        if (fecha === undefined || fecha === null || fecha === '') {
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
        console.log(control);
        const numResultado = parseFloat(control.controlDeCloroLibreResultado);
        const data = {
            ...control,
            controlDeCloroLibreResultado: numResultado ? numResultado : undefined,
        };
        console.log(data);

        const fechaHora = data.controlDeCloroLibreFecha;
        const grifo = data.controlDeCloroLibreGrifoPico;
        const resultado = data.controlDeCloroLibreResultado;

        console.log(fechaHora);
        console.log(grifo);
        console.log(resultado);

        const check = checkError(fechaHora, grifo, resultado);

        console.log(check);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 7000);
        } else {
            axios.put(`/modificar-control-de-cloro-libre/${id}`, data, {
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
                            navigate('/listar-control-de-cloro-libre');
                        }, 3000);
                    } else {
                        updateErrorAlert('No se logró registrar el estado de las alarmas, revise los datos ingresados');
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
                        updateErrorAlert('No se logró registrar el estado de las alarmas, revise los datos ingresados');
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
                                    <Typography component='h1' variant='h4'>Modificar Control De Cloro Libre</Typography>
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
                                                        En esta página puedes registrar la cantidad de cloro medido en el agua y de qué grifo, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 4 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha y Hora</span>: en este campo se debe registrar la fecha y la hora en que se registró el chequeo de los grifos.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Número del Grifo</span>: en este campo se registrará el número del grifo que se revisó.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Resultado</span>: en este campo se registrará la cantidad de cloro medido en el agua.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Observaciones</span>: en este campo se pueden registrar las observaciones o detalles necesarios que se encontraron al momento de medir el cloro en el agua.
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
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            variant="outlined"
                                            label="Fecha y Hora"
                                            defaultValue={new Date()}
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
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Número del Grifo"
                                            defaultValue={0}
                                            id="^[0-9]{0,10}"
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
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Resultado"
                                            id="^[0-9]{0,4}\,?[0-9]{0,3}$"
                                            defaultValue={0}
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
                                            InputLabelProps={{ className: classes.customLabelRed }}
                                            color="secondary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Observaciones"
                                            defaultValue="Observaciones"
                                            id="^[A-Za-z0-9\\s,.]{0,250}$"
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

export default ModificarControlDeCloroLibre;