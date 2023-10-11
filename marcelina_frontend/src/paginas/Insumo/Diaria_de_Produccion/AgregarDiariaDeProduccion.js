import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    title: {
        textAlign: 'center',
    },
    customTooltip: {
        maxWidth: 800,
        fontSize: 16,
        [theme.breakpoints.down('sm')]: {
            maxWidth: '80vw',
        },

        [theme.breakpoints.up('md')]: {
            maxWidth: 800,
        },
    },
    text: {
        color: '#2D2D2D',
    },
    liTitleBlue: {
        color: 'blue',
        fontWeight: 'bold',
    },
    liTitleRed: {
        color: 'red',
        fontWeight: 'bold',
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
}));

const AgregarDiariaDeProduccion = () => {
    const campoCarne = {
        name: 'diariaDeProduccionCantidadUtilizadaCarnes', label: 'Cantidad', color: 'primary', pattern: "^[0-9]{0,10}$"
    };

    const campoInsumo = {
        name: 'diariaDeProduccionCantidadUtilizadaInsumos', label: 'Cantidad', color: 'primary', pattern: "^[0-9]{0,10}$"
    }

    const formFields = [
        { name: 'diariaDeProduccionProducto', label: 'Producto *', type: 'selector', color: 'primary' },
        { name: 'diariaDeProduccionInsumosCarnicos', label: 'Carne *', type: 'cantidadMultiple', tipo: 'carne', campo: campoCarne, color: 'primary' },
        { name: 'diariaDeProduccionAditivos', label: 'Aditivo *', type: 'cantidadMultiple', tipo: 'aditivo', campo: campoInsumo, color: 'primary' },
        { name: 'diariaDeProduccionCantidadProducida', label: 'Cantidad Producida', type: 'text', obligatorio: true, pattern: "^[0-9]{0,10}$", color: 'primary' },
        { name: 'diariaDeProduccionFecha', label: 'Fecha de Produccion', type: 'date', color: 'primary' },
        { name: 'diariaDeProduccionEnvasado', label: 'Envasado *', type: 'selector', color: 'primary' },
        { name: 'diariaDeProduccionFechaVencimiento', label: 'Fecha de Vencimiento', type: 'date', color: 'primary' },
    ];

    const [alertSuccess] = useState({
        title: 'Correcto', body: 'Diaria de producción agregada con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró agregar la diaria de producción, revise los datos ingresados.', severity: 'error', type: 'description'
    });

    const [alertWarning] = useState({
        title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
    });

    const classes = useStyles();
    const navigate = useNavigate();
    const [reload, setReload] = useState(false);
    const [productos, setProductos] = useState('');
    const [productoSelect, setProductoSelect] = useState('');
    const [carnes, setCarnes] = useState('');
    const [carneSelect, setCarneSelect] = useState('');
    const [insumos, setInsumos] = useState('');
    const [insumoSelect, setInsumoSelect] = useState('');
    const [lotesCod, setLotesCod] = useState([]);
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);
    const [checkToken, setCheckToken] = useState(false);
    const [formKey, setFormKey] = useState(0);
    const [envasado] = useState([
        { value: true, label: 'Empaquetado' },
        { value: false, label: 'Sin empaquetar' }
    ]);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
            setCheckToken(false)
        }
    }, [checkToken]);

    useEffect(() => {
        const obtenerProductos = () => {
            axios.get('/listar-productos', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setProductos(response.data);
                    setProductoSelect(
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

        const obtenerCarnes = () => {
            axios.get('/listar-carnes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setCarnes(response.data);
                    const carneS = response.data.map((carne) => {
                        if (carne.carneCantidad > 0 && carne.carneEliminado === false) {
                            return {
                                value: carne.carneId,
                                label: `${carne.carneNombre} - ${carne.carneCorte} - ${carne.carneCantidad} Kg`,
                            }
                        }
                    })
                    const carnesSelect = carneS.filter((carne) => carne !== undefined);
                    setCarneSelect(carnesSelect);
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
        };

        const obtenerAditivos = () => {
            axios.get('/listar-aditivos', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setInsumos(response.data);
                    const fechaActual = new Date();
                    const insumoS = response.data.map((insumo) => {
                        if (insumo.insumoCantidad > 0 && insumo.insumoFechaVencimiento > fechaActual) {
                            return {
                                value: insumo.insumoId,
                                label: `${insumo.insumoNombre} - ${insumo.insumoNroLote} - ${insumo.insumoCantidad} ${insumo.insumoUnidad}`,
                            }
                        }
                    })
                    const insumosSelect = insumoS.filter((insumo) => insumos !== undefined);
                    setInsumoSelect(insumosSelect);
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
        };

        const obtenerLotes = () => {
            axios.get('/listar-lotes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setLotesCod(
                        response.data.map((lote) => lote.loteCodigo)
                    );
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
        };

        obtenerLotes();
        obtenerProductos();
        obtenerCarnes();
        obtenerAditivos();
        setReload(false);
    }, [reload]);

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

    const updateErrorAlert = (newBody) => {
        setAlertError((prevAlert) => ({
            ...prevAlert,
            body: newBody,
        }));
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
                if (carne.selectValue === '' || carne.textFieldValue === '') {
                    resp = false;
                } else { }
                if (resp === false) { return }
            });

            aditivos.forEach((aditivo) => {
                if (aditivo.selectValue === '' || aditivo.textFieldValue === '') {
                    resp = false;
                } else { }

                if (resp === false) { return }
            });
        } else {
            return false;
        }
        return resp;
    }

    const generarNumRandom = () => {
        const array = new Uint8Array(1);
        window.crypto.getRandomValues(array);
        return array[0];
    }

    const generarLote = () => {
        const timeStamp = Date.now();
        const aleatorio = generarNumRandom();
        const prefijo = "MAR";

        const numeroLote = `${prefijo}${timeStamp}${aleatorio}`;

        return numeroLote;
    }

    const handleFormSubmit = (formData) => {
        const { cantidadCarne, cantidadInsumo, ...formDataWithoutCantidad } = formData;

        const cantidadValueCarne = formData.cantidadCarne;
        const cantidadValueInsumo = formData.cantidadAditivo;

        const checkMul = checkMultiple(cantidadValueCarne, cantidadValueInsumo);
        const checkE = checkError(formData.diariaDeProduccionProducto, formData.diariaDeProduccionCantidadProducida, formData.diariaDeProduccionFecha,
            formData.diariaDeProduccionEnvasado, formData.diariaDeProduccionFechaVencimiento);

        if (checkMul === false) {
            updateErrorAlert(`No deje vacío el campo de Carne-Cantidad y tampoco el de Aditivo-Cantidad`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 2500);
        } else {
            if (checkE === false) {
                updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 2500);
            } else {
                const selectCarneValues = cantidadValueCarne.map(item => item.selectValue);
                const selectInsumoValues = cantidadValueInsumo.map(item => item.selectValue);

                const carnesCompletas = carnes.filter(carne => selectCarneValues.includes(carne.carneId.toString()));
                const insumosCompletos = insumos.filter(insumo => selectInsumoValues.includes(insumo.insumoId.toString()));

                const resultadoCarne = carnesCompletas.map(carne => {
                    const cantidaValueEncontradaCarne = cantidadValueCarne.find(cv => cv.selectValue === carne.carneId.toString());
                    if (cantidaValueEncontradaCarne) {
                        const cantidad = cantidaValueEncontradaCarne.textFieldValue;
                        if (cantidad > carne.carneCantidad) {
                            return `${carne.carneNombre} - ${carne.carneCorte} - ${carne.carneCantidad} Kg / `;
                        }
                    }
                    return null;
                })

                const resultadoInsumo = insumosCompletos.map(insumo => {
                    const cantidaValueEncontradaInsumo = cantidadValueInsumo.find(cv => cv.selectValue === insumo.insumoId.toString());
                    if (cantidaValueEncontradaInsumo) {
                        const cantidad = cantidaValueEncontradaInsumo.textFieldValue;
                        if (cantidad > insumo.insumoCantidad) {
                            return `${insumo.insumoNombre} - ${insumo.insumoNroLote} - ${insumo.insumoCantidad} ${insumo.insumoUnidad} / `;
                        }
                    }
                    return null;
                })

                const elementoUndefinedCarne = resultadoCarne.some(elemento => elemento === null);
                const elementoUndefinedInsumo = resultadoInsumo.some(elemento => elemento === null);
                if (!elementoUndefinedInsumo || !elementoUndefinedCarne) {
                    updateErrorAlert(`La cantidad ingresada de carnes o aditivos utilizada en la producción, es mayor a la disponible y no deje campos vacíos.`);
                    setShowAlertError(true);
                    setTimeout(() => {
                        setShowAlertError(false);
                    }, 3000);
                } else {
                    const listaCarneActualizada = [];
                    const listaCarneCantidad = [];
                    carnesCompletas.forEach((carne, index) => {
                        const cantidadCarne = cantidadValueCarne[index].textFieldValue;
                        const carneActualizada = { ...carne, carneCantidad: carne.carneCantidad - cantidadCarne };
                        listaCarneActualizada.push(carneActualizada);
                        const detalleCantidadCarne = {
                            detalleCantidadCarneCarne: carneActualizada,
                            detalleCantidadCarneCantidad: cantidadCarne,
                        };
                        listaCarneCantidad.push(detalleCantidadCarne);
                    })

                    const listaInsumoActualizado = [];
                    const listaInsumoCantidad = [];
                    insumosCompletos.forEach((insumo, index) => {
                        const cantidadInsumo = cantidadValueInsumo[index].textFieldValue;
                        const insumoActualizado = { ...insumo, insumoCantidad: insumo.insumoCantidad - cantidadInsumo };
                        listaInsumoActualizado.push(insumoActualizado);
                        const detalleCantidadInsumo = {
                            detalleCantidadInsumoInsumo: insumoActualizado,
                            detalleCantidadInsumoCantidad: cantidadInsumo,
                        };
                        listaInsumoCantidad.push(detalleCantidadInsumo);
                    })

                    const productoCompleto = productos.filter((producto) => producto.productoId.toString() === formDataWithoutCantidad.diariaDeProduccionProducto)[0];

                    let loteNum = '';
                    let retorno = false;
                    while (retorno === false) {
                        const lote = generarLote();

                        const loteExiste = lotesCod.includes(lote);

                        if (loteExiste === false) {
                            loteNum = lote;
                            retorno = true;
                        }
                    }

                    const loteCompleto = {
                        loteCodigo: loteNum,
                        loteProducto: productoCompleto,
                        loteCantidad: formDataWithoutCantidad.diariaDeProduccionCantidadProducida,
                    };
                    const fecha = new Date(formDataWithoutCantidad.diariaDeProduccionFecha);
                    console.log(fecha.getDate())
                    const fechaV = new Date(formDataWithoutCantidad.diariaDeProduccionFechaVencimiento);
                    fecha.setDate(fecha.getDate() + 1);
                    fechaV.setDate(fechaV.getDate() + 1);
                    const updateFormData = {
                        ...formDataWithoutCantidad,
                        diariaDeProduccionFecha: fecha,
                        diariaDeProduccionFechaVencimiento: fechaV,
                        diariaDeProduccionProducto: productoCompleto,
                        diariaDeProduccionInsumosCarnicos: listaCarneActualizada,
                        diariaDeProduccionAditivos: listaInsumoActualizado,
                        diariaDeProduccionResponsable: window.localStorage.getItem('user'),
                    };

                    const data = {
                        diariaDeProduccion: updateFormData,
                        listaCarneCantidad: listaCarneCantidad,
                        listaInsumoCantidad: listaInsumoCantidad,
                        lote: loteCompleto,
                    };

                    const check = checkError(updateFormData.diariaDeProduccionProducto, updateFormData.diariaDeProduccionCantidadProducida,
                        updateFormData.diariaDeProduccionFecha, updateFormData.diariaDeProduccionEnvasado, updateFormData.diariaDeProduccionFechaVencimiento);

                    if (check === false) {
                        updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2500);
                    } else {
                        if (checkMul === false) {
                            updateErrorAlert(`Seleccione e ingrese la/el carne/aditivo y la cantidad, no deje los campos vacíos.`);
                            setShowAlertError(true);
                            setTimeout(() => {
                                setShowAlertError(false);
                            }, 2500);
                        } else {
                            axios.post('/agregar-diaria-de-produccion', data, {
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                    "Content-Type": "application/json"
                                }
                            })
                                .then(response => {
                                    if (response.status === 201) {
                                        setReload(true);
                                        setFormKey(prevKey => prevKey + 1);
                                        setShowAlertSuccess(true);
                                        setTimeout(() => {
                                            setShowAlertSuccess(false);
                                        }, 2500);
                                    } else {
                                        updateErrorAlert('No se logró agregar la diaria de producción, revise los datos ingresados.')
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
                                        updateErrorAlert('No se logró agregar la diaria de producción, revise los datos ingresados.');
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
        }
    }

    const redirect = () => {
        navigate('/listar-diaria-de-produccion')
    }

    return (
        <Grid>
            <Navbar />
            <Container style={{ marginTop: 30 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={0}>
                        <Grid item lg={2} md={2} ></Grid>
                        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
                            <Typography component='h1' variant='h4'>Agregar Diaria de Producción</Typography>
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
                                                En esta página puedes registrar los productos que se realizan, asegúrate de completar los campos necesarios para registrar el estado.
                                            </span>
                                            <br />
                                            <span>
                                                Este formulario cuenta con 7 campos:
                                                <ul>
                                                    <li>
                                                        <span className={classes.liTitleBlue}>Producto</span>: En este campo se debe seleccionar el producto que se realizara.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitleBlue}>Carne y Cantidad</span>: Este campo se divide en 2 campos, el primero llamado carne que es donde se selecciona la carne que se utilizó para realizar el producto
                                                        y el segundo es cantidad, en el cual se ingresa la cantidad que se utilizó de esa carne seleccionada para hacer el producto, a su vez
                                                        este campo cuenta con un icono de más a la derecha del campo de carne, este icono añade otros 2 campos también denominados carne y cantidad, estos campos se añaden en caso de que el producto este compuesto por más de una carne,
                                                        cuando añades más campos de carne y cantidad, del que ya está predeterminado, el icono de más cambia por una X por si deseas eliminar los nuevos campos generados.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitleBlue}>Aditivo y Cantidad</span>: Este campo se divide en 2 campos, el primero llamado aditivo que es donde se selecciona el aditivo que se utilizó para realizar el producto
                                                        y el segundo es cantidad, en el cual se ingresa la cantidad que se utilizó de ese aditivo seleccionado para hacer el producto, a su vez
                                                        este campo cuenta con un icono de más a la derecha del campo de aditivo, este icono añade otros 2 campos también denominados aditivo y cantidad, estos campos se añaden en caso de que el producto este compuesto por más de un aditivo,
                                                        cuando añades más campos de aditivo y cantidad, del que ya está predeterminado, el icono de más cambia por una X por si deseas eliminar los nuevos campos generados.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitleBlue}>Cantidad Producida</span>: En este campo se debe ingresar la cantidad producida del producto/lote.
                                                    </li>
                                                    <li>
                                                        <span className={classes.liTitleBlue}>Fecha de Producción</span>: En este campo se debe ingresar la fecha en la que se realizó el producto.
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
                                                Aclaraciones:
                                                <br />
                                                - No se permite dejar los campos vacíos, excepto los de contorno rojo.
                                                <br />
                                                - Una vez registre el control de productos químicos, no se le redirigirá al listar. Se determinó así por si está buscando registrar otro control de productos químicos.
                                                <br />
                                                - Los lotes son generados automáticamente con sus datos correspondientes.
                                                <br />
                                                - Cuando la cantidad de una carne o aditivo llega a 0, se eliminará lógicamente, lo que quiere decir esto es que la carne o el aditivo se eliminará pero no permanentemente, se podrá seguir viendo en la lista.
                                                <br />
                                                - Una vez la fecha actual sobrepase la fecha de vencimiento, los lotes/productos se eliminarán lógicamente.
                                                <br />
                                                - En los campos de Aditivo-Cantidad y Carne-Cantidad se mostrarán los registros que no estén eliminados y su fecha de vencimiento sea mayor a la actual.
                                                <br />
                                                - Los campos de cantidad carne, cantidad aditivo y cantidad producida solo aceptarán números y cuentan con una longitud máxima de 10 caracteres.
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
                    </Grid >
                </Box >
            </Container >
            <FormularioReutilizable
                fields={formFields}
                key={formKey}
                onSubmit={handleFormSubmit}
                handleRedirect={redirect}
                selectOptions={{
                    diariaDeProduccionProducto: productoSelect,
                    diariaDeProduccionInsumosCarnicos: carneSelect,
                    diariaDeProduccionAditivos: insumoSelect,
                    diariaDeProduccionEnvasado: envasado,
                }}
            />
        </Grid >
    )
}

export default AgregarDiariaDeProduccion;