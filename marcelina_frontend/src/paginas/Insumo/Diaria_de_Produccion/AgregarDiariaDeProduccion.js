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

const AgregarDiariaDeProduccion = () => {
    const campoCarne = {
        name: 'diariaDeProduccionCantidadUtilizadaCarnes', label: 'Cantidad', color: 'primary'
    };

    const campoInsumo = {
        name: 'diariaDeProduccionCantidadUtilizadaInsumos', label: 'Cantidad', color: 'primary'
    }

    const formFields = [
        { name: 'diariaDeProduccionProducto', label: 'Producto', type: 'selector', color: 'primary' },
        { name: 'diariaDeProduccionInsumosCarnicos', label: 'Carne', type: 'cantidadMultiple', tipo: 'carne', campo: campoCarne, color: 'primary' },
        { name: 'diariaDeProduccionAditivos', label: 'Aditivos', type: 'cantidadMultiple', tipo: 'aditivo', campo: campoInsumo, color: 'primary' },
        { name: 'diariaDeProduccionCantidadProducida', label: 'Cantidad Producida', type: 'text', color: 'primary' },
        { name: 'diariaDeProduccionFecha', label: 'Fecha de Produccion', type: 'datetime-local', color: 'primary' },
        { name: 'diariaDeProduccionEnvasado', label: 'Envasado', type: 'selector', color: 'primary' },
        { name: 'diariaDeProduccionFechaVencimiento', label: 'Fecha de Vencimiento', type: 'date', color: 'primary' },
    ];

    const alertSuccess = [
        { title: 'Correcto', body: 'Diaria de producción agregada con éxito!', severity: 'success', type: 'description' },
    ];

    const alertError = [
        { title: 'Error', body: 'No se logro agregar la diaria de producción, revise los datos ingresados', severity: 'error', type: 'description' },
    ];

    const classes = useStyles();
    const [productos, setProductos] = useState('');
    const [productoSelect, setProductoSelect] = useState('');
    const [carnes, setCarnes] = useState('');
    const [carneSelect, setCarneSelect] = useState('');
    const [insumos, setInsumos] = useState('');
    const [insumoSelect, setInsumoSelect] = useState('');
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [envasado, setEnvasado] = useState([
        { value: true, label: 'Empaquetado' },
        { value: false, label: 'Sin empaquetar' }
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
        const obtenerProductos = () => {
            axios.get('/listar-productos', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setProductos(response.data);
                    setProductoSelect(
                        response.data.map((producto) => ({
                            value: producto.productoId,
                            label: `${producto.productoNombre} - ${producto.productoCodigo}`,
                        }))
                    );
                })
                .catch(error => {
                    console.error(error);
                });
        };

        const obtenerCarnes = () => {
            axios.get('/listar-carnes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setCarnes(response.data);
                    setCarneSelect(
                        response.data.map((carne) => ({
                            value: carne.carneId,
                            label: `${carne.carneNombre} - ${carne.carneCorte} - ${carne.carneCantidad} Kg`,
                        }))
                    );
                })
                .catch(error => {
                    console.error(error);
                });
        };

        const obtenerAditivos = () => {
            axios.get('/listar-aditivos', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setInsumos(response.data);
                    setInsumoSelect(
                        response.data.map((insumo) => ({
                            value: insumo.insumoId,
                            label: `${insumo.insumoNombre} - ${insumo.insumoNroLote} - ${insumo.insumoCantidad} ${insumo.insumoUnidad}`,
                        }))
                    );
                })
                .catch(error => {
                    console.error(error);
                });
        };

        obtenerProductos();
        obtenerCarnes();
        obtenerAditivos();

    }, []);

    const handleFormSubmit = (formData) => {
        const { cantidadCarne, cantidadInsumo, ...formDataWithoutCantidad } = formData;

        const cantidadValueCarne = formData.cantidadCarne;
        const cantidadValueInsumo = formData.cantidadAditivo;

        const selectCarneValues = cantidadValueCarne.map(item => item.selectValue);
        const selectInsumoValues = cantidadValueInsumo.map(item => item.selectValue);

        const carnesCompletas = carnes.filter(carne => selectCarneValues.includes(carne.carneId.toString()));
        const insumosCompletos = insumos.filter(insumo => selectInsumoValues.includes(insumo.insumoId.toString()));

        //console.log(carnesCompletas);
        //console.log(insumosCompletos);

        const resultadoCarne = carnesCompletas.map(carne => {
            const cantidaValueEncontradaCarne = cantidadValueCarne.find(cv => cv.selectValue === carne.carneId.toString());
            console.log(cantidaValueEncontradaCarne);
            if (cantidaValueEncontradaCarne) {
                const cantidad = cantidaValueEncontradaCarne.textFieldValue;
                console.log(cantidad);
                if (cantidad > carne.carneCantidad) {
                    console.log(carne);
                    return `${carne.carneNombre} - ${carne.carneCorte} - ${carne.carneCantidad} Kg / `;
                }
            }
            return null;
        })

        const resultadoInsumo = insumosCompletos.map(insumo => {
            const cantidaValueEncontradaInsumo = cantidadValueInsumo.find(cv => cv.selectValue === insumo.insumoId.toString());
            console.log(cantidaValueEncontradaInsumo);
            if (cantidaValueEncontradaInsumo) {
                const cantidad = cantidaValueEncontradaInsumo.textFieldValue;
                console.log(cantidad);
                if (cantidad > insumo.insumoCantidad) {
                    console.log(insumo);
                    return `${insumo.insumoNombre} - ${insumo.insumoNroLote} - ${insumo.insumoCantidad} ${insumo.insumoUnidad} / `;
                }
            }
            return null;
        })

        const elementoUndefinedCarne = resultadoCarne.some(elemento => elemento === null);
        const elementoUndefinedInsumo = resultadoInsumo.some(elemento => elemento === null);
        if (!elementoUndefinedInsumo) {
            alertError.forEach((alert) => {
                alert.body = `La cantidad ingresada para utilizar de este/estos Aditivo/Aditivos: ${resultadoInsumo} es mayor a la disponible`;
            });
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 5000);
        }
        else if (!elementoUndefinedCarne) {
            alertError.forEach((alert) => {
                alert.body = `La cantidad ingresada para utilizar de este/estas Carne/Carnes: ${resultadoCarne} es mayor a la disponible`;
            });
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 5000);
        } else {
            const listaCarneActualizada = [];
            const listaCarneCantidad = [];
            carnesCompletas.forEach((carne, index) => {
                const cantidadCarne = cantidadValueCarne[index].textFieldValue;
                const carneActualizada = { ...carne, carneCantidad: carne.carneCantidad - cantidadCarne };
                listaCarneActualizada.push(carneActualizada);
                const detalleCantidadCarne = {
                    detalleCantidadCarneCarne: carneActualizada,
                    detalleCantidadCarneCantidad: cantidadCarne,
                };
                listaCarneCantidad.push(detalleCantidadCarne);
            })

            const listaInsumoActualizado = [];
            const listaInsumoCantidad = [];
            insumosCompletos.forEach((insumo, index) => {
                const cantidadInsumo = cantidadValueInsumo[index].textFieldValue;
                const insumoActualizado = { ...insumo, insumoCantidad: insumo.insumoCantidad - cantidadInsumo };
                listaInsumoActualizado.push(insumoActualizado);
                const detalleCantidadInsumo = {
                    detalleCantidadInsumoInsumo: insumoActualizado,
                    detalleCantidadInsumoCantidad: cantidadInsumo,
                };
                listaInsumoCantidad.push(detalleCantidadInsumo);
            })

            const productoCompleto = productos.filter((producto) => producto.productoId.toString() === formDataWithoutCantidad.diariaDeProduccionProducto)[0];
            console.log(productoCompleto);

            const fechaDiariaProduccion = new Date(formData.diariaDeProduccionFecha);
            const anio = fechaDiariaProduccion.getFullYear();
            const mes = fechaDiariaProduccion.getMonth() + 1;
            const dia = fechaDiariaProduccion.getDate();
            const horas = fechaDiariaProduccion.getHours();
            const minutos = fechaDiariaProduccion.getMinutes();

            const horasFormateadas = horas.toString().padStart(2, '0');
            const minutosFormateados = minutos.toString().padStart(2, '0');

            const fechaNumero = parseInt(`${anio}${mes}${dia}${horasFormateadas}${minutosFormateados}${productoCompleto.productoCodigo}`);

            const loteCompleto = {
                loteCodigo: fechaNumero,
                loteProducto: productoCompleto,
                loteCantidad: formDataWithoutCantidad.diariaDeProduccionCantidadProducida,
            };

            const updateFormData = {
                ...formDataWithoutCantidad,
                diariaDeProduccionProducto: productoCompleto,
                diariaDeProduccionInsumosCarnicos: listaCarneActualizada,
                diariaDeProduccionAditivos: listaInsumoActualizado,
                diariaDeProduccionResponsable: window.localStorage.getItem('user'),
            };

            const data = {
                diariaDeProduccion: updateFormData,
                listaCarneCantidad: listaCarneCantidad,
                listaInsumoCantidad: listaInsumoCantidad,
                lote: loteCompleto,
            };

            console.log(data);

            axios.post('/agregar-diaria-de-produccion', data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
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
        <Grid>
            <Navbar />
            <Container style={{ marginTop: 30 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={0}>
                        <Grid item lg={2} md={2} ></Grid>
                        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
                            <Typography component='h1' variant='h4'>Agregar Diaria de Producción</Typography>
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
                                        En esta página puedes registrar los productos que se producen en la chacinería, asegúrate de completar los campos necesarios para registrar el estado.
                                    </span>
                                    <br />
                                    <span>
                                        Este formulario cuenta con 7 campos:
                                        <ul>
                                            <li>
                                                <span className={classes.liTitle}>Producto</span>: en este campo se debe seleccionar el producto que se realizara.
                                            </li>
                                            <li>
                                                <span className={classes.liTitle}>Carne y Cantidad</span>: en este campo se divide en 2, en el primero llamado carne donde se ingresa la carne que se utiliza para realizar el producto
                                                y el segundo es cantidad, en el cual se ingresa la cantidad que se utiliza de esa carne, a su vez,
                                                este campo cuenta con un icono de más a la derecha del campo de carne para añadir otros 2 campos también denominados carne y cantidad, en caso de que el producto este compuesto por más de una carne,
                                                cuando añades más campos de carne y cantidad, del que ya está predeterminado, el icono de más cambia por una X por si deseas eliminar los nuevos campos generados.
                                            </li>
                                            <li>
                                                <span className={classes.liTitle}>Aditivo y Cantidad</span>: en este campo se divide en 2, el primero llamado aditivo donde se ingresa el aditivo que se utiliza para realizar el producto
                                                y el segundo es cantidad, en el cual se ingresa la cantidad que se utiliza de ese aditivo, a su vez,
                                                este campo cuenta con un icono de más a la derecha del campo de aditivo para añadir otros 2 campos también denominados aditivo y cantidad, en caso de que el producto este compuesto por más de un aditivo,
                                                cuando añades más campos de aditivo y cantidad, del que ya está predeterminado, el icono de más cambia por una X por si deseas eliminar los nuevos campos generados.
                                            </li>
                                            <li>
                                                <span className={classes.liTitle}>Cantidad Producida</span>: en este campo se ingresa la cantidad producida del producto/lote.
                                            </li>
                                            <li>
                                                <span className={classes.liTitle}>Fecha de Producción</span>: en este campo se ingresa la fecha y hora en la que se realizo el producto.
                                            </li>
                                            <li>
                                                <span className={classes.liTitle}>Envasado</span>: en este campo se puede seleccionar si el producto esta envasado o no esta envasado.
                                            </li>
                                            <li>
                                                <span className={classes.liTitle}>Fecha de Vencimiento</span>: en este campo se puede ingresar la fecha de vencimiento del producto/lote que se realizo.
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
                    diariaDeProduccionProducto: productoSelect,
                    diariaDeProduccionInsumosCarnicos: carneSelect,
                    diariaDeProduccionAditivos: insumoSelect,
                    diariaDeProduccionEnvasado: envasado,
                }}
            />
        </Grid>
    )
}

export default AgregarDiariaDeProduccion;