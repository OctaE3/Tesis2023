import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Container, Box, Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, withStyles, makeStyles, CssBaseline, Tooltip, IconButton, createTheme } from '@material-ui/core';
import FormularioReutilizable from '../../components/Formulario Reutilizable/FormularioReutilizable';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Logo from "../../assets/images/Logo.png";
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

const AgregarCarne = () => {

    const formFields = [
        { name: 'carneNombre', label: 'Nombre', type: 'text' },
        { name: 'carneTipo', label: 'Tipo de Carne', type: 'selector' },
        { name: 'carneCorte', label: 'Corte', type: 'text' },
        { name: 'carneCantidad', label: 'Cantidad', type: 'number' },
        { name: 'carnePaseSanitario', label: 'Pase Sanitario', type: 'text' },
    ];

    const classes = useStyles();
    const [carne, setCarne] = useState({});
    const [carneTipoSelect, setCarneTipoSelect] = useState([
        { value: 'Porcino', label: 'Porcino' },
        { value: 'Bovino', label: 'Bovino' }
    ]);

    const handleFormSubmit = (formData) => {
        setCarne(formData);
        console.log(formData);
        if (formData.carneTipo == null || formData.carneTipo === 'Seleccionar') {
            console.log("Seleccione un tipo de Carne");
        }
        else {
            axios.post('/agregar-carne', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    if (response.status === 201) {
                        console.log("Carne agregada con éxito!");
                    } else {
                        console.log("No se logro agregar la carne");
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
                                <Grid item lg={2} md={2}></Grid>
                                <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
                                    <Typography component='h1' variant='h5'>Agregar Carne</Typography>
                                    <Tooltip title={
                                        <Typography fontSize={16}>
                                            En esta pagina puedes registrar los distinto tipos de carne y cortes que compran.
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
                        selectOptions={{ carneTipo: carneTipoSelect }}
                    />
                </Grid>
            </CssBaseline>
        </div>
    );
};

export default AgregarCarne;
