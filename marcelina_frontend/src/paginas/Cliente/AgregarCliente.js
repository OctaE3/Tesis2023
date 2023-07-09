import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Container, Typography, Grid, CssBaseline, Box, Tooltip, IconButton } from '@material-ui/core';
import FormularioReutilizable from '../../components/Formulario Reutilizable/FormularioReutilizable';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import axios from 'axios';

const AgregarCliente = () => {
  const formFields = [
    { name: 'clienteNombre', label: 'Nombre', type: 'text' },
    { name: 'clienteContacto', label: 'Contacto', type: 'text' },
    { name: 'clienteObservaciones', label: 'Observaciones', type: 'text', multi: '3' },
    { name: 'clienteLocalidad', label: 'Localidad', type: 'selector' }
  ];

  const [cliente, setLocalidad] = useState({});
  const [localidades, setLocalidades] = useState([]);
  const [localidadesSelect, setLocalidadesSelect] = useState([]);

  useEffect(() => {
    const obtenerLocalidades = () => {
      axios.get('/listar-localidades', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          setLocalidades(response.data);
          setLocalidadesSelect(
            response.data.map((localidad) => ({
              value: localidad.localidadId,
              label: localidad.localidadNombre,
            }))
          );
        })
        .catch(error => {
          console.error(error);
        });
    };

    obtenerLocalidades();
  }, []);

  const handleFormSubmit = (formData) => {
    const localidadSeleccionadaObj = localidades.filter((localidad) => localidad.localidadId.toString() === formData.clienteLocalidad)[0];

    const clienteConLocalidad = {
      ...formData,
      clienteLocalidad: localidadSeleccionadaObj ? localidadSeleccionadaObj : null
  };

    setLocalidad(clienteConLocalidad);
    axios.post('/agregar-cliente', clienteConLocalidad, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.status === 201) {
          console.log("Cliente agregado con éxito!");
        } else {
          console.log("No se logro agregar el cliente");
        }
      })
      .catch(error => {
        console.error(error);
      })

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
                <Grid item lg={8} md={8} sm={12} xs={12} >
                  <Typography component='h1' variant='h5'>Agregar Cliente</Typography>
                  <Tooltip title={
                    <Typography fontSize={16}>
                      En esta pagina puedes registrar los clientes.
                    </Typography>
                  }>
                    <IconButton>
                      <HelpOutlineIcon fontSize="large" color="primary" />
                    </IconButton>
                  </Tooltip>
                  <FormularioReutilizable
                    fields={formFields}
                    onSubmit={handleFormSubmit}
                    selectOptions={{ clienteLocalidad: localidadesSelect }}
                  />
                </Grid>
                <Grid item lg={2} md={2}></Grid>
              </Grid>
            </Box>
          </Container>
        </Grid>
      </CssBaseline>
    </div>
  );
};

export default AgregarCliente;
