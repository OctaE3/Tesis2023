import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, Dialog, IconButton, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
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

const AgregarRecepcionDeMateriasPrimasCarnicas = () => {

    const formFieldsModal = [
        { name: 'carneNombre', label: 'Nombre', type: 'text', color: 'primary', obligatorio: true, pattern: "^[A-Za-z0-9\\s]{0,50}$" },
        { name: 'carneTipo', label: 'Tipo *', type: 'select', color: 'primary' },
        { name: 'carneCorte', label: 'Corte *', type: 'select', color: 'primary' },
        { name: 'carneCategoria', label: 'Categoria *', type: 'select', color: 'primary' },
        { name: 'carneCantidad', label: 'Cantidad', type: 'text', color: 'primary', obligatorio: true, pattern: "^[0-9]{0,10}$" },
    ];

    const formFields = [
        { name: 'recepcionDeMateriasPrimasCarnicasFecha', label: 'Fecha', type: 'date', color: 'primary' },
        { name: 'recepcionDeMateriasPrimasCarnicasProveedor', label: 'Proveedor *', type: 'selector', color: 'primary' },
        { name: 'recepcionDeMateriasPrimasCarnicasProductos', label: 'Productos *', type: 'selectorMultiple', alta: 'si', altaCampos: formFieldsModal, color: 'primary' },
        { name: 'recepcionDeMateriasPrimasCarnicasPaseSanitario', label: 'Pase Sanitario', type: 'text', color: 'primary', obligatorio: true, pattern: "^[0-9]{0,15}$" },
        { name: 'recepcionDeMateriasPrimasCarnicasTemperatura', label: 'Temperatura', type: 'text', adornment: 'si', unit: '°C', color: 'primary', obligatorio: true, pattern: "^-?[0-9]{0,10}$" },
        { name: 'recepcionDeMateriasPrimasCarnicasMotivoDeRechazo', label: 'Motivo de rechazo', type: 'text', multi: '3', color: 'secondary', pattern: "^[A-Za-z0-9\\s,.]{0,250}$" },
    ];

    const [alertSuccess, setAlertSuccess] = useState({
        title: 'Correcto', body: 'Recepcion de materia primas carnicas agregada con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logro agregar la recepcion de materia primas carnicas, revise los datos ingresados.', severity: 'error', type: 'description'
    });

    const [alertWarning, setAlertWarning] = useState({
        title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
    });

    const [proveedores, setProveedores] = useState([]);
    const [proveedoresSelect, setProveedoresSelect] = useState('');
    const [carneTipoSelect, setCarneTipoSelect] = useState([
        { value: 'Porcino', label: 'Porcino' },
        { value: 'Bovino', label: 'Bovino' },
        { value: 'Sangre', label: 'Sangre' },
        { value: 'Tripas', label: 'Tripas' },
        { value: 'Higado', label: 'Higado' },
    ]);
    const [carneCortePorcino, setCarneCortePorcino] = useState([
        { value: 'Carcasa', label: 'Carcasa' },
        { value: 'Media res', label: 'Media res' },
        { value: 'Cortes c/h', label: 'Cortes c/h' },
        { value: 'Cortes s/h', label: 'Cortes s/h' },
        { value: 'Menudencias', label: 'Menudencias' },
        { value: 'Subproductos', label: 'Subproductos' },
    ]);
    const [carneCorteBovino, setCarneCorteBovino] = useState([
        { value: 'Media res', label: 'Media res' },
        { value: 'Delantero', label: 'Delantero' },
        { value: 'Trasero', label: 'Trasero' },
        { value: 'Cortes c/h', label: 'Cortes c/h' },
        { value: 'Cortes s/h', label: 'Cortes s/h' },
        { value: 'Menudencias', label: 'Menudencias' },
        { value: 'Subproductos', label: 'Subproductos' },
    ]);
    const [carneCorteSangre, setCarneCorteSangre] = useState([
        { value: 'Sangre', label: 'Sangre' },
    ]);
    const [carneCorteTripas, setCarneCorteTripas] = useState([
        { value: 'Tripas', label: 'Tripas' },
    ]);
    const [carneCorteHigado, setCarneCorteHigado] = useState([
        { value: 'Higado', label: 'Higado' },
    ]);
    const [carneCategoria, setCarneCategoria] = useState([
        { value: 'CarneSH', label: 'Carne S/H' },
        { value: 'CarneCH', label: 'Carne C/H' },
        { value: 'Grasa', label: 'Grasa' },
    ]);
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const classes = useStyles();

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
        const obtenerProveedores = () => {
            axios.get('/listar-proveedores', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setProveedores(response.data);
                    setProveedoresSelect(
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

    const updateErrorAlert = (newBody) => {
        setAlertError((prevAlert) => ({
            ...prevAlert,
            body: newBody,
        }));
    };

    const checkError = (fecha, proveedor, pase, temperatura) => {
        if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
            return false;
        }
        else if (proveedor === undefined || proveedor === null || proveedor === "Seleccionar") {
            return false;
        }
        else if (pase === undefined || pase === null || pase === '') {
            return false;
        }
        else if (temperatura === undefined || temperatura === null || temperatura === '') {
            return false;
        }
        return true;
    }

    const checkMultiple = (carnes) => {
        if (carnes && carnes.length > 0) {
            let resp = true;
            carnes.forEach((carne) => {
                if (carne.carneNombre === undefined || carne.carneNombre === null || carne.carneNombre === '') {
                    resp = false;
                }
                else if (carne.carneTipo === undefined || carne.carneTipo === null || carne.carneTipo === "Seleccionar") {
                    resp = false;
                }
                else if (carne.carneCorte === undefined || carne.carneCorte === null || carne.carneCorte === "Seleccionar") {
                    resp = false;
                }
                else if (carne.carneCategoria === undefined || carne.carneCategoria === null || carne.carneCategoria === "Seleccionar") {
                    resp = false;
                }
                else if (carne.carneCantidad === undefined || carne.carneCantidad === null || carne.carneCantidad === '') {
                    resp = false;
                }

                if (resp === false) { return }
            })
            return resp;
        } else { return false }
    }

    const handleFormSubmit = (formData) => {
        console.log(formData);
        const { carnesAgregadas, ...formDataWithoutCarnesAgregadas } = formData;

        const checkMul = checkMultiple(carnesAgregadas);

        if (checkMul === false) {
            updateErrorAlert(`Revise los productos ingresados, no se permite dejar campos vacíos y seleccionar la opción "Seleccionar", elimine el producto e ingreselo nuevamente.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 7000);
        } else {
            const listaCarne = formData.carnesAgregadas;

            const carnes = listaCarne.map(carne => ({
                ...carne,
                carneCategoria:
                    carne.carneTipo === "Sangre" ? "Sangre" :
                        carne.carneTipo === "Higado" ? "Higado" :
                            carne.carneTipo === "Tripas" ? "Tripas" :
                                carne.carneCategoria,
                carnePaseSanitario: formDataWithoutCarnesAgregadas.recepcionDeMateriasPrimasCarnicasPaseSanitario,
                carneFecha: formDataWithoutCarnesAgregadas.recepcionDeMateriasPrimasCarnicasFecha,
            }));

            console.log(carnes);

            const proveedorSeleccionadaObj = proveedores.filter((proveedor) => proveedor.proveedorId.toString() === formData.recepcionDeMateriasPrimasCarnicasProveedor)[0];

            const materiasPrimasConProveedor = {
                ...formDataWithoutCarnesAgregadas,
                recepcionDeMateriasPrimasCarnicasProveedor: proveedorSeleccionadaObj ? proveedorSeleccionadaObj : null,
                recepcionDeMateriasPrimasCarnicasResponsable: window.localStorage.getItem('user'),
            };

            const data = {
                recepcionDeMateriasPrimasCarnicas: materiasPrimasConProveedor,
                listaCarne: carnes,
            }

            const check = checkError(materiasPrimasConProveedor.recepcionDeMateriasPrimasCarnicasFecha, materiasPrimasConProveedor.recepcionDeMateriasPrimasCarnicasProveedor,
                materiasPrimasConProveedor.recepcionDeMateriasPrimasCarnicasPaseSanitario, materiasPrimasConProveedor.recepcionDeMateriasPrimasCarnicasTemperatura);

            if (check === false) {
                updateErrorAlert(`Revise los datos ingresados, no se permite dejar campos vacíos y tampoco se permite seleccionar la opción "Seleccionar".`);
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 5000);
            }
            else {
                axios.post('/agregar-recepcion-de-materias-primas-carnicas', data, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then(response => {
                        if (response.status === 201) {
                            setShowAlertSuccess(true);
                            setTimeout(() => {
                                setShowAlertSuccess(false);
                            }, 5000);
                        } else {
                            updateErrorAlert('No se logro registrar la recepcion de materia primas carnicas, revise los datos ingresados.')
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
                            updateErrorAlert('No se logro registrar la recepcion de materia primas carnicas, revise los datos ingresados.');
                            setShowAlertError(true);
                            setTimeout(() => {
                                setShowAlertError(false);
                            }, 5000);
                        }
                    })
            }
        }
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
                                    <Typography component='h1' variant='h4'>Control de Recepcion de Materias Primas Carnicas</Typography>
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
                                                        En esta página puedes registrar los productos carnicos que recibe large chacinería, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 6 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha</span>: en este campo se debe ingresar la fecha en la que se recibio la carne.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Proveedor</span>: en este campo se debe seleccionar el proveedor al que se le compro la carne.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Productos</span>: en este campo se ingresan los productos cárnicos que reciben, los productos se ingresan a través de un formulario,
                                                                para abrir el formulario hay que darle click al icono de más a la derecha del campo.
                                                                El formulario de carne cuenta con 5 campos:
                                                                <ul>
                                                                    <li><span className={classes.liTitleBlue}>Nombre</span>: en este campo se ingresa el nombre de la carne o producto cárnico que se recibio</li>
                                                                    <li><span className={classes.liTitleBlue}>Tipo</span>: en este campo se selecciona el tipo de producto que se recibio, hay 5 tipos Bovino, Porcino, Higado, Tripa y Sangre</li>
                                                                    <li><span className={classes.liTitleBlue}>Corte</span>: en este campo se selecciona el grupo en el que entra el producto recibido</li>
                                                                    <li><span className={classes.liTitleBlue}>Categoria</span>: este campo solo esta disponible para los productos Bovinos y Porcinos,
                                                                        y lo que se busca en este campo es especificar si la carne recibida es con hueso o sin hueso</li>
                                                                    <li><span className={classes.liTitleBlue}>Cantidad</span>: en este campo se ingresa la cantidad recibida del producto</li>
                                                                </ul>
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Pase Sanitario</span>: en este campo se ingresa el número del pase sanitario.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Temperatura</span>: en este campo se ingresa la temperatura en la que se recibio la carne.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Motivo de rechazo</span>: en este campo se puede dar los motivos o los detalles de por que se rechazó el producto cárnico recibido.
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
                        </Box>
                    </Container>
                    <FormularioReutilizable
                        fields={formFields}
                        onSubmit={handleFormSubmit}
                        selectOptions={{
                            recepcionDeMateriasPrimasCarnicasProveedor: proveedoresSelect,
                            carneTipo: carneTipoSelect,
                            carneCategoria: carneCategoria,
                            carneCortePorcino: carneCortePorcino,
                            carneCorteBovino: carneCorteBovino,
                            carneCorteSangre: carneCorteSangre,
                            carneCorteTripas: carneCorteTripas,
                            carneCorteHigado: carneCorteHigado,
                        }}
                    />
                </Grid>
            </CssBaseline>
        </div>
    );
};

export default AgregarRecepcionDeMateriasPrimasCarnicas;