import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import { format } from 'date-fns';
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

const AgregarControlDeReposicionDeCloro = () => {
  const formFields = [
    { name: 'controlDeReposicionDeCloroFecha', label: 'Fecha', type: 'date', color: 'primary' },
    { name: 'controlDeReposicionDeCloroCantidadDeAgua', label: 'Cantidad de Agua', type: 'text', obligatorio: true, pattern: "^[0-9]{0,6}$", adornment: 'si', unit: 'L', color: 'primary' },
    { name: 'controlDeReposicionDeCloroCantidadDeCloroAdicionado', label: 'Cloro Adicionado', type: 'text', obligatorio: true, pattern: "^[0-9]{0,6}$", adornment: 'si', unit: 'mL', color: 'primary' },
    { name: 'controlDeReposicionDeCloroObservaciones', label: 'Observaciones', type: 'text', pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,250}$", multi: '3', color: 'secondary' },
  ];

  const [alertSuccess] = useState({
    title: 'Correcto', body: 'Se registró el control de resposición de cloro con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró regristrar el control de reposición de cloro, revise los datos ingresados.', severity: 'error', type: 'description'
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
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [blinking, setBlinking] = useState(true);

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

  const checkError = (fecha, agua, cloro) => {
    if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
      return false;
    }
    else if (agua === undefined || agua === null || agua === "") {
      return false;
    }
    else if (cloro === undefined || cloro === null || cloro === "") {
      return false;
    }
    return true;
  }

  const handleFormSubmit = (formData) => {
    let fechaControl = new Date(formData.controlDeReposicionDeCloroFecha);
    let fechaPars = '';
    if (fechaControl.toString() === 'Invalid Date') { }
    else {
      fechaControl.setDate(fechaControl.getDate() + 2);
      fechaPars = format(fechaControl, 'yyyy-MM-dd');
    }

    const controlDeReposicionConResponsable = {
      ...formData,
      controlDeReposicionDeCloroFecha: fechaPars === fechaPars === '' ? fechaControl : fechaPars,
      controlDeReposicionDeCloroResponsable: window.localStorage.getItem('user'),
    }

    const fecha = controlDeReposicionConResponsable.controlDeReposicionDeCloroFecha;
    const agua = controlDeReposicionConResponsable.controlDeReposicionDeCloroCantidadDeAgua;
    const cloro = controlDeReposicionConResponsable.controlDeReposicionDeCloroCantidadDeCloroAdicionado;

    const check = checkError(fecha, agua, cloro);

    if (check === false) {
      updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 2500);
    } else {
      axios.post('/agregar-control-de-reposicion-de-cloro', controlDeReposicionConResponsable, {
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
            updateErrorAlert('No se logró regristrar el control de reposición de cloro, revise los datos ingresados.');
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
            updateErrorAlert('No se logró regristrar el control de reposición de cloro, revise los datos ingresados.');
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 3000);
          }
        })
    }
    setCheckToken(true);
  }

  const redirect = () => {
    navigate('/listar-control-de-reposicion-de-cloro')
  }

  return (
    <Grid>
      <Navbar />
      <Container style={{ marginTop: 30 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid item lg={2} md={2} ></Grid>
            <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
              <Typography component='h1' variant='h4'>Registrar Control de Reposición de Cloro</Typography>
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
                        En esta página puedes registrar la cantidad de cloro medido en el agua y de qué grifo, asegúrate de completar los campos necesarios para registrar el estado.
                      </span>
                      <br />
                      <span>
                        Este formulario cuenta con 4 campos:
                        <ul>
                          <li>
                            <span className={classes.liTitleBlue}>Fecha</span>: En este campo se debe seleccionar la fecha en la que se realizó la reposicíon de cloro.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Cantidad de Agua</span>: En este campo se debe ingresar la cantidad de agua a la que se le adicionó el cloro,
                            este campo solo acepta números y cuenta con una longitud máxima de 6 caracteres.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Cantidad Adicionado</span>: En este campo se debe ingresar la cantidad de cloro que se le añadió al agua,
                            este campo solo acepta números y cuenta con una longitud máxima de 6 caracteres.
                          </li>
                          <li>
                            <span className={classes.liTitleRed}>Observaciones</span>: En este campo se pueden registrar las observaciones o detalles necesarios que se encontraron al momento de añadirle cloro al agua,
                            este campo acepta palabras minúsculas, mayúsculas y también números, el campo cuenta con una longitud máxima de 250 caracteres.
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
                        - Una vez registre el control de reposición de cloro, no se le redirigirá al listar. Se determinó así por si está buscando registrar otro control de reposición de cloro.
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

export default AgregarControlDeReposicionDeCloro;