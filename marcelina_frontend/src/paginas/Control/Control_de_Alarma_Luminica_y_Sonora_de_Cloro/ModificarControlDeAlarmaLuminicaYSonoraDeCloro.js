import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, makeStyles, createTheme, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
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
}));

const ModificarControlDeAlarmaLuminicaYSonoraDeCloro = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [controles, setControles] = useState([]);
    const opciones = [
        { value: true, label: 'Funciona' },
        { value: false, label: 'No Funciona' },
    ];

    useEffect(() => {
        const obtenerControles = () => {
            axios.get('/listar-control-de-alarma-luminica-y-sonora-de-cloro', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    const controlEncontrado = controlesData.find((control) => control.controlDeAlarmaLuminicaYSonaraDeCloroId.toString() === id.toString());
                    const fechaArray = controlEncontrado.controlDeAlarmaLuminicaYSonoraDeCloroFechaHora;
                    const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
                    const fechaParseada = format(fecha, 'yyyy-MM-dd HH:mm');
                    const controlConFechaParseada = {
                        ...controlEncontrado,
                        controlDeAlarmaLuminicaYSonoraDeCloroFechaHora: fechaParseada,
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
            controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica: control.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica === "false" ? false : true,
            controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora: control.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora === "false" ? false : true,
        };
        console.log(data);

        axios.put(`/modificar-control-de-alarma-luminica-y-sonora-de-cloro/${id}`, data, {
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
                                    <Typography component='h1' variant='h4'>Modificar Control De Alarma Luminica Y Sonora De Cloro</Typography>

                                </Grid>
                                <Grid item lg={2} md={2}></Grid>
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
                                            label="Fecha y Hora"
                                            defaultValue={new Date()}
                                            type="datetime-local"
                                            name="controlDeAlarmaLuminicaYSonoraDeCloroFechaHora"
                                            value={control.controlDeAlarmaLuminicaYSonoraDeCloroFechaHora}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel htmlFor={`outlined-Alarma-Lumínica-native-simple`}>Alarma Lumínica</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                name="controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica"
                                                value={control.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica}
                                                label="Alarma Lumínica"
                                                inputProps={{
                                                    name: "controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica",
                                                    id: `outlined-Alarma-Lumínica-native-simple`,
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
                                            <InputLabel htmlFor={`outlined-Alarma-Sonora-native-simple`}>Alarma Sonora</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={control.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora}
                                                name="controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora"
                                                label="Alarma Sonora"
                                                inputProps={{
                                                    name: "controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora",
                                                    id: `outlined-Alarma-Sonora-native-simple`,
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
                                            name="controlDeAlarmaLuminicaYSonoraDeCloroObservaciones"
                                            value={
                                                control.controlDeAlarmaLuminicaYSonoraDeCloroObservaciones ?
                                                    control.controlDeAlarmaLuminicaYSonoraDeCloroObservaciones :
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

export default ModificarControlDeAlarmaLuminicaYSonoraDeCloro;