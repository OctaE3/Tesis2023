import React, { useState, useEffect } from 'react'
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
  liTitleBlue: {
    color: 'blue',
    fontWeight: 'bold',
  },
  liTitleRed: {
    color: 'red',
    fontWeight: 'bold',
  },
  blinkingButton: {
    animation: '$blink 1s infinite',
  },
  '@keyframes blink': {
    '0%': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    '50%': {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.main,
    },
    '100%': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  },
}));

const AgregarControlDeTemperaturaDeEsterilizadores = () => {
  const text = "Este campo es Obligatorio";

  const formFields = [
    { name: 'controlDeTemperaturaDeEsterilizadoresFecha', label: 'Fecha y Hora', type: 'datetime-local', color: 'primary' },
    { name: 'controlDeTemperaturaDeEsterilizadoresTemperatura1', label: 'Temperatura 1', type: 'text', obligatorio: true, text: text, pattern: "^[0-9]{0,10}$", adornment: 'si', unit: '°C', color: 'primary' },
    { name: 'controlDeTemperaturaDeEsterilizadoresTemperatura2', label: 'Temperatura 2', type: 'text', obligatorio: true, text: text, pattern: "^[0-9]{0,10}$", adornment: 'si', unit: '°C', color: 'primary' },
    { name: 'controlDeTemperaturaDeEsterilizadoresTemperatura3', label: 'Temperatura 3', type: 'text', obligatorio: true, text: text, pattern: "^[0-9]{0,10}$", adornment: 'si', unit: '°C', color: 'primary' },
    { name: 'controlDeTemperaturaDeEsterilizadoresObservaciones', label: 'Observaciones', type: 'text', pattern: "^[A-Za-z0-9\\s,.]{0,250}$", multi: '3', color: 'secondary' },
  ];

  const [alertSuccess, setAlertSuccess] = useState({
    title: 'Correcto', body: 'Se registro el control de temperatura de esterilizadores con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logro regristrar el control de temperatura de esterilizadores, revise los datos ingresados', severity: 'error', type: 'description'
  });

  const [alertWarning, setAlertWarning] = useState({
    title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  const classes = useStyles();
  const [controlDeTemperatura, setControlDeTemperatura] = useState({});
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [blinking, setBlinking] = useState(true);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking((prevBlinking) => !prevBlinking);
    }, 500);

    setTimeout(() => {
      clearInterval(blinkInterval);
      setBlinking(false);
    }, 5000);

    return () => {
      clearInterval(blinkInterval);
    };
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateErrorAlert = (newBody) => {
    setAlertError((prevAlert) => ({
      ...prevAlert,
      body: newBody,
    }));
  };

  const checkError = (fecha, temp1, temp2, temp3) => {
    if (fecha === undefined || fecha === null) {
      return false;
    }
    else if (temp1 === undefined || temp1 === null || temp1 === "") {
      return false;
    }
    else if (temp2 === undefined || temp2 === null || temp2 === "") {
      return false;
    }
    else if (temp3 === undefined || temp3 === null || temp3 === "") {
      return false;
    }
    return true;
  }

  const handleFormSubmit = (formData) => {
    const controlDeTemperaturaConResponsable = {
      ...formData,
      controlDeTemperaturaDeEsterilizadoresResponsable: window.localStorage.getItem('user'),
    }
    console.log(controlDeTemperaturaConResponsable);

    const fecha = controlDeTemperaturaConResponsable.controlDeTemperaturaDeEsterilizadoresFecha;
    const temp1 = controlDeTemperaturaConResponsable.controlDeTemperaturaDeEsterilizadoresTemperatura1;
    const temp2 = controlDeTemperaturaConResponsable.controlDeTemperaturaDeEsterilizadoresTemperatura2;
    const temp3 = controlDeTemperaturaConResponsable.controlDeTemperaturaDeEsterilizadoresTemperatura3;

    const check = checkError(fecha, temp1, temp2, temp3);

    if (check === false) {
      updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 7000);
    } else {
      axios.post('/agregar-control-de-temperatura-de-esterilizadores', controlDeTemperaturaConResponsable, {
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
            updateErrorAlert('No se logro regristrar el control de temperatura de esterilizadores, revise los datos ingresados.');
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 5000);
          }
        })
        .catch(error => {
          if (error.request.status === 401) {
            setShowAlertWarning(true);
            setTimeout(() => {
              setShowAlertWarning(false);
            }, 5000);
          }
          else if (error.request.status === 500) {
            updateErrorAlert('No se logro regristrar el control de temperatura de esterilizadores, revise los datos ingresados.');
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 5000);
          }
        })
    }
  }

  return (
    <Grid>
      <Navbar />
      <Container style={{ marginTop: 30 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid item lg={2} md={2} ></Grid>
            <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
              <Typography component='h1' variant='h4'>Control de Temperatura de Esterilizadores</Typography>
              <div>
                <Button color="primary" onClick={handleClickOpen}>
                  <IconButton className={blinking ? classes.blinkingButton : ''}>
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
                        En esta página puedes registrar las temperaturas de los esterilizadores, asegúrate de completar los campos necesarios para registrar las temperaturas.
                      </span>
                      <br />
                      <span>
                        Este formulario cuenta con 5 campos:
                        <ul>
                          <li>
                            <span className={classes.liTitleBlue}>Fecha y Hora</span>: en este campo se debe seleccionar la fecha y hora, en la que se midió la temperatura de los esterilizadores.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Temperatura 1</span>: en este campo se debe registrar la primera temperatura que se obtuvo al medir, de los esterilizadores.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Temperatura 2</span>: en este campo se debe registrar la segunda temperatura que se obtuvo al medir, de los esterilizadores.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Temperatura 3</span>: en este campo se debe registrar la tercera temperatura que se obtuvo al medir, de los esterilizadores.
                          </li>
                          <li>
                            <span className={classes.liTitleRed}>Observaciones</span>: en este campo se pueden registrar las observaciones o detalles necesarios que se encontraron al momento de medir las temperaturas de los esterilizadores.
                          </li>
                        </ul>
                      </span>
                      <span>
                        Campos obligatorios y no obligatorios:
                        <ul>
                          <li>
                            <span className={classes.liTitleBlue}>Campos con contorno azul y con asterisco en su nombre</span>: los campos con contorno azul y asterisco son obligatorios, se tienen que completar sin excepción.
                          </li>
                          <li>
                            <span className={classes.liTitleRed}>Campos con contorno rojo</span>: en cambio, los campos con contorno rojo no son obligatorios, se pueden dejar vacíos de ser necesario.
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
              <AlertasReutilizable alert={alertWarning} isVisible={showAlertWarning} />
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
          </Grid>
        </Box>
      </Container>
      <FormularioReutilizanle
        fields={formFields}
        onSubmit={handleFormSubmit}
      />
    </Grid>
  )
}

export default AgregarControlDeTemperaturaDeEsterilizadores;