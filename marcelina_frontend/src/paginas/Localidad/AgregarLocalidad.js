import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Container, Typography, Grid } from '@material-ui/core'
import FormularioReutilizanle from '../../components/Formulario Reutilizable/FormularioReutilizable'
import axios from 'axios';

const AgregarLocalidad = () => {
  const formFields = [
    { name: 'localidadNombre', label: 'Nombre', type: 'text' },
  ];

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
      <Container>
        <Typography component='h1' variant='h5'>Localidad</Typography>
        <FormularioReutilizanle fields={formFields} onSubmit={handleFormSubmit} />
      </Container>
    </Grid>
  )
}

export default AgregarLocalidad;