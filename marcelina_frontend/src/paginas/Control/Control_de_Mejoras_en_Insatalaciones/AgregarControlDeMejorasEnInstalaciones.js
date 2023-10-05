import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import FormularioReutilizanle from '../../../components/Reutilizable/FormularioReutilizable'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const AgregarControlDeMejorasEnInstalaciones = () => {

  const formFields = [
    { name: 'controlDeMejorasEnInstalacionesFecha', label: 'Fecha', type: 'date', color: 'primary' },
    { name: 'controlDeMejorasEnInstalacionesSector', label: 'Sector', type: 'text', obligatorio: true, pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,50}$", color: 'primary' },
    { name: 'controlDeMejorasEnInstalacionesDefecto', label: 'Defecto', type: 'text', obligatorio: true, pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,250}$", multi: '3', color: 'primary' },
    { name: 'controlDeMejorasEnInstalacionesMejoraRealizada', label: 'Mejora Realizada', obligatorio: true, pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,250}$", type: 'text', multi: '3', color: 'primary' },
  ];

  const [alertSuccess] = useState({
    title: 'Correcto', body: 'Se registró el control de mejoras en instalaciones con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró regristrar el control de mejoras en instalaciones, revise los datos ingresados.', severity: 'error', type: 'description'
  });

  const [alertWarning] = useState({
    title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  const classes = useStyles();
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);
  const [checkToken, setCheckToken] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [blinking, setBlinking] = useState(true);

  const navigate = useNavigate();

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
    }
  }, [checkToken]);

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

  const checkError = (fecha, sector, defecto, mejora) => {
    if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
      return false;
    }
    else if (sector === undefined || sector === "" || sector === null) {
      return false;
    }
    else if (defecto === undefined || defecto === "" || defecto === null) {
      return false;
    }
    else if (mejora === undefined || mejora === "" || mejora === null) {
      return false;
    }
    return true;
  }

  const handleFormSubmit = (formData) => {
    let fechaControl = new Date(formData.controlDeMejorasEnInstalacionesFecha);
    let fechaPars = '';
    if (fechaControl.toString() === 'Invalid Date') {
      fechaControl.setDate(null);
    } else {
      fechaControl.setDate(fechaControl.getDate() + 2);
      fechaPars = format(fechaControl, 'yyyy-MM-dd')
    }

    const controlDeMejorasConResponsable = {
      ...formData,
      controlDeMejorasEnInstalacionesFecha: fechaPars === '' ? fechaControl : fechaPars,
      controlDeMejorasEnInstalacionesResponsable: window.localStorage.getItem('user'),
    }

    const fecha = controlDeMejorasConResponsable.controlDeMejorasEnInstalacionesFecha;
    const sector = controlDeMejorasConResponsable.controlDeMejorasEnInstalacionesSector;
    const defecto = controlDeMejorasConResponsable.controlDeMejorasEnInstalacionesDefecto;
    const mejora = controlDeMejorasConResponsable.controlDeMejorasEnInstalacionesMejoraRealizada;

    const check = checkError(fecha, sector, defecto, mejora);

    if (check === false) {
      updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 2000);
    } else {
      axios.post('/agregar-control-de-mejoras-en-instalaciones', controlDeMejorasConResponsable, {
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
            }, 3000);
          } else {
            updateErrorAlert('No se logró regristrar el control de mejoras en instalaciones, revise los datos ingresados.');
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 3000);
          }
        })
        .catch(error => {
          if (error.request.status === 401) {
            setCheckToken(true);
          }
          else if (error.request.status === 500) {
            updateErrorAlert('No se logró regristrar el control de mejoras en instalaciones, revise los datos ingresados.');
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 3000);
          }
        })
    }
  }

  const redirect = () => {
    navigate('/listar-control-de-mejoras-en-instalaciones')
  }

  return (
    <Grid>
      <Navbar />
      <Container style={{ marginTop: 30 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid item lg={2} md={2} ></Grid>
            <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
              <Typography component='h1' variant='h4'>Registrar Control de Mejoras en Instalaciones</Typography>
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
                        En esta página puedes registrar las mejoras que se realizan en las instalaciones, asegúrate de completar los campos necesarios para registrar el estado.
                      </span>
                      <br />
                      <span>
                        Este formulario cuenta con 4 campos:
                        <ul>
                          <li>
                            <span className={classes.liTitleBlue}>Fecha</span>: En este campo se debe ingresar la fecha en la que se realizó la mejora en la instalación.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Sector</span>: En este campo se debe ingresar en que sector se realizó la mejora,este campo acepta palabras minúsculas, mayúsculas y también números, el campo cuenta con una longitud máxima de 50 caracteres.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Defecto</span>: En este campo se debe ingresar el defecto que se encontró, este campo acepta palabras minúsculas, mayúsculas y también números, el campo cuenta con una longitud máxima de 250 caracteres.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Mejora Realizada</span>: En este campo se debe ingresar la mejora que se realizó, este campo acepta palabras minúsculas, mayúsculas y también números, el campo cuenta con una longitud máxima de 250 caracteres.
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
                        - Una vez registre el control de mejoras en instalaciones, no se le redirigirá al listar. Se determinó así por si está buscando registrar otro control de mejoras en instalaciones.
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
        handleRedirect={redirect}
      />
    </Grid>
  )
}

export default AgregarControlDeMejorasEnInstalaciones;