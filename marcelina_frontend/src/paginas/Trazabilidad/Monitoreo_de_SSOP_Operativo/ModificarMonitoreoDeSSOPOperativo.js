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
    },
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
    auto: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1),
    },
}));

const ModificarMoniteoreoDeSSOPOperativo = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [controles, setControles] = useState([]);
    const [diasControl, setDiasControl] = useState([]);
    const [dias, setDias] = useState([
        { value: 'Lunes', label: 'Lunes' },
        { value: 'Martes', label: 'Martes' },
        { value: 'Miercoles', label: 'Miércoles' },
        { value: 'Jueves', label: 'Jueves' },
        { value: 'Viernes', label: 'Viernes' },
        { value: 'Sabado', label: 'Sábado' },
    ]);
    const [area, setArea] = useState([
        { value: 'Mesadas', label: 'Mesadas' },
        { value: 'Pisos', label: 'Pisos' },
        { value: 'Utensilios', label: 'Utensilios' },
        { value: 'Equipos', label: 'Equipos' },
        { value: 'Lavamanos', label: 'Lavamanos' },
        { value: 'Bandejas Plasticas', label: 'Bandejas Plasticas' },
        { value: 'Personal', label: 'Personal' },
        { value: 'Otras', label: 'Otras' },
    ]);

    useEffect(() => {
        const obtenerControles = () => {
            axios.get('/listar-monitoreo-de-ssop-operativo', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    const controlEncontrado = controlesData.find((control) => control.monitoreoDeSSOPOperativoId.toString() === id.toString());

                    setControles(controlesData);
                    console.log(controlEncontrado)

                    const fechaControl = controlEncontrado.monitoreoDeSSOPOperativoFechaInicio;
                    const fecha = new Date(fechaControl);
                    const fechaFormateada = format(fecha, 'yyyy-MM-dd');

                    const opciones = dias.filter((item) =>
                        controlEncontrado.monitoreoDeSSOPOperativoDias.includes(item.value)
                    );

                    const controlConFechaParseada = {
                        ...controlEncontrado,
                        monitoreoDeSSOPOperativoFechaInicio: fechaFormateada,
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

    const handleChange = event => {
        const { name, value } = event.target;
        setControl(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleDiasChange = (event, newValue) => {
        const uniqueList = [...new Set(newValue)];
        setDiasControl(uniqueList);
    };

    const handleFormSubmit = () => {
        const fechaFinal = control.monitoreoDeSSOPOperativoFechaInicio;
        const fecha = new Date(fechaFinal);
        fecha.setDate(fecha.getDate() + 6);
        const fechaFormateada = format(fecha, 'yyyy-MM-dd');

        const fecha2 = new Date(fechaFinal);
        fecha2.setDate(fecha2.getDate() + 2);
        const fechaFormateada2 = format(fecha2, 'yyyy-MM-dd');

        const dias = diasControl;

        const valoresDias = dias.map(dia => dia.value);

        const data = {
            ...control,
            monitoreoDeSSOPOperativoDias: valoresDias,
            monitoreoDeSSOPOperativoFechaInicio: fechaFormateada2,
            monitoreoDeSSOPOperativoFechaFinal: fechaFormateada,
        };

        console.log(data);

        axios.put(`/modificar-monitoreo-de-ssop-operativo/${id}`, data, {
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
                                    <Typography component='h1' variant='h4'>Modificar Monitoreo de SSOP Operativo</Typography>
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
                                            label="Fecha de Inicio de la Semana"
                                            defaultValue={new Date()}
                                            type="date"
                                            name="monitoreoDeSSOPOperativoFechaInicio"
                                            value={control.monitoreoDeSSOPOperativoFechaInicio}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel htmlFor={`outlined-monitoreoDeSSOPOperativoArea-native-simple`}>Área</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={control.monitoreoDeSSOPOperativoArea}
                                                name="monitoreoDeSSOPOperativoArea"
                                                label="Área"
                                                inputProps={{
                                                    name: "monitoreoDeSSOPOperativoArea",
                                                    id: `outlined-monitoreoDeSSOPOperativoArea-native-simple`,
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
                                            margin="normal"
                                            variant="outlined"
                                            label="Observaciones"
                                            defaultValue="Observaciones"
                                            type="text"
                                            name="monitoreoDeSSOPOperativoObservaciones"
                                            value={
                                                control.monitoreoDeSSOPOperativoObservaciones ?
                                                    control.monitoreoDeSSOPOperativoObservaciones :
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
                                            margin="normal"
                                            variant="outlined"
                                            label="Acciones Correctivas"
                                            defaultValue="Acciones Correctivas"
                                            type="text"
                                            name="monitoreoDeSSOPOperativoAccCorrectivas"
                                            value={control.monitoreoDeSSOPOperativoAccCorrectivas}
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
                                            label="Acciones Preventivas"
                                            defaultValue="Acciones Preventivas"
                                            type="text"
                                            name="monitoreoDeSSOPOperativoAccPreventivas"
                                            value={control.monitoreoDeSSOPOperativoAccPreventivas}
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

export default ModificarMoniteoreoDeSSOPOperativo;