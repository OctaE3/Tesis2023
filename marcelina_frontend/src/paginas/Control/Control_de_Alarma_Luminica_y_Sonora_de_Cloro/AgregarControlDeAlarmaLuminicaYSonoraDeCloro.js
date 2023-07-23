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

const AgregarControlDeAlarmaLuminicaYSonoraDeCloro = () => {
  const formFields = [
    { name: 'controlDeAlarmaLuminicaYSonoraDeCloroFechaHora', label: 'Fecha y Hora', type: 'datetime-local' },
    { name: 'controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica', label: 'Alarma Lumínica', type: 'selector' },
    { name: 'controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora', label: 'Alarma Sonora', type: 'selector' },
    { name: 'controlDeAlarmaLuminicaYSonoraDeCloroObservaciones', label: 'Observaciones', type: 'text', multi: '3' },
  ];

  const classes = useStyles();
  const [controlDeAlarmas, setControlDeAlarmas] = useState({});
  const [selectAlarmas, setSelectAlarmas] = useState([
    { value: true, label: 'Funciona' },
    { value: false, label: 'No Funciona' }
  ]);

  const handleFormSubmit = (formData) => {
    const controlDeAlarmasConResponsable = {
      ...formData,
      controlDeAlarmaLuminicaYSonoraDeCloroResponsable: window.localStorage.getItem('user'),
    }
    setControlDeAlarmas(controlDeAlarmasConResponsable);
    console.log(controlDeAlarmasConResponsable);
    axios.post('/agregar-control-de-alarma-luminica-y-sonora-de-cloro', controlDeAlarmasConResponsable, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    }) 
      .then(response => {
        if (response.status === 201) {
          console.log("Se registro el estado de las alarmas con éxito!");
        } else {
          console.log("No se logro regristrar el estado de las alarmas, revise los datos");
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
              <Typography component='h1' variant='h4'>Registrar estado de alarmas lumínicas y sonoras de cloro</Typography>
              <Tooltip title={
                <Typography fontSize={16}>
                  En esta página puedes registrar el estado de las alarmas lumínicas y sonoras de cloro de la chacinería.
                  Asegúrate de completar los campos necesarios para registrar el estado.
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
          controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica: selectAlarmas,
          controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora: selectAlarmas,
        }}
      />
    </Grid>
  )
}

export default AgregarControlDeAlarmaLuminicaYSonoraDeCloro;