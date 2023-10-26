import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, CssBaseline, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
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

const ModificarControlDeNitrato = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [ultimoNitratoDisabled, setUltimoNitratoDisabled] = useState(true);
    const [nitratoStock, setNitratoStock] = useState('');
    const [checkToken, setCheckToken] = useState(false);
    const [lotes, setLotes] = useState([]);
    const [loteSeleccionado, setLoteSeleccionado] = useState('');
    const [loteSelect, setLoteSelect] = useState([]);
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const [alertSuccess] = useState({
        title: 'Correcto', body: 'Control de nitrato agregado con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró agregar el control de nitrato, revise los datos ingresados.', severity: 'error', type: 'description'
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
            axios.get('/listar-control-de-nitrato', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    const lastNitrato = response.data[0];
                    const controlEncontrado = controlesData.find((control) => control.controlDeNitratoId.toString() === id.toString());
                    if (!controlEncontrado) {
                        navigate('/listar-control-de-nitratos')
                    }
                    const controlesRestantes = controlesData.filter(
                        (control) => control.controlDeNitratoId.toString() !== controlEncontrado.controlDeNitratoId.toString()
                    );
                    if (lastNitrato.controlDeNitratoId.toString() === controlEncontrado.controlDeNitratoId.toString()) {
                        setUltimoNitratoDisabled(false);
                    }
                    setNitratoStock(controlEncontrado.controlDeNitratoStock + controlEncontrado.controlDeNitratoCantidadUtilizada);
                    const fechaControl = controlEncontrado.controlDeNitratoFecha;
                    const fecha = new Date(fechaControl);
                    const fechaFormateada = fecha.toISOString().split('T')[0];

                    const controlConFechaParseada = {
                        ...controlEncontrado,
                        controlDeNitratoFecha: fechaFormateada,
                        controlDeNitratoStock: controlEncontrado.controlDeNitratoStock + controlEncontrado.controlDeNitratoCantidadUtilizada,
                    }

                    setLoteSeleccionado({
                        value: controlEncontrado.controlDeNitratoProductoLote.loteId,
                        label: `${controlEncontrado.controlDeNitratoProductoLote.loteCodigo} - ${controlEncontrado.controlDeNitratoProductoLote.loteProducto.productoNombre}`
                    })

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

        const obtenerLotes = () => {
            axios.get('/listar-lotes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    if (response.data.length > 0) {
                        const data = response.data.map(lote => {
                            if (lote.loteEliminado === false) {
                                return lote;
                            }
                        })
                        const dataSinUndefined = data.filter(data => data !== undefined);
                        setLotes(dataSinUndefined);
                        setLoteSelect(
                            dataSinUndefined.map((lote) => ({
                                value: lote.loteId,
                                label: `${lote.loteCodigo} - ${lote.loteProducto.productoNombre}`
                            }))
                        )
                    }
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

        obtenerControles();
        obtenerLotes();
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
        if (name === "controlDeNitratoProductoLote") {
            const regex = new RegExp("^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ]{0,20}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
        else if (name === "controlDeNitratoCantidadUtilizada") {
            const regex = new RegExp("^[0-9]{0,10}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
        else if (name === "controlDeNitratoStock") {
            const regex = new RegExp("^[0-9]{0,10}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
        else if (name === "controlDeNitratoObservaciones") {
            const regex = new RegExp("^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,250}$");
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

    const checkError = (fecha, lote, cantidad, stock) => {
        if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
            return false;
        }
        else if (lote === undefined || lote === null || lote === 'Seleccionar' || lote === '') {
            return false;
        }
        else if (cantidad === undefined || cantidad === null || cantidad === '') {
            return false;
        }
        else if (stock === undefined || stock === null || stock === '' || parseInt(stock) === 0) {
            return false;
        }
        return true;
    }

    const handleFormSubmit = () => {
        const data = control;
        const check = checkError(data.controlDeNitratoFecha, data.controlDeNitratoProductoLote,
            data.controlDeNitratoCantidadUtilizada, data.controlDeNitratoStock);

        if (parseInt(data.controlDeNitratoStock) < parseInt(data.controlDeNitratoCantidadUtilizada) || parseInt(data.controlDeNitratoCantidadUtilizada) === 0) {
            updateErrorAlert(`La cantidad utilizada no puede ser 0 o mayor al stock y tampoco se permite dejar el stock vacío.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 2500);
        } else {
            if (check === false) {
                updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 2500);
            } else {
                const loteCompleto = lotes.find((lote) => lote.loteId.toString() === loteSeleccionado.value.toString());

                const dataMod = {
                    ...data,
                    controlDeNitratoProductoLote: loteCompleto,
                    controlDeNitratoStock: data.controlDeNitratoStock - data.controlDeNitratoCantidadUtilizada,
                }
                axios.put(`/modificar-control-de-nitrato/${id}`, dataMod, {
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
                                navigate('/listar-control-de-nitratos');
                            }, 2500)
                        } else {
                            updateErrorAlert('No se logró modificar el control de nitrato, revise los datos ingresados.')
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
                            updateErrorAlert('No se logró modificar el control de nitrato, revise los datos ingresados.');
                            setShowAlertError(true);
                            setTimeout(() => {
                                setShowAlertError(false);
                            }, 2500);
                        }
                    })
            }
        }
    };

    const redirect = () => {
        navigate('/listar-control-de-nitratos')
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
                                    <Typography component='h1' variant='h4'>Modificar Control de Nitrato</Typography>
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
                                                        En esta página puedes modificar un control de nitrato, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 5 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha</span>: En este campo se debe ingresar la fecha en la que se le registro el control de nitrato.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Producto/Lote</span>: En este campo se debe ingresar el producto/lote al que se le agrego el nitrato,
                                                                este campos solo acepta palabras minúsculas, mayúsculas y números, a su vez cuenta con un máximo de 20 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Cantidad Utilizada</span>: En este campo se especifica la cantidad utilizada de nitrato en el producto/lote,
                                                                este campos solo acepta números y cuenta con un máximo de 10 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Stock</span>: En este campo solo se puede modificar el valor si es el último control de nitrato que se registro, en caso contrario no se podra modificar el valor del stock.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Observaciones</span>: En este campo se pueden registrar las observaciones o detalles necesarios que se encontraron al momento de agregar el nitrato al producto/lote,
                                                                este campo solo acepta palabras minúsculas, mayúsculas y números, a su vez cuenta con un máximo de 250 caracteres.
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
                                                            <li>Solo se podrá modificar el campo de stock si es el último registro agregado.</li>
                                                            <li>En caso de que se este modificando el último registro, el campo de stock solo aceptara números y contará con una longitud de 10 caracteres.</li>
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
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Fecha"
                                            type="date"
                                            name="controlDeNitratoFecha"
                                            value={control.controlDeNitratoFecha}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-controlDeNitratoProductoLote-native-simple`}>Lote</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={loteSeleccionado.value}
                                                name="controlDeNitratoProductoLote"
                                                label="Lote"
                                                inputProps={{
                                                    name: "controlDeNitratoProductoLote",
                                                    id: `outlined-controlDeNitratoProductoLote-native-simple`,
                                                }}
                                                onChange={(e) => setLoteSeleccionado({
                                                    value: e.target.value
                                                })}
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
                                            required
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Cantidad Utilizada"
                                            type="text"
                                            name="controlDeNitratoCantidadUtilizada"
                                            value={control.controlDeNitratoCantidadUtilizada}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            required
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Stock"
                                            type="number"
                                            name="controlDeNitratoStock"
                                            value={control.controlDeNitratoStock}
                                            onChange={handleChange}
                                            disabled={ultimoNitratoDisabled}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            minRows={3}
                                            multiline
                                            autoFocus
                                            className={classes.customOutlinedRed}
                                            InputLabelProps={{ className: classes.customLabelRed, shrink: true }}
                                            color="secondary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Observaciones"
                                            type="text"
                                            name="controlDeNitratoObservaciones"
                                            value={
                                                control.controlDeNitratoObservaciones ?
                                                    control.controlDeNitratoObservaciones :
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

export default ModificarControlDeNitrato;