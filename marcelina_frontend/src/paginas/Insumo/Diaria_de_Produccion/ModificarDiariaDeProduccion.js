import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, CssBaseline, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

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

const ModificarDiariaDeProduccion = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [codigoLote, setCodigoLote] = useState('');
    const [productos, setProductos] = useState([]);
    const [productosSelect, setProductosSelect] = useState([]);
    const [produccionProducto, setProduccionProducto] = useState({});
    const [carnes, setCarnes] = useState([]);
    const [carneSelect, setCarneSelect] = useState([]);
    const [carneCantidad, setCarneCantidad] = useState([]);
    const [carnesRemplazadas, setCarnesRemplazadas] = useState([]);
    const [aditivos, setAditivos] = useState([]);
    const [aditivoSelect, setAditivoSelect] = useState([]);
    const [aditivosCantidad, setAditivoCantidad] = useState([]);
    const [aditivosRemplazados, setAditivosRemplazados] = useState([]);
    const [checkToken, setCheckToken] = useState(false);
    const selectEnvasado = [
        { value: true, label: 'Empaquetado' },
        { value: false, label: 'No Empaquetado' },
    ];

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const [alertSuccess] = useState({
        title: 'Correcto', body: 'Diaria de producción modificada con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró modificar la diaria de producción, revise los datos ingresados.', severity: 'error', type: 'description'
    });

    const [alertWarning] = useState({
        title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
    });

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
            axios.get('/listar-diaria-de-produccion', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    const controlEncontrado = controlesData.find((control) => control.diariaDeProduccionId.toString() === id.toString());
                    if (!controlEncontrado) {
                        navigate('/listar-diaria-de-produccion')
                    }
                    setCodigoLote(controlEncontrado.diariaDeProduccionLote.loteCodigo);
                    axios.get('/listar-carnes', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then(response => {
                            const data = response.data;
                            setCarnes(data);
                            const carnes = data.map((carnes) => {
                                controlEncontrado.diariaDeProduccionCantidadUtilizadaCarnes.forEach((car) => {
                                    if (carnes.carneId === car.detalleCantidadCarneCarne.carneId) {
                                        carnes.carneCantidad = carnes.carneCantidad + car.detalleCantidadCarneCantidad;
                                    }
                                })
                                return carnes;
                            })
                            const carnesDeControl = carnes.filter(carne => {
                                const carneIdEnControl = controlEncontrado.diariaDeProduccionInsumosCarnicos.map(car => car.carneId.toString());
                                return carneIdEnControl.includes(carne.carneId.toString());
                            });
                            setCarnesRemplazadas(carnesDeControl);
                            setCarneSelect(
                                carnes.map((carne) => ({
                                    value: carne.carneId,
                                    label: `${carne.carneNombre} - ${carne.carneCorte} - ${carne.carneCantidad} Kg`,
                                }))
                            );
                        })
                        .catch(error => {
                            if (error.request.status === 401) {
                                setCheckToken(true);
                            } else {
                                updateErrorAlert('No se logró cargar las carnes, recargue la página.')
                                setShowAlertError(true);
                                setTimeout(() => {
                                    setShowAlertError(false);
                                }, 2000);
                            }
                        });

                    axios.get('/listar-aditivos-todos', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then(response => {
                            const data = response.data;
                            setAditivos(data);
                            const aditivos = data.map((aditivos) => {
                                controlEncontrado.diariaDeProduccionCantidadUtilizadaInsumos.forEach((adi) => {
                                    if (aditivos.insumoId === adi.detalleCantidadInsumoInsumo.insumoId) {
                                        aditivos.insumoCantidad = aditivos.insumoCantidad + adi.detalleCantidadInsumoCantidad;
                                    }
                                })
                                return aditivos;
                            })
                            const aditivosDeControl = aditivos.filter(aditivo => {
                                const aditivoIdEnControl = controlEncontrado.diariaDeProduccionAditivos.map(adi => adi.insumoId.toString());
                                return aditivoIdEnControl.includes(aditivo.insumoId.toString());
                            });
                            setAditivosRemplazados(aditivosDeControl);
                            setAditivoSelect(
                                aditivos.map((insumo) => ({
                                    value: insumo.insumoId,
                                    label: `${insumo.insumoNombre} - ${insumo.insumoNroLote} - ${insumo.insumoCantidad} ${insumo.insumoUnidad}`,
                                }))
                            );
                        })
                        .catch(error => {
                            if (error.request.status === 401) {
                                setCheckToken(true);
                            } else {
                                updateErrorAlert('No se logró cargar los aditivos, recargue la página.')
                                setShowAlertError(true);
                                setTimeout(() => {
                                    setShowAlertError(false);
                                }, 2000);
                            }
                        });

                    controlEncontrado.diariaDeProduccionCantidadUtilizadaCarnes.forEach(carne => {
                        carne.detalleCantidadCarneCarne.carneCantidad = carne.detalleCantidadCarneCarne.carneCantidad + carne.detalleCantidadCarneCantidad;
                    });

                    controlEncontrado.diariaDeProduccionCantidadUtilizadaInsumos.forEach(aditivo => {
                        aditivo.detalleCantidadInsumoInsumo.insumoCantidad = aditivo.detalleCantidadInsumoInsumo.insumoCantidad + aditivo.detalleCantidadInsumoCantidad;
                    });

                    setProduccionProducto({
                        value: controlEncontrado.diariaDeProduccionProducto.productoId,
                        label: `${controlEncontrado.diariaDeProduccionProducto.productoNombre} - ${controlEncontrado.diariaDeProduccionProducto.productoCodigo}`,
                    });

                    const car = controlEncontrado.diariaDeProduccionCantidadUtilizadaCarnes.map((carneC) => ({
                        carneUtilizada: {
                            value: carneC.detalleCantidadCarneCarne.carneId,
                        },
                        cantidad: carneC.detalleCantidadCarneCantidad,
                    }))

                    setCarneCantidad(car);

                    const ad = controlEncontrado.diariaDeProduccionCantidadUtilizadaInsumos.map((aditivoC) => ({
                        aditivoUtilizado: {
                            value: aditivoC.detalleCantidadInsumoInsumo.insumoId,
                        },
                        cantidad: aditivoC.detalleCantidadInsumoCantidad,
                    }))

                    setAditivoCantidad(ad);

                    const fechaControl2 = controlEncontrado.diariaDeProduccionFecha;
                    const fecha2 = new Date(fechaControl2);
                    const fechaFormateada2 = fecha2.toISOString().split('T')[0];

                    const fechaControl = controlEncontrado.diariaDeProduccionFechaVencimiento;
                    const fecha = new Date(fechaControl);
                    const fechaFormateada = fecha.toISOString().split('T')[0];

                    const controlConFechaParseada = {
                        ...controlEncontrado,
                        diariaDeProduccionFecha: fechaFormateada2,
                        diariaDeProduccionFechaVencimiento: fechaFormateada,
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
                            setShowAlertError(false);
                        }, 2000);
                    }
                });
        };

        const obtenerProductos = () => {
            axios.get('/listar-productos', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setProductos(response.data);
                    setProductosSelect(
                        response.data.map((producto) => ({
                            value: producto.productoId,
                            label: `${producto.productoNombre} - ${producto.productoCodigo}`,
                        }))
                    );
                })
                .catch(error => {
                    if (error.request.status === 401) {
                        setCheckToken(true);
                    } else {
                        updateErrorAlert('No se logró cargar los productos, recargue la página.')
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2000);
                    }
                });
        };

        obtenerControles();
        obtenerProductos();
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
        if (name === "diariaDeProduccionCantidadProducida") {
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

    const handleSelectChangeCarne = (event, index) => {
        const updatedCarneCantidad = [...carneCantidad];
        updatedCarneCantidad[index].carneUtilizada.value = event.target.value;
        setCarneCantidad(updatedCarneCantidad);
    };

    const handleCantidadChangeCarne = (event, index) => {
        const regex = new RegExp("^[0-9]{0,10}$");
        if (regex.test(event.target.value)) {
            const updatedCarneCantidad = [...carneCantidad];
            updatedCarneCantidad[index].cantidad = event.target.value;
            setCarneCantidad(updatedCarneCantidad);
        }
    };

    const handleSelectChangeAditivo = (event, index) => {
        const updatedAditivoCantidad = [...aditivosCantidad];
        updatedAditivoCantidad[index].aditivoUtilizado.value = event.target.value;
        setAditivoCantidad(updatedAditivoCantidad);
    };

    const handleCantidadChangeAditivo = (event, index) => {
        const regex = new RegExp("^[0-9]{0,4}\\.?[0-9]{0,4}$");
        if (regex.test(event.target.value)) {
            const updatedAditivoCantidad = [...aditivosCantidad];
            updatedAditivoCantidad[index].cantidad = event.target.value;
            setAditivoCantidad(updatedAditivoCantidad);
        }
    };

    const checkError = (producto, cantidad, fechaProd, envasado, fechaVenc) => {
        if (producto === undefined || producto === null || producto === 'Seleccionar') {
            return false;
        }
        else if (cantidad === undefined || cantidad === null || cantidad === '') {
            return false;
        }
        else if (fechaProd === undefined || fechaProd === null || fechaProd === '' || fechaProd.toString() === 'Invalid Date') {
            return false;
        }
        else if (envasado === undefined || envasado === null || envasado === 'Seleccionar') {
            return false;
        }
        else if (fechaVenc === undefined || fechaVenc === null || fechaVenc === '' || fechaVenc.toString() === 'Invalid Date') {
            return false;
        }
        return true;
    }

    const checkMultiple = (carnes, aditivos) => {
        let resp = true;
        if (carnes && aditivos) {
            carnes.forEach((carne) => {
                if (carne.carneUtilizada.value === '' || carne.cantidad === '' || carne.carneUtilizada.value === 'Seleccionar' || parseInt(carne.cantidad) === 0) {
                    return false;
                } else { }
            });

            aditivos.forEach((aditivo) => {
                if (aditivo.aditivoUtilizado.value === '' || aditivo.cantidad === '' || aditivo.aditivoUtilizado.value === 'Seleccionar' || parseInt(aditivo.cantidad) === 0) {
                    return false;
                } else { }
            });
        } else {
            return false;
        }
        return resp;
    }

    const handleFormSubmit = () => {
        const checkMul = checkMultiple(carneCantidad, aditivosCantidad);
        const checkE = checkError(control.diariaDeProduccionProducto, control.diariaDeProduccionCantidadProducida,
            control.diariaDeProduccionFecha, control.diariaDeProduccionEnvasado, control.diariaDeProduccionFechaVencimiento);

        if (checkE === false) {
            updateErrorAlert(`No deje vacío el campo de Carne-Cantidad y tampoco el de Aditivo-Cantidad`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 2500);
        } else {
            if (checkMul === false) {
                updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 2500);
            } else {
                const idCarnes = carneCantidad.map(carne => parseInt(carne.carneUtilizada.value));
                const idAditivos = aditivosCantidad.map(aditivo => parseInt(aditivo.aditivoUtilizado.value));

                const carnesCompletas = [];
                const insumosCompletos = [];

                for (const carne of carnes) {
                    if (idCarnes.includes(carne.carneId)) {
                        carnesCompletas.push(carne);
                    }
                }

                for (const aditivo of aditivos) {
                    if (idAditivos.includes(aditivo.insumoId)) {
                        insumosCompletos.push(aditivo);
                    }
                }

                const resultadoCarne = carnesCompletas.map(carne => {
                    const cantidaValueEncontradaCarne = carneCantidad.find(cv => cv.carneUtilizada.value.toString() === carne.carneId.toString());
                    if (cantidaValueEncontradaCarne) {
                        const cantidad = cantidaValueEncontradaCarne.cantidad;
                        if (cantidad > carne.carneCantidad) {
                            return `${carne.carneNombre} - ${carne.carneCorte} - ${carne.carneCantidad} Kg / `;
                        }
                    }
                    return null;
                })

                const resultadoInsumo = insumosCompletos.map(insumo => {
                    const cantidaValueEncontradaInsumo = aditivosCantidad.find(cv => cv.aditivoUtilizado.value.toString() === insumo.insumoId.toString());
                    if (cantidaValueEncontradaInsumo) {
                        const cantidad = cantidaValueEncontradaInsumo.cantidad;
                        if (cantidad > insumo.insumoCantidad) {
                            return `${insumo.insumoNombre} - ${insumo.insumoNroLote} - ${insumo.insumoCantidad} ${insumo.insumoUnidad} / `;
                        }
                    }
                    return null;
                })

                const elementoUndefinedCarne = resultadoCarne.some(elemento => elemento === null);
                const elementoUndefinedInsumo = resultadoInsumo.some(elemento => elemento === null);

                if (!elementoUndefinedInsumo || !elementoUndefinedCarne) {
                    updateErrorAlert(`La cantidad ingresada de carnes o aditivos utilizados en la producción, es mayor a la disponible, revise los datos ingresados.`);
                    setShowAlertError(true);
                    setTimeout(() => {
                        setShowAlertError(false);
                    }, 3000);
                } else {
                    const productoCompleto = productos.find((producto) => producto.productoId.toString() === control.diariaDeProduccionProducto.productoId.toString());

                    const loteControl = control.diariaDeProduccionLote;
                    const loteCompleto = {
                        ...loteControl,
                        loteCodigo: codigoLote,
                        loteProducto: productoCompleto,
                        loteCantidad: control.diariaDeProduccionCantidadProducida,
                    };

                    const listaCarneActualizada = [];
                    const listaCarneCantidad = [];
                    carnesCompletas.forEach((carne, index) => {
                        const cantidadCarne = carneCantidad[index].cantidad;
                        const carneActualizada = { ...carne, carneCantidad: carne.carneCantidad - cantidadCarne };
                        listaCarneActualizada.push(carneActualizada);
                        const detalleCantidad = control.diariaDeProduccionCantidadUtilizadaCarnes.find(detalle => detalle.detalleCantidadCarneCarne.carneId.toString() === carne.carneId.toString());
                        const detalleCantidadCarne = {
                            ...detalleCantidad,
                            detalleCantidadCarneCarne: carneActualizada,
                            detalleCantidadCarneCantidad: cantidadCarne,
                        };
                        listaCarneCantidad.push(detalleCantidadCarne);
                    })

                    const listaInsumoActualizado = [];
                    const listaInsumoCantidad = [];
                    insumosCompletos.forEach((insumo, index) => {
                        const cantidadInsumo = aditivosCantidad[index].cantidad;
                        const insumoActualizado = { ...insumo, insumoCantidad: insumo.insumoCantidad - cantidadInsumo };
                        listaInsumoActualizado.push(insumoActualizado);
                        const detalleCantidad = control.diariaDeProduccionCantidadUtilizadaInsumos.find(detalle => detalle.detalleCantidadInsumoInsumo.insumoId.toString() === insumo.insumoId.toString());
                        const detalleCantidadInsumo = {
                            ...detalleCantidad,
                            detalleCantidadInsumoInsumo: insumoActualizado,
                            detalleCantidadInsumoCantidad: cantidadInsumo,
                        };
                        listaInsumoCantidad.push(detalleCantidadInsumo);
                    })

                    const listaCarnesDesusadas = [];

                    listaCarneActualizada.map((carne) => {
                        carnesRemplazadas.forEach((car) => {
                            if (carne.carneId.toString() !== car.carneId.toString()) {
                                listaCarnesDesusadas.push(car);
                            }
                        })
                    })

                    const listaAditivosDesusados = [];

                    listaInsumoActualizado.map((aditivo) => {
                        aditivosRemplazados.forEach((adi) => {
                            if (aditivo.insumoId.toString() !== adi.insumoId.toString()) {
                                listaAditivosDesusados.push(adi);
                            }
                        })
                    })

                    const fecha = new Date(control.diariaDeProduccionFecha);
                    const fechaV = new Date(control.diariaDeProduccionFechaVencimiento);
                    fecha.setDate(fecha.getDate() + 2);
                    fechaV.setDate(fechaV.getDate() + 2);
                    const fechon1 = format(fecha, 'yyyy-MM-dd')
                    const fechon2 = format(fechaV, 'yyyy-MM-dd')

                    const data = {
                        ...control,
                        diariaDeProduccionFecha: fechon1,
                        diariaDeProduccionFechaVencimiento: fechon2,
                        diariaDeProduccionProducto: productoCompleto,
                        diariaDeProduccionLote: loteCompleto,
                        diariaDeProduccionInsumosCarnicos: listaCarneActualizada,
                        diariaDeProduccionCantidadUtilizadaCarnes: listaCarneCantidad,
                        diariaDeProduccionAditivos: listaInsumoActualizado,
                        diariaDeProduccionCantidadUtilizadaInsumos: listaInsumoCantidad,

                    };

                    const dataCompleta = {
                        diariaDeProduccion: data,
                        listaCarneDesusadas: listaCarnesDesusadas,
                        listaAditivosDesusadas: listaAditivosDesusados,
                    }


                    const check = checkError(data.diariaDeProduccionProducto, data.diariaDeProduccionCantidadProducida,
                        data.diariaDeProduccionFecha, data.diariaDeProduccionEnvasado, data.diariaDeProduccionFechaVencimiento);


                    if (check === false) {
                        updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2500);
                    } else {
                        axios.put(`/modificar-diaria-de-produccion/${id}`, dataCompleta, {
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
                                        navigate('/listar-diaria-de-produccion');
                                    }, 2500)
                                } else {
                                    updateErrorAlert('No se logró modificar la diaria de producción, revise los datos ingresados.')
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
                                    updateErrorAlert('No se logró modificar la diaria de producción, revise los datos ingresados.');
                                    setShowAlertError(true);
                                    setTimeout(() => {
                                        setShowAlertError(false);
                                    }, 2500);
                                }
                            })
                    }
                }
            }
        }
    };

    const redirect = () => {
        navigate('/listar-diaria-de-produccion')
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
                                    <Typography component='h1' variant='h4'>Modificar Diaria de Producción</Typography>
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
                                                        En esta página puedes modificar una diaria de producción, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 7 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Producto</span>: En este campo se debe seleccionar el producto que se realizara.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Carne y Cantidad</span>: Este campo se divide en 2, en el primero llamado carne donde se selecciona la carne que se utilizó para realizar el producto
                                                                y el segundo es cantidad, en el cual se ingresa la cantidad que se utilizó de esa carne.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Aditivo y Cantidad</span>: Este campo se divide en 2, el primero llamado aditivo donde se selecciona el aditivo que se utilizó para realizar el producto
                                                                y el segundo es cantidad, en el cual se ingresa la cantidad que se utilizó de ese aditivo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Cantidad Producida</span>: En este campo se debe ingresar la cantidad producida del producto/lote.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha de Producción</span>: En este campo se ingresar la fecha en la que se realizó el producto.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Envasado</span>: En este campo se debe seleccionar si el producto está envasado o no está envasado.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha de Vencimiento</span>: En este campo se debe ingresar la fecha de vencimiento del producto/lote que se realizó.
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
                                                        Aclaraciones y Recomendaciones:
                                                        <ul>
                                                            <li>Solo modifique los campos que necesite.</li>
                                                            <li>No se acepta que los campos con contorno azul se dejen vacíos.</li>
                                                            <li>En el modificar no se pueden agregar nuevas carnes o aditivos, en caso de que la producción del producto llevaba mas carnes o aditivos, se recomienda eliminar el registro de la lista y agregarlo de nuevo.</li>
                                                            <li>El lote que se generó para para el producto elaborado no se puede modificar.</li>
                                                            <li>Los campos de cantidad carne, cantidad aditivo y cantidad producida solo aceptarán números y cuentan con una longitud máxima de 10 caracteres.</li>
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
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-diariaDeProduccionProducto-native-simple`}>Producto *</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={produccionProducto.value}
                                                name="diariaDeProduccionProducto"
                                                label="Producto *"
                                                inputProps={{
                                                    name: "diariaDeProduccionProducto",
                                                    id: `outlined-diariaDeProduccionProducto-native-simple`,
                                                }}
                                                onChange={(e) => setProduccionProducto(e.target.value)}
                                            >
                                                <option>Seleccionar</option>
                                                {productosSelect.map((option, ind) => (
                                                    <option key={ind} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {carneCantidad.map((carne, index) => (
                                        <div key={index}>
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <FormControl variant="outlined" className={classes.formControl}>
                                                    <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-carneUtilizada-native-simple`}>Carne *</InputLabel>
                                                    <Select
                                                        className={classes.select}
                                                        native
                                                        value={carne.carneUtilizada.value}
                                                        name="carneUtilizada"
                                                        label="Carne *"
                                                        inputProps={{
                                                            name: "carneUtilizada",
                                                            id: `outlined-carneUtilizada-native-simple`,
                                                        }}
                                                        onChange={(event) => handleSelectChangeCarne(event, index)}
                                                    >
                                                        <option>Seleccionar</option>
                                                        {carneSelect.map((option, ind) => (
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
                                                    value={carne.cantidad}
                                                    onChange={(event) => handleCantidadChangeCarne(event, index)}
                                                />
                                            </Grid>
                                        </div>
                                    ))}
                                    {aditivosCantidad.map((aditivo, index) => (
                                        <div key={index}>
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <FormControl variant="outlined" className={classes.formControl}>
                                                    <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-aditivoUtilizado-native-simple`}>Aditivo *</InputLabel>
                                                    <Select
                                                        className={classes.select}
                                                        native
                                                        value={aditivo.aditivoUtilizado.value}
                                                        name="aditivoUtilizado"
                                                        label="Aditivo *"
                                                        inputProps={{
                                                            name: "aditivoUtilizado",
                                                            id: `outlined-aditivoUtilizado-native-simple`,
                                                        }}
                                                        onChange={(event) => handleSelectChangeAditivo(event, index)}
                                                    >
                                                        <option>Seleccionar</option>
                                                        {aditivoSelect.map((option, ind) => (
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
                                                    value={aditivo.cantidad}
                                                    onChange={(event) => handleCantidadChangeAditivo(event, index)}
                                                />
                                            </Grid>
                                        </div>
                                    ))}
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Número de lote"
                                            defaultValue='Número de lote'
                                            type="text"
                                            value={codigoLote}
                                            disabled={true}
                                        />
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
                                            label="Cantidad Producida"
                                            type="text"
                                            name="diariaDeProduccionCantidadProducida"
                                            value={control.diariaDeProduccionCantidadProducida}
                                            onChange={handleChange}
                                        />
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
                                            label="Fecha"
                                            type="date"
                                            name="diariaDeProduccionFecha"
                                            value={control.diariaDeProduccionFecha}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-diariaDeProduccionEnvasado-native-simple`}>Envasado *</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={control.diariaDeProduccionEnvasado}
                                                name="diariaDeProduccionEnvasado"
                                                label="Envasado *"
                                                inputProps={{
                                                    name: "diariaDeProduccionEnvasado",
                                                    id: `outlined-diariaDeProduccionEnvasado-native-simple`,
                                                }}
                                                onChange={handleChange}
                                            >
                                                <option>Seleccionar</option>
                                                {selectEnvasado.map((option, ind) => (
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
                                            label="Fecha Vencimiento"
                                            type="date"
                                            name="diariaDeProduccionFechaVencimiento"
                                            value={control.diariaDeProduccionFechaVencimiento}
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

export default ModificarDiariaDeProduccion;