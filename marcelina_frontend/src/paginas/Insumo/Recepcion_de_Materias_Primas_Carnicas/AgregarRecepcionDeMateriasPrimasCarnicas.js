import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import { Container, Box, Grid, Typography, makeStyles, createTheme, CssBaseline, Tooltip, IconButton } from '@material-ui/core';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable';
import { useNavigate } from 'react-router-dom';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import axios from 'axios';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2C2C71'
        }
    }
});

const useStyles = makeStyles((theme) => ({
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: '100%',
        marginBottom: theme.spacing(1)
    },
    title: {
        textAlign: 'center',
    }
}));

const AgregarRecepcionDeMateriasPrimasCarnicas = () => {

    const formFieldsModal = [
        { name: 'carneNombre', label: 'Nombre', type: 'text' },
        { name: 'carneTipo', label: 'Tipo', type: 'select' },
        { name: 'carneCorte', label: 'Corte', type: 'select' },
        { name: 'carneCategoria', label: 'Categoria', type: 'select' },
        { name: 'carneCantidad', label: 'Cantidad', type: 'text' },
    ];

    const formFields = [
        { name: 'recepcionDeMateriasPrimasCarnicasFecha', label: 'Fecha', type: 'date' },
        { name: 'recepcionDeMateriasPrimasCarnicasProveedor', label: 'Proveedor', type: 'selector' },
        { name: 'recepcionDeMateriasPrimasCarnicasProductos', label: 'Productos', type: 'selectorMultiple', alta: 'si', altaCampos: formFieldsModal },
        { name: 'recepcionDeMateriasPrimasCarnicasPaseSanitario', label: 'Pase Sanitario', type: 'text' },
        { name: 'recepcionDeMateriasPrimasCarnicasTemperatura', label: 'Temperatura', type: 'number', adornment: 'si', unit: '°C' },
        { name: 'recepcionDeMateriasPrimasCarnicasMotivoDeRechazo', label: 'Motivo de rechazo', type: 'text', multi: '3' },
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

    const classes = useStyles();

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
            carneCategoria: carne.carneTipo === "Sangre" ? "Sangre" : 
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
        }
        else {
            axios.post('/agregar-recepcion-de-materias-primas-carnicas', data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    if (response.status === 201) {
                        console.log("Recepcion de materia primas carnicas agregada con éxito!");
                    } else {
                        console.log("No se logro agregar la recepcion de materia primas carnicas, revise los datos ingresados.");
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
                                    <Typography component='h1' variant='h5'>Control de Recepcion de Materias Primas Carnicas</Typography>
                                    <Tooltip title={
                                        <Typography fontSize={16}>
                                            En esta pagina puedes registrar los proveedores.
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