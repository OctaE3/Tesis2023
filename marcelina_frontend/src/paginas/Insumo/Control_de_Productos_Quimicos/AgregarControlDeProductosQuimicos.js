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

const AgregarControlDeProductosQuimicos = () => {

    const formFields = [
        { name: 'controlDeProductosQuimicosFecha', label: 'Fecha', type: 'date', color: 'primary' },
        { name: 'controlDeProductosQuimicosProveedor', label: 'Proveedor *', type: 'selector', color: 'primary' },
        { name: 'controlDeProductosQuimicosProductoQuimico', label: 'Producto Químico', type: 'text', obligatorio: true, pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s]{0,50}$", color: 'primary' },
        { name: 'controlDeProductosQuimicosLote', label: 'Lote', type: 'text', obligatorio: true, pattern: "^[A-Za-z0-9\\s]{0,15}$", color: 'primary' },
        { name: 'controlDeProductosQuimicosMotivoDeRechazo', label: 'Motivo de rechazo', type: 'text', pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,250}$", multi: '3', color: 'secondary' },
    ];

    const [alertSuccess] = useState({
        title: 'Correcto', body: 'Control de productos quimicos agregado con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró agregar el control de productos quimicos, revise los datos ingresados.', severity: 'error', type: 'description'
    });

    const [alertWarning] = useState({
        title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
    });

    const [proveedores, setProveedores] = useState([]);
    const [proveedoresSelect, setProveedoresSelect] = useState('');
    const [reloadProveedores, setReloadProveedores] = useState(false);
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);
    const [checkToken, setCheckToken] = useState(false);
    const [formKey, setFormKey] = useState(0);

    const classes = useStyles();
    const navigate = useNavigate();

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
        const obtenerProveedores = () => {
            axios.get('/listar-proveedores', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const proveedorT = response.data;
                    const proveedorNoEliminados = proveedorT.filter((proveedor) => proveedor.proveedorEliminado === false);
                    setProveedores(proveedorNoEliminados);
                    setProveedoresSelect(
                        proveedorNoEliminados.map((proveedor) => ({
                            value: proveedor.proveedorId,
                            label: proveedor.proveedorNombre,
                        }))
                    );
                })
                .catch(error => {
                    if (error.request.status === 401) {
                        setCheckToken(true);
                    } else {
                        updateErrorAlert('No se logró cargar los datos de los proveedores, recargue la página.')
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2000);
                    }
                });
        };

        obtenerProveedores();

        if (reloadProveedores) {
            obtenerProveedores();
            setReloadProveedores(false);
        }

    }, [reloadProveedores]);

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

    const checkError = (fecha, proveedor, quimico, lote) => {
        if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
            return false;
        }
        else if (proveedor === undefined || proveedor === null) {
            return false;
        }
        else if (quimico === undefined || quimico === null || quimico === '') {
            return false;
        }
        else if (lote === undefined || lote === null || lote === '') {
            return false;
        }
        return true;
    }

    const handleFormSubmit = (formData) => {
        const proveedorSeleccionadaObj = proveedores.filter((proveedor) => proveedor.proveedorId.toString() === formData.controlDeProductosQuimicosProveedor)[0];

        const quimicosConProveedor = {
            ...formData,
            controlDeProductosQuimicosProveedor: proveedorSeleccionadaObj ? proveedorSeleccionadaObj : null,
            controlDeProductosQuimicosResponsable: window.localStorage.getItem('user'),
        };

        const check = checkError(quimicosConProveedor.controlDeProductosQuimicosFecha, quimicosConProveedor.controlDeProductosQuimicosProveedor,
            quimicosConProveedor.controlDeProductosQuimicosProductoQuimico, quimicosConProveedor.controlDeProductosQuimicosLote);

        if (quimicosConProveedor.controlDeProductosQuimicosProveedor === undefined || quimicosConProveedor.controlDeProductosQuimicosProveedor === null || quimicosConProveedor.controlDeProductosQuimicosProveedor === 'Seleccionar') {
            updateErrorAlert(`Seleccione un proveedor válido, no se permite dejar seleccionada la opción de "Seleccionar".`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 2500);
        }
        else {
            if (check === false) {
                updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 2500);
            } else {
                const fechaR = new Date(quimicosConProveedor.controlDeProductosQuimicosFecha);
                fechaR.setDate(fechaR.getDate() + 1);
                const data = {
                    ...quimicosConProveedor,
                    controlDeProductosQuimicosFecha: fechaR,
                }

                axios.post('/agregar-control-de-productos-quimicos', data, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then(response => {
                        if (response.status === 201) {
                            setFormKey(prevKey => prevKey + 1);
                            setShowAlertSuccess(true);
                            setTimeout(() => {
                                setShowAlertSuccess(false);
                            }, 2500);
                            formData = {};
                        } else {
                            updateErrorAlert('No se logró agregar el control de productos quimicos, revise los datos ingresados.')
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
                            updateErrorAlert('No se logró agregar el control de productos quimicos, revise los datos ingresados.');
                            setShowAlertError(true);
                            setTimeout(() => {
                                setShowAlertError(false);
                            }, 2500);
                        }
                    })
            }
        }
    }

    const redirect = () => {
        navigate('/listar-control-de-productos-quimicos')
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
                                    <Typography component='h1' variant='h4'>Agregar Control de Productos Químicos</Typography>
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
                                                        En esta página puedes registrar los productos químicos que recibidos, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 5 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha</span>: En este campo se debe ingresar la fecha en la que se registro el control de productos químicos.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Proveedor</span>: En este campo se debe seleccionar el proveedor al que se le compro el producto químico.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Producto Químico</span>: En este campo se ingresa el producto químico que se recibió.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Lote</span>: En este campo se ingresa el código del lote del producto recibido.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Motivo de rechazo</span>: En este campo se puede ingresar el motivo por el cual se rechazó el producto químico recibido.
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
                        key={formKey}
                        onSubmit={handleFormSubmit}
                        handleRedirect={redirect}
                        selectOptions={{ controlDeProductosQuimicosProveedor: proveedoresSelect }}
                    />
                </Grid>
            </CssBaseline>
        </div>
    );
};

export default AgregarControlDeProductosQuimicos;