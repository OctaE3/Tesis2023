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

const AgregarControlDeReposicionDeCloro = () => {
  const formFields = [
    { name: 'controlDeReposicionDeCloroFecha', label: 'Fecha', type: 'date' },
    { name: 'controlDeReposicionDeCloroCantidadDeAgua', label: 'Cantidad de Agua', type: 'number', adornment: 'si', unit: 'L' },
    { name: 'controlDeReposicionDeCloroCantidadDeCloroAdicionado', label: 'Cloro Adicionado', type: 'number', adornment: 'si', unit: 'L' },
    { name: 'controlDeReposicionDeCloroObservaciones', label: 'Mejora Realizada', type: 'text', multi: '3' },
  ];

  const classes = useStyles();
  const [controlDeReposicion, setControlDeReposicion] = useState({});

  const handleFormSubmit = (formData) => {
    const controlDeReposicionConResponsable = {
      ...formData,
      controlDeReposicionDeCloroResponsable: window.localStorage.getItem('user'),
    }                                                               
    setControlDeReposicion(controlDeReposicionConResponsable);
    console.log(controlDeReposicionConResponsable);
    axios.post('/agregar-control-de-reposicion-de-cloro', controlDeReposicionConResponsable, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    }) 
      .then(response => {
        if (response.status === 201) {
          console.log("Se registro el control de resposicion de cloro con éxito!");
        } else {
          console.log("No se logro regristrar el control de reposicion de cloro, revise los datos");
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
              <Typography component='h1' variant='h4'>Control de Reposicion de Cloro</Typography>
              <Tooltip title={
                <Typography fontSize={16}>
                  En esta página puedes registrar el Control de Reposicion de Cloro.
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

export default AgregarControlDeReposicionDeCloro;