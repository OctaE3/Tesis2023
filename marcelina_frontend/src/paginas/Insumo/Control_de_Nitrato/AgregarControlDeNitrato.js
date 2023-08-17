import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import { Container, Box, Grid, Typography, FormControl, InputLabel, Select, makeStyles, CssBaseline, Tooltip, IconButton, createTheme } from '@material-ui/core';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
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

const AgregarControlDeNitrato = () => {
  const formFields = [
    { name: 'controlDeNitratoFecha', label: 'Fecha', type: 'date' },
    { name: 'controlDeNitratoProductoLote', label: 'Producto / Lote', type: 'text' },
    { name: 'controlDeNitratoCantidadUtilizada', label: 'Cantidad Utilizada', type: 'number' },
    { name: 'controlDeNitratoStock', label: 'Stock', type: 'text', disabled: 'si' },
    { name: 'controlDeNitratoObservaciones', label: 'Observaciones', type: 'text', multi: '3' },
  ];

  const classes = useStyles();
  const [nitrato, setNitrato] = useState({});
  const [listaN, setListaN] = useState([]);
  const [nitratoStock, setNitratoStock] = useState(0);

  useEffect(() => {
    const obtenerNitratos = () => {
      axios.get('/listar-control-de-nitrato', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          setListaN(response.data);
          if(response.data.length > 0) {
            const ultimoNitrato = response.data[response.data.length - 1];
            setNitratoStock(ultimoNitrato.controlDeNitratoStock);
          }
        })
        .catch(error => {
          console.error(error);
        });
    };

    obtenerNitratos();
  }, []);

  const handleFormSubmit = (formData) => {
    const { stock, ...formDataWithoutStock } = formData;

    console.log(stock);
    console.log(formDataWithoutStock.controlDeNitratoCantidadUtilizada);

    const stockRestante = parseInt(stock) - parseInt(formDataWithoutStock.controlDeNitratoCantidadUtilizada);

    console.log(stockRestante);

    const controlDeNitratoConResponsable = {
      ...formDataWithoutStock,
      controlDeNitratoStock: stockRestante,
      controlDeNitratoResponsable: window.localStorage.getItem('user'),
    }
    console.log(controlDeNitratoConResponsable);
    axios.post('/agregar-control-de-nitrato', controlDeNitratoConResponsable, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.status === 201) {
          console.log("Control de nitrato agregada con éxito!");
        } else {
          console.log("No se logro agregar el Control de nitrato");
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
              <Typography component='h1' variant='h4'>Agregar Control de Nitrato </Typography>
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
      <FormularioReutilizable
        fields={formFields}
        onSubmit={handleFormSubmit} 
        selectOptions={{ controlDeNitratoStock: nitratoStock, }}
      />
    </Grid>
  )
}

export default AgregarControlDeNitrato;