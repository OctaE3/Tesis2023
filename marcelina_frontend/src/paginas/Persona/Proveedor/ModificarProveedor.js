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
}));

const ModificarCliente = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [proveedor, setProveedor] = useState({});
    const [proveedores, setProveedores] = useState([]);
    const [proveedorLocalidad, setProveedorLocalidad] = useState({});
    const [localidades, setLocalidades] = useState({});
    const [localidadesSelect, setLocalidadesSelect] = useState([]);
    const [telefonos, setTelefonos] = useState([]);
    const [checkToken, setCheckToken] = useState(false);

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const [alertSuccess] = useState({
        title: 'Correcto', body: 'Proveedor registrado con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró registrar el proveedor, revise los datos ingresados.', severity: 'error', type: 'description'
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
        const obtenerProveedores = () => {
            axios.get('/listar-proveedores', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const proveedores = response.data;
                    setProveedores(proveedores);
                    const proveedorEncontrado = proveedores.find((proveedor) => proveedor.proveedorId.toString() === id.toString());
                    if (!proveedorEncontrado) {
                        navigate('/listar-proveedor')
                    }
                    setProveedor(proveedorEncontrado);
                    setTelefonos(
                        proveedorEncontrado.proveedorContacto.map((telefono) => ({
                            tel: telefono,
                        }))
                    );
                    setProveedorLocalidad({
                        value: proveedorEncontrado.proveedorLocalidad.localidadId,
                        label: proveedorEncontrado.proveedorLocalidad.localidadCiudad,
                    });
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
                    console.error(error);
                });
        };

        obtenerProveedores();
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
        if (name === "proveedorNombre") {
            const regex = new RegExp("^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s]{0,50}$");
            if (regex.test(value)) {
                setProveedor(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
        else if (name === "proveedorEmail") {
            const regex = new RegExp("^[A-Za-z0-9.@]{0,50}$");
            if (regex.test(value)) {
                setProveedor(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
        else if (name === "proveedorRUT") {
            const regex = new RegExp("^[0-9]{0,12}$");
            if (regex.test(value)) {
                setProveedor(prevState => ({
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
        const telefonosProveedores = [];
        if (telefonos === undefined || telefonos === null || telefonos.length === 0) {
            return true;
        } else {
            proveedores.forEach(proveedor => {
                proveedor.proveedorContacto.forEach(telefono => {
                    if (proveedor.proveedorId.toString() === id.toString()) { }
                    else {
                        telefonosProveedores.push(telefono);
                    }
                })
            })

            let telCheck = false;

            telefonosProveedores.forEach((telC) => {
                telefonos.forEach((tel) => {
                    if (telC.toString() === tel.toString()) {
                        telCheck = true;
                    }
                });
                if (telCheck) { return }
            });

            return telCheck;
        }
    }

    const checkRut = (rut) => {
        const rutProveedores = [];
        proveedores.forEach(proveedor => {
            if (proveedor.proveedorId.toString() === id.toString()) { }
            else {
                rutProveedores.push(proveedor.proveedorRUT);
            }
        })

        const rutEncontrado = rutProveedores.includes(rut);
        return rutEncontrado;
    }

    const checkEmail = (email) => {
        if (email) {
            const emailProveedores = [];
            proveedores.forEach(proveedor => {
                if (proveedor.proveedorId.toString() === id.toString()) { }
                else {
                    if (proveedor.proveedorEmail !== undefined && proveedor.proveedorEmail !== null && proveedor.proveedorEmail !== '') {
                        emailProveedores.push(proveedor.proveedorEmail);
                    }
                }
            })

            const emailEncontrado = emailProveedores.includes(email);
            return emailEncontrado;
        }
    }

    const checkError = (nombre, rut, email, localidad) => {
        if (nombre === undefined || nombre === null || nombre === '') {
            return false;
        }

        if (rut === undefined || rut === null || rut === '') { return false }
        else {
            const regex = /^\d{1,12}$/;
            if (regex.test(rut)) { }
            else { return false; }
        }

        if (email) {
            if (email === undefined || email === null || email === '') { return false }
            else {
                if (!email.includes(".") && !email.includes("@")) {
                    return false;
                } else { }
            }
        }

        if (localidad === undefined || localidad === null || localidad === 'Seleccionar') {
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
                    if (parseInt(primerNum) === 0 && longitud === 9 || (parseInt(primerNum) === 4 && longitud === 8)) { }
                    else { resp = false }
                }
                else { resp = false }
            })
            return resp;
        }
    }

    const handleFormSubmit = () => {
        const localidadCompleta = localidades.find((localidad) => localidad.localidadId.toString() === proveedorLocalidad.value.toString());
        const telefonosStrings = [];
        telefonos.forEach((telefono) => {
            telefonosStrings.push(telefono.tel);
        })
        const data = {
            ...proveedor,
            proveedorContacto: telefonosStrings,
            proveedorLocalidad: localidadCompleta,
        };

        const nombre = data.proveedorNombre;
        const rut = data.proveedorRUT;
        const email = data.proveedorEmail;
        const localidad = data.proveedorLocalidad;

        const check = checkError(nombre, rut, email, localidad);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 2500);
        } else {
            if (localidadCompleta !== undefined || proveedorLocalidad !== "Seleccionar") {
                const telefonoCheck = checkTelefono(data.proveedorContacto);
                const rutCheck = checkRut(data.proveedorRUT);
                const emailCheck = checkEmail(data.proveedorEmail);
                const telefonoCheckError = checkErrorTelefono(data.proveedorContacto);
                if (email) {
                    const regex = /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (regex.test(email)) {
                        if (telefonoCheckError === false) {
                            updateErrorAlert(`Los teléfonos ingresados tienen que empezar con el número 0 y tener una longitud de 9 digitos, en caso de agregar otro campo de contacto, no lo deje vacío.`);
                            setShowAlertError(true);
                            setTimeout(() => {
                                setShowAlertError(false);
                            }, 3000);
                        } else {
                            if (telefonoCheck === false && rutCheck === false && emailCheck === false) {
                                axios.put(`/modificar-proveedor/${id}`, data, {
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
                                                navigate('/listar-proveedor');
                                            }, 3000)
                                        } else {
                                            updateErrorAlert('No se logró modificar el proveedor, revise los datos ingresados.')
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
                                            updateErrorAlert('No se logró modificar el proveedor, revise los datos ingresados.');
                                            setShowAlertError(true);
                                            setTimeout(() => {
                                                setShowAlertError(false);
                                            }, 2500);
                                        }
                                    })
                            } else {
                                updateErrorAlert('Revise los datos ingresados, no puede coincidir el email, el codigo rut o los teléfonos, con los proveedores ya registrados.');
                                setShowAlertError(true);
                                setTimeout(() => {
                                    setShowAlertError(false);
                                }, 3000);
                            }
                        }
                    } else {
                        updateErrorAlert(`El mail ingresado no es válido.`);
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2000);
                    }
                } else {
                    if (telefonoCheckError === false) {
                        updateErrorAlert(`Los teléfonos ingresados tienen que empezar con el número 0 y tener una longitud de 9 digitos, en caso de agregar otro campo de contacto, no lo deje vacío.`);
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 3000);
                    } else {
                        if (telefonoCheck === false && rutCheck === false) {
                            const dataMod = {
                                ...data,
                                proveedorEmail: null,
                            }
                            axios.put(`/modificar-proveedor/${id}`, dataMod, {
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
                                            navigate('/listar-proveedor');
                                        }, 2500)
                                    } else {
                                        updateErrorAlert('No se logró modificar el proveedor, revise los datos ingresados.')
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
                                        updateErrorAlert('No se logró modificar el proveedor, revise los datos ingresados.');
                                        setShowAlertError(true);
                                        setTimeout(() => {
                                            setShowAlertError(false);
                                        }, 2500);
                                    }
                                })
                        } else {
                            updateErrorAlert('Revise los datos ingresados, no puede coincidir el codigo rut o los teléfonos, con los proveedores ya registrados.');
                            setShowAlertError(true);
                            setTimeout(() => {
                                setShowAlertError(false);
                            }, 3000);
                        }
                    }
                }
            } else {
                updateErrorAlert(`Seleccione una localidad válida.`);
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 5000);
            }
        }
    };

    const redirect = () => {
        navigate('/listar-proveedor')
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
                                    <Typography component='h1' variant='h4'>Modificar Proveedor</Typography>
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
                                                        En esta página puede modificar un proveedor, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 5 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Nombre</span>: en este campo se debe ingresar el nombre de la empresa o del proveedor,
                                                                este campo solo acepta palabras y números, a su vez cuenta con una longitud máxima de 40 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>RUT</span>: en este campo se debe ingresar el código RUT por el cual se identifica el proveedor,
                                                                este campo solo acepta números, a su vez cuenta con una longitud máxima de 12 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Email</span>: en este campo se debe ingresar el mail del proveedor,
                                                                este campo solo acepta palabras, números, arroba y punto, a su vez cuenta con un máximo de 50 caracteres..
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Contacto</span>: en este campo se ingresa el número de teléfono del proveedor,
                                                                en caso de que tenga mas de un teléfono, se puede agregar mas al darle click al icono de mas a la derecha del campo
                                                                y si desea eliminar el campo, consta en darle click a la X a la derecha del campo generado, los campos de teléfono aceptan solo números y
                                                                cuentan con una longitud máxima de 9 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Observaciones</span>: en este campo se pueden registrar las observaciones o detalles necesarios del proveedor.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Localidad</span>: en este campo se puede seleccionar la localidad en donde esta ubicado el proveedor o su empresa,
                                                                en caso de querer añadir una localidad nueva, es posible dandole al icono de más a la derecha del campo.
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
                                            InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Nombre"
                                            type="text"
                                            name="proveedorNombre"
                                            value={proveedor.proveedorNombre}
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
                                            label="RUT"
                                            type="text"
                                            name="proveedorRUT"
                                            value={proveedor.proveedorRUT}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            className={classes.customOutlinedRed}
                                            InputLabelProps={{ className: classes.customLabelRed, shrink: true }}
                                            color="secondary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Email"
                                            type="email"
                                            name="proveedorEmail"
                                            value={proveedor.proveedorEmail}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
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
                                                InputLabelProps={{ className: classes.customLabelBlue, shrink: true }}
                                                color="primary"
                                                margin="normal"
                                                variant="outlined"
                                                label={`Teléfono ${index + 1}`}
                                                type="text"
                                                name={`proveedorContacto-${index}`}
                                                value={telefono.tel || ''}
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
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-localidad-native-simple`}>Localidad</InputLabel>
                                        <Select
                                            className={classes.select}
                                            native
                                            value={proveedorLocalidad.value}
                                            label="Localidad"
                                            inputProps={{
                                                name: "proveedorLocalidad",
                                                id: `outlined-localidad-native-simple`,
                                            }}
                                            onChange={(e) => setProveedorLocalidad({
                                                value: e.targer.value
                                            })}
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
                </Grid >
            </CssBaseline >
        </div >
    );
};

export default ModificarCliente;