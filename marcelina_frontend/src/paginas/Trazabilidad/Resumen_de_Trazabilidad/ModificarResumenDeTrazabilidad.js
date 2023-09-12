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

const ModificarResumenDeTrazabilidad = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [controles, setControles] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [loteSelect, setLoteSelect] = useState([]);
    const [loteControl, setLoteControl] = useState({});
    const [destinos, setDestinos] = useState([]);
    const [destinoSelect, setDestinoSelect] = useState([]);
    const [destinoControl, setDestinoControl] = useState([]);

    useEffect(() => {
        const obtenerControles = () => {
            axios.get('/listar-resumen-de-trazabilidad', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    console.log(response.data);
                    const controlEncontrado = controlesData.find((control) => control.resumenDeTrazabilidadId.toString() === id.toString());

                    setControles(controlesData);
                    console.log(controlEncontrado)

                    const fechaControl = controlEncontrado.resumenDeTrazabilidadFecha;
                    const fecha = new Date(fechaControl);
                    const fechaParseada = format(fecha, 'yyyy-MM-dd');

                    setLoteControl({
                        value: controlEncontrado.resumenDeTrazabilidadLote.loteId,
                        label: `${controlEncontrado.resumenDeTrazabilidadLote.loteCodigo} - ${controlEncontrado.resumenDeTrazabilidadLote.loteProducto.productoNombre}`,
                    });

                    axios.get('/listar-clientes', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then(response => {
                            const dataDestino = response.data;
                            console.log(dataDestino)
                            setDestinos(dataDestino);
                            const data = dataDestino.map(cliente => ({
                                value: cliente.clienteId,
                                label: `${cliente.clienteNombre} - ${cliente.clienteEmail}`,
                            }));

                            console.log(data);
                            setDestinoSelect(data);

                            const opciones = data.filter((elemento) =>
                                controlEncontrado.resumenDeTrazabilidadDestino.some((cliente) => cliente.clienteId.toString() === elemento.value.toString())
                            );

                            console.log(opciones);

                            setDestinoControl(opciones);

                            const controlConFechaParseada = {
                                ...controlEncontrado,
                                resumenDeTrazabilidadFecha: fechaParseada,
                            }

                            console.log(controlConFechaParseada);
                            setControl(controlConFechaParseada);
                        })
                        .catch(error => {
                            console.error(error);
                        });
                })
                .catch(error => {
                    console.error(error);
                });
        };

        const obtenerLotes = () => {
            axios.get('/listar-lotes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setLotes(response.data);
                    setLoteSelect(
                        response.data.map((lote) => ({
                            value: lote.loteId,
                            label: `${lote.loteCodigo} - ${lote.loteProducto.productoNombre}`,
                        }))
                    );
                })
                .catch(error => {
                    console.error(error);
                });
        };

        obtenerControles();
        obtenerLotes();
    }, []);

    const handleChange = event => {
        const { name, value } = event.target;
        setControl(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleDestinoChange = (event, newValue) => {
        const uniqueList = [...new Set(newValue)];
        setDestinoControl(uniqueList);
    };

    const handleFormSubmit = () => {
        const destinosSeleccionados = destinoControl;

        const valoresDestinos = destinosSeleccionados.map(dia => dia.value.toString());

        const destinosCompletos = destinos.filter((destino) => valoresDestinos.includes(destino.clienteId.toString()));
        console.log(destinosCompletos);

        const loteCompleto = lotes.find((lote) => lote.loteId.toString() === loteControl.value.toString());
        console.log(loteCompleto);

        axios.get(`/buscar-diaria-de-produccion-lote/${loteCompleto.loteId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                const diariaDeProduccion = response.data;
                console.log(diariaDeProduccion);

                const data = {
                    ...control,
                    resumenDeTrazabilidadDestino: destinosCompletos,
                    resumenDeTrazabilidadLote: loteCompleto,
                    resumenDeTrazabilidadProducto: loteCompleto.loteProducto,
                    resumenDeTrazabilidadCantidadProducida: diariaDeProduccion.diariaDeProduccionCantidadProducida,
                    resumenDeTrazabilidadMatPrimaCarnica: diariaDeProduccion.diariaDeProduccionInsumosCarnicos,
                    resumenDeTrazabilidadMatPrimaNoCarnica: diariaDeProduccion.diariaDeProduccionAditivos,
                }

                console.log(data);

                /*axios.put(`/modificar-monitoreo-de-ssop-pre-operativo/${id}`, data, {
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
                    })*/
            })
            .catch(error => {
                console.error(error);
            });
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
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Fecha"
                                            defaultValue={new Date()}
                                            type="date"
                                            name="resumenDeTrazabilidadFecha"
                                            value={control.resumenDeTrazabilidadFecha}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel htmlFor={`outlined-lote-native-simple`}>Lote</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={loteControl.value}
                                                name="resumenDeTrazabilidadLote"
                                                label="Lote"
                                                inputProps={{
                                                    name: "resumenDeTrazabilidadLote",
                                                    id: `outlined-lote-native-simple`,
                                                }}
                                                onChange={(e) => setLoteControl(e.target.value)}
                                            >
                                                <option>Seleccionar</option>
                                                {loteSelect.map((option, ind) => (
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
                                            options={destinoSelect}
                                            getOptionLabel={(opcion) => opcion.label}
                                            value={destinoControl}
                                            onChange={handleDestinoChange}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Destino"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            )}
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

export default ModificarResumenDeTrazabilidad;