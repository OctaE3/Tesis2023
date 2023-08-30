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

    const handleChange = event => {
        const { name, value } = event.target;
        setControl(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleFormSubmit = () => {
        const fecha = control.controlDeTemperaturaEnCamarasFecha;
        const fechaNueva = new Date(fecha);
        fechaNueva.setDate(fechaNueva.getDate() + 1);
        const fechaFormateada = fechaNueva.toISOString().split('T')[0];
        const data = {
            ...control,
            controlDeTemperaturaEnCamarasFecha: fechaFormateada,
        };
        console.log(data);

        axios.put(`/modificar-control-de-temperatura-en-camaras/${id}`, data, {
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
                                    <Typography component='h1' variant='h4'>Modificar Control de Temperatura en Camaras</Typography>
                                </Grid>
                                <Grid item lg={2} md={2}></Grid>
                            </Grid>
                            <Grid container className={classes.contenedor}>
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel htmlFor={`outlined-controlDeTemperaturaEnCamarasNroCamara-native-simple`}>Número de Camara</InputLabel>
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
                                            margin="normal"
                                            variant="outlined"
                                            label="Hora"
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
                                            margin="normal"
                                            variant="outlined"
                                            label="Temperatura Interna"
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
                                            margin="normal"
                                            variant="outlined"
                                            label="Temperatura Externa"
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