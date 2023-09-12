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
    formControl: {
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        minWidth: '100%',
        marginBottom: theme.spacing(1)
    },
    select: {
        width: '100%',
        marginBottom: theme.spacing(0.5),
        marginTop: theme.spacing(0.5),
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

const ModificarCarne = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [carneDesactivado, setCarneDesactivado] = useState(false);
    const [opciones, setOpciones] = useState([]);
    const [categoriaValue, setCategoriaValue] = useState('');
    const carneTipoSelect = [
        { value: 'Porcino', label: 'Porcino' },
        { value: 'Bovino', label: 'Bovino' },
        { value: 'Sangre', label: 'Sangre' },
        { value: 'Tripas', label: 'Tripas' },
        { value: 'Higado', label: 'Higado' },
    ];
    const carneCortePorcino = [
        { value: 'Carcasa', label: 'Carcasa' },
        { value: 'Media res', label: 'Media res' },
        { value: 'Cortes c/h', label: 'Cortes c/h' },
        { value: 'Cortes s/h', label: 'Cortes s/h' },
        { value: 'Menudencias', label: 'Menudencias' },
        { value: 'Subproductos', label: 'Subproductos' },
    ];
    const carneCorteBovino = [
        { value: 'Media res', label: 'Media res' },
        { value: 'Delantero', label: 'Delantero' },
        { value: 'Trasero', label: 'Trasero' },
        { value: 'Cortes c/h', label: 'Cortes c/h' },
        { value: 'Cortes s/h', label: 'Cortes s/h' },
        { value: 'Menudencias', label: 'Menudencias' },
        { value: 'Subproductos', label: 'Subproductos' },
    ];
    const carneCorteSangre = [
        { value: 'Sangre', label: 'Sangre' },
    ];
    const carneCorteTripas = [
        { value: 'Tripas', label: 'Tripas' },
    ];
    const carneCorteHigado = [
        { value: 'Higado', label: 'Higado' },
    ];
    const carneCategoria = [
        { value: 'CarneSH', label: 'Carne S/H' },
        { value: 'CarneCH', label: 'Carne C/H' },
        { value: 'Grasa', label: 'Grasa' },
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
        title: 'Correcto', body: 'Carne modificada con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logro modificar la carne, revise los datos ingresados.', severity: 'error', type: 'description'
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
            axios.get('/listar-carnes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    const controlEncontrado = controlesData.find((control) => control.carneId.toString() === id.toString());
                    console.log(controlEncontrado)
                    const fechaControl = controlEncontrado.carneFecha;
                    const fecha = new Date(fechaControl);
                    const fechaFormateada = fecha.toISOString().split('T')[0];

                    const controlConFechaParseada = {
                        ...controlEncontrado,
                        carneCategoria: control.carneTipo === "Sangre" ? "Seleccionar" :
                            control.carneTipo === "Higado" ? "Seleccionar" :
                                control.carneTipo === "Tripas" ? "Seleccionar" :
                                    controlEncontrado.carneCategoria,
                        carneFecha: fechaFormateada,
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
        if (control.carneTipo === 'Porcino') {
            setOpciones(carneCortePorcino);
            setCarneDesactivado(false);
        } else if (control.carneTipo === 'Bovino') {
            setOpciones(carneCorteBovino);
            setCarneDesactivado(false);
        } else if (control.carneTipo === 'Sangre') {
            setOpciones(carneCorteSangre);
            setCarneDesactivado(true);
        } else if (control.carneTipo === 'Higado') {
            setOpciones(carneCorteHigado);
            setCarneDesactivado(true);
        } else if (control.carneTipo === 'Tripas') {
            setOpciones(carneCorteTripas);
            setCarneDesactivado(true);
        }
    }, [control.carneTipo]);

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
        if (name === "carneNombre") {
            const regex = new RegExp("^[A-Za-z0-9\\s]{0,50}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
        else if (name === "carneCantidad") {
            const regex = new RegExp("^[0-9]{0,10}$");
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

    const checkError = (nombre, cantidad) => {
        if (nombre === undefined || nombre === null || nombre.Trim() === '') {
            return false;
        }
        else if (cantidad === undefined || cantidad === null || cantidad.Trim() === '') {
            return false;
        }
        return true;
    }

    const handleFormSubmit = () => {
        const data = {
            ...control,
            carneCategoria: control.carneTipo === "Sangre" ? "Sangre" :
                control.carneTipo === "Higado" ? "Higado" :
                    control.carneTipo === "Tripas" ? "Tripas" :
                        control.carneCategoria,
        };
        console.log(data);

        const nombre = data.carneNombre.toString();
        const cantidad = data.carneCantidad.toString();

        const check = checkError(nombre, cantidad);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 7000);
        } else {
            axios.put(`/modificar-carne/${id}`, data, {
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
                        }, 5000);
                    } else {
                        updateErrorAlert('No se logro modificar la carne, revise los datos ingresados.')
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
                        updateErrorAlert('No se logro modificar la carne, revise los datos ingresados.');
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
                                    <Typography component='h1' variant='h4'>Modificar Carne</Typography>
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
                                                        En esta página puedes modificar las carne registradas en la chacinería, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 5 campos:
                                                        <ul>
                                                            <li><span className={classes.liTitleBlue}>Nombre</span>: en este campo se ingresa el nombre de la carne o producto cárnico que se recibio</li>
                                                            <li><span className={classes.liTitleBlue}>Tipo</span>: en este campo se selecciona el tipo de producto que se recibio, hay 5 tipos Bovino, Porcino, Higado, Tripa y Sangre</li>
                                                            <li><span className={classes.liTitleBlue}>Corte</span>: en este campo se selecciona el grupo en el que entra el producto recibido</li>
                                                            <li><span className={classes.liTitleBlue}>Categoria</span>: este campo solo esta disponible para los productos Bovinos y Porcinos,
                                                                y lo que se busca en este campo es especificar si la carne recibida es con hueso o sin hueso</li>
                                                            <li><span className={classes.liTitleBlue}>Cantidad</span>: en este campo se ingresa la cantidad recibida del producto</li>
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
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Nombre"
                                            defaultValue="Nombre"
                                            type="text"
                                            name="carneNombre"
                                            value={control.carneNombre}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-carneTipo-native-simple`}>Tipo</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={control.carneTipo}
                                                name="carneTipo"
                                                label="Tipo"
                                                inputProps={{
                                                    name: "carneTipo",
                                                    id: `outlined-carneTipo-native-simple`,
                                                }}
                                                onChange={handleChange}
                                            >
                                                <option>Seleccionar</option>
                                                {carneTipoSelect.map((option, ind) => (
                                                    <option key={ind} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-carneCorte-native-simple`}>Corte</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={control.carneCorte}
                                                name="carneCorte"
                                                label="Corte"
                                                inputProps={{
                                                    name: "carneCorte",
                                                    id: `outlined-carneCorte-native-simple`,
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
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-carneCategoria-native-simple`}>Categoria</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={control.carneCategoria}
                                                name="carneCategoria"
                                                label="Categoria"
                                                inputProps={{
                                                    name: "carneCategoria",
                                                    id: `outlined-carneCategoria-native-simple`,
                                                }}
                                                onChange={handleChange}
                                            >
                                                <option>Seleccionar</option>
                                                {carneCategoria.map((option, ind) => (
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
                                            label="Cantidad"
                                            defaultValue={0}
                                            type="number"
                                            name="carneCantidad"
                                            value={control.carneCantidad}
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

export default ModificarCarne;