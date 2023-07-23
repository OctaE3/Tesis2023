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

const AgregarControlDeMejorasEnInstalaciones = () => {
  const formFields = [
    { name: 'controlDeMejorasEnInstalacionesFecha', label: 'Fecha', type: 'date' },
    { name: 'controlDeMejorasEnInstalacionesSector', label: 'Sector', type: 'text' },
    { name: 'controlDeMejorasEnInstalacionesDefecto', label: 'Defecto', type: 'text' },
    { name: 'controlDeMejorasEnInstalacionesMejoraRealizada', label: 'Mejora Realizada', type: 'text', multi: '3' },
  ];

  const classes = useStyles();
  const [controlDeMejoras, setControlDeMejoras] = useState({});

  const handleFormSubmit = (formData) => {
    const controlDeMejorasConResponsable = {
      ...formData,
      controlDeMejorasEnInstalacionesResponsable: window.localStorage.getItem('user'),
    }                                                               
    setControlDeMejoras(controlDeMejorasConResponsable);
    console.log(controlDeMejorasConResponsable);
    axios.post('/agregar-control-de-mejoras-en-instalaciones', controlDeMejorasConResponsable, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    }) 
      .then(response => {
        if (response.status === 201) {
          console.log("Se registro el control de mejoras en instalaciones con éxito!");
        } else {
          console.log("No se logro regristrar el control de mejoras en instalaciones, revise los datos");
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
              <Typography component='h1' variant='h4'>Control de Mejoras en Instalaciones</Typography>
              <Tooltip title={
                <Typography fontSize={16}>
                  En esta página puedes registrar el Control de Mejoras en Instalaciones.
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

export default AgregarControlDeMejorasEnInstalaciones;