import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, Dialog, IconButton, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
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
    liTitle: {
        color: 'black',
        fontWeight: 'bold',
    },
}));

const AgregarMonitoreoDeSSOPPreOperativo = () => {
    const formFields = [
        { name: 'monitoreoDeSSOPPreOperativoSector', label: 'Sector', type: 'selector', color: 'primary' },
        { name: 'monitoreoDeSSOPPreOperativoArea', label: 'Área', type: 'selector', color: 'primary' },
        { name: 'monitoreoDeSSOPPreOperativoFecha', label: 'Fecha y Hora', type: 'datetime-local', color: 'primary' },
        { name: 'monitoreoDeSSOPPreOperativoDias', label: 'Días Implementados', type: 'selector', multiple: 'si', color: 'primary' },
        { name: 'monitoreoDeSSOPPreOperativoObservaciones', label: 'Observaciones', type: 'text', multi: '3', color: 'secondary' },
        { name: 'monitoreoDeSSOPPreOperativoAccCorrectivas', label: 'Acciones Correctivas', type: 'text', multi: '3', color: 'primary' },
        { name: 'monitoreoDeSSOPPreOperativoAccPreventivas', label: 'Acciones Preventivas', type: 'text', multi: '3', color: 'primary' },
    ];

    const alertSuccess = [
        { title: 'Correcto', body: 'Monitoreo de ssop pre operativo agregado con éxito!', severity: 'success', type: 'description' },
    ];

    const alertError = [
        { title: 'Error', body: 'No se logro agregar el monitoreo de ssop pre operativo, revise los datos ingresados', severity: 'error', type: 'description' },
    ];

    const classes = useStyles();
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
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

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFormSubmit = (formData) => {

        const dias = formData.monitoreoDeSSOPPreOperativoDias;

        const valoresDias = dias.map(dia => dia.value);

        const updateFormData = {
            ...formData,
            monitoreoDeSSOPPreOperativoDias: valoresDias,
            monitoreoDeSSOPPreOperativoResponsable: window.localStorage.getItem('user'),
        }
        axios.post('/agregar-monitoreo-de-ssop-pre-operativo', updateFormData, {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
            }
        })
            .then(response => {
                if (response.status === 201) {
                    setShowAlertSuccess(true);
                    setTimeout(() => {
                        setShowAlertSuccess(false);
                    }, 5000);
                } else {
                    setShowAlertError(true);
                    setTimeout(() => {
                        setShowAlertError(false);
                    }, 5000);
                }
            })
            .catch(error => {
                console.error(error);
            })

    }

    return (
        <Grid>
            <Navbar />
            <Container style={{ marginTop: 30 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={0}>
                        <Grid item lg={2} md={2} ></Grid>
                        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
                            <Typography component='h1' variant='h4'>Agregar Monitoreo de SSOP Pre Operativo</Typography>
                            <div>
                                <Button color="primary" onClick={handleClickOpen}>
                                    <IconButton>
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
                                                        <span className={classes.liTitle}>Sector</span>: en este campo se selecciona el sector en donde se realizara el monitoreo.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitle}>Área</span>: en este campo se selecciona el área en la que se realiza el monitoreo.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitle}>Fecha y Hora</span>: en este campo se ingresa la fecha y la hora en la que se realiza el monitoreo.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitle}>Días implementados</span>: en este campo se selecciona el o los días en los que se realizo el monitoreo.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitle}>Observaciones</span>: en este campo se pueden registrar las observaciones o detalles necesarios que se encontraron en el momento que se realizo el monitoreo.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitle}>Acciones Correctivas</span>: en este campo se ingresa las acciones que se implementaron para corregir el inconveniente.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitle}>Acciones Preventivas</span>: en este campo se ingresa las acciones que se implementaran para solucionar posibles problemas a futuro.
                                                    </li>
                                                </ul>
                                            </span>
                                            <span>
                                                Campos obligatorios y no obligatorios:
                                                <ul>
                                                    <li>
                                                        <span className={classes.liTitle}>Campos con contorno azul</span>: los campos con contorno azul son obligatorio, se tienen que completar sin excepción.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitle}>Campos con contorno rojo</span>: en cambio, los campos con contorno rojo no son obligatorios, se pueden dejar vacíos de ser necesario.
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
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
                    </Grid>
                </Box>
            </Container>
            <FormularioReutilizable
                fields={formFields}
                onSubmit={handleFormSubmit}
                selectOptions={{
                    monitoreoDeSSOPPreOperativoSector: sector,
                    monitoreoDeSSOPPreOperativoArea: area1,
                    area1: area1,
                    area2: area2,
                    area3: area3,
                    area4: area4,
                    area5: area5,
                    monitoreoDeSSOPPreOperativoDias: dias,
                }}
            />
        </Grid>
    )
}

export default AgregarMonitoreoDeSSOPPreOperativo;