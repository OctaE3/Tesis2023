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
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
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

const ModificarInsumo = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [controles, setControles] = useState({});
    const [proveedores, setProveedores] = useState([]);
    const [proveedorSelect, setProveedorSelect] = useState([]);
    const [insumoProveedor, setInsumoProveedor] = useState({});
    const insumoTipoSelect = [
        { value: 'Aditivo', label: 'Aditivo' },
        { value: 'Otros', label: 'Otros' }
    ];
    const insumoUnidadSelect = [
        { value: 'Kg', label: 'Kg' },
        { value: 'Metros', label: 'Metros' },
        { value: 'Litros', label: 'Litros' },
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
        title: 'Correcto', body: 'Insumo modificado con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logro modificar el Insumo, revise los datos ingresados.', severity: 'error', type: 'description'
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
            axios.get('/listar-control-de-insumos', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    setControles(controlesData);
                    const controlEncontrado = controlesData.find((control) => control.insumoId.toString() === id.toString());
                    if (controlEncontrado === undefined) {
                        navigate('/listar-control-de-insumos');
                    }
                    console.log(controlEncontrado)

                    const fechaControl1 = controlEncontrado.insumoFecha;
                    const fechaControl2 = controlEncontrado.insumoFechaVencimiento;
                    const fecha1 = new Date(fechaControl1);
                    const fecha2 = new Date(fechaControl2);
                    const fechaFormateada1 = fecha1.toISOString().split('T')[0];
                    const fechaFormateada2 = fecha2.toISOString().split('T')[0];

                    setInsumoProveedor({
                        value: controlEncontrado.insumoProveedor.proveedorId,
                        label: controlEncontrado.insumoProveedor.proveedorNombre,
                    });

                    const controlConFechaParseada = {
                        ...controlEncontrado,
                        insumoFecha: fechaFormateada1,
                        insumoFechaVencimiento: fechaFormateada2,
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
        }, 7000);

        return () => {
            clearInterval(blinkInterval);
        };
    }, []);

    const handleChange = event => {
        const { name, value } = event.target;
        if (name === "insumoProveedor" || name === "insumoTipo" || name === "insumoUnidad") {
            setControl(prevState => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            if (name === "insumoNombre") {
                const regex = new RegExp("^[A-Za-z0-9\\s]{0,50}$");
                if (regex.test(value)) {
                    setControl(prevState => ({
                        ...prevState,
                        [name]: value,
                    }));
                }
            }
            else if (name === "insumoCantidad") {
                const regex = new RegExp("^[0-9]{0,10}$");
                if (regex.test(value)) {
                    setControl(prevState => ({
                        ...prevState,
                        [name]: value,
                    }));
                }
            }
            else if (name === "insumoNroLote") {
                const regex = new RegExp("^[A-Za-z0-9]{0,20}$");
                if (regex.test(value)) {
                    setControl(prevState => ({
                        ...prevState,
                        [name]: value,
                    }));
                }
            }
            else if (name === "insumoMotivoDeRechazo") {
                const regex = new RegExp("^[A-Za-z0-9\\s,.]{0,250}$");
                if (regex.test(value)) {
                    setControl(prevState => ({
                        ...prevState,
                        [name]: value,
                    }));
                }
            }
        }
    }

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

    const handleFormSubmit = () => {
        const proveedorCompleto = proveedores.find((proveedor) => proveedor.proveedorId.toString() === insumoProveedor.toString());
        console.log(proveedorCompleto);
        const data = {
            ...control,
            insumoProveedor: proveedorCompleto,
        };
        console.log(data);

        const check = checkError(data.insumoNombre, data.insumoFecha,
            data.insumoCantidad, data.insumoNroLote, data.insumoFechaVencimiento);

        const checkSelect = checkSelects(data.insumoProveedor, data.insumoTipo, data.insumoUnidad);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 7000);
        } else {
            if (checkSelect) {
                updateErrorAlert(`Revise los datos seleccionados en el selector de Proveedor, Tipo y Unidad, no se permite dejar seleccionada la opción "Seleccionar"`);
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 7000);
            } else {
                axios.put(`/modificar-control-de-insumos/${id}`, data, {
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
                                navigate('/listar-control-de-insumos');
                            }, 3000)
                        } else {
                            updateErrorAlert(`No se logro modificar el Insumo, revise los datos ingresados.`);
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
                            updateErrorAlert(`No se logro modificar el Insumo, revise los datos ingresados.`);
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
                                    <Typography component='h1' variant='h4'>Modificar Insumo</Typography>
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
                                                        En esta página puedes registrar los insumos que recibe la chacinería, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 9 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Nombre</span>: en este campo se debe ingresar el nombre del insumo que se recibió.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha</span>: en este campo se debe registrar la fecha en la que se recibió el insumo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Proveedor</span>: en este campo se tendrá que seleccionar el proveedor al cual se le compró el insumo/producto.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Tipo</span>: en este campo se podrá seleccionar el tipo de insumo que se recibe, hay 2 tipos,
                                                                Aditivo que se refiere a los aditivos utilizados para la producción de los chacinados y Otros que se refiere a los productos de envasado, cuerdas, etc.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Cantidad</span>: en este campo se registrará la cantidad que se recibió del insumo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Unidad</span>: en este campo se registrará la unidad correspondiente al insumo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Lote</span>: en este campo se registrará el código de lote del insumo recibido.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Motivo de rechazó</span>: en este campo se puede ingresar el motivo por el cual se rechazó el producto/insumo recibido.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha Vencimiento</span>: en este campo se registrará la fecha de vencimiento del producto/insumo.
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
                                            label="Nombre"
                                            defaultValue="Nombre"
                                            type="text"
                                            name="insumoNombre"
                                            value={control.insumoNombre}
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
                                            label="Fecha"
                                            defaultValue={new Date()}
                                            type="date"
                                            name="insumoFecha"
                                            value={control.insumoFecha}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-insumoProveedor-native-simple`}>Proveedor *</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={insumoProveedor.value}
                                                name="insumoProveedor"
                                                label="Proveedor *"
                                                inputProps={{
                                                    name: "insumoProveedor",
                                                    id: `outlined-insumoProveedor-native-simple`,
                                                }}
                                                onChange={(e) => setInsumoProveedor(e.target.value)}
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
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-insumoTipo-native-simple`}>Tipo *</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={control.insumoTipo}
                                                name="insumoTipo"
                                                label="Tipo *"
                                                inputProps={{
                                                    name: "insumoTipo",
                                                    id: `outlined-insumoTipo-native-simple`,
                                                }}
                                                onChange={handleChange}
                                            >
                                                <option>Seleccionar</option>
                                                {insumoTipoSelect.map((option, ind) => (
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
                                            label="Cantidad"
                                            defaultValue={0}
                                            type="number"
                                            name="insumoCantidad"
                                            value={control.insumoCantidad}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-insumoUnidad-native-simple`}>Unidad *</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={control.insumoUnidad}
                                                name="insumoUnidad"
                                                label="Unidad *"
                                                inputProps={{
                                                    name: "insumoUnidad",
                                                    id: `outlined-insumoUnidad-native-simple`,
                                                }}
                                                onChange={handleChange}
                                            >
                                                <option>Seleccionar</option>
                                                {insumoUnidadSelect.map((option, ind) => (
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
                                            label="Lote"
                                            defaultValue="Lote"
                                            type="text"
                                            name="insumoNroLote"
                                            value={control.insumoNroLote}
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
                                            label="Motivo de rechazó"
                                            defaultValue="Motivo de rechazó"
                                            type="text"
                                            name="insumoMotivoDeRechazo"
                                            value={
                                                control.insumoMotivoDeRechazo ?
                                                    control.insumoMotivoDeRechazo :
                                                    ''
                                            }
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
                                            label="Fecha de Vencimiento"
                                            defaultValue={new Date()}
                                            type="date"
                                            name="insumoFechaVencimiento"
                                            value={control.insumoFechaVencimiento}
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

export default ModificarInsumo;