import React, { useState } from 'react'
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

const AgregarControlDeTemperaturaDeEsterilizadores = () => {
  const formFields = [
    { name: 'controlDeTemperaturaDeEsterilizadoresFecha', label: 'Fecha y Hora', type: 'datetime-local' },
    { name: 'controlDeTemperaturaDeEsterilizadoresTemperatura1', label: 'Temperatura 1', type: 'number', adornment: 'si', unit: '°C' },
    { name: 'controlDeTemperaturaDeEsterilizadoresTemperatura2', label: 'Temperatura 2', type: 'number', adornment: 'si', unit: '°C' },
    { name: 'controlDeTemperaturaDeEsterilizadoresTemperatura3', label: 'Temperatura 3', type: 'number', adornment: 'si', unit: '°C' },
    { name: 'controlDeTemperaturaDeEsterilizadoresObservaciones', label: 'Observaciones', type: 'text', multi: '3' },
  ];

  const classes = useStyles();
  const [controlDeTemperatura, setControlDeTemperatura] = useState({});

  const handleFormSubmit = (formData) => {
    const controlDeTemperaturaConResponsable = {
      ...formData,
      controlDeTemperaturaDeEsterilizadoresResponsable: window.localStorage.getItem('user'),
    }                                                               
    setControlDeTemperatura(controlDeTemperaturaConResponsable);
    console.log(controlDeTemperaturaConResponsable);
    axios.post('/agregar-control-de-temperatura-de-esterilizadores', controlDeTemperaturaConResponsable, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    }) 
      .then(response => {
        if (response.status === 201) {
          console.log("Se registro el control de temperatura de esterilizadores con éxito!");
        } else {
          console.log("No se logro regristrar el control de temperatura de esterilizadores, revise los datos");
        }
      })
      .catch(error => {
        console.error(error);
      })

  }

  return (
    <Grid>
      <Navbar />
      <Container style={{ marginTop: 30 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid item lg={2} md={2} ></Grid>
            <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
              <Typography component='h1' variant='h4'>Control de Temperatura de Esterilizadores</Typography>
              <Tooltip title={
                <Typography fontSize={16}>
                  En esta página puedes registrar el Control de Temperatura de Esterilizadores.
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
      />
    </Grid>
  )
}

export default AgregarControlDeTemperaturaDeEsterilizadores;