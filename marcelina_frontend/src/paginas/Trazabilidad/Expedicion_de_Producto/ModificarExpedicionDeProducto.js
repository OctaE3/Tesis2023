import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, CssBaseline, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    sendButtonMargin: {
        margin: theme.spacing(1),
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
    const [controles, setControles] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [clienteSelect, setClienteSelect] = useState([]);
    const [clienteExpedicion, setClienteExpedicion] = useState({});
    const [lotes, setLotes] = useState([]);
    const [loteSelect, setLoteSelect] = useState([]);
    const [loteCantidad, setLoteCantidad] = useState([]);
    const [lotesRemplazados, setLotesRemplazados] = useState([]);
    const [checkToken, setCheckToken] = useState(false);

    const [alertSuccess] = useState({
        title: 'Correcto', body: 'Expedición de producto modificada con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró modificar la expedición de producto, revise los datos ingresados.', severity: 'error', type: 'description'
    });

    const [alertWarning] = useState({
        title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
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
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/')
        } else {
            const tokenParts = token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));

            const tokenExpiration = payload.exp * 1000;
            const currentTime = Date.now();

            if (tokenExpiration < currentTime) {
                setShowAlertWarning(true);
                setTimeout(() => {
                    setShowAlertWarning(false);
                    navigate('/')
                }, 2000);
            }
        }
    }, [checkToken]);

    useEffect(() => {
        const obtenerControles = () => {
            axios.get('/listar-expedicion-de-productos', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    setControles(
                        controlesData.filter((exp) => exp.expedicionDeProductoId.toString() !== id.toString())
                            .map((exp) => ({
                                documento: exp.expedicionDeProductoDocumento,
                            }))
                    );
                    const controlEncontrado = controlesData.find((control) => control.expedicionDeProductoId.toString() === id.toString());
                    if (!controlEncontrado) {
                        navigate('/listar-expedicion-de-producto');
                    }
                    axios.get('/listar-lotes', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then(responselote => {
                            const data = responselote.data;
                            setLotes(data);
                            const lotes = data.map((lote) => {
                                controlEncontrado.expedicionDeProductoCantidad.forEach((lot) => {
                                    if (lote.loteId === lot.detalleCantidadLoteLote.loteId) {
                                        lote.loteCantidad = lote.loteCantidad + lot.detalleCantidadLoteCantidadVendida;
                                    }
                                })
                                return lote;
                            })
                            const lotesDeControl = lotes.filter(lote => {
                                const loteIdEnControl = controlEncontrado.expedicionDeProductoLotes.map(lote => lote.loteId.toString());
                                return loteIdEnControl.includes(lote.loteId.toString());
                            });
                            setLotesRemplazados(lotesDeControl);
                            const lotesito = lotes.map((lote) => {
                                if (lote.loteCantidad === 0) { }
                                else {
                                    return {
                                        value: lote.loteId,
                                        label: `${lote.loteCodigo} - ${lote.loteCantidad} Kg - ${lote.loteProducto.productoNombre}`,
                                    }
                                }
                            })
                            const anashe = lotesito.filter((lote) => lote !== undefined);
                            setLoteSelect(anashe);
                        })
                        .catch(error => {
                            if (error.request.status === 401) {
                                setCheckToken(true);
                            } else {
                                updateErrorAlert('No se logró cargar los lotes, recargue la página.')
                                setShowAlertError(true);
                                setTimeout(() => {
                                    setShowAlertError(false);
                                }, 2000);
                            }
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

                    setControl(controlConFechaParseada);
                })
                .catch(error => {
                    if (error.request.status === 401) {
                        setCheckToken(true);
                    } else {
                        updateErrorAlert('No se logró cargar los datos del registro, intente nuevamente.')
                        setShowAlertError(true);
                        setTimeout(() => {
                            redirect();
                            setShowAlertError(false);
                        }, 2000);
                    }
                });
        };

        const obtenerClientes = () => {
            axios.get('/listar-clientes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const clientesT = response.data;
                    const clientesNoEliminados = clientesT.filter((cliente) => cliente.clienteEliminado === false);
                    setClientes(clientesNoEliminados);
                    setClienteSelect(
                        clientesNoEliminados.map((cliente) => ({
                            value: cliente.clienteId,
                            label: cliente.clienteNombre,
                        }))
                    );
                })
                .catch(error => {
                    if (error.request.status === 401) {
                        setCheckToken(true);
                    } else {
                        updateErrorAlert('No se logró cargar los clientes, recargue la página.')
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2000);
                    }
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
        setLoteCantidad(updatedLoteCantidad);
    };

    const handleCantidadChangeLote = (event, index) => {
        const regex = new RegExp("^[0-9]{0,10}$");
        if (regex.test(event.target.value)) {
            const updatedLoteCantidad = [...loteCantidad];
            updatedLoteCantidad[index].cantidad = event.target.value;
            setLoteCantidad(updatedLoteCantidad);
        }
    };

    const checkError = (fecha, cliente, documento) => {
        if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
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
        let resp = true;
        if (lotes) {
            lotes.forEach((lote) => {
                if (lote.loteVendido.value === '' || lote.cantidad === '' || lote.loteVendido.value === "Seleccionar" || lote.cantidad === 0) {
                    resp = false;
                } else { }

                if (resp === false) { return }
            })
            return resp;
        } else { return false }
    }

    const checkDoc = (documento) => {
        let resp = true;
        controles.forEach((exp) => {
            if (exp.documento.toString() === documento.toString()) {
                resp = false;
            }

            if (resp === false) { return }
        })
        return resp;
    }

    const handleFormSubmit = () => {
        const checkMul = checkMultiple(loteCantidad);

        if (checkMul === false) {
            updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 2500);
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
                if (cantidaValueEncontradaLote) {
                    const cantidad = cantidaValueEncontradaLote.cantidad;
                    if (cantidad > lote.loteCantidad) {
                        return `${lote.loteCodigo} - ${lote.loteProducto.productoNombre} - ${lote.loteCantidad} Kg / `;
                    }
                }
                return null;
            })

            const elementoUndefinedLote = resultadoLote.some(elemento => elemento === null);

            if (elementoUndefinedLote === true) {
                const productosCompletos = lotesCompletos.map(lote => lote.loteProducto);
                const clienteCompleto = clientes.find((cliente) => cliente.clienteId.toString() === clienteExpedicion.value.toString());

                const listaDetalleCantidaLote = [];
                const lotesCompletosConCantidadRestada = [];
                lotesCompletos.forEach((lote, index) => {
                    const cantidadLote = loteCantidad[index].cantidad;
                    const loteActualizado = { ...lote, loteCantidad: lote.loteCantidad - cantidadLote };
                    lotesCompletosConCantidadRestada.push(loteActualizado);
                    const detalleLote = control.expedicionDeProductoCantidad[index];
                    const detalleCantidadLote = {
                        ...detalleLote,
                        detalleCantidadLoteLote: loteActualizado,
                        detalleCantidadLoteCantidadVendida: cantidadLote,
                    };
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

                const uniqueProductos = {};
                const productosSinDuplicados = productosCompletos.filter((producto) => {
                    const key = `${producto.productoId}-${producto.productoCodigo}`;
                    if (!uniqueProductos[key]) {
                        uniqueProductos[key] = true;
                        return true;
                    }
                    return false;
                });

                const fecha = new Date(control.expedicionDeProductoFecha);
                fecha.setDate(fecha.getDate() + 1);

                const data = {
                    ...control,
                    expedicionDeProductoCliente: clienteCompleto,
                    expedicionDeProductoFecha: fecha,
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
                    }, 3000);
                } else {
                    const checkD = checkDoc(data.expedicionDeProductoDocumento);
                    if (checkD === false) {
                        updateErrorAlert(`El documento ingresado ya le pertenece a otra expedición de producto.`);
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2500);
                    } else {
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
                                        navigate('/listar-expedicion-de-producto');
                                    }, 2500)
                                } else {
                                    updateErrorAlert('No se logró modificar la expedición de producto, revise los datos ingresados.')
                                    setShowAlertError(true);
                                    setTimeout(() => {
                                        setShowAlertError(false);
                                    }, 2500);
                                }
                            })
                            .catch(error => {
                                if (error.request.status === 401) {
                                    setCheckToken(true);
                                }
                                else if (error.request.status === 500) {
                                    updateErrorAlert('No se logró modificar la expedición de producto, revise los datos ingresados.');
                                    setShowAlertError(true);
                                    setTimeout(() => {
                                        setShowAlertError(false);
                                    }, 2500);
                                }
                            })
                    }
                }
            } else {
                updateErrorAlert(`La cantidad ingresada para vender del/los lote/lotes: ${resultadoLote} es mayor a la disponible.`);
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 3000);
            }
        }
    };

    const redirect = () => {
        navigate('/listar-expedicion-de-producto')
    }

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
                                        <IconButton className={blinking ? classes.blinkingButton : ''} onClick={handleClickOpen}>
                                            <HelpOutlineIcon fontSize="large" color="primary" />
                                        </IconButton>
                                        <Dialog
                                            fullScreen={fullScreen}
                                            fullWidth
                                            maxWidth='md'
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="responsive-dialog-title"
                                        >
                                            <DialogTitle id="responsive-dialog-title">Explicación del formulario.</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText className={classes.text}>
                                                    <span>
                                                        En esta página se puede modificar una expedición de producto, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 4 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha</span>: En este campo se debe ingresar la fecha en la que se vendió el o los lotes.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Lote y Cantidad</span>: Este campo se divide en 2, en el primero llamado lote donde se selecciona el lote que se vendió
                                                                y el segundo es cantidad en el cual se ingresa la cantidad que se vendió.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Cliente</span>: En este campo se selecciona el cliente o la empresa a la que se le va a vender el/los lote/lotes.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Documento</span>: En este campo se ingresa el documento que identifica la venta.
                                                            </li>
                                                        </ul>
                                                    </span>
                                                    <span>
                                                        Campos obligatorios y no obligatorios:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Campos con contorno azul y con asterisco en su nombre</span>: Los campos con contorno azul y asterisco son obligatorios, se tienen que completar sin excepción.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Campos con contorno rojo</span>: Los campos con contorno rojo no son obligatorios, se pueden dejar vacíos de ser necesario.
                                                            </li>
                                                        </ul>
                                                    </span>
                                                    <span>
                                                        Aclaraciones:
                                                        <ul>
                                                            <li>Solo se pueden cambiar los lotes ya ingresados, no se pueden añadir más.</li>
                                                            <li>En caso de que falten añadir lotes a la expedición de producto, se recomienda eliminarla y agregarla de nuevo</li>
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
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Fecha"
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
                                                    InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                                    color="primary"
                                                    margin="normal"
                                                    variant="outlined"
                                                    label="Cantidad"
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
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Documento"
                                            type="text"
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
                                    <Button type="submit" variant="contained" color="primary" onClick={handleFormSubmit} className={classes.sendButtonMargin}>Modificar</Button>
                                    <Button type="submit" variant="contained" color="primary" onClick={redirect} className={classes.sendButtonMargin}>Volver</Button>
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