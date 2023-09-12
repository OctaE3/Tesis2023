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

const AgregarControlDeNitrito = () => {
  const formFields = [
    { name: 'controlDeNitritoFecha', label: 'Fecha', type: 'date', color: 'primary' },
    { name: 'controlDeNitritoProductoLote', label: 'Producto / Lote', type: 'text', obligatorio: true, pattern: "^[A-Za-z0-9]{0,20}$", color: 'primary' },
    { name: 'controlDeNitritoCantidadUtilizada', label: 'Cantidad Utilizada', type: 'number', obligatorio: true, pattern: "^[0-9]{0,10}$", color: 'primary' },
    { name: 'controlDeNitritoStock', label: 'Stock', type: 'text', disabled: 'si', color: 'primary' },
    { name: 'controlDeNitritoObservaciones', label: 'Observaciones', type: 'text', pattern: "^[A-Za-z0-9\\s,.]{0,250}$", multi: '3', color: 'secondary' },
  ];

  const [alertSuccess, setAlertSuccess] = useState({
    title: 'Correcto', body: 'Control de nitrito agregado con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logro registrar el control de nitrito, revise los datos ingresados.', severity: 'error', type: 'description'
  });

  const [alertWarning, setAlertWarning] = useState({
    title: 'Advertencia', body: 'Expiro el inicio de sesión, para renovarlo inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  const classes = useStyles();
  const [listaN, setListaN] = useState([]);
  const [nitritoStock, setNitritoStock] = useState(0);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);

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
    const obtenerNitratos = () => {
      axios.get('/listar-control-de-nitrito', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          setListaN(response.data);
          if (response.data.length > 0) {
            const ultimoNitrito = response.data[response.data.length - 1];
            setNitritoStock(ultimoNitrito.controlDeNitritoStock);
          }
        })
        .catch(error => {
          console.error(error);
        });
    };

    obtenerNitratos();
  }, []);

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

  const checkError = (fecha, lote, cantidad, stock) => {
    if (fecha === undefined || fecha === null) {
      return false;
    }
    else if (lote === undefined || lote === null) {
      return false;
    }
    else if (cantidad === undefined || cantidad === null) {
      return false;
    }
    else if (stock === undefined || stock === null) {
      return false;
    }
    return true;
  }

  const handleFormSubmit = (formData) => {
    const { stock, ...formDataWithoutStock } = formData;

    if (formDataWithoutStock.controlDeNitritoCantidadUtilizada > stock) {
      updateErrorAlert(`La cantidad utilizada no puede ser mayor al stock`);
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 7000);
    } else {
      const stockRestante = parseInt(stock) - parseInt(formDataWithoutStock.controlDeNitritoCantidadUtilizada);
      const controlDeNitritoConResponsable = {
        ...formDataWithoutStock,
        controlDeNitritoStock: stockRestante,
        controlDeNitritoResponsable: window.localStorage.getItem('user'),
      }

      const check = checkError(controlDeNitritoConResponsable.controlDeNitritoFecha, controlDeNitritoConResponsable.controlDeNitritoProductoLote,
        controlDeNitritoConResponsable.controlDeNitritoCantidadUtilizada, controlDeNitritoConResponsable.controlDeNitritoStock);

      if (check === false) {
        updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
        setShowAlertError(true);
        setTimeout(() => {
          setShowAlertError(false);
        }, 7000);
      } else {
        axios.post('/agregar-control-de-nitrito', controlDeNitritoConResponsable, {
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
              updateErrorAlert('No se logro registrar el control de nitrito, revise los datos ingresados.')
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
              updateErrorAlert('No se logro registrar el control de nitrito, revise los datos ingresados.');
              setShowAlertError(true);
              setTimeout(() => {
                setShowAlertError(false);
              }, 5000);
            }
          })
      }
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
              <Typography component='h1' variant='h4'>Agregar Control de Nitrito</Typography>
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
                        En esta página puedes registrar el nitrito utilizado en los producto/lote, asegúrate de completar los campos necesarios para registrar el estado.
                      </span>
                      <br />
                      <span>
                        Este formulario cuenta con 5 campos:
                        <ul>
                          <li>
                            <span className={classes.liTitleBlue}>Fecha</span>: en este campo se debe ingresar la fecha en la que se le agrego el nitrito a el producto/lote.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Producto/Lote</span>: en este campo se debe ingresar el producto/lote al que se le agrega el nitrito.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Cantidad Utilizada</span>: en este campo se especifica la cantidad utilizada de nitrito en el producto/lote.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Stock</span>: este campo no se puede modificar el valor que hay en él, la única forma de agregar más stock es,
                            utilizando el más que hay a la derecha del campo, al hacer click en el icono de más se desplegara una ventana donde se puede ingresar nuevo stock,
                            al momento de darle enviar, el nuevo valor ingresado se le sumara al stock existente.
                          </li>
                          <li>
                            <span className={classes.liTitleRed}>Observaciones</span>: en este campo se pueden registrar las observaciones o detalles necesarios que se encontraron al momento de agregar el nitrito al producto/lote.
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
      <FormularioReutilizable
        fields={formFields}
        onSubmit={handleFormSubmit}
        selectOptions={{
          controlDeNitritoStock: nitritoStock,
        }}
      />
    </Grid>
  )
}

export default AgregarControlDeNitrito;