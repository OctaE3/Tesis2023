import React, { useState } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, Dialog, IconButton, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import FormularioReutilizanle from '../../../components/Reutilizable/FormularioReutilizable'
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

const AgregarControlDeTemperaturaEnCamaras = () => {
  const formFields = [
    { name: 'controlDeTemperaturaEnCamarasNroCamara', label: 'Número de Camara', type: 'selector', color: 'primary' },
    { name: 'controlDeTemperaturaEnCamarasFecha', label: 'Fecha', type: 'date', color: 'primary' },
    { name: 'controlDeTemperaturaEnCamarasHora', label: 'Hora', type: 'number', color: 'primary' },
    { name: 'controlDeTemperaturaEnCamarasTempInterna', label: 'Temperatura Interna', type: 'number', adornment: 'si', unit: '°C', color: 'primary' },
    { name: 'controlDeTemperaturaEnCamaraTempExterna', label: 'Temperatura Externa', type: 'number', adornment: 'si', unit: '°C', color: 'primary' },
  ];

  const alertSuccess = [
    { title: 'Correcto', body: 'Se registro el control de temperatura en camaras con éxito!', severity: 'success', type: 'description' },
  ];

  const alertError = [
    { title: 'Error', body: 'No se logro regristrar el control de temperatura en camaras, revise los datos ingresados', severity: 'error', type: 'description' },
  ];

  const classes = useStyles();
  const [controlDeTemperatura, setControlDeTemperatura] = useState({});
  const [selectNroCamara, setSelectNroCamara] = useState([
    { value: 'Camara 1', label: 'Camara 1' },
    { value: 'Camara 2', label: 'Camara 2' },
    { value: 'Camara 3', label: 'Camara 3' },
    { value: 'Camara 4', label: 'Camara 4' },
    { value: 'Camara 5', label: 'Camara 5' },
    { value: 'Camara 6', label: 'Camara 6' },
  ]);
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

  const handleFormSubmit = (formData) => {

    setControlDeTemperatura(formData);
    console.log(formData);
    axios.post('/agregar-control-de-temperatura-en-camaras', formData, {
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

  return (
    <Grid>
      <Navbar />
      <Container style={{ marginTop: 30 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid item lg={2} md={2} ></Grid>
            <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
              <Typography component='h1' variant='h4'>Control de Temperatura en Cámaras</Typography>
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
                        En esta página puedes registrar la temperatura interna y externa de las distintas cámaras, asegúrate de completar los campos necesarios para registrar el estado.
                      </span>
                      <br />
                      <span>
                        Este formulario cuenta con 5 campos:
                        <ul>
                          <li>
                            <span className={classes.liTitle}>Número de la cámara</span>: en este campo se debe seleccionar la cámara de la cual se midió su temperatura interna y externa.
                          </li>
                          <li>
                            <span className={classes.liTitle}>Fecha</span>: en este campo se debe registrar la fecha en la que se midió la temperatura de la cámara.
                          </li>
                          <li>
                            <span className={classes.liTitle}>Hora</span>: en este campo se registrará la hora en la que se midió la temperatura de la cámara.
                          </li>
                          <li>
                            <span className={classes.liTitle}>Temperatura Interna</span>: en este campo se registrará la temperatura interna de la cámara seleccionada.
                          </li>
                          <li>
                            <span className={classes.liTitle}>Temperatura Externa</span>: en este campo se registrará la temperatura externa de la cámara seleccionada.
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
      <FormularioReutilizanle
        fields={formFields}
        onSubmit={handleFormSubmit}
        selectOptions={{ controlDeTemperaturaEnCamarasNroCamara: selectNroCamara }}
      />
    </Grid>
  )
}

export default AgregarControlDeTemperaturaEnCamaras;