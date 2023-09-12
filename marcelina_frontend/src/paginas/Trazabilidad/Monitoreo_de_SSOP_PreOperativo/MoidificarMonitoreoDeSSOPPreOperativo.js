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
        const fechaMonitoreo = control.monitoreoDeSSOPPreOperativoFecha;
        const fecha = new Date(fechaMonitoreo);

        const dias = diasControl;

        const valoresDias = dias.map(dia => dia.value);

        const data = {
            ...control,
            monitoreoDeSSOPPreOperativoFecha: fecha,
            monitoreoDeSSOPPreOperativoDias: valoresDias,
        };

        console.log(data);

        axios.put(`/modificar-monitoreo-de-ssop-pre-operativo/${id}`, data, {
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
                                    <Typography component='h1' variant='h4'>Modificar Monitoreo de SSOP Pre-Operativo</Typography>
                                </Grid>
                                <Grid item lg={2} md={2}></Grid>
                            </Grid>
                            <Grid container >
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel htmlFor={`outlined-sector-native-simple`}>Sector</InputLabel>
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
                                            <InputLabel htmlFor={`outlined-monitoreoDeSSOPPreOperativoArea-native-simple`}>Área</InputLabel>
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