import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Tooltip, IconButton, makeStyles, createTheme } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import FormularioReutilizanle from '../../components/Formulario Reutilizable/FormularioReutilizable'
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

const AgregarControlDeTemperaturaEnCamaras = () => {
  const formFields = [
    { name: 'controlDeTemperaturaEnCamarasNroCamara', label: 'Número de Camara', type: 'selector' },
    { name: 'controlDeTemperaturaEnCamarasFecha', label: 'Fecha', type: 'date' },
    { name: 'controlDeTemperaturaEnCamarasHora', label: 'Hora', type: 'number' },
    { name: 'controlDeTemperaturaEnCamarasTempInterna', label: 'Temperatura Interna', type: 'number', adornment: 'si', unit: '°C' },
    { name: 'controlDeTemperaturaEnCamarasTempExterna', label: 'Temperatura Externa', type: 'number', adornment: 'si', unit: '°C' },
  ];

  const classes = useStyles();
  const [controlDeTemperatura, setControlDeTemperatura] = useState({});
  const [selectNroCamara, setSelectNroCamara] = useState([
    { value: 'Camara 1', label: 'Camara 1' },
    { value: 'Camara 2', label: 'Camara 2' },
    { value: 'Camara 3', label: 'Camara 3' },
    { value: 'Camara 4', label: 'Camara 4' },
    { value: 'Camara 5', label: 'Camara 5' },
    { value: 'Camara 6', label: 'Camara 6' },
  ]);

  const handleFormSubmit = (formData) => {

    setControlDeTemperatura(formData);
    console.log(formData);
    axios.post('/agregar-control-de-temperatura-de-esterilizadores', formData, {
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
        selectOptions={{ controlDeTemperaturaEnCamarasNroCamara : selectNroCamara }}
      />
    </Grid>
  )
}

export default AgregarControlDeTemperaturaEnCamaras;