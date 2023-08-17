import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Tooltip, IconButton, makeStyles, createTheme } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import FormularioReutilizanle from '../../../components/Reutilizable/FormularioReutilizable'
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
}));

const AgregarDiariaDeProduccion = () => {
    const campoCarne = {
        name: 'diariaDeProduccionCantidadUtilizadaCarnes', label: 'Cantidad'
    };

    const campoInsumo = {
        name: 'diariaDeProduccionCantidadUtilizadaInsumos', label: 'Cantidad'
    }

    const formFields = [
        { name: 'diariaDeProduccionProducto', label: 'Producto', type: 'selector' },
        { name: 'diariaDeProduccionInsumosCarnicos', label: 'Carne', type: 'cantidadMultiple', tipo: 'carne', campo: campoCarne },
        { name: 'diariaDeProduccionAditivos', label: 'Aditivos', type: 'cantidadMultiple', tipo: 'aditivo', campo: campoInsumo },
        { name: 'diariaDeProduccionCantidadProducida', label: 'Cantidad Producida', type: 'text' },
        { name: 'diariaDeProduccionFecha', label: 'Fecha de Produccion', type: 'datetime-local' },
        { name: 'diariaDeProduccionEnvasado', label: 'Envasado', type: 'selector' },
        { name: 'diariaDeProduccionFechaVencimiento', label: 'Fecha de Vencimiento', type: 'date' },
    ];

    const classes = useStyles();
    const [productos, setProductos] = useState('');
    const [productoSelect, setProductoSelect] = useState('');
    const [carnes, setCarnes] = useState('');
    const [carneSelect, setCarneSelect] = useState('');
    const [insumos, setInsumos] = useState('');
    const [insumoSelect, setInsumoSelect] = useState('');
    const [envasado, setEnvasado] = useState([
        { value: true, label: 'Empaquetado' },
        { value: false, label: 'Sin empaquetar' }
    ]);

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
            console.log(`La cantidad ingresada para utilizar de este/estos Aditivo/Aditivos: ${resultadoInsumo} es mayor a la disponible`);
        }
        else if (!elementoUndefinedCarne) {
            console.log(`La cantidad ingresada para utilizar de este/estas Carne/Carnes: ${resultadoCarne} es mayor a la disponible`);
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
                        console.log(response.data);
                        console.log("Diaria de produccion agregada con éxito!");
                    } else {
                        console.log("No se logro agregar la diaria de produccion");
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
                            <Tooltip title={
                                <Typography fontSize={16}>
                                    En esta pagina puedes registrar las localidades, que se asignaran a los proveedores, clientes, etc.
                                </Typography>
                            }>
                                <IconButton>
                                    <HelpOutlineIcon fontSize="large" color="primary" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item lg={2} md={2}></Grid>
                    </Grid>
                </Box>
            </Container>
            <FormularioReutilizanle
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