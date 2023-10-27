import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, CssBaseline, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
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
    addButton: {
        justifyContent: 'flex-start',
        marginTop: theme.spacing(0.5),
    },
    iconButton: {
        minWidth: '50px',
    },
}));

const ModificarCliente = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [cliente, setCliente] = useState({});
    const [clientes, setClientes] = useState({});
    const [clienteLocalidad, setClienteLocalidad] = useState({});
    const [localidades, setLocalidades] = useState({});
    const [localidadesSelect, setLocalidadesSelect] = useState([]);
    const [telefonos, setTelefonos] = useState([]);

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);
    const [checkToken, setCheckToken] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const [alertSuccess] = useState({
        title: 'Correcto', body: 'Cliente modificado con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró modificar el cliente, revise los datos ingresados.', severity: 'error', type: 'description'
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
        const obtenerClientes = () => {
            axios.get('/listar-clientes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const clientes = response.data;
                    setClientes(clientes);
                    const clienteEncontrado = clientes.find((cliente) => cliente.clienteId.toString() === id.toString());
                    if (!clienteEncontrado) {
                        navigate('/listar-cliente');
                    }
                    setCliente(clienteEncontrado);
                    setTelefonos(
                        clienteEncontrado.clienteContacto.map((tel) => ({
                            tel: tel,
                        }))
                    );
                    setClienteLocalidad({
                        value: clienteEncontrado.clienteLocalidad.localidadId,
                        label: clienteEncontrado.clienteLocalidad.localidadCiudad,
                    });
                })
                .catch(error => {
                    if (error.request.status === 401) {
                        setCheckToken(true);
                    } else {
                        updateErrorAlert('No se logró cargar los datos del registro, intente nuevamente.')
                        setShowAlertError(true);
                        setTimeout(() => {
                            redirect()
                            setShowAlertError(false);
                        }, 2000);
                    }
                });
        };

        const obtenerLocalidades = () => {
            axios.get('/listar-localidades', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const localidadesT = response.data;
                    const localidadesNoEliminadas = localidadesT.filter((localidad) => localidad.localidadEliminado === false);
                    setLocalidades(localidadesNoEliminadas);
                    setLocalidadesSelect(
                        localidadesNoEliminadas.map((localidad) => ({
                            value: localidad.localidadId,
                            label: localidad.localidadCiudad,
                        }))
                    );
                })
                .catch(error => {
                    if (error.request.status === 401) {
                        setCheckToken(true);
                    } else {
                        updateErrorAlert('No se logró cargar las localidades, recargue la p[agina].')
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2000);
                    }
                });
        };

        obtenerClientes();
        obtenerLocalidades();
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
        if (name === "clienteNombre") {
            const regex = new RegExp("^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s]{0,50}$");
            if (regex.test(value)) {
                setCliente(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
        else if (name === "clienteEmail") {
            const regex = new RegExp("^[A-Za-z0-9.@]{0,50}$");
            if (regex.test(value)) {
                setCliente(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
        else if (name === "clienteObservaciones") {
            const regex = new RegExp("^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,250}$");
            if (regex.test(value)) {
                setCliente(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
    }

    const handleChangeTelefono = (index, telefono) => {
        const regex = new RegExp("^[0-9]{0,9}$");

        if (regex.test(telefono)) {
            setTelefonos(prevTelefonos => {
                const nuevosTelefonos = [...prevTelefonos];
                nuevosTelefonos[index] = { tel: telefono };
                return nuevosTelefonos;
            });
        }
    }

    const handleAddTelefono = async () => {
        setTelefonos([...telefonos, { tel: "" }]);
    };

    const handleRemoveTelefono = (index) => {
        const nuevosTelefonos = [...telefonos];
        nuevosTelefonos.splice(index, 1);

        setTelefonos(nuevosTelefonos);
    };

    const checkTelefono = (telefonos) => {
        const telefonosClientes = [];
        if (telefonos === undefined || telefonos === null || telefonos.length === 0) {
            return false;
        } else {
            clientes.forEach(cliente => {
                cliente.clienteContacto.forEach(telefono => {
                    if (cliente.clienteId.toString() === id.toString()) { }
                    else {
                        telefonosClientes.push(telefono);
                    }
                })
            })

            let telCheck = false;

            telefonosClientes.forEach((telC) => {
                telefonos.forEach((tel) => {
                    if (telC.toString() === tel.toString()) {
                        telCheck = true;
                    }
                });
                if (telCheck) {
                    return;
                }
            });

            return telCheck;
        }
    }

    const checkEmail = (email) => {
        if (email) {
            const emailClientes = [];
            clientes.forEach(cliente => {
                if (cliente.clienteId.toString() === id.toString()) { }
                else {
                    if (cliente.clienteEmail !== undefined && cliente.clienteEmail !== null && cliente.clienteEmail !== '') {
                        emailClientes.push(cliente.clienteEmail);
                    }
                }
            })


            const emailEncontrado = emailClientes.includes(email);
            return emailEncontrado;
        }
    }

    const checkError = (nombre, email, localidad) => {
        if (nombre === undefined || nombre === null || nombre === '') {
            return false;
        }

        if (email) {
            if (email === undefined || email === null || email === '') { }
            else {
                if (!email.includes(".") && !email.includes("@")) {
                    return false;
                }
            }
        }

        if (localidad === undefined || localidad === null || localidad === "Seleccionar") {
            return false;
        }
        return true;
    }

    const checkErrorTelefono = (telefonos) => {
        let resp = true;
        if (telefonos === undefined || telefonos === null || telefonos.length === 0) {
            return false;
        } else {
            const regex = /^\d{8,9}$/;
            telefonos.forEach((tel) => {
                if (regex.test(tel)) {
                    const primerNum = tel[0];
                    const longitud = tel.length;
                    if (parseInt(primerNum) === 0 && parseInt(longitud) === 9 || parseInt(primerNum) === 4 && parseInt(longitud) === 8) { }
                    else { resp = false }
                }
                else { resp = false }
            })
        }
        return resp;
    }

    const handleFormSubmit = () => {
        const localidadValue = clienteLocalidad === "Seleccionar" ? "Seleccionar" : clienteLocalidad.value;
        const localidadCompleta = localidades.find((localidad) => localidad.localidadId.toString() === localidadValue.toString());

        const telefonosStrings = [];
        telefonos.forEach((telefono) => {
            telefonosStrings.push(telefono.tel);
        })

        const data = {
            ...cliente,
            clienteEmail: !cliente.clienteEmail || cliente.clienteEmail === '' ? '' : cliente.clienteEmail,
            clienteContacto: telefonosStrings,
            clienteLocalidad: localidadCompleta,
        };

        const check = checkError(data.clienteNombre, data.clienteEmail, data.clienteLocalidad);
        const telefonoCheck = checkTelefono(data.clienteContacto);
        const emailCheck = checkEmail(data.clienteEmail);
        const telefonoErrorCheck = checkErrorTelefono(data.clienteContacto);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados en cliente y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 2500);
        } else {
            if (telefonoErrorCheck === false) {
                updateErrorAlert(`Los teléfonos ingresados tienen que empezar con el número 0 y tener una longitud de 9 digitos, en caso de agregar otro campo de contacto, no lo deje vacío.`);
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 3000);
            } else {
                if (data.clienteEmail && data.clienteEmail !== '' && data.clienteEmail !== undefined && data.clienteEmail !== null) {
                    const regex = /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (regex.test(data.clienteEmail)) {
                        if (telefonoCheck === false && emailCheck === false) {
                            axios.put(`/modificar-cliente/${id}`, data, {
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
                                            navigate('/listar-cliente');
                                        }, 2500)
                                    } else {
                                        updateErrorAlert('No se logró modificar el cliente, revise los datos ingresados.')
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
                                        updateErrorAlert('No se logró registrar el cliente, revise los datos ingresados.');
                                        setShowAlertError(true);
                                        setTimeout(() => {
                                            setShowAlertError(false);
                                        }, 2500);
                                    }
                                })
                        } else {
                            updateErrorAlert(`Revise los datos ingresados, no puede coincidir el email o los teléfonos, con los clientes ya registrados.`);
                            setShowAlertError(true);
                            setTimeout(() => {
                                setShowAlertError(false);
                            }, 3000);
                        }
                    } else {
                        updateErrorAlert(`El mail ingresado no es válido.`);
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2500);
                    }
                } else {
                    if (telefonoCheck === false) {
                        const dataMod = {
                            ...data,
                            clienteEmail: '',
                        }
                        axios.put(`/modificar-cliente/${id}`, dataMod, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                "Content-Type": "application/json"
                            }
                        })
                            .then(response => {
                                if (response.status === 200) {
                                    setShowAlertSuccess(true);
                                    setTimeout(() => {
                                        navigate('/listar-cliente');
                                        setShowAlertSuccess(false);
                                    }, 2500);
                                } else {
                                    updateErrorAlert('No se logró modificar el cliente, revise los datos ingresados.')
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
                                    updateErrorAlert('No se logró registrar el cliente, revise los datos ingresados.');
                                    setShowAlertError(true);
                                    setTimeout(() => {
                                        setShowAlertError(false);
                                    }, 2500);
                                }
                            })
                    } else {
                        updateErrorAlert(`Revise los datos ingresados, no puede coincidir los teléfonos, con los clientes ya registrados.`);
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 7000);
                    }
                }
            }
        }
    };

    const redirect = () => {
        navigate('/listar-cliente')
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
                                    <Typography component='h1' variant='h4'>Modificar Cliente</Typography>
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
                                                        En esta página puedes modificar un cliente, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 5 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Nombre</span>: En este campo se debe ingresar el nombre de la empresa o del cliente,
                                                                este campo acepta palabras y número, a su vez cuenta con una longitud máxima de 50 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Email</span>: En este campo se debe ingresar el mail del cliente,
                                                                este campo solo acepta palabras, números, arroba y punto.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Contacto</span>: En este campo se ingresa el número de teléfono del cliente,
                                                                en caso de que tenga más de un teléfono, se puede agregar más al darle click al icono de más a la derecha del campo
                                                                y si desea eliminar el campo, consta en darle click a la X a la derecha del campo generado,
                                                                los campos de teléfono aceptan solo números y cuentan con una longitud máxima de 9 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Observaciones</span>: En este campo se pueden registrar las observaciones o detalles necesarios del cliente,
                                                                este campo acepta palabras y números, a su vez cuenta con una longitud máxima de 250 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Localidad</span>: En este campo se debe seleccionar la localidad en donde esta ubicado el cliente o su empresa.
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
                                                            <li>Solo modifiqué los campos que necesite.</li>
                                                            <li>No se acepta que los campos con contorno azul se dejen vacíos.</li>
                                                            <li>En el campo de teléfono también se acepta números de teléfono fijo, en caso de que quiera agregar un teléfono fijo ingréselo todo junto.</li>
                                                            <li>En el modificar también se pueden agregar o sacar teléfonos.</li>
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
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true, }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Nombre"
                                            type="text"
                                            name="clienteNombre"
                                            value={cliente.clienteNombre}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            className={classes.customOutlinedRed}
                                            InputLabelProps={{ className: classes.customLabelRed, shrink: true, }}
                                            color="secondary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Email"
                                            type="email"
                                            name="clienteEmail"
                                            value={cliente.clienteEmail}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                </Grid>
                            </Grid>
                            {telefonos.map((telefono, index) => (
                                <Grid
                                    container
                                    justifyContent='flex-start'
                                    alignItems="center"
                                    key={index}>
                                    <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                    <Grid item lg={8} md={8} sm={8} xs={8}>
                                        <Grid item lg={12} md={12} sm={12} xs={12} key={index}>
                                            <TextField
                                                fullWidth
                                                autoFocus
                                                className={classes.customOutlinedBlue}
                                                InputLabelProps={{ className: classes.customLabelBlue, shrink: true, }}
                                                color="primary"
                                                margin="normal"
                                                variant="outlined"
                                                label={`Teléfono ${index + 1}`}
                                                type="text"
                                                name={`clienteContacto-${index}`}
                                                value={telefono.tel}
                                                onChange={(e) => handleChangeTelefono(index, e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        {index === 0 && (
                                            <Grid className={`${classes.addButton} align-left`}>
                                                <Button className={classes.iconButton} onClick={handleAddTelefono}>
                                                    <AddIcon color='primary' fontSize='large' />
                                                </Button>
                                            </Grid>
                                        )}

                                        {index !== 0 && (
                                            <Grid className={`${classes.addButton} align-left`}>
                                                <Button className={classes.iconButton} onClick={() => handleRemoveTelefono(index)}>
                                                    <CloseIcon color='primary' fontSize='large' />
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            ))}
                            <Grid container>
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            minRows={3}
                                            multiline
                                            autoFocus
                                            className={classes.customOutlinedRed}
                                            InputLabelProps={{ className: classes.customLabelRed, shrink: true, }}
                                            color="secondary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Observaciones"
                                            type="text"
                                            name="clienteObservaciones"
                                            value={cliente.clienteObservaciones ? cliente.clienteObservaciones : ''}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-localidad-native-simple`}>Localidad</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={clienteLocalidad.value}
                                                label="Localidad"
                                                inputProps={{
                                                    name: "clienteLocalidad",
                                                    id: `outlined-localidad-native-simple`,
                                                }}
                                                onChange={(e) => setClienteLocalidad({ value: e.target.value })}
                                            >
                                                <option>Seleccionar</option>
                                                {localidadesSelect.map((option, ind) => (
                                                    <option key={ind} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
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
        </div >
    );
};

export default ModificarCliente;