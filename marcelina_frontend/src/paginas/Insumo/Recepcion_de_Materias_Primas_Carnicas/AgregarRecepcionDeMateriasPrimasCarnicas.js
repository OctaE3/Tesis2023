import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, Dialog, IconButton, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
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
    liTitle: {
        color: 'black',
        fontWeight: 'bold',
    },
}));

const AgregarRecepcionDeMateriasPrimasCarnicas = () => {

    const formFieldsModal = [
        { name: 'carneNombre', label: 'Nombre', type: 'text', color: 'primary' },
        { name: 'carneTipo', label: 'Tipo', type: 'select', color: 'primary' },
        { name: 'carneCorte', label: 'Corte', type: 'select', color: 'primary' },
        { name: 'carneCategoria', label: 'Categoria', type: 'select', color: 'primary' },
        { name: 'carneCantidad', label: 'Cantidad', type: 'text', color: 'primary' },
    ];

    const formFields = [
        { name: 'recepcionDeMateriasPrimasCarnicasFecha', label: 'Fecha', type: 'date', color: 'primary' },
        { name: 'recepcionDeMateriasPrimasCarnicasProveedor', label: 'Proveedor', type: 'selector', color: 'primary' },
        { name: 'recepcionDeMateriasPrimasCarnicasProductos', label: 'Productos', type: 'selectorMultiple', alta: 'si', altaCampos: formFieldsModal, color: 'primary' },
        { name: 'recepcionDeMateriasPrimasCarnicasPaseSanitario', label: 'Pase Sanitario', type: 'text', color: 'primary' },
        { name: 'recepcionDeMateriasPrimasCarnicasTemperatura', label: 'Temperatura', type: 'number', adornment: 'si', unit: '°C', color: 'primary' },
        { name: 'recepcionDeMateriasPrimasCarnicasMotivoDeRechazo', label: 'Motivo de rechazo', type: 'text', multi: '3', color: 'secondary' },
    ];

    const alertSuccess = [
        { title: 'Correcto', body: 'Recepcion de materia primas carnicas agregada con éxito!', severity: 'success', type: 'description' },
    ];

    const alertError = [
        { title: 'Error', body: 'No se logro agregar la recepcion de materia primas carnicas, revise los datos ingresados.', severity: 'error', type: 'description' },
    ];

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

    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

    const handleFormSubmit = (formData) => {
        const { carnesAgregadas, ...formDataWithoutCarnesAgregadas } = formData;

        const listaCarne = formData.carnesAgregadas

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

        if (materiasPrimasConProveedor.recepcionDeMateriasPrimasCarnicasProveedor === null || materiasPrimasConProveedor.recepcionDeMateriasPrimasCarnicasProveedor === 'Seleccionar') {
            console.log("Seleccione un proveedor valido.")
            alertError.forEach((alert) => {
                alert.body = `Seleccione un proveedor valido.`;
            });
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
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 5000);
                    }
                })
                .catch(error => {
                    console.error(error);
                })
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
                                            <IconButton>
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
                                                                <span className={classes.liTitle}>Fecha</span>: en este campo se debe ingresar la fecha en la que se recibio la carne.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Proveedor</span>: en este campo se debe seleccionar el proveedor al que se le compro la carne.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Productos</span>: en este campo se ingresan los productos cárnicos que reciben, los productos se ingresan a través de un formulario, 
                                                                para abrir el formulario hay que darle click al icono de más a la derecha del campo.
                                                                El formulario de carne cuenta con 5 campos:
                                                                <ul>
                                                                    <li><span className={classes.liTitle}>Nombre</span>: en este campo se ingresa el nombre de la carne o producto cárnico que se recibio</li>
                                                                    <li><span className={classes.liTitle}>Tipo</span>: en este campo se selecciona el tipo de producto que se recibio, hay 5 tipos Bovino, Porcino, Higado, Tripa y Sangre</li>
                                                                    <li><span className={classes.liTitle}>Corte</span>: en este campo se selecciona el grupo en el que entra el producto recibido</li>
                                                                    <li><span className={classes.liTitle}>Categoria</span>: este campo solo esta disponible para los productos Bovinos y Porcinos, 
                                                                    y lo que se busca en este campo es especificar si la carne recibida es con hueso o sin hueso</li>
                                                                    <li><span className={classes.liTitle}>Cantidad</span>: en este campo se ingresa la cantidad recibida del producto</li>
                                                                </ul>
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Pase Sanitario</span>: en este campo se ingresa el número del pase sanitario.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Temperatura</span>: en este campo se ingresa la temperatura en la que se recibio la carne.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Motivo de rechazo</span>: en este campo se puede dar los motivos o los detalles de por que se rechazó el producto cárnico recibido.
                                                            </li>
                                                        </ul>
                                                    </span>
                                                    <span>
                                                        Campos obligatorios y no obligatorios:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitle}>Campos con contorno azul</span>: los campos con contorno azul son obligatorio, se tienen que completar sin excepción.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Campos con contorno rojo</span>: en cambio, los campos con contorno rojo no son obligatorios, se pueden dejar vacíos de ser necesario.
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