import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Container, Typography, Grid, Button, Select, MenuItem, FormControl, InputLabel, withStyles } from '@material-ui/core';
import FormularioReutilizable from '../../components/Formulario Reutilizable/FormularioReutilizable';

const CustomInputLabel = withStyles((theme) => ({
  root: {
    '&$focused': {
      color: theme.palette.primary.main,
    },
  },
  focused: {},
}))(InputLabel);

const Cliente = () => {
  const formFields1 = [
    { name: 'name', label: 'Nombre', type: 'text' },
    { name: 'contacto', label: 'Contacto', type: 'text' },
    { name: 'Obs', label: 'Observaciones', type: 'text' },
  ];

  const [localidad, setLocalidad] = useState('');
  const [formData, setFormData] = useState({});

  const handleDropdownChange = (event) => {
    const selectedLocalidad = event.target.value;
    if (selectedLocalidad === 'localidad') {
      setLocalidad('');
    } else {
      setLocalidad(selectedLocalidad);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Formulario enviado', formData);
  };

  return (
    <Grid>
      <Navbar />
      <Container>
        <Typography component='h1' variant='h5'>Cliente</Typography>
        <FormularioReutilizable fields={formFields1} formData={formData} handleChange={handleChange} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FormControl variant="outlined" style={{ marginBottom: '16px', marginTop: '16px', width: '100%' }}>
            <CustomInputLabel style={{ backgroundColor: '#fff' }} htmlFor="demo-customized-select-label">Localidad</CustomInputLabel>
            <Select
              labelId="demo-customized-select-label"
              value={localidad}
              onChange={handleDropdownChange}
              displayEmpty
            >
              <MenuItem value="">
                <em>Seleccionar</em>
              </MenuItem>
              <MenuItem value="opcion1">Opción 1</MenuItem>
              <MenuItem value="opcion2">Opción 2</MenuItem>
              <MenuItem value="opcion3">Opción 3</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Enviar
          </Button>
        </div>
      </Container>
    </Grid>
  );
};

export default Cliente;
