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

const AgregarInsumo = () => {
    const formFields = [
        { name: 'insumoNombre', label: 'Nombre', type: 'text', color: 'primary' },
        { name: 'insumoFecha', label: 'Fecha', type: 'date', format: 'yyyy-MM-dd', color: 'primary' },
        { name: 'insumoProveedor', label: 'Proveedor', type: 'selector', color: 'primary' },
        { name: 'insumoTipo', label: 'Tipo', type: 'selector', color: 'primary' },
        { name: 'insumoCantidad', label: 'Cantidad', type: 'number', color: 'primary' },
        { name: 'insumoUnidad', label: 'Unidad', type: 'selector', color: 'primary' },
        { name: 'insumoNroLote', label: 'Lote', type: 'text', color: 'primary' },
        { name: 'insumoMotivoDeRechazo', label: 'Motivo de rechazó', type: 'text', multi: '3', color: 'secondary' },
        { name: 'insumoFechaVencimiento', label: 'Fecha Vencimiento', type: 'date', format: 'yyyy-MM-dd', color: 'primary' },
    ];

    const alertSuccess = [
        { title: 'Correcto', body: 'Insumo agregado con éxito!', severity: 'success', type: 'description' },
    ];

    const alertError = [
        { title: 'Error', body: 'No se logro agregar el Insumo, revise los datos ingresados', severity: 'error', type: 'description' },
    ];

    const classes = useStyles();
    const [insumo, setInsumo] = useState({});
    const [proveedores, setProveedores] = useState([]);
    const [insumoProveedoresSelect, setInsumoProveedoresSelect] = useState([]);
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [insumoTipoSelect, setInsumoTipoSelect] = useState([
        { value: 'Aditivo', label: 'Aditivo' },
        { value: 'Otros', label: 'Otros' }
    ]);
    const [insumoUnidadSelect, setInsumoUnidadSelect] = useState([
        { value: 'Kg', label: 'Kg' },
        { value: 'Metros', label: 'Metros' },
        { value: 'Litros', label: 'Litros' },
    ]);

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
                    setInsumoProveedoresSelect(
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
        const proveedorSeleccionadaObj = proveedores.filter((proveedor) => proveedor.proveedorId.toString() === formData.insumoProveedor)[0];

        const insumoConProveedor = {
            ...formData,
            insumoProveedor: proveedorSeleccionadaObj ? proveedorSeleccionadaObj : null,
            insumoResponsable: window.localStorage.getItem('user'),
        };

        setInsumo(insumoConProveedor);
        console.log(insumoConProveedor);
        if (insumoConProveedor.insumoTipo == null || insumoConProveedor.insumoTipo === 'Seleccionar'
            || insumoConProveedor.insumoProveedor == null || insumoConProveedor.insumoProveedor === 'Seleccionar') {
            console.log("Seleccione un tipo de Insumo");
        }
        else {
            axios.post('/agregar-control-de-insumos', insumoConProveedor, {
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
                                    <Typography component='h1' variant='h4'>Agregar Insumo</Typography>
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
                                                        En esta página puedes registrar los insumos que recibe la chacinería, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 9 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitle}>Nombre</span>: en este campo se debe ingresar el nombre del insumo que se recibió.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Fecha</span>: en este campo se debe registrar la fecha en la que se recibió el insumo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Proveedor</span>: en este campo se tendrá que seleccionar el proveedor al cual se le compró el insumo/producto.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Tipo</span>: en este campo se podrá seleccionar el tipo de insumo que se recibe, hay 2 tipos,
                                                                Aditivo que se refiere a los aditivos utilizados para la producción de los chacinados y Otros que se refiere a los productos de envasado, cuerdas, etc.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Cantidad</span>: en este campo se registrará la cantidad que se recibió del insumo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Unidad</span>: en este campo se registrará la unidad correspondiente al insumo.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Lote</span>: en este campo se registrará el código de lote del insumo recibido.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Motivo de rechazó</span>: en este campo se puede ingresar el motivo por el cual se rechazó el producto/insumo recibido.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitle}>Fecha Vencimiento</span>: en este campo se registrará la fecha de vencimiento del producto/insumo.
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
                            insumoProveedor: insumoProveedoresSelect,
                            insumoTipo: insumoTipoSelect,
                            insumoUnidad: insumoUnidadSelect
                        }}
                    />
                </Grid>
            </CssBaseline>
        </div>
    );
}

export default AgregarInsumo;