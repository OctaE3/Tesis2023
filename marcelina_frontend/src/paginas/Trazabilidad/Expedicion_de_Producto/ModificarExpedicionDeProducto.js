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

const ModificarExpedicionDeProducto = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [clientes, setClientes] = useState([]);
    const [clienteSelect, setClienteSelect] = useState([]);
    const [clienteExpedicion, setClienteExpedicion] = useState({});
    const [lotes, setLotes] = useState([]);
    const [loteSelect, setLoteSelect] = useState([]);
    const [loteCantidad, setLoteCantidad] = useState([]);
    const [lotesRemplazados, setLotesRemplazados] = useState([]);

    useEffect(() => {
        const obtenerControles = () => {
            axios.get('/listar-expedicion-de-productos', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    console.log(controlesData);
                    const controlEncontrado = controlesData.find((control) => control.expedicionDeProductoId.toString() === id.toString());
                    console.log(controlEncontrado);
                    axios.get('/listar-lotes', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then(responselote => {
                            console.log(responselote.data);
                            const data = responselote.data;
                            console.log(data);
                            setLotes(data);
                            const lotes = data.map((lote) => {
                                controlEncontrado.expedicionDeProductoCantidad.forEach((lot) => {
                                    if (lote.loteId === lot.detalleCantidadLoteLote.loteId) {
                                        lote.loteCantidad = lote.loteCantidad + lot.detalleCantidadLoteCantidadVendida;
                                    }
                                })
                                return lote;
                            })
                            console.log(lotes);
                            const lotesDeControl = lotes.filter(lote => {
                                const loteIdEnControl = controlEncontrado.expedicionDeProductoLotes.map(lote => lote.loteId.toString());
                                return loteIdEnControl.includes(lote.loteId.toString());
                            });
                            setLotesRemplazados(lotesDeControl);
                            setLoteSelect(
                                lotes.map((lote) => ({
                                    value: lote.loteId,
                                    label: `${lote.loteCodigo} - ${lote.loteCantidad} Kg - ${lote.loteProducto.productoNombre}`,
                                }))
                            );
                        })
                        .catch(error => {
                            console.error(error);
                        });

                    controlEncontrado.expedicionDeProductoCantidad.forEach(detalle => {
                        detalle.detalleCantidadLoteLote.loteCantidad = detalle.detalleCantidadLoteLote.loteCantidad + detalle.detalleCantidadLoteCantidadVendida;
                    });

                    setClienteExpedicion({
                        value: controlEncontrado.expedicionDeProductoCliente.clienteId,
                        label: `${controlEncontrado.expedicionDeProductoCliente.clienteNombre} - ${controlEncontrado.expedicionDeProductoCliente.clienteEmail}`,
                    });

                    const loteC = controlEncontrado.expedicionDeProductoCantidad.map((detalle) => ({
                        loteVendido: {
                            value: detalle.detalleCantidadLoteLote.loteId,
                        },
                        cantidad: detalle.detalleCantidadLoteCantidadVendida,
                    }))

                    setLoteCantidad(loteC);

                    const fechaControl = controlEncontrado.expedicionDeProductoFecha;
                    const fecha = new Date(fechaControl);
                    const fechaFormateada = format(fecha, 'yyyy-MM-dd');

                    const controlConFechaParseada = {
                        ...controlEncontrado,
                        expedicionDeProductoFecha: fechaFormateada,
                    }

                    console.log(controlConFechaParseada);
                    setControl(controlConFechaParseada);
                })
                .catch(error => {
                    console.error(error);
                });
        };

        const obtenerClientes = () => {
            axios.get('/listar-clientes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setClientes(response.data);
                    setClienteSelect(
                        response.data.map((cliente) => ({
                            value: cliente.clienteId,
                            label: cliente.clienteNombre,
                        }))
                    );
                })
                .catch(error => {
                    console.error(error);
                });
        };

        obtenerClientes();
        obtenerControles();
    }, []);

    const handleChange = event => {
        const { name, value } = event.target;
        setControl(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleSelectChangeLote = (event, index) => {
        const updatedLoteCantidad = [...loteCantidad];
        updatedLoteCantidad[index].loteVendido.value = event.target.value;
        console.log(updatedLoteCantidad)
        setLoteCantidad(updatedLoteCantidad);
    };

    const handleCantidadChangeLote = (event, index) => {
        const updatedLoteCantidad = [...loteCantidad];
        updatedLoteCantidad[index].cantidad = event.target.value;
        console.log(updatedLoteCantidad);
        setLoteCantidad(updatedLoteCantidad);
    };

    const handleFormSubmit = () => {
        console.log(control);
        console.log(clienteExpedicion);
        const idLotes = loteCantidad.map(lote => parseInt(lote.loteVendido.value));

        const lotesCompletos = [];

        for (const lote of lotes) {
            if (idLotes.includes(lote.loteId)) {
                lotesCompletos.push(lote);
            }
        }

        const resultadoLote = lotesCompletos.map(lote => {
            const cantidaValueEncontradaLote = loteCantidad.find(cv => cv.loteVendido.value.toString() === lote.loteId.toString());
            console.log(cantidaValueEncontradaLote);
            console.log(lote);
            if (cantidaValueEncontradaLote) {
                const cantidad = cantidaValueEncontradaLote.cantidad;
                console.log(cantidad);
                if (cantidad > lote.loteCantidad) {
                    console.log(lote);
                    return `${lote.loteCodigo} - ${lote.loteProducto.productoNombre} - ${lote.loteCantidad} Kg / `;
                }
            }
            return null;
        })

        console.log(resultadoLote)

        const elementoUndefinedLote = resultadoLote.some(elemento => elemento === null);

        console.log(elementoUndefinedLote);

        if (elementoUndefinedLote === true) {
            const productosCompletos = lotesCompletos.map(lote => lote.loteProducto);
            console.log(clienteExpedicion)
            const clienteCompleto = clientes.find((cliente) => cliente.clienteId.toString() === clienteExpedicion.value.toString());
            console.log(clienteCompleto);

            const listaDetalleCantidaLote = [];
            const lotesCompletosConCantidadRestada = [];
            lotesCompletos.forEach((lote, index) => {
              const cantidadLote = loteCantidad[index].cantidad;
              const loteActualizado = { ...lote, loteCantidad: lote.loteCantidad - cantidadLote };
              lotesCompletosConCantidadRestada.push(loteActualizado);
              const detalleLote = control.expedicionDeProductoCantidad[index];
              console.log(detalleLote);
              console.log(loteActualizado);
              const detalleCantidadLote = {
                ...detalleLote,
                detalleCantidadLoteLote: loteActualizado,
                detalleCantidadLoteCantidadVendida: cantidadLote,
              };
              console.log(detalleCantidadLote);
              listaDetalleCantidaLote.push(detalleCantidadLote);
            });

            const listaLotesDesusados = [];

            lotesCompletosConCantidadRestada.map((lote) => {
                lotesRemplazados.forEach((lot) => {
                    if (lote.loteId.toString() !== lot.loteId.toString()) {
                        listaLotesDesusados.push(lot);
                    }
                })
            })

            console.log(listaLotesDesusados);

            const uniqueProductos = {};
            const productosSinDuplicados = productosCompletos.filter((producto) => {
              const key = `${producto.productoId}-${producto.productoCodigo}`;
              if (!uniqueProductos[key]) {
                uniqueProductos[key] = true;
                return true;
              }
              return false;
            });
    
            console.log(productosSinDuplicados);

            const data = {
                ...control,
                expedicionDeProductoCliente: clienteCompleto,
                expedicionDeProductoProductos: productosSinDuplicados,
                expedicionDeProductoLotes: lotesCompletosConCantidadRestada,
                expedicionDeProductoCantidad: listaDetalleCantidaLote,
            };

            const dataCompleta = {
                expedicionDeProducto: data,
                listaLotesDesusados: listaLotesDesusados,
            }

            console.log(dataCompleta.expedicionDeProducto.expedicionDeProductoCantidad);
            axios.put(`/modificar-expedicion-de-producto/${id}`, dataCompleta, {
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
                                    <Typography component='h1' variant='h4'>Modificar Expedición de Produto</Typography>

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
                                            name="expedicionDeProductoFecha"
                                            value={control.expedicionDeProductoFecha}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    {loteCantidad.map((lote, index) => (
                                        <div key={index}>
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <FormControl variant="outlined" className={classes.formControl}>
                                                    <InputLabel htmlFor={`outlined-loteVendido-native-simple`}>Lote</InputLabel>
                                                    <Select
                                                        className={classes.select}
                                                        native
                                                        value={lote.loteVendido.value}
                                                        name="loteVendido"
                                                        label="Lote"
                                                        inputProps={{
                                                            name: "loteVendido",
                                                            id: `outlined-loteVendido-native-simple`,
                                                        }}
                                                        onChange={(event) => handleSelectChangeLote(event, index)}
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
                                                <TextField
                                                    fullWidth
                                                    autoFocus
                                                    margin="normal"
                                                    variant="outlined"
                                                    label="Cantidad"
                                                    defaultValue={0}
                                                    type="text"
                                                    name="cantidad"
                                                    value={lote.cantidad}
                                                    onChange={(event) => handleCantidadChangeLote(event, index)}
                                                />
                                            </Grid>
                                        </div>
                                    ))}
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel htmlFor={`outlined-expedicionDeProductoCliente-native-simple`}>Cliente</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={clienteExpedicion.value}
                                                name="diariaDeProduccionEnvasado"
                                                label="Cliente"
                                                inputProps={{
                                                    name: "expedicionDeProductoCliente",
                                                    id: `outlined-expedicionDeProductoCliente-native-simple`,
                                                }}
                                                onChange={(e) => setClienteExpedicion({value: e.target.value})}
                                            >
                                                <option>Seleccionar</option>
                                                {clienteSelect.map((option, ind) => (
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
                                            label="Documento"
                                            defaultValue={0}
                                            type="number"
                                            name="expedicionDeProductoDocumento"
                                            value={control.expedicionDeProductoDocumento}
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

export default ModificarExpedicionDeProducto;