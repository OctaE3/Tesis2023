import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, CssBaseline, Dialog, IconButton, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
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
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'blue',
        },
    },
    sendButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    customOutlinedRed: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'red',
        },
    },
    customOutlinedBlue: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'blue',
        },
    },
    customLabelBlue: {
        color: 'blue',
    },
    customLabelRed: {
        color: 'red',
    },
    blinkingButton: {
        animation: '$blink 1s infinite',
    },
    '@keyframes blink': {
        '0%': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
        },
        '50%': {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.primary.main,
        },
        '100%': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
        },
    },
    liTitleBlue: {
        color: 'blue',
        fontWeight: 'bold',
    },
    liTitleRed: {
        color: 'red',
        fontWeight: 'bold',
    },
    text: {
        color: '#2D2D2D',
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

    const [alertSuccess, setAlertSuccess] = useState({
        title: 'Correcto', body: 'Expedición de producto modificada con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logro modificar la expedición de producto, revise los datos ingresados.', severity: 'error', type: 'description'
    });

    const [alertWarning, setAlertWarning] = useState({
        title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
    });

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const updateErrorAlert = (newBody) => {
        setAlertError((prevAlert) => ({
            ...prevAlert,
            body: newBody,
        }));
    };

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

    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlinking((prevBlinking) => !prevBlinking);
        }, 500);

        setTimeout(() => {
            clearInterval(blinkInterval);
            setBlinking(false);
        }, 5000);

        return () => {
            clearInterval(blinkInterval);
        };
    }, []);

    const handleChange = event => {
        const { name, value } = event.target;
        if (name === "expedicionDeProductoDocumento") {
            const regex = new RegExp("^[0-9]{0,10}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        } else {
            setControl(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    }

    const handleSelectChangeLote = (event, index) => {
        const updatedLoteCantidad = [...loteCantidad];
        updatedLoteCantidad[index].loteVendido.value = event.target.value;
        console.log(updatedLoteCantidad)
        setLoteCantidad(updatedLoteCantidad);
    };

    const handleCantidadChangeLote = (event, index) => {
        const regex = new RegExp("^[0-9]{0,10}$");
        if (regex.test(event.target.value)) {
            const updatedLoteCantidad = [...loteCantidad];
            updatedLoteCantidad[index].cantidad = event.target.value;
            console.log(updatedLoteCantidad);
            setLoteCantidad(updatedLoteCantidad);
        }
    };

    const checkError = (fecha, cliente, documento) => {
        if (fecha === undefined || fecha === null) {
            return false;
        }
        else if (cliente === undefined || cliente === null || cliente === "Seleccionar") {
            return false;
        }
        else if (documento === undefined || documento === null || documento === '') {
            return false;
        }
        return true;
    }

    const checkMultiple = (lotes) => {
        console.log(lotes);
        if (lotes) {
            const resul = lotes.forEach((lote) => {
                console.log(lote);
                if (lote.loteVendido.value === '' || lote.cantidad === '' || lote.loteVendido.value === "Seleccionar" || lote.cantidad === 0) {
                    return false;
                } else { }
            })
            console.log(resul);
            return resul ? resul : true;
        } else { return false }
    }

    const handleFormSubmit = () => {
        console.log(control);
        console.log(clienteExpedicion);
        console.log(loteCantidad);

        const checkMul = checkMultiple(loteCantidad);

        if (checkMul === false) {
            updateErrorAlert(`Revise los datos ingresados en cliente y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 7000);
        } else {
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

                const check = checkError(data.expedicionDeProductoFecha, data.expedicionDeProductoCliente, data.expedicionDeProductoDocumento);

                if (check === false) {
                    updateErrorAlert(`Revise los datos ingresados, no se permite dejar campos vacíos y tampoco seleccionar la opción "Seleccionar".`);
                    setShowAlertError(true);
                    setTimeout(() => {
                        setShowAlertError(false);
                    }, 7000);
                } else {
                    console.log(dataCompleta.expedicionDeProducto.expedicionDeProductoCantidad);
                    axios.put(`/modificar-expedicion-de-producto/${id}`, dataCompleta, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            "Content-Type": "application/json"
                        }
                    })
                        .then(response => {
                            if (response.status === 200) {
                                setShowAlertSuccess(true);
                                setTimeout(() => {
                                    setShowAlertSuccess(false);
                                }, 5000);
                            } else {
                                updateErrorAlert('No se logro modificar la expedición de producto, revise los datos ingresados.')
                                setShowAlertError(true);
                                setTimeout(() => {
                                    setShowAlertError(false);
                                }, 5000);
                            }
                        })
                        .catch(error => {
                            if (error.request.status === 401) {
                                setShowAlertWarning(true);
                                setTimeout(() => {
                                    setShowAlertWarning(false);
                                }, 5000);
                            }
                            else if (error.request.status === 500) {
                                updateErrorAlert('No se logro modificar la expedición de producto, revise los datos ingresados.');
                                setShowAlertError(true);
                                setTimeout(() => {
                                    setShowAlertError(false);
                                }, 5000);
                            }
                        })
                }
            } else {
                updateErrorAlert(`La cantidad ingresada para vender del/los lote/lotes: ${resultadoLote} es mayor a la disponible.`);
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 5000);
            }
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
                                    <div>
                                        <Button color="primary" onClick={handleClickOpen}>
                                            <IconButton className={blinking ? classes.blinkingButton : ''}>
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
                                                        En esta página puedes registrar las ventas a empresas o clientes de la chacinería, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 4 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha</span>: en este campo se debe ingresar la fecha en la que se vende el lote/lotes.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Lote y Cantidad</span>: en este campo se divide en 2, en el primero llamado lote donde se selecciona el lote que se va a vender
                                                                y el segundo es cantidad, en el cual se ingresa la cantidad que se le va a vender, a su vez,
                                                                este campo cuenta con un icono de más a la derecha del campo de lote para añadir otros 2 campos también denominados lote y cantidad, en caso de que se quiera vender mas de un lote,
                                                                cuando añades más campos de lote y cantidad, del que ya está predeterminado, el icono de más cambia por una X por si deseas eliminar los nuevos campos generados.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Cliente</span>: en este campo se selecciona el cliente o la empresa a la que se le va a vender el/los lote/lotes.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Documento</span>: en este campo se ingresa el documento de la venta.
                                                            </li>
                                                        </ul>
                                                    </span>
                                                    <span>
                                                        Campos obligatorios y no obligatorios:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Campos con contorno azul y con asterisco en su nombre</span>: los campos con contorno azul y asterisco son obligatorios, se tienen que completar sin excepción.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Campos con contorno rojo</span>: en cambio, los campos con contorno rojo no son obligatorios, se pueden dejar vacíos de ser necesario.
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
                                    <AlertasReutilizable alert={alertWarning} isVisible={showAlertWarning} />
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
                            </Grid>
                            <Grid container >
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
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
                                                    <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-loteVendido-native-simple`}>Lote</InputLabel>
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
                                                    className={classes.customOutlinedBlue}
                                                    InputLabelProps={{ className: classes.customLabelBlue }}
                                                    color="primary"
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
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-expedicionDeProductoCliente-native-simple`}>Cliente</InputLabel>
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
                                                onChange={(e) => setClienteExpedicion({ value: e.target.value })}
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
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
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