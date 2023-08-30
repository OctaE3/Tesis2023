import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, makeStyles, createTheme, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
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

const ModificarLocalidad = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [localidad, setLocalidad] = useState({});
    const [localidades, setLocalidades] = useState([]);

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
                    setLocalidades(localidadesData);
                    setLocalidad(localidadEncontrada);
                })
                .catch(error => {
                    console.error(error);
                });
        };

        obtenerLocalidades();
    }, []);

    const handleChange = event => {
        const { name, value } = event.target;
        setLocalidad(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleFormSubmit = () => {
        const data = localidad;
        const check = localidades.includes(data);
        console.log(localidades);
        console.log(check);
        console.log(data);
        if (check) {
            console.log("Esa localidad ya existe")
        } else {
            axios.post(`/modificar-localidad/${data.localidadId}`, data, {
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
                                    <Typography component='h1' variant='h4'>Modificar Localidad</Typography>

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
                                            label="Ciudad"
                                            defaultValue="Ciudad"
                                            type="text"
                                            name="localidadCiudad"
                                            value={localidad.localidadCiudad}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Departamento"
                                            defaultValue="Departamento"
                                            type="text"
                                            name="localidadDepartamento"
                                            value={localidad.localidadDepartamento}
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

export default ModificarLocalidad;