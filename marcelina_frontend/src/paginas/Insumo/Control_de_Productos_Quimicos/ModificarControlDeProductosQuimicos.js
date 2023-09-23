import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, CssBaseline, Dialog, IconButton, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
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

const ModificarControlDeProductosQuimicos = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [controles, setControles] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [proveedorSelect, setProveedorSelect] = useState([]);
    const [quimicoProveedor, setQuimicoProveedor] = useState({});

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const [alertSuccess, setAlertSuccess] = useState({
        title: 'Correcto', body: 'Control de productos quimicos modificado con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logro modificar el control de productos quimicos, revise los datos ingresados.', severity: 'error', type: 'description'
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
            axios.get('/listar-control-de-productos-quimicos', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    const controlEncontrado = controlesData.find((control) => control.controlDeProductosQuimicosId.toString() === id.toString());
                    if (!controlEncontrado) {
                        navigate('/listar-control-de-productos-quimicos')
                    }
                    const controlesRestantes = controlesData.filter(
                        (control) => control.controlDeProductosQuimicosId.toString() !== controlEncontrado.controlDeProductosQuimicosId.toString()
                    );
                    setControles(controlesRestantes);
                    console.log(controlEncontrado)

                    setQuimicoProveedor({
                        value: controlEncontrado.controlDeProductosQuimicosProveedor.proveedorId,
                        label: controlEncontrado.controlDeProductosQuimicosProveedor.proveedorNombre,
                    });

                    const fechaControl = controlEncontrado.controlDeProductosQuimicosFecha;
                    const fecha = new Date(fechaControl);
                    const fechaFormateada = fecha.toISOString().split('T')[0];

                    const controlConFechaParseada = {
                        ...controlEncontrado,
                        controlDeProductosQuimicosFecha: fechaFormateada,
                    }
                    console.log(controlConFechaParseada);
                    setControl(controlConFechaParseada);
                })
                .catch(error => {
                    console.error(error);
                });
        };

        const obtenerProveedores = () => {
            axios.get('/listar-proveedores', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setProveedores(response.data);
                    setProveedorSelect(
                        response.data.map((proveedor) => ({
                            value: proveedor.proveedorId,
                            label: proveedor.proveedorNombre,
                        }))
                    );

                })
                .catch(error => {
                    console.error(error);
                });
        };

        obtenerControles();
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

    const handleChange = event => {
        const { name, value } = event.target;
        if (name === "controlDeProductosQuimicosProductoQuimico") {
            const regex = new RegExp("^[A-Za-z0-9\\s]{0,50}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
        else if (name === "controlDeProductosQuimicosLote") {
            const regex = new RegExp("^[A-Za-z0-9\\s]{0,15}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
        else if (name === "controlDeProductosQuimicosMotivoDeRechazo") {
            const regex = new RegExp("^[A-Za-z0-9\\s,.]{0,250}$");
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

    const checkError = (fecha, proveedor, quimico, lote) => {
        if (fecha === undefined || fecha === null || fecha === '' || fecha === 'Invalid Date') {
            return false;
        }
        else if (proveedor === undefined || proveedor === null || proveedor === 'Seleccionar') {
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

    const handleFormSubmit = () => {
        let proveedorCompleto = '';
        if (quimicoProveedor.value) {
            proveedorCompleto = proveedores.find((proveedor) => proveedor.proveedorId.toString() === quimicoProveedor.value.toString());
        } else {
            proveedorCompleto = proveedores.find((proveedor) => proveedor.proveedorId.toString() === quimicoProveedor.toString());
        }

        const fecha = control.controlDeProductosQuimicosFecha;
        let fechaNueva = new Date(fecha);
        let fechaFormateada = '';
        fechaNueva.setDate(fechaNueva.getDate() + 1);
        console.log(fechaNueva)
        if (fechaNueva.toString() === 'Invalid Date') {
            fechaFormateada = undefined;
        }
        else {
            fechaFormateada = fechaNueva.toISOString().split('T')[0];
        }
        const data = {
            ...control,
            controlDeProductosQuimicosFecha: fechaFormateada,
            controlDeProductosQuimicosProveedor: proveedorCompleto,
        };
        console.log(data);

        const check = checkError(data.controlDeProductosQuimicosFecha, data.controlDeProductosQuimicosProveedor,
            data.controlDeProductosQuimicosProductoQuimico, data.controlDeProductosQuimicosLote);

        if (data.controlDeProductosQuimicosProveedor === null || data.controlDeProductosQuimicosProveedor === undefined || data.controlDeProductosQuimicosProveedor === "Seleccionar") {
            updateErrorAlert(`Seleccione un proveedor válido, no se permite seleccionar la opción de "Seleccionar".`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 7000);
        } else {
            if (check === false) {
                updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 7000);
            } else {
                axios.put(`/modificar-control-de-productos-quimicos/${id}`, data, {
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
                                navigate('/listar-control-de-productos-quimicos');
                            }, 3000)
                        } else {
                            updateErrorAlert('No se logro modificar el control de productos quimicos, revise los datos ingresados.')
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
                            updateErrorAlert('No se logro modificar el control de productos quimicos, revise los datos ingresados.');
                            setShowAlertError(true);
                            setTimeout(() => {
                                setShowAlertError(false);
                            }, 5000);
                        }
                    })
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
                                    <Typography component='h1' variant='h4'>Modificar Control de Productos Químicos</Typography>
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
                                                        En esta página puedes registrar los productos químicos que recibe la chacinería, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 5 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha</span>: en este campo se debe ingresar la fecha en la que se recibe el producto químico.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Proveedor</span>: en este campo se debe seleccionar el proveedor al que se le compra el producto químico.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Producto Químico</span>: en este campo se ingresa el producto químico que se recibe.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Lote</span>: este campo se ingresa el código del lote, del producto químico que se recibe.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Motivo de rechazo</span>: en este campo se puede ingresar el motivo por el cual se rechazó el producto químico recibido.
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
                                            required
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Fecha"
                                            defaultValue={new Date()}
                                            type="date"
                                            name="controlDeProductosQuimicosFecha"
                                            value={control.controlDeProductosQuimicosFecha}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-controlDeProductosQuimicosProveedor-native-simple`}>Proveedor *</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={quimicoProveedor.value}
                                                name="controlDeProductosQuimicosProveedor"
                                                label="Proveedor *"
                                                inputProps={{
                                                    name: "controlDeProductosQuimicosProveedor",
                                                    id: `outlined-controlDeProductosQuimicosProveedor-native-simple`,
                                                }}
                                                onChange={(e) => setQuimicoProveedor(e.target.value)}
                                            >
                                                <option>Seleccionar</option>
                                                {proveedorSelect.map((option, ind) => (
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
                                            required
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Producto Químico"
                                            defaultValue="Producto Químico"
                                            type="text"
                                            name="controlDeProductosQuimicosProductoQuimico"
                                            value={control.controlDeProductosQuimicosProductoQuimico}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            required
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Lote"
                                            defaultValue={0}
                                            type="text"
                                            name="controlDeProductosQuimicosLote"
                                            value={control.controlDeProductosQuimicosLote}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            minRows={3}
                                            multiline
                                            autoFocus
                                            className={classes.customOutlinedRed}
                                            InputLabelProps={{ className: classes.customLabelRed }}
                                            color="secondary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Motivo de rechazo"
                                            defaultValue="Motivo de rechazo"
                                            type="text"
                                            name="controlDeProductosQuimicosMotivoDeRechazo"
                                            value={
                                                control.controlDeProductosQuimicosMotivoDeRechazo ?
                                                    control.controlDeProductosQuimicosMotivoDeRechazo :
                                                    ''
                                            }
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

export default ModificarControlDeProductosQuimicos;