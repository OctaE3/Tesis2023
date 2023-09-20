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
        marginTop: theme.spacing(3),
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
    auto: {
        marginTop: theme.spacing(2),
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

const ModificarMoniteoreoDeSSOPPreOperativo = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [controles, setControles] = useState([]);
    const [diasControl, setDiasControl] = useState([]);
    const [area, setArea] = useState([]);
    const [sector, setSector] = useState([
        { value: 'Sala Elaboracion', label: 'Sala Elaboración' },
        { value: 'Desosado', label: 'Desosado' },
        { value: 'Camaras', label: 'Cámaras' },
        { value: 'Sector Despacho', label: 'Sector Despacho' },
        { value: 'Sector Aditivos', label: 'Sector Aditivos' },
        { value: 'Instalaciones del Personal', label: 'Instalaciones del Personal' },
    ]);
    const [area1, setArea1] = useState([
        { value: 'Pisos', label: 'Pisos' },
        { value: 'Paredes', label: 'Paredes' },
        { value: 'Techos', label: 'Techos' },
        { value: 'Mesadas', label: 'Mesadas' },
        { value: 'Utensilios', label: 'Utensilios' },
        { value: 'Equipos', label: 'Equipos' },
        { value: 'Lavamanos', label: 'Lavamanos' },
        { value: 'Personal', label: 'Personal' },
    ]);
    const [area2, setArea2] = useState([
        { value: 'Pisos', label: 'Pisos' },
        { value: 'Paredes', label: 'Paredes' },
        { value: 'Puertas', label: 'Puertas' },
    ]);
    const [area3, setArea3] = useState([
        { value: 'Paredes', label: 'Paredes' },
        { value: 'Puertas', label: 'Puertas' },
        { value: 'Equipos', label: 'Equipos' },
    ]);
    const [area4, setArea4] = useState([
        { value: 'Pisos', label: 'Pisos' },
        { value: 'Paredes', label: 'Paredes' },
        { value: 'Equipos', label: 'Equipos' },
    ]);
    const [area5, setArea5] = useState([
        { value: 'Pisos', label: 'Pisos' },
        { value: 'Paredes', label: 'Paredes' },
        { value: 'Sanitarios', label: 'Sanitarios' },
    ]);
    const [dias, setDias] = useState([
        { value: 'Lunes', label: 'Lunes' },
        { value: 'Martes', label: 'Martes' },
        { value: 'Miercoles', label: 'Miércoles' },
        { value: 'Jueves', label: 'Jueves' },
        { value: 'Viernes', label: 'Viernes' },
        { value: 'Sabado', label: 'Sábado' },
    ]);

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const [alertSuccess, setAlertSuccess] = useState({
        title: 'Correcto', body: 'Monitoreo de ssop pre operativo modificado con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logro modificar el monitoreo de ssop pre operativo, revise los datos ingresados.', severity: 'error', type: 'description'
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
            axios.get('/listar-monitoreo-de-ssop-pre-operativo', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    console.log(response.data);
                    const controlEncontrado = controlesData.find((control) => control.monitoreoDeSSOPPreOperativoId.toString() === id.toString());
                    if (!controlEncontrado) {
                        navigate('/listar-monitoreo-de-ssop-pre-operativo')
                    }
                    setControles(controlesData);
                    console.log(controlEncontrado)

                    const fechaArray = controlEncontrado.monitoreoDeSSOPPreOperativoFecha;
                    const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
                    const fechaParseada = format(fecha, 'yyyy-MM-dd HH:mm');

                    const opciones = dias.filter((item) =>
                        controlEncontrado.monitoreoDeSSOPPreOperativoDias.includes(item.value)
                    );

                    const controlConFechaParseada = {
                        ...controlEncontrado,
                        monitoreoDeSSOPPreOperativoFecha: fechaParseada,
                    }
                    console.log(controlConFechaParseada);
                    setDiasControl(opciones);
                    setControl(controlConFechaParseada);
                })
                .catch(error => {
                    console.error(error);
                });
        };

        obtenerControles();
    }, []);

    useEffect(() => {
        if (control.monitoreoDeSSOPPreOperativoSector === 'Sala Elaboracion') {
            setArea(area1);
        } else if (control.monitoreoDeSSOPPreOperativoSector === 'Desosado') {
            setArea(area1);
        } else if (control.monitoreoDeSSOPPreOperativoSector === 'Camaras') {
            setArea(area2);
        } else if (control.monitoreoDeSSOPPreOperativoSector === 'Sector Despacho') {
            setArea(area3);
        } else if (control.monitoreoDeSSOPPreOperativoSector === 'Sector Aditivos') {
            setArea(area4);
        } else if (control.monitoreoDeSSOPPreOperativoSector === 'Instalaciones del Personal') {
            setArea(area5);
        }

    }, [control.monitoreoDeSSOPPreOperativoSector]);

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
        const regex = new RegExp("^[A-Za-z0-9\\s,.]{0,250}$");
        if (name === "monitoreoDeSSOPPreOperativoObservaciones" || name === "monitoreoDeSSOPPreOperativoAccCorrectivas" || name === "monitoreoDeSSOPPreOperativoAccPreventivas") {
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

    const checkError = (sector, area, fecha, dias, correc, prevent) => {
        if (sector === undefined || sector === null || sector === "Seleccionar") {
            return false;
        }
        else if (area === undefined || area === null || area === "Seleccionar") {
            return false;
        }
        else if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
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
        const fechaMonitoreo = control.monitoreoDeSSOPPreOperativoFecha;
        const fecha = new Date(fechaMonitoreo);

        const dias = diasControl ? diasControl : [];

        const valoresDias = dias.map(dia => dia.value);

        const data = {
            ...control,
            monitoreoDeSSOPPreOperativoFecha: fecha,
            monitoreoDeSSOPPreOperativoDias: valoresDias,
        };

        console.log(data);

        const check = checkError(data.monitoreoDeSSOPPreOperativoSector, data.monitoreoDeSSOPPreOperativoArea, data.monitoreoDeSSOPPreOperativoFecha,
            data.monitoreoDeSSOPPreOperativoDias, data.monitoreoDeSSOPPreOperativoAccCorrectivas, data.monitoreoDeSSOPPreOperativoAccPreventivas);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados, no se permite seleccionar la opción de "Seleccionar" y no deje campos vacíos.`);
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
                            navigate('/listar-monitoreo-de-ssop-pre-operativo');
                        }, 3000)
                    } else {
                        updateErrorAlert('No se logro modificar el monitoreo de ssop pre operativo, revise los datos ingresados.')
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
                        updateErrorAlert('No se logro modificar el monitoreo de ssop pre operativo, revise los datos ingresados.');
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
                                                        En esta página puedes registrar los monitoreos de SSOP Pre Operativos, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 7 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Sector</span>: en este campo se selecciona el sector en donde se realizara el monitoreo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Área</span>: en este campo se selecciona el área en la que se realiza el monitoreo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha y Hora</span>: en este campo se ingresa la fecha y la hora en la que se realiza el monitoreo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Días implementados</span>: en este campo se selecciona el o los días en los que se realizo el monitoreo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Observaciones</span>: en este campo se pueden registrar las observaciones o detalles necesarios que se encontraron en el momento que se realizo el monitoreo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Acciones Correctivas</span>: en este campo se ingresa las acciones que se implementaron para corregir el inconveniente.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Acciones Preventivas</span>: en este campo se ingresa las acciones que se implementaran para solucionar posibles problemas a futuro.
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
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-sector-native-simple`}>Sector</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={control.monitoreoDeSSOPPreOperativoSector}
                                                name="monitoreoDeSSOPPreOperativoSector"
                                                label="Sector"
                                                inputProps={{
                                                    name: "monitoreoDeSSOPPreOperativoSector",
                                                    id: `outlined-monitoreoDeSSOPPreOperativoSector-native-simple`,
                                                }}
                                                onChange={handleChange}
                                            >
                                                <option>Seleccionar</option>
                                                {sector.map((option, ind) => (
                                                    <option key={ind} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-monitoreoDeSSOPPreOperativoArea-native-simple`}>Área</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={control.monitoreoDeSSOPPreOperativoArea}
                                                name="monitoreoDeSSOPPreOperativoArea"
                                                label="Área"
                                                inputProps={{
                                                    name: "monitoreoDeSSOPPreOperativoArea",
                                                    id: `outlined-monitoreoDeSSOPPreOperativoArea-native-simple`,
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
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Fecha y Hora"
                                            defaultValue={new Date()}
                                            type="datetime-local"
                                            name="monitoreoDeSSOPPreOperativoFecha"
                                            value={control.monitoreoDeSSOPPreOperativoFecha}
                                            onChange={handleChange}
                                        />
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
                                            InputLabelProps={{ className: classes.customLabelRed }}
                                            color="secondary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Observaciones"
                                            defaultValue="Observaciones"
                                            type="text"
                                            name="monitoreoDeSSOPPreOperativoObservaciones"
                                            value={
                                                control.monitoreoDeSSOPPreOperativoObservaciones ?
                                                    control.monitoreoDeSSOPPreOperativoObservaciones :
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
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Acciones Correctivas"
                                            defaultValue="Acciones Correctivas"
                                            type="text"
                                            name="monitoreoDeSSOPPreOperativoAccCorrectivas"
                                            value={control.monitoreoDeSSOPPreOperativoAccCorrectivas}
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
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Acciones Preventivas"
                                            defaultValue="Acciones Preventivas"
                                            type="text"
                                            name="monitoreoDeSSOPPreOperativoAccPreventivas"
                                            value={control.monitoreoDeSSOPPreOperativoAccPreventivas}
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

export default ModificarMoniteoreoDeSSOPPreOperativo;