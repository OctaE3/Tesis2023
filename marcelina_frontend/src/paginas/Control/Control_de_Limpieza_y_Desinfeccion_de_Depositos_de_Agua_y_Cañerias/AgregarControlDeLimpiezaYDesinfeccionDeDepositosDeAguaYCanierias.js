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

const AgregarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias = () => {

  const formFields = [
    { name: 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha', label: 'Fecha', type: 'date', color: 'primary' },
    { name: 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito', label: 'Depositos *', type: 'selector', multiple: 'si', color: 'primary' },
    { name: 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias', label: 'Cañerias', type: 'text', pattern: "^[A-Za-z0-9\\s]{0,30}$", obligatorio: true, color: 'primary' },
    { name: 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones', label: 'Observaciones', pattern: "^[A-Za-z0-9\\s,.]{0,250}$", type: 'text', multi: '3', color: 'secondary' },
  ];

  const [alertSuccess, setAlertSuccess] = useState({
    title: 'Correcto', body: 'Se registro el control de limpieza y desinfeccion de depositos de agua y cañerías con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logro regristrar el control de limpieza y desinfeccion de depositos de agua y cañerías, revise los datos ingresados', severity: 'error', type: 'description'
  });

  const [alertWarning, setAlertWarning] = useState({
    title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  const classes = useStyles();
  const [controlDeLimpieza, setControlDeLimpieza] = useState({});
  const [depositoSelect, setDepositoSelect] = useState([
    { value: '1', label: 'Deposito de Agua 1' },
    { value: '2', label: 'Deposito de Agua 2' },
    { value: '3', label: 'Deposito de Agua 3' },
  ]);
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

  const checkError = (fecha, depositos, canierias) => {
    if (fecha === undefined || fecha === null || fecha === '') {
      return false;
    }
    else if (depositos.length === 0 || depositos === undefined || depositos === null) {
      return false;
    }
    else if (canierias === undefined || canierias === null || canierias === '') {
      return false;
    }
    return true;
  }

  const handleFormSubmit = (formData) => {
    let data = formData;
    if (formData.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito === undefined) {
      data = {
        ...formData,
        controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito: [],
      }
    }
    const fechaData = new Date(data.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha);
    fechaData.setDate(fechaData.getDate() + 1);
    const depositos = data.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito.map(deposito => deposito.value);
    const controlDeLimpiezaConResponsable = {
      ...data,
      controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha: fechaData,
      controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito: depositos,
      controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable: window.localStorage.getItem('user'),
    }

    const fecha = controlDeLimpiezaConResponsable.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha;
    const deposito = controlDeLimpiezaConResponsable.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito;
    const canierias = controlDeLimpiezaConResponsable.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias;

    const check = checkError(fecha, deposito, canierias);

    if (check === false) {
      updateErrorAlert('Revise los datos ingresados y no deje campos vacíos.');
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 5000);
    } else {
      console.log(controlDeLimpiezaConResponsable);
      axios.post('/agregar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-canierias', controlDeLimpiezaConResponsable, {
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
            updateErrorAlert('No se logro regristrar el control de limpieza y desinfeccion de depositos de agua y canierias, revise los datos ingresados.');
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
            updateErrorAlert('No se logro regristrar el control de limpieza y desinfeccion de depositos de agua y canierias, revise los datos ingresados.');
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
              <Typography component='h1' variant='h4'>Registrar Control de Limpieza y Desinfeccion de Depositos de Agua y Canierias</Typography>
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
                        En esta página puedes registrar la cantidad de cloro medido en el agua y de qué grifo, asegúrate de completar los campos necesarios para registrar el estado.
                      </span>
                      <br />
                      <span>
                        Este formulario cuenta con 4 campos:
                        <ul>
                          <li>
                            <span className={classes.liTitleBlue}>Fecha</span>: en este campo se debe registrar la fecha en que se registró la limpieza y desinfección de los depósitos y cañerías.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Depósitos</span>: en este campo se registrará los depósitos que limpiaron y desinfectaron.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Cañerías</span>: en este campo se registrará las cañerías que se limpiaron y desinfectaron.
                          </li>
                          <li>
                            <span className={classes.liTitleRed}>Observaciones</span>: en este campo se pueden registrar las observaciones o detalles necesarios que se encontraron al momento de limpiar los depósitos y cañerías.
                          </li>
                        </ul>
                      </span>
                      <span>
                        Campos obligatorios y no obligatorios:
                        <ul>
                          <li>
                            <span className={classes.liTitleBlue}>Campos con contorno azul</span>: los campos con contorno azul son obligatorio, se tienen que completar sin excepción.
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
        selectOptions={{ controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito: depositoSelect }}
      />
    </Grid>
  )
}

export default AgregarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias;