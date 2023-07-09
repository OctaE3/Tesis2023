import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Container, Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem, withStyles, makeStyles, CssBaseline, Tooltip, IconButton, createTheme } from '@material-ui/core';
import FormularioReutilizable from '../../components/Formulario Reutilizable/FormularioReutilizable';
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
}));

const AgregarProveedor = () => {

    const formFieldsPopover = [
        { name: 'localidadNombre', label: 'Nombre', type: 'text' }
    ];

    const formFields = [
        { name: 'proveedorNombre', label: 'Nombre', type: 'text' },
        { name: 'proveedorRUT', label: 'RUT', type: 'text' },
        { name: 'proveedorContacto', label: 'Contacto', type: 'text' },
        { name: 'proveedorLocalidad', label: 'Localidad', type: 'selector', alta: 'si', altaCampos: formFieldsPopover },
    ];

    const [proveedor, setProveedor] = useState({});
    const [localidad, setLocalidad] = useState({});
    const [localidades, setLocalidades] = useState([]);
    const [localidadesSelect, setLocalidadesSelect] = useState('');
    const [reloadLocalidades, setReloadLocalidades] = useState(false);

    const classes = useStyles();

    const navigate = useNavigate();

    const redireccionar = () => {
        navigate('/proveedor');
    } 

    useEffect(() => {
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
                            label: localidad.localidadNombre,
                        }))
                    );
                })
                .catch(error => {
                    console.error(error);
                });
        };

        obtenerLocalidades();

        if(reloadLocalidades){
            obtenerLocalidades();
            setReloadLocalidades(false);
        }

    }, [reloadLocalidades]);

    const handleFormSubmit = (formData) => {
        const localidadSeleccionadaObj = localidades.filter((localidad) => localidad.localidadId.toString() === formData.proveedorLocalidad)[0];

        const proveedorConLocalidad = {
            ...formData,
            proveedorLocalidad: localidadSeleccionadaObj ? localidadSeleccionadaObj : null
        };

        setProveedor(proveedorConLocalidad);

        if (proveedorConLocalidad.proveedorLocalidad == null || proveedorConLocalidad.proveedorConLocalidad === 'Seleccionar') {
            console.log("Seleccione una localidad valida.")
        }
        else {
            axios.post('/agregar-proveedor', proveedorConLocalidad, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    if (response.status === 201) {
                        console.log("Proveedor agregada con éxito!");
                    } else {
                        console.log("No se logro agregar el proveedor, revise los datos ingresados.");
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        }
    }

    const handleFormSubmitPopover = (formDataPopover) => {
        setLocalidad(formDataPopover);
        console.log(formDataPopover);
        axios.post('/agregar-localidad', formDataPopover, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
          }
        })
          .then(response => {
            if (response.status === 201) {
              console.log("Localidad agregada con éxito!");
              setReloadLocalidades(true);
              redireccionar();
              
            } else {
              console.log("No se logro agregar la localidad");
            }
          })
          .catch(error => {
            console.error(error);
          })
    
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
                                <Grid item lg={8} md={8} sm={12} xs={12} >
                                    <Typography component='h1' variant='h5'>Agregar Proveedor</Typography>
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
                        onSubmitPopover={handleFormSubmitPopover}
                        selectOptions={{ proveedorLocalidad: localidadesSelect }}
                    />
                </Grid>
            </CssBaseline>
        </div>
    );
};

export default AgregarProveedor;