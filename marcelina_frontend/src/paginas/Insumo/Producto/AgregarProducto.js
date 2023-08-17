import React, { useState, useEffect } from 'react'
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

const AgregarProducto = () => {
    const formFields = [
      { name: 'productoNombre', label: 'Nombre', type: 'text' },
      { name: 'productoCodigo', label: 'Codigo', type: 'text' },
    ];
  
    const classes = useStyles();
    const [producto, setProducto] = useState({});
  
    const handleFormSubmit = (formData) => {
      setProducto(formData);
      console.log(formData);
      axios.post('/agregar-producto', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (response.status === 201) {
            console.log("Producto agregada con éxito!");
          } else {
            console.log("No se logro agregar el producto");
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
                <Typography component='h1' variant='h4'>Agregar Producto</Typography>
                <Tooltip title={
                  <Typography fontSize={16}>
                    En esta pagina puedes registrar los productos que realizan la marcelina.
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
            onSubmit={handleFormSubmit} />
      </Grid>
    )
  }
  
  export default AgregarProducto;