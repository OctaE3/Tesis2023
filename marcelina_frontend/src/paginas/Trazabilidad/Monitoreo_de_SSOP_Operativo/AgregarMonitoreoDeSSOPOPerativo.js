import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
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

const AgregarMonitoreoDeSSOPOPerativo = () => {
  const formFields = [
    { name: 'monitoreoDeSSOPOperativoFechaInicio', label: 'Fecha de Inicio de la Semana', type: 'date', color: 'primary' },
    { name: 'monitoreoDeSSOPOperativoArea', label: 'Área *', type: 'selector', color: 'primary' },
    { name: 'monitoreoDeSSOPOperativoDias', label: 'Días Implementados *', type: 'selector', multiple: 'si', color: 'primary' },
    { name: 'monitoreoDeSSOPOperativoObservaciones', label: 'Observaciones', type: 'text', pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,250}$", multi: '3', color: 'secondary' },
    { name: 'monitoreoDeSSOPOperativoAccCorrectivas', label: 'Acciones Correctivas', obligatorio: true, pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,250}$", type: 'text', multi: '3', color: 'primary' },
    { name: 'monitoreoDeSSOPOperativoAccPreventivas', label: 'Acciones Preventivas', obligatorio: true, pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,250}$", type: 'text', multi: '3', color: 'primary' },
  ];

  const [alertSuccess,] = useState({
    title: 'Correcto', body: 'Monitoreo de ssop operativo agregado con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró agregar el monitoreo de ssop operativo, revise los datos ingresados.', severity: 'error', type: 'description'
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
  const [dias] = useState([
    { value: 'Lunes', label: 'Lunes' },
    { value: 'Martes', label: 'Martes' },
    { value: 'Miercoles', label: 'Miércoles' },
    { value: 'Jueves', label: 'Jueves' },
    { value: 'Viernes', label: 'Viernes' },
    { value: 'Sabado', label: 'Sábado' },
  ]);
  const [area] = useState([
    { value: 'Mesadas', label: 'Mesadas' },
    { value: 'Pisos', label: 'Pisos' },
    { value: 'Utensilios', label: 'Utensilios' },
    { value: 'Equipos', label: 'Equipos' },
    { value: 'Lavamanos', label: 'Lavamanos' },
    { value: 'Bandejas Plasticas', label: 'Bandejas Plasticas' },
    { value: 'Personal', label: 'Personal' },
    { value: 'Otras', label: 'Otras' },
  ]);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [blinking, setBlinking] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const updateErrorAlert = (newBody) => {
    setAlertError((prevAlert) => ({
      ...prevAlert,
      body: newBody,
    }));
  };

  const checkError = (fecha, area, dias, correc, prevent) => {
    if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
      return false;
    }
    else if (area === undefined || area === null || area === "Seleccionar") {
      return false;
    }
    else if (dias === undefined || dias === null || dias.length === 0) {
      return false;
    }
    else if (correc === undefined || correc === null || correc === '') {
      return false;
    }
    else if (prevent === undefined || prevent === null || prevent === '') {
      return false;
    }
    return true;
  }

  const handleFormSubmit = (formData) => {
    const fechaFinal = new Date(formData.monitoreoDeSSOPOperativoFechaInicio);
    fechaFinal.setDate(fechaFinal.getDate() + 5);

    const year = fechaFinal.getFullYear();
    const month = String(fechaFinal.getMonth() + 1).padStart(2, '0');
    const day = String(fechaFinal.getDate()).padStart(2, '0');

    const formattedFechaFinal = `${year}-${month}-${day}`;

    const dias = formData.monitoreoDeSSOPOperativoDias ? formData.monitoreoDeSSOPOperativoDias : [];

    const valoresDias = dias.map(dia => dia.value);

    const fecha = new Date(formData.monitoreoDeSSOPOperativoFechaInicio);
    fecha.setDate(fecha.getDate() + 1);

    const updateFormData = {
      ...formData,
      monitoreoDeSSOPOperativoDias: valoresDias,
      monitoreoDeSSOPOperativoFechaFinal: formattedFechaFinal,
      monitoreoDeSSOPOperativoFechaInicio: fecha,
      monitoreoDeSSOPOperativoResponsable: window.localStorage.getItem('user'),
    }

    const check = checkError(updateFormData.monitoreoDeSSOPOperativoFechaInicio, updateFormData.monitoreoDeSSOPOperativoArea,
      updateFormData.monitoreoDeSSOPOperativoDias, updateFormData.monitoreoDeSSOPOperativoAccCorrectivas, updateFormData.monitoreoDeSSOPOperativoAccPreventivas);

    if (check === false) {
      updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 2500);
    } else {
      axios.post('/agregar-monitoreo-de-ssop-operativo', updateFormData, {
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
            updateErrorAlert('No se logró agregar el monitoreo de ssop operativo, revise los datos ingresados.')
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 2500);
          }
        })
        .catch(error => {
          if (error.request.status === 401) {
            setCheckToken(true);
          }
          else if (error.request.status === 500) {
            updateErrorAlert('No se logró agregar el monitoreo de ssop operativo, revise los datos ingresados.');
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 2500);
          }
        })
    }
  }

  const redirect = () => {
    navigate('/listar-monitoreo-de-ssop-operativo')
  }

  return (
    <Grid>
      <Navbar />
      <Container style={{ marginTop: 30 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid item lg={2} md={2} ></Grid>
            <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
              <Typography component='h1' variant='h4'>Agregar Monitoreo de SSOP Operativo</Typography>
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
                        En esta página puedes registrar los monitoreos de SSOP Operativos, asegúrate de completar los campos necesarios para registrar el estado.
                      </span>
                      <br />
                      <span>
                        Este formulario cuenta con 6 campos:
                        <ul>
                          <li>
                            <span className={classes.liTitleBlue}>Fecha de incio de la semana</span>: En este campo se debe ingresar la fecha en la que inició el monitoreo.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Área</span>: En este campo se debe seleccionar el área en la que se realizó el monitoreo.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Días implementados</span>: En este campo se debe seleccionar el o los días en los que se realizó el monitoreo.
                          </li>
                          <li>
                            <span className={classes.liTitleRed}>Observaciones</span>: En este campo se pueden registrar las observaciones o detalles que se encontraron en el momento que se realizó el monitoreo.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Acciones Correctivas</span>: En este campo se ingresa las acciones que se implementaron para corregir el inconveniente.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Acciones Preventivas</span>: En este campo se ingresa las acciones que se implementaran para solucionar posibles problemas a futuro.
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
                        - Una vez se registre el monitoreo de ssop operativo, no se le redirigirá al listar. Se determinó así por si está buscando registrar otro monitoreo de ssop operativo.
                        <br />
                        - Los campos de Observaciones, Acciones Correctivas y Acciones Preventivas cuentan con una longitud máxima de 250 caracteres y se podrán ingresar letras y números.
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
      <FormularioReutilizable
        fields={formFields}
        key={formKey}
        onSubmit={handleFormSubmit}
        handleRedirect={redirect}
        selectOptions={{
          monitoreoDeSSOPOperativoDias: dias,
          monitoreoDeSSOPOperativoArea: area,
        }}
      />
    </Grid>
  )
}

export default AgregarMonitoreoDeSSOPOPerativo;