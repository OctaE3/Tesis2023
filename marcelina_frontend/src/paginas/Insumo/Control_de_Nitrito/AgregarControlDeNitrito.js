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

const AgregarControlDeNitrito = () => {
  const formFields = [
    { name: 'controlDeNitritoFecha', label: 'Fecha', type: 'date', color: 'primary' },
    { name: 'controlDeNitritoProductoLote', label: 'Producto / Lote', type: 'text', obligatorio: true, pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ]{0,20}$", color: 'primary' },
    { name: 'controlDeNitritoCantidadUtilizada', label: 'Cantidad Utilizada', type: 'text', obligatorio: true, pattern: "^[0-9]{0,10}$", color: 'primary' },
    { name: 'controlDeNitritoStock', label: 'Stock', type: 'text', disabled: 'si', color: 'primary' },
    { name: 'controlDeNitritoObservaciones', label: 'Observaciones', type: 'text', pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,250}$", multi: '3', color: 'secondary' },
  ];

  const [alertSuccess] = useState({
    title: 'Correcto', body: 'Control de nitrito agregado con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró registrar el control de nitrito, revise los datos ingresados.', severity: 'error', type: 'description'
  });

  const [alertWarning] = useState({
    title: 'Advertencia', body: 'Expiró el inicio de sesión, para renovarlo inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  const classes = useStyles();
  const navigate = useNavigate();
  const [nitritoStock, setNitritoStock] = useState(0);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);
  const [checkToken, setCheckToken] = useState(false);
  const [formKey, setFormKey] = useState(0);

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
    const obtenerNitratos = () => {
      axios.get('/listar-control-de-nitrito', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          if (response.data.length > 0) {
            const ultimoNitrito = response.data[0];
            setNitritoStock(ultimoNitrito.controlDeNitritoStock);
          }
        })
        .catch(error => {
          if (error.request.status === 401) {
            setCheckToken(true);
        } else {
            updateErrorAlert('No se logró cargar el stock de nitrato, recargue la página.')
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 2000);
        }
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
    if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
      return false;
    }
    else if (lote === undefined || lote === null || lote === '') {
      return false;
    }
    else if (cantidad === undefined || cantidad === null || cantidad === '') {
      return false;
    }
    else if (stock === undefined || stock === null) {
      return false;
    }
    return true;
  }

  const handleFormSubmit = (formData) => {
    const { stockForm, ...formDataWithoutStock } = formData;

    let stock = stockForm;
    if (stock === undefined) {
      stock = nitritoStock;
    }

    if (parseInt(formDataWithoutStock.controlDeNitritoCantidadUtilizada) > parseInt(stock) || parseInt(formDataWithoutStock.controlDeNitritoCantidadUtilizada) === 0) {
      updateErrorAlert(`La cantidad utilizada no puede ser 0 o mayor al stock y tampoco se permite dejar el stock vacío.`);
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 2500);
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
        }, 2500);
      } else {
        axios.post('/agregar-control-de-nitrito', controlDeNitritoConResponsable, {
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
              updateErrorAlert('No se logró registrar el control de nitrito, revise los datos ingresados.')
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
              updateErrorAlert('No se logró registrar el control de nitrito, revise los datos ingresados.');
              setShowAlertError(true);
              setTimeout(() => {
                setShowAlertError(false);
              }, 2500);
            }
          })
      }
    }
  }

  const redirect = () => {
    navigate('/listar-control-de-nitritos')
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
                        En esta página puedes registrar el nitrito utilizado en los producto/lote, asegúrate de completar los campos necesarios para registrar el estado.
                      </span>
                      <br />
                      <span>
                        Este formulario cuenta con 5 campos:
                        <ul>
                          <li>
                            <span className={classes.liTitleBlue}>Fecha</span>: En este campo se debe ingresar la fecha en la que se registro el control de nitrito.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Producto/Lote</span>: En este campo se debe ingresar el producto/lote al que se le agrega el nitrito, 
                            este campo solo acepta palabras minúsculas, mayúsculas y números, a su vez cuenta con un máximo de 20 caracteres.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Cantidad Utilizada</span>: En este campo se debe especificar la cantidad utilizada de nitrito en el producto/lote, 
                            este campos solo acepta números y cuenta con un máximo de 10 caracteres.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Stock</span>: En este campo no se puede modificar el valor que hay en él, la única forma de agregar más stock es,
                            utilizando el más que hay a la derecha del campo, al hacer click en el icono de más se desplegara una ventana donde se puede ingresar nuevo stock,
                            al momento de darle enviar, el nuevo valor ingresado se le sumara al stock existente.
                          </li>
                          <li>
                            <span className={classes.liTitleRed}>Observaciones</span>: En este campo se pueden registrar las observaciones o detalles que se encontraron al momento de agregar el nitrito al producto/lote, 
                            este campo solo acepta palabras minúsculas, mayúsculas y números, a su vez cuenta con un máximo de 250 caracteres.
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
                        - Una vez registre el control de nitrato, no se le redirigirá al listar. Se determinó así por si está buscando registrar otro control de nitrato.
                        <br />
                        - En el campo de stock aparece la cantidad restante que quedó del último control de nitrito que se agregó.
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
          controlDeNitritoStock: nitritoStock,
        }}
      />
    </Grid>
  )
}

export default AgregarControlDeNitrito;