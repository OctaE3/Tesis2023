import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, Dialog, IconButton, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
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
  customTooltip: {
    maxWidth: 800,
    fontSize: 16,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '80vw',
    },

    [theme.breakpoints.up('md')]: {
      maxWidth: 800,
    },
  },
  text: {
    color: '#2D2D2D',
  },
  liTitle: {
    color: 'black',
    fontWeight: 'bold',
  },
}));

const AgregarCliente = () => {
  const formFieldsModal = [
    { name: 'localidadDepartamento', label: 'Departamento', type: 'text', color: 'primary' },
    { name: 'localidadCiudad', label: 'Ciudad', type: 'text', color: 'primary' },
  ];

  const formFields = [
    { name: 'clienteNombre', label: 'Nombre', type: 'text', color: 'primary' },
    { name: 'clienteEmail', label: 'Email', type: 'email', color: 'primary' },
    { name: 'clienteContacto', label: 'Contacto', type: 'phone', color: 'primary' },
    { name: 'clienteObservaciones', label: 'Observaciones', type: 'text', multi: '3', color: 'secondary' },
    { name: 'clienteLocalidad', label: 'Localidad', type: 'selector', alta: 'si', altaCampos: formFieldsModal, color: 'primary' }
  ];

  const alertSuccess = [
    { title: 'Correcto', body: 'Cliente agregado con éxito!', severity: 'success', type: 'description' },
  ];

  const alertError = [
    { title: 'Error', body: 'No se logro agregar el cliente, revise los datos ingresados.', severity: 'error', type: 'description' },
  ];

  const classes = useStyles();
  const [cliente, setCliente] = useState({});
  const [localidad, setLocalidad] = useState({});
  const [localidades, setLocalidades] = useState([]);
  const [localidadesSelect, setLocalidadesSelect] = useState([]);
  const [reloadLocalidades, setReloadLocalidades] = useState(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
          setShowAlertSuccess(true);
          setTimeout(() => {
            setShowAlertSuccess(false);
          }, 5000);
        } else {
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 5000);
        }
      })
      .catch(error => {
        console.error(error);
      })

  }

  const handleFormSubmitModal = (formDataModal) => {

    const localidadDepartamento = formDataModal.localidadDepartamento;
    const localidadCiudad = formDataModal.localidadCiudad;

    const localidadesExisten = localidades.some(localidad => {
      return localidad.departamento === localidadDepartamento && localidad.ciudad === localidadCiudad;
    });

    setLocalidad(formDataModal);
    console.log(formDataModal);

    if (!localidadesExisten) {
      axios.post('/agregar-localidad', formDataModal, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (response.status === 201) {
            alertSuccess.forEach((alert) => {
              alert.body = `Localidad agregada con éxito!`;
            });
            setShowAlertSuccess(true);
            setTimeout(() => {
              setShowAlertSuccess(false);
            }, 5000);
            setReloadLocalidades(true);
  
          } else {
            alertError.forEach((alert) => {
              alert.body = `No se logro agregar la localidad, revise los datos ingresados.`;
            });
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 5000);
          }
        })
        .catch(error => {
          console.error(error);
        })
    } else {
      alertError.forEach((alert) => {
        alert.body = `Esa localidad ya existe.`;
      });
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 5000);
    }
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
                  <Typography component='h1' variant='h4'>Agregar Cliente</Typography>
                  <div>
                    <Button color="primary" onClick={handleClickOpen}>
                      <IconButton>
                        <HelpOutlineIcon fontSize="large" color="primary" />
                      </IconButton>
                    </Button>
                    <Dialog
                      fullScreen={fullScreen}
                      fullWidth='md'
                      maxWidth='md'
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="responsive-dialog-title"
                    >
                      <DialogTitle id="responsive-dialog-title">Explicación del formulario.</DialogTitle>
                      <DialogContent>
                        <DialogContentText className={classes.text}>
                          <span>
                            En esta página puedes registrar los clientes, asegúrate de completar los campos necesarios para registrar el estado.
                          </span>
                          <br />
                          <span>
                            Este formulario cuenta con 5 campos:
                            <ul>
                              <li>
                                <span className={classes.liTitle}>Nombre</span>: en este campo se debe ingresar el nombre de la empresa o del cliente.
                              </li>
                              <li>
                                <span className={classes.liTitle}>Email</span>: en este campo se debe ingresar el mail proporcionado por el cliente.
                              </li>
                              <li>
                                <span className={classes.liTitle}>Contacto</span>: en este campo se ingresa el número de teléfono del cliente, 
                                en caso de que tenga mas de un teléfono, se puede agregar mas al darle click al icono de mas a la derecha del campo 
                                y si desea eliminar el campo, consta en darle click a la X a la derecha del campo generado.
                              </li>
                              <li>
                                <span className={classes.liTitle}>Observaciones</span>: en este campo se pueden registrar las observaciones o detalles necesarios del cliente.
                              </li>
                              <li>
                                <span className={classes.liTitle}>Localidad</span>: en este campo se puede seleccionar la localidad en donde esta ubicado el cliente o su empresa, 
                                en caso de querer añadir una localidad nueva, es posible dandole al icono de más a la derecha del campo.
                              </li>
                            </ul>
                          </span>
                          <span>
                            Campos obligatorios y no obligatorios:
                            <ul>
                              <li>
                                <span className={classes.liTitle}>Campos con contorno azul</span>: los campos con contorno azul son obligatorio, se tienen que completar sin excepción.
                              </li>
                              <li>
                                <span className={classes.liTitle}>Campos con contorno rojo</span>: en cambio, los campos con contorno rojo no son obligatorios, se pueden dejar vacíos de ser necesario.
                              </li>
                            </ul>
                          </span>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} color="primary" autoFocus>
                          Cerrar
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                </Grid>
                <Grid item lg={2} md={2}></Grid>
              </Grid>
              <Grid container spacing={0}>
                <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
                <Grid item lg={4} md={4} sm={4} xs={4}>
                  <AlertasReutilizable alert={alertSuccess} isVisible={showAlertSuccess} />
                  <AlertasReutilizable alert={alertError} isVisible={showAlertError} />
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
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
