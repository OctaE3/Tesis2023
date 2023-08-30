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

const ModificarControlDeReposicionDeCloro = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [controles, setControles] = useState([]);

    useEffect(() => {
        const obtenerControles = () => {
            axios.get('/listar-control-de-reposicion-de-cloro', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    console.log(controlesData);
                    const controlEncontrado = controlesData.find((control) => control.controlDeReposicionDeCloroId.toString() === id.toString());
                    const fechaControl = controlEncontrado.controlDeReposicionDeCloroFecha;
                    const fecha = new Date(fechaControl);
                    const fechaFormateada = fecha.toISOString().split('T')[0];
                    const controlConFecha = {
                        ...controlEncontrado,
                        controlDeReposicionDeCloroFecha: fechaFormateada,
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
        const fecha = control.controlDeReposicionDeCloroFecha;
        const fechaNueva = new Date(fecha);
        fechaNueva.setDate(fechaNueva.getDate() + 1);
        const fechaFormateada = fechaNueva.toISOString().split('T')[0];
        console.log(fechaFormateada);
        const data = {
            ...control,
            controlDeReposicionDeCloroFecha: fechaFormateada,
        };
        console.log(data);

        axios.put(`/modificar-control-de-reposicion-de-cloro/${id}`, data, {
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
                                    <Typography component='h1' variant='h4'>Modificar Control de Reposición de Cloro</Typography>
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
                                            label="Fecha"
                                            defaultValue={new Date()}
                                            type="date"
                                            name="controlDeReposicionDeCloroFecha"
                                            value={control.controlDeReposicionDeCloroFecha}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Cantidad de Agua"
                                            defaultValue={0}
                                            type="number"
                                            name="controlDeReposicionDeCloroCantidadDeAgua"
                                            value={control.controlDeReposicionDeCloroCantidadDeAgua}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Cloro Adicionado"
                                            defaultValue={0}
                                            type="number"
                                            name="controlDeReposicionDeCloroCantidadDeCloroAdicionado"
                                            value={control.controlDeReposicionDeCloroCantidadDeCloroAdicionado}
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
                                            name="controlDeReposicionDeCloroObservaciones"
                                            value={
                                                control.controlDeReposicionDeCloroObservaciones ?
                                                    control.controlDeReposicionDeCloroObservaciones :
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

export default ModificarControlDeReposicionDeCloro;