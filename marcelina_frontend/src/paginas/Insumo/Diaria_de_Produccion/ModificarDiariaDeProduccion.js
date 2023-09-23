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

    const [alertSuccess, setAlertSuccess] = useState({
        title: 'Correcto', body: 'Diaria de producción modificada con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logro modificar la diaria de producción, revise los datos ingresados.', severity: 'error', type: 'description'
    });

    const [alertWarning, setAlertWarning] = useState({
        title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
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
            updateErrorAlert('El token no existe, inicie sesión nuevamente.')
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
                navigate('/')
            }, 5000);
        } else {
            const tokenParts = token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log(payload)

            const tokenExpiration = payload.exp * 1000;
            console.log(tokenExpiration)
            const currentTime = Date.now();
            console.log(currentTime)

            if (tokenExpiration < currentTime) {
                setShowAlertWarning(true);
                setTimeout(() => {
                    setShowAlertWarning(false);
                    navigate('/')
                }, 3000);
            }
        }
    }, []);

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
                    console.log(controlEncontrado);
                    axios.get('/listar-carnes-todas', {
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
                            console.error(error);
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
                            console.error(error);
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

                    console.log(controlConFechaParseada);
                    setControl(controlConFechaParseada);
                })
                .catch(error => {
                    console.error(error);
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
                    console.error(error);
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
        console.log(updatedCarneCantidad)
        setCarneCantidad(updatedCarneCantidad);
    };

    const handleCantidadChangeCarne = (event, index) => {
        const regex = new RegExp("^[0-9]{0,10}$");
        if (regex.test(event.target.value)) {
            const updatedCarneCantidad = [...carneCantidad];
            updatedCarneCantidad[index].cantidad = event.target.value;
            console.log(updatedCarneCantidad);
            setCarneCantidad(updatedCarneCantidad);
        }
    };

    const handleSelectChangeAditivo = (event, index) => {
        const updatedAditivoCantidad = [...aditivosCantidad];
        updatedAditivoCantidad[index].aditivoUtilizado.value = event.target.value;
        console.log(updatedAditivoCantidad)
        setAditivoCantidad(updatedAditivoCantidad);
    };

    const handleCantidadChangeAditivo = (event, index) => {
        const regex = new RegExp("^[0-9]{0,10}$");
        if (regex.test(event.target.value)) {
            const updatedAditivoCantidad = [...aditivosCantidad];
            updatedAditivoCantidad[index].cantidad = event.target.value;
            console.log(updatedAditivoCantidad);
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
        if (carnes && aditivos) {
            carnes.forEach((carne) => {
                if (carne.carneUtilizada.value === '' || carne.cantidad === '' || carne.carneUtilizada.value === 'Seleccionar' || carne.cantidad === 0) {
                    return false;
                } else { }
            });
            console.log(aditivos)
            aditivos.forEach((aditivo) => {
                if (aditivo.aditivoUtilizado.value === '' || aditivo.cantidad === '' || aditivo.aditivoUtilizado.value === 'Seleccionar' || aditivo.cantidad === 0) {
                    return false;
                } else { }
            });

        } else {
            return false;
        }
    }

    const handleFormSubmit = () => {
        console.log(carneCantidad)
        console.log(aditivosCantidad)

        const checkMul = checkMultiple(carneCantidad, aditivosCantidad);
        const checkE = checkError(control.diariaDeProduccionProducto, control.diariaDeProduccionCantidadProducida,
            control.diariaDeProduccionFecha, control.diariaDeProduccionEnvasado, control.diariaDeProduccionFechaVencimiento);

        if (checkE === false) {
            updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 7000);
        } else {
            if (checkMul === false) {
                updateErrorAlert(`Seleccione e ingrese la/el carne/aditivo y la cantidad, no seleccione la opción "Seleccionar" y no deje el campo cantida vacío.`);
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 7000);
            } else {
                const idCarnes = carneCantidad.map(carne => parseInt(carne.carneUtilizada.value));
                const idAditivos = aditivosCantidad.map(aditivo => parseInt(aditivo.aditivoUtilizado.value));

                console.log(idCarnes);
                console.log(idAditivos);

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

                console.log(carnesCompletas)
                console.log(insumosCompletos);

                const resultadoCarne = carnesCompletas.map(carne => {
                    const cantidaValueEncontradaCarne = carneCantidad.find(cv => cv.carneUtilizada.value.toString() === carne.carneId.toString());
                    console.log(cantidaValueEncontradaCarne);
                    console.log(carne);
                    if (cantidaValueEncontradaCarne) {
                        const cantidad = cantidaValueEncontradaCarne.cantidad;
                        console.log(cantidad);
                        if (cantidad > carne.carneCantidad) {
                            console.log(carne);
                            return `${carne.carneNombre} - ${carne.carneCorte} - ${carne.carneCantidad} Kg / `;
                        }
                    }
                    return null;
                })

                const resultadoInsumo = insumosCompletos.map(insumo => {
                    const cantidaValueEncontradaInsumo = aditivosCantidad.find(cv => cv.aditivoUtilizado.value.toString() === insumo.insumoId.toString());
                    console.log(cantidaValueEncontradaInsumo);
                    if (cantidaValueEncontradaInsumo) {
                        const cantidad = cantidaValueEncontradaInsumo.cantidad;
                        console.log(cantidad);
                        if (cantidad > insumo.insumoCantidad) {
                            console.log(insumo);
                            return `${insumo.insumoNombre} - ${insumo.insumoNroLote} - ${insumo.insumoCantidad} ${insumo.insumoUnidad} / `;
                        }
                    }
                    return null;
                })

                console.log(resultadoCarne)
                console.log(resultadoInsumo);

                const elementoUndefinedCarne = resultadoCarne.some(elemento => elemento === null);
                const elementoUndefinedInsumo = resultadoInsumo.some(elemento => elemento === null);

                console.log(elementoUndefinedCarne);

                if (!elementoUndefinedInsumo || !elementoUndefinedCarne) {
                    updateErrorAlert(`La cantidad ingresada de carnes o aditivos utilizada en la producción, es mayor a la disponible, revise los datos ingresados.`);
                    setShowAlertError(true);
                    setTimeout(() => {
                        setShowAlertError(false);
                    }, 7000);
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
                        console.log(cantidadCarne);
                        const carneActualizada = { ...carne, carneCantidad: carne.carneCantidad - cantidadCarne };
                        console.log(carneActualizada);
                        listaCarneActualizada.push(carneActualizada);
                        const detalleCantidad = control.diariaDeProduccionCantidadUtilizadaCarnes.find(detalle => detalle.detalleCantidadCarneCarne.carneId.toString() === carne.carneId.toString());
                        console.log(detalleCantidad);
                        const detalleCantidadCarne = {
                            ...detalleCantidad,
                            detalleCantidadCarneCarne: carneActualizada,
                            detalleCantidadCarneCantidad: cantidadCarne,
                        };
                        listaCarneCantidad.push(detalleCantidadCarne);
                    })
                    console.log(listaCarneActualizada);
                    console.log(listaCarneCantidad);

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

                    console.log(listaInsumoActualizado);
                    console.log(listaInsumoCantidad);

                    console.log(listaCarneActualizada);
                    console.log(carnesRemplazadas);

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

                    console.log(listaCarnesDesusadas);

                    const data = {
                        ...control,
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

                    console.log(dataCompleta);

                    const check = checkError(data.diariaDeProduccionProducto, data.diariaDeProduccionCantidadProducida,
                        data.diariaDeProduccionFecha, data.diariaDeProduccionEnvasado, data.diariaDeProduccionFechaVencimiento);


                    if (check === false) {
                        updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 7000);
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
                                    }, 3000)
                                } else {
                                    updateErrorAlert('No se logro modificar la diaria de producción, revise los datos ingresados.')
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
                                    updateErrorAlert('No se logro modificar la diaria de producción, revise los datos ingresados.');
                                    setShowAlertError(true);
                                    setTimeout(() => {
                                        setShowAlertError(false);
                                    }, 5000);
                                }
                            })
                    }
                }
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
                                    <Typography component='h1' variant='h4'>Modificar Diaria de Producción</Typography>
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
                                                        En esta página puedes registrar los productos que se producen en la chacinería, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 7 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Producto</span>: en este campo se debe seleccionar el producto que se realizara.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Carne y Cantidad</span>: en este campo se divide en 2, en el primero llamado carne donde se ingresa la carne que se utiliza para realizar el producto
                                                                y el segundo es cantidad, en el cual se ingresa la cantidad que se utiliza de esa carne.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Aditivo y Cantidad</span>: en este campo se divide en 2, el primero llamado aditivo donde se ingresa el aditivo que se utiliza para realizar el producto
                                                                y el segundo es cantidad, en el cual se ingresa la cantidad que se utiliza de ese aditivo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Cantidad Producida</span>: en este campo se ingresa la cantidad producida del producto/lote.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha de Producción</span>: en este campo se ingresa la fecha y hora en la que se realizo el producto.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Envasado</span>: en este campo se puede seleccionar si el producto esta envasado o no esta envasado.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha de Vencimiento</span>: en este campo se puede ingresar la fecha de vencimiento del producto/lote que se realizo.
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
                                                    InputLabelProps={{ className: classes.customLabelBlue }}
                                                    color="primary"
                                                    margin="normal"
                                                    variant="outlined"
                                                    label="Cantidad"
                                                    defaultValue={0}
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
                                                    InputLabelProps={{ className: classes.customLabelBlue }}
                                                    color="primary"
                                                    margin="normal"
                                                    variant="outlined"
                                                    label="Cantidad"
                                                    defaultValue={0}
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
                                            InputLabelProps={{ className: classes.customLabelBlue }}
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
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Cantidad Producida"
                                            defaultValue={0}
                                            type="number"
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
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Fecha"
                                            defaultValue={new Date()}
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
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Fecha Vencimiento"
                                            defaultValue={new Date()}
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

export default ModificarDiariaDeProduccion;