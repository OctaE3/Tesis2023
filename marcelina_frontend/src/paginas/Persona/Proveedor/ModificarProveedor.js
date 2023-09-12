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

const ModificarCliente = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [proveedor, setProveedor] = useState({});
    const [proveedores, setProveedores] = useState([]);
    const [proveedorLocalidad, setProveedorLocalidad] = useState({});
    const [localidades, setLocalidades] = useState({});
    const [localidadesSelect, setLocalidadesSelect] = useState([]);
    const [telefonos, setTelefonos] = useState([]);

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const [alertSuccess, setAlertSuccess] = useState({
        title: 'Correcto', body: 'Proveedor registrado con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logro registrar el proveedor, revise los datos ingresados.', severity: 'error', type: 'description'
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
                    setProveedor(proveedorEncontrado);
                    setTelefonos(proveedorEncontrado.proveedorContacto);
                    setProveedorLocalidad({
                        value: proveedorEncontrado.proveedorLocalidad.localidadId,
                        label: proveedorEncontrado.proveedorLocalidad.localidadCiudad,
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        };

        const obtenerLocalidades = () => {
            axios.get('/listar-localidades', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setLocalidades(response.data);
                    setLocalidadesSelect(
                        response.data.map((localidad) => ({
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
            const regex = new RegExp("^[A-Za-z0-9\\s]{0,50}$");
            if (regex.test(value)) {
                setProveedor(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
        else if (name === "proveedorEmail") {
            const regex = new RegExp("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{0,3}");
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
        console.log(proveedor);
    }

    const handleChangeTelefono = (index, telefono) => {
        const regex = new RegExp("^[0-9]{0,9}$");

        if (regex.test(telefono)) {
            setTelefonos(prevTelefonos => {
                const nuevosTelefonos = [...prevTelefonos];
                nuevosTelefonos[index] = telefono;
                return nuevosTelefonos;
            });
        }
    }

    const checkTelefono = (telefonos) => {
        const telefonosProveedores = [];
        proveedores.forEach(proveedor => {
            proveedor.proveedorContacto.forEach(telefono => {
                telefonosProveedores.push(telefono);
            })
        })

        const telefonosEncontrados = telefonos.filter(tel => {
            return telefonosProveedores.includes(tel);
        });

        return telefonosEncontrados.length > 0 ? telefonosEncontrados : null;
    }

    const checkRut = (rut) => {
        const rutProveedores = [];
        proveedores.forEach(proveedor => {
            rutProveedores.push(proveedor.proveedorRUT);
        })

        const rutEncontrado = rutProveedores.includes(rut);
        return rutEncontrado;
    }

    const checkEmail = (email) => {
        const emailProveedores = [];
        proveedores.forEach(proveedor => {
            emailProveedores.push(proveedor.proveedorEmail);
        })

        const emailEncontrado = emailProveedores.includes(email);
        return emailEncontrado;
    }

    const checkError = (nombre, rut, email, telefonos, localidad) => {
        if (nombre === undefined || nombre === null || nombre.trim() === '') {
            return false;
        }
        else if (!rut === undefined || !rut === null || !rut.trim() === '') {
            const regex = /^\d{12}$/;
            if (regex.test(rut)) { }
            else { return false; }
        }
        else if (!email === undefined || !email === null || !email.trim() === '') {
            if (!email.includes(".") && !email.includes("@")) {
                return false;
            }
        }
        else if (telefonos !== undefined || telefonos !== null || telefonos.length !== 0) {
            const regex = /^\d{9}$/;
            telefonos.forEach((tel) => {
                if (regex.test(tel.telefono)) { }
                else { return false; }
            })
        }
        else if (localidad === undefined || localidad === null) {
            return false;
        }
        return true;
    }

    const handleFormSubmit = () => {
        const localidadCompleta = localidades.find((localidad) => localidad.localidadId.toString() === proveedorLocalidad.toString());
        const data = {
            ...proveedor,
            proveedorLocalidad: localidadCompleta,
        };

        const nombre = data.prveedorNombre;
        const rut = data.proveedorRUT;
        const email = data.proveedorEmail;
        const tel = data.proveedorLocalidad;
        const localidad = data.proveedorLocalidad;

        const check = checkError(nombre, rut, email, tel, localidad);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados del proveedor y no deje campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 7000);
        } else {
            if (localidadCompleta !== undefined || proveedorLocalidad !== "Seleccionar") {
                const telefonoCheck = checkTelefono(data.proveedorContacto);
                const rutCheck = checkRut(data.proveedorRUT);
                const emailCheck = checkEmail(data.proveedorEmail);

                if (telefonoCheck === null && rutCheck === false && emailCheck === false) {
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
                                }, 5000);
                            } else {
                                updateErrorAlert('No se logro modificar el proveedor, revise los datos ingresados.')
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
                                updateErrorAlert('No se logro modificar el proveedor, revise los datos ingresados.');
                                setShowAlertError(true);
                                setTimeout(() => {
                                    setShowAlertError(false);
                                }, 5000);
                            }
                        })
                } else {
                    updateErrorAlert('Revise los datos ingresados, no puede coincidir el email, el codigo rut o los teléfonos, con los proveedores ya registrados.');
                    setShowAlertError(true);
                    setTimeout(() => {
                        setShowAlertError(false);
                    }, 7000);
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
                                                        En esta página puedes registrar los clientes, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 5 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Nombre</span>: en este campo se debe ingresar el nombre de la empresa o del cliente.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Email</span>: en este campo se debe ingresar el mail proporcionado por el cliente.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Contacto</span>: en este campo se ingresa el número de teléfono del cliente,
                                                                en caso de que tenga mas de un teléfono, se puede agregar mas al darle click al icono de mas a la derecha del campo
                                                                y si desea eliminar el campo, consta en darle click a la X a la derecha del campo generado.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Observaciones</span>: en este campo se pueden registrar las observaciones o detalles necesarios del cliente.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Localidad</span>: en este campo se puede seleccionar la localidad en donde esta ubicado el cliente o su empresa,
                                                                en caso de querer añadir una localidad nueva, es posible dandole al icono de más a la derecha del campo.
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
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Nombre"
                                            defaultValue="Nombre"
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
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="RUT"
                                            defaultValue="RUT"
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
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Email"
                                            defaultValue="Email"
                                            type="email"
                                            name="proveedorEmail"
                                            value={proveedor.proveedorEmail}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    {telefonos.map((telefono, index) => (
                                        <Grid item lg={12} md={12} sm={12} xs={12} key={index}>
                                            <TextField
                                                fullWidth
                                                autoFocus
                                                className={classes.customOutlinedBlue}
                                                InputLabelProps={{ className: classes.customLabelBlue }}
                                                color="primary"
                                                margin="normal"
                                                variant="outlined"
                                                label={`Teléfono ${index + 1}`}
                                                type="text"
                                                name={`proveedorContacto-${index}`}
                                                value={telefono}
                                                onChange={(e) => handleChangeTelefono(index, e.target.value)}
                                            />
                                        </Grid>
                                    ))}
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
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
                                                onChange={(e) => setProveedorLocalidad(e.target.value)}
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

export default ModificarCliente;