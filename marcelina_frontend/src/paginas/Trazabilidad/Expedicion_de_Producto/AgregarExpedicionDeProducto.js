import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, Dialog, IconButton, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import axios from 'axios';
import { tr } from 'date-fns/locale';

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


const AgregarExpedicionDeProducto = () => {
  const campo = {
    name: 'expedicionDeProductoCantidad', label: 'Cantidad', color: 'primary', obligatorio: true, pattern: "^[0-9]{0,10}$"
  };

  const formFields = [
    { name: 'expedicionDeProductoFecha', label: 'Fecha', type: 'date', color: 'primary' },
    { name: 'expedicionDeProductoLote', label: 'Lote *', type: 'cantidadMultiple', campo: campo, color: 'primary' },
    { name: 'expedicionDeProductoCliente', label: 'Cliente *', type: 'selector', color: 'primary' },
    { name: 'expedicionDeProductoDocumento', label: 'Documento', type: 'number', color: 'primary', obligatorio: true, pattern: "^[0-9]{0,10}$" },
  ];

  const [alertSuccess, setAlertSuccess] = useState({
    title: 'Correcto', body: 'Expedición de producto agregada con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logro agregar la expedición de producto, revise los datos ingresados.', severity: 'error', type: 'description'
  });

  const [alertWarning, setAlertWarning] = useState({
    title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  const classes = useStyles();
  const [expedicionDeProducto, setExpedicionDeProducto] = useState({});
  const [expediciones, setExpediciones] = useState([]);
  const [lotes, setLotes] = useState('');
  const [loteSelect, setLoteSelect] = useState('');
  const [clientes, setClientes] = useState('');
  const [clienteSelect, setClienteSelect] = useState('');
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
    const obtenerExpedicion = () => {
      axios.get('/listar-expedicion-de-productos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          setExpediciones(
            response.data.map((exp) => ({
              documento: exp.expedicionDeProductoDocumento,
            }))
          );
        })
        .catch(error => {
          console.error(error);
        });
    };


    const obtenerLotes = () => {
      axios.get('/listar-lotes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          setLotes(response.data);
          setLoteSelect(
            response.data.map((lote) => ({
              value: lote.loteId,
              label: `${lote.loteCodigo} - ${lote.loteCantidad} Kg - ${lote.loteProducto.productoNombre}`,
            }))
          );
        })
        .catch(error => {
          console.error(error);
        });
    };

    const obtenerClientes = () => {
      axios.get('/listar-clientes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          setClientes(response.data);
          setClienteSelect(
            response.data.map((cliente) => ({
              value: cliente.clienteId,
              label: cliente.clienteNombre,
            }))
          );
        })
        .catch(error => {
          console.error(error);
        });
    };

    obtenerExpedicion();
    obtenerLotes();
    obtenerClientes();

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

  function hasDuplicate(list) {
    return new Set(list).size !== list.length;
  }

  const checkError = (fecha, cliente, documento) => {
    if (fecha === undefined || fecha === null || fecha === '' || fecha.toString() === 'Invalid Date') {
      return false;
    }
    else if (cliente === undefined || cliente === null || cliente === "Seleccionar") {
      return false;
    }
    else if (documento === undefined || documento === null || documento === '') {
      return false;
    }
    return true;
  }

  const checkMultiple = (lotes) => {
    console.log(lotes);
    if (lotes) {
      const resul = lotes.forEach((lote) => {
        console.log(lote);
        if (lote.selectValue === '' || lote.textFieldValue === '' || lote.selectValue.value === "Seleccionar" || lote.textFieldValue === 0) {
          return false;
        } else { }
      })
      console.log(resul);
      return resul ? resul : true;
    } else { return false }
  }

  const checkDoc = (documento) => {
    let resp = true;
    console.log(expediciones);
    expediciones.forEach((exp) => {
      if (exp.documento.toString() === documento.toString()) {
        resp = false;
      }

      if (resp === false) { return }
    })
    return resp;
  }

  const handleFormSubmit = (formData) => {
    const { cantidad, ...formDataWithoutCantidad } = formData;
    //console.log(expedicionDeProducto);
    const cantidadValue = formData.cantidad;
    //console.log(cantidad);
    console.log(cantidadValue);

    const checkMul = checkMultiple(cantidadValue);
    console.log(checkMul);

    if (checkMul === false) {
      updateErrorAlert(`Revise los los lote seleccionados y las cantidades ingresadas, no se permite dejar campos vacíos y tampoco seleccionar la opción "Seleccionar".`);
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 7000);
    } else {
      const selectValues = cantidadValue.map(item => item.selectValue);
      const hasDuplicateList = hasDuplicate(selectValues);
      console.log(hasDuplicateList);

      if (hasDuplicateList === false) {
        const lotesCompletos = lotes.filter(lote => selectValues.includes(lote.loteId.toString()));
        const productosCompletos = lotesCompletos.map(lote => lote.loteProducto);

        console.log(lotesCompletos);
        const resultado = lotesCompletos.map(lote => {
          const cantidaValueEncontrada = cantidadValue.find(cv => cv.selectValue.toString() === lote.loteId.toString());
          console.log(cantidaValueEncontrada);
          if (cantidaValueEncontrada) {
            const cantidad = parseInt(cantidaValueEncontrada.textFieldValue);
            console.log(cantidad);
            console.log(lote.loteCantidad);
            if (cantidad > lote.loteCantidad) {
              console.log(lote);
              return `${lote.loteCodigo} - ${lote.loteCantidad} Kg - ${lote.loteProducto.productoNombre} /`;
            }
          }
          return null;
        })

        console.log(resultado);

        const elementoUndefined = resultado.some(elemento => elemento === null);
        console.log(elementoUndefined);
        if (elementoUndefined === true) {
          const clienteCompleto = clientes.filter((cliente) => cliente.clienteId.toString() === formDataWithoutCantidad.expedicionDeProductoCliente)[0];
          //console.log(clienteCompleto);

          const listaDetalleCantidaLote = [];
          const lotesCompletosConCantidadRestada = [];
          lotesCompletos.forEach((lote, index) => {
            const cantidadLote = cantidadValue[index].textFieldValue;
            const loteActualizado = { ...lote, loteCantidad: lote.loteCantidad - cantidadLote };
            lotesCompletosConCantidadRestada.push(loteActualizado);
            console.log(loteActualizado);
            const detalleCantidadLote = {
              detalleCantidadLoteLote: loteActualizado,
              detalleCantidadLoteCantidadVendida: cantidadLote,
            };
            listaDetalleCantidaLote.push(detalleCantidadLote);
          });

          console.log(lotesCompletos);
          console.log(lotesCompletosConCantidadRestada);

          const uniqueProductos = {};
          const productosSinDuplicados = productosCompletos.filter((producto) => {
            const key = `${producto.productoId}-${producto.productoCodigo}`;
            if (!uniqueProductos[key]) {
              uniqueProductos[key] = true;
              return true;
            }
            return false;
          });

          console.log(productosSinDuplicados);

          const updateFormData = {
            ...formDataWithoutCantidad,
            expedicionDeProductoCliente: clienteCompleto,
            expedicionDeProductoProductos: productosSinDuplicados,
            expedicionDeProductoLotes: lotesCompletosConCantidadRestada,
            expedicionDeProductoUsuario: window.localStorage.getItem('user'),
          }
          console.log(updateFormData);
          console.log(listaDetalleCantidaLote);

          const data = {
            expedicionDeProducto: updateFormData,
            listaCantidad: listaDetalleCantidaLote,
          }

          console.log(data);

          const check = checkError(updateFormData.expedicionDeProductoFecha, updateFormData.expedicionDeProductoCliente, updateFormData.expedicionDeProductoDocumento);

          if (check === false) {
            updateErrorAlert(`Revise los datos ingresados, no se permite dejar campos vacíos y tampoco seleccionar la opción "Seleccionar".`);
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 7000);
          } else {
            const checkD = checkDoc(updateFormData.expedicionDeProductoDocumento);
            if (checkD === false) {
              updateErrorAlert(`El documento ingresado ya le pertenece a otra expedición de producto.`);
              setShowAlertError(true);
              setTimeout(() => {
                setShowAlertError(false);
              }, 7000);
            } else {
              axios.post('/agregar-expedicion-de-producto', data, {
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
                    updateErrorAlert('No se logro agregar la expedición de producto, revise los datos ingresados.')
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
                    updateErrorAlert('No se logro agregar la expedición de producto, revise los datos ingresados.');
                    setShowAlertError(true);
                    setTimeout(() => {
                      setShowAlertError(false);
                    }, 5000);
                  }
                })
            }
          }
        } else {
          updateErrorAlert(`La cantidad ingresada para vender del/los lote/lotes: ${resultado} es mayor a la disponible.`);
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 5000);
        }
      } else {
        updateErrorAlert(`No se pueden repetir los lotes.`);
        setShowAlertError(true);
        setTimeout(() => {
          setShowAlertError(false);
        }, 5000);
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
              <Typography component='h1' variant='h4'>Agregar Expedición de Producto</Typography>
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
                        En esta página puedes registrar las ventas a empresas o clientes de la chacinería, asegúrate de completar los campos necesarios para registrar el estado.
                      </span>
                      <br />
                      <span>
                        Este formulario cuenta con 4 campos:
                        <ul>
                          <li>
                            <span className={classes.liTitleBlue}>Fecha</span>: en este campo se debe ingresar la fecha en la que se vende el lote/lotes.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Lote y Cantidad</span>: en este campo se divide en 2, en el primero llamado lote donde se selecciona el lote que se va a vender
                            y el segundo es cantidad, en el cual se ingresa la cantidad que se le va a vender, a su vez,
                            este campo cuenta con un icono de más a la derecha del campo de lote para añadir otros 2 campos también denominados lote y cantidad, en caso de que se quiera vender mas de un lote,
                            cuando añades más campos de lote y cantidad, del que ya está predeterminado, el icono de más cambia por una X por si deseas eliminar los nuevos campos generados.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Cliente</span>: en este campo se selecciona el cliente o la empresa a la que se le va a vender el/los lote/lotes.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Documento</span>: en este campo se ingresa el documento de la venta.
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
          expedicionDeProductoLote: loteSelect,
          expedicionDeProductoCliente: clienteSelect,
        }}
      />
    </Grid>
  )
}

export default AgregarExpedicionDeProducto;