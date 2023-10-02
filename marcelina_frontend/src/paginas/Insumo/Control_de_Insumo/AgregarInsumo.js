import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core'
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

const AgregarInsumo = () => {
    const formFields = [
        { name: 'insumoNombre', label: 'Nombre', type: 'text', obligatorio: true, pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s]{0,50}$", color: 'primary' },
        { name: 'insumoFecha', label: 'Fecha', type: 'date', format: 'yyyy-MM-dd', color: 'primary' },
        { name: 'insumoProveedor', label: 'Proveedor *', type: 'selector', color: 'primary' },
        { name: 'insumoTipo', label: 'Tipo *', type: 'selector', color: 'primary' },
        { name: 'insumoCantidad', label: 'Cantidad', type: 'text', obligatorio: true, pattern: "^[0-9]{0,5}$", color: 'primary' },
        { name: 'insumoUnidad', label: 'Unidad *', type: 'selector', color: 'primary' },
        { name: 'insumoNroLote', label: 'Lote', type: 'text', obligatorio: true, pattern: "^[A-Za-z0-9]{0,20}$", color: 'primary' },
        { name: 'insumoMotivoDeRechazo', label: 'Motivo de rechazó', type: 'text', multi: '3', pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,250}$", color: 'secondary' },
        { name: 'insumoFechaVencimiento', label: 'Fecha Vencimiento', type: 'date', format: 'yyyy-MM-dd', color: 'primary' },
    ];

    const [alertSuccess] = useState({
        title: 'Correcto', body: 'Insumo agregado con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró agregar el Insumo, revise los datos ingresados.', severity: 'error', type: 'description'
    });

    const [alertWarning] = useState({
        title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
    });

    const classes = useStyles();
    const [proveedores, setProveedores] = useState([]);
    const [insumoProveedoresSelect, setInsumoProveedoresSelect] = useState([]);
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);
    const [checkToken, setCheckToken] = useState(false);
    const [insumoTipoSelect] = useState([
        { value: 'Aditivo', label: 'Aditivo' },
        { value: 'Otros', label: 'Otros' }
    ]);
    const [insumoUnidadSelect] = useState([
        { value: 'Kg', label: 'Kg' },
        { value: 'Metros', label: 'Metros' },
        { value: 'Litros', label: 'Litros' },
    ]);

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
            setCheckToken(false)
        }
    }, [checkToken]);

    useEffect(() => {
        const obtenerProveedores = () => {
            axios.get('/listar-proveedores', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setProveedores(response.data);
                    setInsumoProveedoresSelect(
                        response.data.map((proveedor) => ({
                            value: proveedor.proveedorId,
                            label: proveedor.proveedorNombre,
                        }))
                    );
                })
                .catch(error => {
                    if (error.request.status === 401) {
                        setCheckToken(true);
                      } else {
                        updateErrorAlert('No se logró cargar las proveedores, recargue la página.')
                        setShowAlertError(true);
                        setTimeout(() => {
                          setShowAlertError(false);
                        }, 2000);
                      }
                });
        };

        obtenerProveedores();
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

    const checkError = (nombre, fecha, cantidad, lote, fechaV) => {
        if (nombre === undefined || nombre === null || nombre === '') {
            return false;
        }
        else if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
            return false;
        }
        else if (cantidad === undefined || cantidad === null || cantidad === '') {
            return false;
        }
        else if (lote === undefined || lote === null || lote === '') {
            return false;
        }
        else if (fechaV === undefined || fechaV === null || fechaV === '' || fechaV.toString() === 'Invalid Date') {
            return false;
        }
        return true;
    }

    const checkSelects = (proveedor, tipo, unidad) => {
        if (proveedor === undefined || proveedor === null || proveedor === "Seleccionar") {
            return false;
        }
        else if (tipo === undefined || tipo === null || tipo === "Seleccionar") {
            return false;
        }
        else if (unidad === undefined || unidad === null || unidad === "Seleccionar") {
            return false;
        }
        return true;
    }

    const handleFormSubmit = (formData) => {
        const proveedorSeleccionadaObj = proveedores.filter((proveedor) => proveedor.proveedorId.toString() === formData.insumoProveedor)[0];

        const insumoConProveedor = {
            ...formData,
            insumoProveedor: proveedorSeleccionadaObj ? proveedorSeleccionadaObj : null,
            insumoResponsable: window.localStorage.getItem('user'),
        };

        const check = checkError(insumoConProveedor.insumoNombre, insumoConProveedor.insumoFecha,
            insumoConProveedor.insumoCantidad, insumoConProveedor.insumoNroLote, insumoConProveedor.insumoFechaVencimiento);

        const checkSelect = checkSelects(insumoConProveedor.insumoProveedor, insumoConProveedor.insumoTipo, insumoConProveedor.insumoUnidad);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 2500);
        } else {
            if (checkSelect === false) {
                updateErrorAlert(`Revise los datos seleccionados en el selector de Proveedor, Tipo y Unidad, no se permite dejar seleccionada la opción "Seleccionar"`);
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 3000);
            } else {
                if (insumoConProveedor.insumoFechaVencimiento <= insumoConProveedor.insumoFecha) {
                    updateErrorAlert(`La fecha de vencimiento no puede ser menor o igual a la fecha de llegada del insumo`);
                    setShowAlertError(true);
                    setTimeout(() => {
                        setShowAlertError(false);
                    }, 3000);
                } else {
                    axios.post('/agregar-control-de-insumos', insumoConProveedor, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then(response => {
                            if (response.status === 201) {
                                setShowAlertSuccess(true);
                                setTimeout(() => {
                                    setShowAlertSuccess(false);
                                }, 2500);
                            } else {
                                updateErrorAlert(`No se logró agregar el Insumo, revise los datos ingresados.`);
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
                                updateErrorAlert(`No se logró agregar el Insumo, revise los datos ingresados.`);
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

    const redirect = () => {
        navigate('/listar-control-de-insumos')
    }

    return (
        <div>
            <CssBaseline>
                <Grid>
                    <Navbar />
                    <Container style={{ marginTop: 30 }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={0}>
                                <Grid item lg={2} md={2} ></Grid>
                                <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
                                    <Typography component='h1' variant='h4'>Agregar Insumo</Typography>
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
                                                        En esta página puedes registrar los insumos que reciben, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 9 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Nombre</span>: En este campo se debe ingresar el nombre del insumo que se recibió,
                                                                este campo solo acepta palabras y números, este campo cuenta con una longitud máxima de 50 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha</span>: En este campo se debe ingresar la fecha en la que se recibió el insumo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Proveedor</span>: En este campo se selecciona el proveedor al cual se le compró el insumo/producto.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Tipo</span>: En este campo se debe seleccionar el tipo de insumo que se recibe, hay 2 tipos,
                                                                Aditivo que se refiere a los aditivos utilizados para la producción de los chacinados y Otros que se refiere a los productos de envasado, cuerdas, etc.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Cantidad</span>: En este campo se debe ingresar la cantidad que se recibió del insumo, este campo solo acepta números y cuenta con una longitud máxima de 5 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Unidad</span>: En este campo se debe seleccionar la unidad correspondiente al insumo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Lote</span>: En este campo se debe ingresar el código de lote del insumo recibido,
                                                                este campo solo acepta palabras y números, este campo cuenta con una longitud máxima de 20 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Motivo de rechazo</span>: En este campo se puede ingresar el motivo por el cual se rechazó el producto/insumo,
                                                                este campo acepta palabras minúsculas, mayúsculas y también números, el campo cuenta con una longitud máxima de 250 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha Vencimiento</span>: En este campo se debe ingresar la fecha de vencimiento del producto/insumo.
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
                                                        - Una vez registre el control el insumo, no se le redirigirá al listar. Se determinó así por si está buscando registrar otro insumo.
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
                        </Box>
                    </Container>
                    <FormularioReutilizable
                        fields={formFields}
                        onSubmit={handleFormSubmit}
                        handleRedirect={redirect}
                        selectOptions={{
                            insumoProveedor: insumoProveedoresSelect,
                            insumoTipo: insumoTipoSelect,
                            insumoUnidad: insumoUnidadSelect
                        }}
                    />
                </Grid>
            </CssBaseline>
        </div>
    );
}

export default AgregarInsumo;