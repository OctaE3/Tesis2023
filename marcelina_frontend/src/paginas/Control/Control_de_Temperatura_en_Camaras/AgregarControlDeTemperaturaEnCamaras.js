import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import FormularioReutilizanle from '../../../components/Reutilizable/FormularioReutilizable'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const AgregarControlDeTemperaturaEnCamaras = () => {
  const formFields = [
    { name: 'controlDeTemperaturaEnCamarasNroCamara', label: 'Número de la Cámara *', type: 'selector', color: 'primary' },
    { name: 'controlDeTemperaturaEnCamarasFecha', label: 'Fecha', type: 'date', color: 'primary' },
    { name: 'controlDeTemperaturaEnCamarasHora', label: 'Hora', type: 'text', obligatorio: true, pattern: "^[0-9]{0,2}$", color: 'primary' },
    { name: 'controlDeTemperaturaEnCamarasTempInterna', label: 'Temperatura Interna', type: 'text', obligatorio: true, pattern: "^-?[0-9]{0,4}$", adornment: 'si', unit: '°C', color: 'primary' },
    { name: 'controlDeTemperaturaEnCamaraTempExterna', label: 'Temperatura Externa', type: 'text', obligatorio: true, pattern: "^-?[0-9]{0,4}$", adornment: 'si', unit: '°C', color: 'primary' },
  ];

  const [alertSuccess] = useState({
    title: 'Correcto', body: 'Se registró el control de temperatura en cámaras con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró regristrar el control de temperatura en cámaras, revise los datos ingresados.', severity: 'error', type: 'description'
  });

  const [alertWarning] = useState({
    title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  const classes = useStyles();
  const navigate = useNavigate();
  const [selectNroCamara] = useState([
    { value: 'Cámara 1', label: 'Cámara 1' },
    { value: 'Cámara 2', label: 'Cámara 2' },
    { value: 'Cámara 3', label: 'Cámara 3' },
    { value: 'Cámara 4', label: 'Cámara 4' },
    { value: 'Cámara 5', label: 'Cámara 5' },
    { value: 'Cámara 6', label: 'Cámara 6' },
  ]);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [blinking, setBlinking] = useState(true);
  const [checkToken, setCheckToken] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/')
    } else {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));

      const tokenExpiration = payload.exp * 1000;
      const currentTime = Date.now();

      if (tokenExpiration < currentTime) {
        setShowAlertWarning(true);
        setTimeout(() => {
          setShowAlertWarning(false);
          navigate('/')
        }, 2000);
      }
      setCheckToken(false)
    }
  }, [checkToken]);

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

  const checkError = (nroC, fecha, hora, tempI, tempE) => {
    if (nroC === undefined || nroC === null || nroC === "Seleccionar") {
      return false;
    }
    else if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
      return false;
    }
    else if (hora === undefined || hora === null || hora === '') {
      return false;
    }
    else if (tempI === undefined || tempI === null || tempI === '') {
      return false;
    }
    else if (tempE === undefined || tempE === null || tempE === '') {
      return false;
    }
    return true;
  }

  const handleFormSubmit = (formData) => {
    const control = formData;

    const nroC = control.controlDeTemperaturaEnCamarasNroCamara;
    const fecha = control.controlDeTemperaturaEnCamarasFecha;
    const hora = control.controlDeTemperaturaEnCamarasHora;
    const tempI = control.controlDeTemperaturaEnCamarasTempInterna;
    const tempE = control.controlDeTemperaturaEnCamaraTempExterna;

    const check = checkError(nroC, fecha, hora, tempI, tempE);

    if (check === false) {
      updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 2500);
    } else {
      axios.post('/agregar-control-de-temperatura-en-camaras', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (response.status === 201) {
            setFormKey(prevKey => prevKey + 1);
            setShowAlertSuccess(true);
            setTimeout(() => {
              setShowAlertSuccess(false);
            }, 2500);
          } else {
            updateErrorAlert('No se logró regristrar el control de temperatura en cámaras, revise los datos ingresados.');
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 2500);
          }
        })
        .catch(error => {
          if (error.request.status === 401) {
            setShowAlertWarning(true);
            setTimeout(() => {
              setShowAlertWarning(false);
            }, 2500);
          }
          else if (error.request.status === 500) {
            updateErrorAlert('No se logró regristrar el control de temperatura en cámaras, revise los datos ingresados.');
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 2500);
          }
        })
    }
    setCheckToken(true);
  }

  const redirect = () => {
    navigate('/listar-control-de-temperatura-en-camaras')
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
                <IconButton className={blinking ? classes.blinkingButton : ''} onClick={handleClickOpen}>
                  <HelpOutlineIcon fontSize="large" color="primary" />
                </IconButton>
                <Dialog
                  fullScreen={fullScreen}
                  fullWidth
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
                            <span className={classes.liTitleBlue}>Número de la cámara</span>: En este campo se debe seleccionar la cámara de la cual se midió su temperatura interna y externa.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Fecha</span>: En este campo se debe registrar la fecha en la que se registro el control de temperatura en cámaras.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Hora</span>: en este campo se debe registrar la hora en la que se midió la temperatura de la cámara, este campo solo acepta números y cuenta con una longitud máxima de 2 caracteres.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Temperatura Interna</span>: en este campo se debe registrar la temperatura interna de la cámara seleccionada, este campo solo acepta números postivos y negativos, este campo cuenta con una longitud máxima de 4 caracteres.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Temperatura Externa</span>: en este campo se debe registrar la temperatura externa de la cámara seleccionada, este campo solo acepta números postivos y negativos, este campo cuenta con una longitud máxima de 4 caracteres.
                          </li>
                        </ul>
                      </span>
                      <span>
                        Campos obligatorios y no obligatorios:
                        <ul>
                          <li>
                            <span className={classes.liTitleBlue}>Campos con contorno azul y con asterisco en su nombre</span>: Los campos con contorno azul y asterisco son obligatorios, se tienen que completar sin excepción.
                          </li>
                          <li>
                            <span className={classes.liTitleRed}>Campos con contorno rojo</span>: Los campos con contorno rojo no son obligatorios, se pueden dejar vacíos de ser necesario.
                          </li>
                        </ul>
                      </span>
                      <span>
                        Aclaraciones:
                        <br />
                        - No se permite dejar los campos vacíos, excepto los de contorno rojo.
                        <br />
                        - El formato en el que se ingresa la hora es solo el número de la hora, ejemplo: 12.
                        <br />
                        - Una vez registre el control de temperatura en cámaras, no se le redirigirá al listar. Se determinó así por si está buscando registrar otro control de temperatura en cámaras.
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
        key={formKey}
        onSubmit={handleFormSubmit}
        selectOptions={{ controlDeTemperaturaEnCamarasNroCamara: selectNroCamara }}
        handleRedirect={redirect}
      />
    </Grid>
  )
}

export default AgregarControlDeTemperaturaEnCamaras;