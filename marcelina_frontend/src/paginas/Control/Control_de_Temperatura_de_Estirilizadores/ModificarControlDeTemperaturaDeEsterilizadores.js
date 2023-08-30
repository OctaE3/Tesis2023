import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, makeStyles, createTheme, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
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
}));

const ModificarControlDeTemperaturaDeEsterilizadores = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [controles, setControles] = useState([]);

    useEffect(() => {
        const obtenerControles = () => {
            axios.get('/listar-control-de-temperatura-de-esterilizadores', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    console.log(controlesData);
                    const controlEncontrado = controlesData.find((control) => control.controlDeTemperaturaDeEsterilizadoresId.toString() === id.toString());
                    const fechaArray = controlEncontrado.controlDeTemperaturaDeEsterilizadoresFecha;
                    const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
                    const fechaParseada = format(fecha, 'yyyy-MM-dd HH:mm');
                    const controlConFecha = {
                        ...controlEncontrado,
                        controlDeTemperaturaDeEsterilizadoresFecha: fechaParseada,
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

    const handleChange = event => {
        const { name, value } = event.target;
        setControl(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleFormSubmit = () => {
        const data = {
            ...control,
            controlDeTemperaturaDeEsterilizadoresTemperatura1: parseInt(control.controlDeTemperaturaDeEsterilizadoresTemperatura1),
            controlDeTemperaturaDeEsterilizadoresTemperatura2: parseInt(control.controlDeTemperaturaDeEsterilizadoresTemperatura2),
            controlDeTemperaturaDeEsterilizadoresTemperatura3: parseInt(control.controlDeTemperaturaDeEsterilizadoresTemperatura3),
        };
        console.log(data);

        axios.put(`/modificar-control-de-temperatura-de-esterilizadores/${id}`, data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("Modificado");
                } else {
                    console.log("No modificado")
                }
            })
            .catch(error => {
                console.error(error);
            })
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
                                    <Typography component='h1' variant='h4'>Modificar Control de Temperatura en Esterilizadores</Typography>
                                </Grid>
                                <Grid item lg={2} md={2}></Grid>
                            </Grid>
                            <Grid container className={classes.contenedor}>
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Fecha y Hora"
                                            defaultValue={new Date()}
                                            type="datetime-local"
                                            name="controlDeTemperaturaDeEsterilizadoresFecha"
                                            value={control.controlDeTemperaturaDeEsterilizadoresFecha}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Temperatura 1"
                                            defaultValue={0}
                                            type="number"
                                            name="controlDeTemperaturaDeEsterilizadoresTemperatura1"
                                            value={control.controlDeTemperaturaDeEsterilizadoresTemperatura1}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Temperatura 2"
                                            defaultValue={0}
                                            type="number"
                                            name="controlDeTemperaturaDeEsterilizadoresTemperatura2"
                                            value={control.controlDeTemperaturaDeEsterilizadoresTemperatura2}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Temperatura 3"
                                            defaultValue={0}
                                            type="number"
                                            name="controlDeTemperaturaDeEsterilizadoresTemperatura3"
                                            value={control.controlDeTemperaturaDeEsterilizadoresTemperatura3}
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
                                            defaultValue="Observaciones"
                                            type="text"
                                            name="controlDeTemperaturaDeEsterilizadoresObservaciones"
                                            value={
                                                control.controlDeTemperaturaDeEsterilizadoresObservaciones ?
                                                    control.controlDeTemperaturaDeEsterilizadoresObservaciones :
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

export default ModificarControlDeTemperaturaDeEsterilizadores;