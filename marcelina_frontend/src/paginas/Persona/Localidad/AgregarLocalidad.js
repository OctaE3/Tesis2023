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

const AgregarLocalidad = () => {
  const formFields = [
    { name: 'localidadDepartamento', label: 'Departamento', type: 'text' },
    { name: 'localidadCiudad', label: 'Ciudad', type: 'text' },
  ];

  const classes = useStyles();
  const [localidad, setLocalidad] = useState({});

  const handleFormSubmit = (formData) => {
    setLocalidad(formData);
    console.log(formData);
    axios.post('/agregar-localidad', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.status === 201) {
          console.log("Localidad agregada con éxito!");
        } else {
          console.log("No se logro agregar la localidad");
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
              <Typography component='h1' variant='h4'>Agregar Localidad</Typography>
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
      <FormularioReutilizanle fields={formFields} onSubmit={handleFormSubmit} />
    </Grid>
  )
}

export default AgregarLocalidad;