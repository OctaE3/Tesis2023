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

const AgregarProveedor = () => {

    const formFieldsModal = [
        { name: 'localidadDepartamento', label: 'Departamento', type: 'text', obligatorio: true, pattern: "^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\\s]{0,40}$", color: 'primary' },
        { name: 'localidadCiudad', label: 'Ciudad', obligatorio: true, pattern: "^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\\s]{0,40}$", type: 'text', color: 'primary' },
    ];

    const formFields = [
        { name: 'proveedorNombre', label: 'Nombre', type: 'text', obligatorio: true, pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s]{0,40}$", color: 'primary' },
        { name: 'proveedorRUT', label: 'RUT', type: 'text', obligatorio: true, pattern: "^[0-9]{0,12}$", color: 'primary' },
        { name: 'proveedorEmail', label: 'Email', type: 'email', pattern: "^[A-Za-z0-9.@]{0,50}$", color: 'secondary' },
        { name: 'proveedorContacto', label: 'Contacto', type: 'phone', obligatorio: true, pattern: "^[0-9]{0,9}$", color: 'primary' },
        { name: 'proveedorLocalidad', label: 'Localidad *', type: 'selector', alta: 'si', altaCampos: formFieldsModal, color: 'primary' },
    ];

    const [alertSuccess, setAlertSuccess] = useState({
        title: 'Correcto', body: 'Proveedor registrado con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró registrar el proveedor, revise los datos ingresados.', severity: 'error', type: 'description'
    });

    const [alertWarning] = useState({
        title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
    });

    const navigate = useNavigate();
    const [proveedores, setProveedores] = useState({});
    const [localidades, setLocalidades] = useState([]);
    const [localidadesSelect, setLocalidadesSelect] = useState('');
    const [reloadLocalidades, setReloadLocalidades] = useState(false);
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);
    const [checkToken, setCheckToken] = useState(false);
    const [formKey, setFormKey] = useState(0);
    const [formKeyModal, setFormKeyModal] = useState(0);

    const classes = useStyles();

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
                    setProveedores(response.data);
                })
                .catch(error => {
                    if (error.request.status === 401) {
                        setCheckToken(true);
                    } else {
                        updateErrorAlert('No se logró cargar los proveedores, recargue la página.')
                        setShowAlertError(true);
                        setTimeout(() => {
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
                        updateErrorAlert('No se logró cargar las localidades, recargue la página.')
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2000);
                    }
                });
        };

        obtenerProveedores();
        obtenerLocalidades();

        if (reloadLocalidades) {
            obtenerProveedores();
            obtenerLocalidades();
            setReloadLocalidades(false);
        }

    }, [reloadLocalidades]);

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

    const updateSuccessAlert = (newBody) => {
        setAlertSuccess((prevAlert) => ({
            ...prevAlert,
            body: newBody,
        }));
    };

    const checkRut = (rut) => {
        const rutProveedores = [];
        proveedores.forEach(proveedor => {
            rutProveedores.push(proveedor.proveedorRUT);
        })
        const rutEncontrado = rutProveedores.includes(rut);
        return rutEncontrado;
    }

    const checkTelefono = (telefonos) => {
        const telefonosProveedores = [];
        if (telefonos === undefined || telefonos === null || telefonos.length === 0) {
            return true;
        } else {
            proveedores.forEach(proveedor => {
                proveedor.proveedorContacto.forEach(telefono => {
                    telefonosProveedores.push(telefono);
                })
            })

            let telCheck = false;

            telefonosProveedores.forEach((telP) => {
                telefonos.forEach((tel) => {
                    if (telP.toString() === tel.telefono.toString()) {
                        telCheck = true;
                    }
                });
                if (telCheck) { return; }
            });
            return telCheck;
        }
    }

    const checkEmail = (email) => {
        if (email) {
            const emailProveedores = [];
            proveedores.forEach(proveedor => {
                if (proveedor.proveedorEmail !== null && proveedor.proveedorEmail !== '') {
                    emailProveedores.push(proveedor.proveedorEmail);
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
                if (regex.test(tel.telefono)) {
                    const primerNum = tel.telefono[0];
                    const longitud = tel.telefono.length;
                    if (parseInt(primerNum) === 0 && parseInt(longitud) === 9 || parseInt(primerNum) === 4 && parseInt(longitud) === 8) { }
                    else { resp = false }
                }
                else { resp = false }
            })
        }
        return resp;
    }

    const handleFormSubmit = (formData, telefonos) => {
        const localidadSeleccionadaObj = localidades.filter((localidad) => localidad.localidadId.toString() === formData.proveedorLocalidad)[0];

        const proveedorConLocalidad = {
            ...formData,
            proveedorContacto: telefonos,
            proveedorLocalidad: localidadSeleccionadaObj ? localidadSeleccionadaObj : null
        };

        const nombre = proveedorConLocalidad.proveedorNombre;
        const rut = proveedorConLocalidad.proveedorRUT;
        const email = !proveedorConLocalidad.proveedorEmail || proveedorConLocalidad.proveedorEmail === '' ? undefined : proveedorConLocalidad.proveedorEmail;
        const tel = proveedorConLocalidad.proveedorContacto;
        const localidad = proveedorConLocalidad.proveedorConLocalidad;

        const check = checkError(nombre, rut, email, tel, localidad);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados en proveedor y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 2500);
        } else {
            if (proveedorConLocalidad.proveedorLocalidad === undefined || proveedorConLocalidad.proveedorConLocalidad === 'Seleccionar') {
                updateErrorAlert(`Seleccione una localidad válida.`);
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 2000);
            } else {
                const telefonoCheckError = checkErrorTelefono(tel);
                if (telefonoCheckError === false) {
                    updateErrorAlert(`Los teléfonos ingresados tienen que empezar con el número 0 y tener una longitud de 9 digitos, en caso de agregar otro campo de contacto, no lo deje vacío.`);
                    setShowAlertError(true);
                    setTimeout(() => {
                        setShowAlertError(false);
                    }, 3000);
                } else {
                    if (email) {
                        const regex = /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (regex.test(email)) {
                            const rutCheck = checkRut(rut);
                            const emailCheck = checkEmail(email);
                            const telefonoCheck = checkTelefono(tel);

                            if (telefonoCheck === false && emailCheck === false && rutCheck === false) {
                                const telefonosConvertidos = proveedorConLocalidad.proveedorContacto.map((tel) => tel.telefono);
                                const data = {
                                    ...proveedorConLocalidad,
                                    proveedorContacto: telefonosConvertidos,
                                }
                                axios.post('/agregar-proveedor', data, {
                                    headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                                    }
                                })
                                    .then(response => {
                                        if (response.status === 201) {
                                            updateSuccessAlert('Proveedor registrado con éxito!')
                                            setFormKey(prevKey => prevKey + 1);
                                            setReloadLocalidades(true);
                                            setShowAlertSuccess(true);
                                            setTimeout(() => {
                                                setShowAlertSuccess(false);
                                            }, 2500);
                                        } else {
                                            updateErrorAlert('No se logró registrar el proveedor, revise los datos ingresados.')
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
                                            updateErrorAlert('No se logró registrar el proveedor, revise los datos ingresados.');
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
                        } else {
                            updateErrorAlert(`El mail ingresado no es válido.`);
                            setShowAlertError(true);
                            setTimeout(() => {
                                setShowAlertError(false);
                            }, 2000);
                        }
                    } else {
                        const rutCheck = checkRut(rut);
                        const telefonoCheck = checkTelefono(tel);

                        if (telefonoCheck === false && rutCheck === false) {
                            const telefonosConvertidos = proveedorConLocalidad.proveedorContacto.map((tel) => tel.telefono);
                            const data = {
                                ...proveedorConLocalidad,
                                proveedorEmail: null,
                                proveedorContacto: telefonosConvertidos,
                            }
                            axios.post('/agregar-proveedor', data, {
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                                .then(response => {
                                    if (response.status === 201) {
                                        updateSuccessAlert('Proveedor registrado con éxito!')
                                        setFormKey(prevKey => prevKey + 1);
                                        setReloadLocalidades(true);
                                        setShowAlertSuccess(true);
                                        setTimeout(() => {
                                            setShowAlertSuccess(false);
                                        }, 2000);
                                    } else {
                                        updateErrorAlert('No se logró registrar el proveedor, revise los datos ingresados.')
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
                                        updateErrorAlert('No se logró registrar el proveedor, revise los datos ingresados.');
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
            }
        }
    }

    const handleFormSubmitModal = (formDataModal) => {

        const localidadDepartamento = formDataModal.localidadDepartamento;
        const localidadCiudad = formDataModal.localidadCiudad;
        console.log(localidades);
        const localidadesExisten = localidades.some(localidad => {
            return localidad.localidadDepartamento.toLowerCase().toString() === localidadDepartamento.toLowerCase().toString() && localidad.localidadCiudad.toLowerCase().toString() === localidadCiudad.toLowerCase().toString();
        });

        const data = formDataModal

        if (!localidadesExisten) {
            axios.post('/agregar-localidad', data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (response.status === 201) {
                        updateSuccessAlert('Localidad registrada con éxito!')
                        setFormKeyModal(prevKey => prevKey + 1);
                        setReloadLocalidades(true);
                        setShowAlertSuccess(true);
                        setTimeout(() => {
                            setShowAlertSuccess(false);
                        }, 2500);
                    } else {
                        updateErrorAlert('No se logró registrar la localidad, revise los datos ingresados.')
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
                        updateErrorAlert('No se logró registrar la localidad, revise los datos ingresados.');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 2500);
                    }
                })
        } else {
            updateErrorAlert('La localidad que intenta ingresar ya existe.');
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 2500);
        }
    }

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
                                <Grid item lg={2} md={2} ></Grid>
                                <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
                                    <Typography component='h1' variant='h4'>Agregar Proveedor</Typography>
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
                                                        En esta página puedes registrar los proveedores, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 5 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Nombre</span>: En este campo se debe ingresar el nombre del proveedor o de su empresa,
                                                                este campo solo acepta palabras y números, a su vez cuenta con una longitud máxima de 40 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>RUT</span>: en este campo se debe ingresar el código RUT por el cual se identifica el proveedor,
                                                                este campo solo acepta números, a su vez cuenta con una longitud máxima de 12 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Email</span>: en este campo se debe ingresar el email del proveedor,
                                                                este campo solo acepta palabras, números, arroba y punto, a su vez cuenta con un máximo de 50 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Contacto</span>: en este campo se ingresa el número de teléfono del proveedor,
                                                                en caso de que tenga mas de un teléfono, se puede agregar mas al darle click al icono de más a la derecha del campo
                                                                y si desea eliminar el campo, consta en darle click a la X a la derecha del campo generado, los campos de teléfono aceptan solo números y
                                                                cuentan con una longitud máxima de 9 caracteres.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Localidad</span>: en este campo se debe seleccionar la localidad en donde esta ubicado el proveedor o su empresa,
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
                                                        Aclaraciones:
                                                        <br />
                                                        - No se permite dejar los campos vacíos, excepto los de contorno rojo.
                                                        <br />
                                                        - Una vez registre el proveedor, no se le redirigirá al listar. Se determinó así por si está buscando registrar otro proveedor.
                                                        <br />
                                                        - Los campos para dar de alta una localidad solo aceptan palabras y cuentan con una longitud máxima de 40 caracteres.
                                                        <br />
                                                        - En el campo de teléfono también se acepta números de teléfono fijo, en caso de que quiera agregar un teléfono fijo ingréselo todo junto.
                                                        <br />
                                                        - Los proveedores se eliminan lógicamente.
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
                        keyModal={formKeyModal}
                        onSubmit={handleFormSubmit}
                        onSubmitModal={handleFormSubmitModal}
                        handleRedirect={redirect}
                        selectOptions={{ proveedorLocalidad: localidadesSelect }}
                    />
                </Grid>
            </CssBaseline>
        </div>
    );
};

export default AgregarProveedor;