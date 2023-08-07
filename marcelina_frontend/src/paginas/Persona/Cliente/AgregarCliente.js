import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import { Container, Typography, Grid, CssBaseline, Box, Tooltip, IconButton, makeStyles, createTheme } from '@material-ui/core';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useNavigate } from 'react-router-dom';
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

const AgregarCliente = () => {
  const formFieldsModal = [
    { name: 'localidadDepartamento', label: 'Departamento', type: 'text' },
    { name: 'localidadCiudad', label: 'Ciudad', type: 'text' },
  ];

  const formFields = [
    { name: 'clienteNombre', label: 'Nombre', type: 'text', validation: 'text' },
    { name: 'clienteEmail', label: 'Email', type: 'email', validation: 'email' },
    { name: 'clienteContacto', label: 'Contacto', type: 'phone', validation: 'phone' },
    { name: 'clienteObservaciones', label: 'Observaciones', type: 'text', multi: '3' },
    { name: 'clienteLocalidad', label: 'Localidad', type: 'selector', alta: 'si', altaCampos: formFieldsModal, validation: 'select' }
  ];

  const classes = useStyles();
  const [cliente, setCliente] = useState({});
  const [localidad, setLocalidad] = useState({});
  const [localidades, setLocalidades] = useState([]);
  const [localidadesSelect, setLocalidadesSelect] = useState([]);
  const [reloadLocalidades, setReloadLocalidades] = useState(false);

  const navigate = useNavigate();

    const redireccionar = () => {
        navigate('/proveedor');
    }

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
              label: localidad.localidadCiudad,
            }))
          );
        })
        .catch(error => {
          console.error(error);
        });
    };

    obtenerLocalidades();

    if (reloadLocalidades) {
      obtenerLocalidades();
      setReloadLocalidades(false);
    }
  }, [reloadLocalidades]);

  const handleFormSubmit = (formData) => {
    const localidadSeleccionadaObj = localidades.filter((localidad) => localidad.localidadId.toString() === formData.clienteLocalidad)[0];

    const clienteConLocalidad = {
      ...formData,
      clienteLocalidad: localidadSeleccionadaObj ? localidadSeleccionadaObj : null
    };

    setCliente(clienteConLocalidad);
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

  const handleFormSubmitModal = (formDataModal) => {
    setLocalidad(formDataModal);
    console.log(formDataModal);
    axios.post('/agregar-localidad', formDataModal, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.status === 201) {
          console.log("Localidad agregada con éxito!");
          setReloadLocalidades(true);
          redireccionar();

        } else {
          console.log("No se logro agregar la localidad");
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
                <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title} >
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
                </Grid>
                <Grid item lg={2} md={2}></Grid>
              </Grid>
            </Box>
          </Container>
          <FormularioReutilizable
            fields={formFields}
            onSubmit={handleFormSubmit}
            onSubmitModal={handleFormSubmitModal}
            selectOptions={{ clienteLocalidad: localidadesSelect }}
          />
        </Grid>
      </CssBaseline>
    </div>
  );
};

export default AgregarCliente;
