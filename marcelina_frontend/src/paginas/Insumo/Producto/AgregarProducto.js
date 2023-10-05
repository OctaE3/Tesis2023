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

const AgregarProducto = () => {
  const formFields = [
    { name: 'productoNombre', label: 'Nombre', type: 'text', color: 'primary', obligatorio: true, pattern: "^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\\s]{0,50}$" },
    { name: 'productoCodigo', label: 'Código', type: 'text', color: 'primary', obligatorio: true, pattern: "^[0-9]{0,10}$" },
  ];

  const [alertSuccess] = useState({
    title: 'Correcto', body: 'Producto registrado con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró registrar el producto, revise los datos ingresados.', severity: 'error', type: 'description'
  });

  const [alertWarning] = useState({
    title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  const classes = useStyles();
  const navigate = useNavigate();
  const [productos, setProductos] = useState({});
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
    const obtenerProductos = () => {
      axios.get('/listar-productos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          setProductos(
            response.data.map((producto) => ({
              productoNombre: producto.productoNombre,
              productoCodigo: producto.productoCodigo,
            }))
          );
        })
        .catch(error => {
          if (error.request.status === 401) {
            setCheckToken(true);
          } else {
            updateErrorAlert('No se logró cargar los datos de los productos, recargue la página.')
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 2000);
          }
        });
    };

    obtenerProductos();
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

  const checkError = (nombre, codigo) => {
    if (nombre === undefined || nombre === null || nombre === '') {
      return false;
    }
    else if (codigo === undefined || codigo === null || codigo === '') {
      return false;
    }
    return true;
  }

  const checkCod = (prod) => {
    let resp = false;
    productos.forEach((producto) => {
      if (producto.productoCodigo.toString() === prod.productoCodigo || producto.productoNombre === prod.productoNombre) {
        resp = true;
      } else {
        if (producto.productoCodigo.toString() === prod.productoCodigo && producto.productoNombre === prod.productoNombre) {
          resp = true;
        }
      }
      if (resp) { return }
    })
    return resp;
  }

  const handleFormSubmit = (formData) => {
    const data = formData;

    const check = checkError(data.productoNombre, data.productoCodigo);
    const checkC = checkCod(data);

    if (check === false) {
      updateErrorAlert(`Revise los datos ingresados y no deje campos vacíos.`);
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 2500);
    } else {
      if (checkC === false) {
        formData = {};
        console.log(formData);
        axios.post('/agregar-producto', data, {
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
              updateErrorAlert('No se logró registrar el producto, revise los datos ingresados.')
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
              updateErrorAlert('No se logró registrar el producto, revise los datos ingresados.');
              setShowAlertError(true);
              setTimeout(() => {
                setShowAlertError(false);
              }, 2500);
            }
          })
      } else {
        updateErrorAlert(`No se puede repetir el nombre y el código de una producto ya registrado.`);
        setShowAlertError(true);
        setTimeout(() => {
          setShowAlertError(false);
        }, 2500);
      }
    }
  }

  const redirect = () => {
    navigate('/listar-producto')
  }

  return (
    <Grid>
      <Navbar />
      <Container style={{ marginTop: 30 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid item lg={2} md={2} ></Grid>
            <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
              <Typography component='h1' variant='h4'>Agregar Producto</Typography>
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
                        En esta página puedes registrar los productos que produce y vende la chacinería, asegúrate de completar los campos necesarios para registrar el estado.
                      </span>
                      <br />
                      <span>
                        Este formulario cuenta con 2 campos:
                        <ul>
                          <li>
                            <span className={classes.liTitleBlue}>Nombre</span>: En este campo se debe ingresar el nombre del producto,
                            este campo solo acepta palabras mayúsculas y minúsculas, a su vez cuenta con una longitud máxima de 50 caracteres.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Código</span>: En este campo se debe ingresa el código que identifica el producto,
                            este campo solo acepta números y cuenta con una longitud máxima de 10 caracteres.
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
                        - Una vez registre el producto, no se le redirigirá al listar. Se determinó así por si está buscando registrar otro producto.
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
        handleRedirect={redirect}
        onSubmit={handleFormSubmit} />
    </Grid>
  )
}

export default AgregarProducto;