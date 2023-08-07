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

const AgregarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias = () => {
  const formFields = [
    { name: 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha', label: 'Fecha', type: 'date' },
    { name: 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito', label: 'Depositos', type: 'selector', multiple: 'si' },
    { name: 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias', label: 'Cañerias', type: 'text' },
    { name: 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones', label: 'Observaciones', type: 'text', multi: '3' },
  ];

  const classes = useStyles();
  const [controlDeLimpieza, setControlDeLimpieza] = useState({});
  const [depositoSelect, setDepositoSelect] = useState([
    { value: '1', label: 'Deposito de Agua 1' },
    { value: '2', label: 'Deposito de Agua 2' },
    { value: '3', label: 'Deposito de Agua 3' },
  ]);

  const handleFormSubmit = (formData) => {
    const controlDeLimpiezaConResponsable = {
      ...formData,
      controlDeCloroLibreResponsable: window.localStorage.getItem('user'),
    }                                                               
    setControlDeLimpieza(controlDeLimpiezaConResponsable);
    console.log(controlDeLimpiezaConResponsable);
    axios.post('/agregar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-canierias', controlDeLimpiezaConResponsable, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    }) 
      .then(response => {
        if (response.status === 201) {
          console.log("Se registro el control de limpieza y desinfeccion de depositos de agua y canierias con éxito!");
        } else {
          console.log("No se logro regristrar el control de limpieza y desinfeccion de depositos de agua y canierias, revise los datos");
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
              <Typography component='h1' variant='h4'>Control de Limpieza y Desinfeccion de Depositos de Agua y Canierias</Typography>
              <Tooltip title={
                <Typography fontSize={16}>
                  En esta página puedes registrar el Control de Limpieza y Desinfeccion de Depositos de Agua y Canierias.
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
        selectOptions={{ controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito: depositoSelect }}
      />
    </Grid>
  )
}

export default AgregarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias;