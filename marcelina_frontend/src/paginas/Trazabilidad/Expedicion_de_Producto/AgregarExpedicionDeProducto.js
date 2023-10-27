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

  const [alertSuccess] = useState({
    title: 'Correcto', body: 'Expedición de producto agregada con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró agregar la expedición de producto, revise los datos ingresados.', severity: 'error', type: 'description'
  });

  const [alertWarning] = useState({
    title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  const classes = useStyles();
  const navigate = useNavigate();
  const [expediciones, setExpediciones] = useState([]);
  const [expedicionesDeProd, setExpedicionesDeProd] = useState([]);
  const [lotes, setLotes] = useState('');
  const [loteSelect, setLoteSelect] = useState('');
  const [clientes, setClientes] = useState('');
  const [clienteSelect, setClienteSelect] = useState('');
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);
  const [checkToken, setCheckToken] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [reload, setReload] = useState(false);

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
    const obtenerExpedicion = () => {
      axios.get('/listar-expedicion-de-productos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          setExpedicionesDeProd(response.data);
          setExpediciones(
            response.data.map((exp) => ({
              documento: exp.expedicionDeProductoDocumento,
            }))
          );
        })
        .catch(error => {
          if (error.request.status === 401) {
            setCheckToken(true);
          } else {
            updateErrorAlert('No se logró cargar las expediciones de producto, recargue la página.')
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 2000);
          }
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
          const lotesCantidadMayor = response.data.map((lote) => {
            if (lote.loteCantidad > 0) {
              return {
                value: lote.loteId,
                label: `${lote.loteCodigo} - ${lote.loteCantidad} Kg - ${lote.loteProducto.productoNombre}`,
              }
            }
          })
          const lotesSelect = lotesCantidadMayor.filter(lote => lote !== undefined);
          setLoteSelect(lotesSelect);
        })
        .catch(error => {
          if (error.request.status === 401) {
            setCheckToken(true);
          } else {
            updateErrorAlert('No se logró cargar los lotes, recargue la página.')
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 2000);
          }
        });
    };

    const obtenerClientes = () => {
      axios.get('/listar-clientes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          const clientesT = response.data;
          const clientesNoEliminados = clientesT.filter((cliente) => cliente.clienteEliminado === false);
          setClientes(clientesNoEliminados);
          setClienteSelect(
            clientesNoEliminados.map((cliente) => ({
              value: cliente.clienteId,
              label: cliente.clienteNombre,
            }))
          );
        })
        .catch(error => {
          if (error.request.status === 401) {
            setCheckToken(true);
          } else {
            updateErrorAlert('No se logró cargar los clientes, recargue la página.')
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 2000);
          }
        });
    };

    obtenerExpedicion();
    obtenerLotes();
    obtenerClientes();
    setReload(false);

  }, [reload]);

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
    let resp = true;
    if (lotes) {
      lotes.forEach((lote) => {
        if (lote.selectValue === '' || lote.textFieldValue === '' || lote.selectValue === "Seleccionar" || lote.textFieldValue === 0) {
          resp = false;
        } else { }
        if (resp === false) { return }
      })
      return resp;
    } else {
      return false;
    }
  }

  const checkDoc = (documento) => {
    let resp = true;
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

    const cantidadValue = formData.cantidad;
    const checkMul = checkMultiple(cantidadValue);

    if (checkMul === false) {
      updateErrorAlert(`Revise los los lote seleccionados y las cantidades ingresadas, no se permite dejar campos vacíos y tampoco seleccionar la opción "Seleccionar".`);
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 2500);
    } else {
      const selectValues = cantidadValue.map(item => item.selectValue);
      const hasDuplicateList = hasDuplicate(selectValues);

      if (hasDuplicateList === false) {
        const lotesCompletos = lotes.filter(lote => selectValues.includes(lote.loteId.toString()));
        const productosCompletos = lotesCompletos.map(lote => lote.loteProducto);

        const resultado = lotesCompletos.map(lote => {
          const cantidaValueEncontrada = cantidadValue.find(cv => cv.selectValue.toString() === lote.loteId.toString());
          if (cantidaValueEncontrada) {
            const cantidad = parseInt(cantidaValueEncontrada.textFieldValue);
            if (cantidad > lote.loteCantidad) {
              return `${lote.loteCodigo} - ${lote.loteCantidad} Kg - ${lote.loteProducto.productoNombre} /`;
            }
          }
          return null;
        })

        const elementoUndefined = resultado.some(elemento => elemento === null);
        if (elementoUndefined === true) {
          const clienteCompleto = clientes.filter((cliente) => cliente.clienteId.toString() === formDataWithoutCantidad.expedicionDeProductoCliente)[0];

          const listaDetalleCantidaLote = [];
          const lotesCompletosConCantidadRestada = [];
          lotesCompletos.forEach((lote, index) => {
            const cantidadLote = cantidadValue[index].textFieldValue;
            const loteActualizado = { ...lote, loteCantidad: lote.loteCantidad - cantidadLote };
            lotesCompletosConCantidadRestada.push(loteActualizado);
            const detalleCantidadLote = {
              detalleCantidadLoteLote: loteActualizado,
              detalleCantidadLoteCantidadVendida: cantidadLote,
            };
            listaDetalleCantidaLote.push(detalleCantidadLote);
          });

          console.log()

          const uniqueProductos = {};
          const productosSinDuplicados = productosCompletos.filter((producto) => {
            const key = `${producto.productoId}-${producto.productoCodigo}`;
            if (!uniqueProductos[key]) {
              uniqueProductos[key] = true;
              return true;
            }
            return false;
          });

          const fecha = new Date(formDataWithoutCantidad.expedicionDeProductoFecha);
          fecha.setDate(fecha.getDate() + 1);

          const updateFormData = {
            ...formDataWithoutCantidad,
            expedicionDeProductoCliente: clienteCompleto,
            expedicionDeProductoFecha: fecha,
            expedicionDeProductoProductos: productosSinDuplicados,
            expedicionDeProductoLotes: lotesCompletosConCantidadRestada,
            expedicionDeProductoUsuario: window.localStorage.getItem('user'),
          }

          const data = {
            expedicionDeProducto: updateFormData,
            listaCantidad: listaDetalleCantidaLote,
          }

          const check = checkError(updateFormData.expedicionDeProductoFecha, updateFormData.expedicionDeProductoCliente, updateFormData.expedicionDeProductoDocumento);

          if (check === false) {
            updateErrorAlert(`Revise los datos ingresados, no se permite dejar campos vacíos y tampoco seleccionar la opción "Seleccionar".`);
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 3000);
          } else {
            const checkD = checkDoc(updateFormData.expedicionDeProductoDocumento);
            if (checkD === false) {
              updateErrorAlert(`El documento ingresado ya le pertenece a otra expedición de producto.`);
              setShowAlertError(true);
              setTimeout(() => {
                setShowAlertError(false);
              }, 2500);
            } else {
              axios.post('/agregar-expedicion-de-producto', data, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  "Content-Type": "application/json"
                }
              })
                .then(response => {
                  if (response.status === 201) {
                    setReload(true);
                    setFormKey(prevKey => prevKey + 1);
                    setShowAlertSuccess(true);
                    setTimeout(() => {
                      setShowAlertSuccess(false);
                    }, 2500);
                    const expedicionNueva = response.data;
                    const listaExpediciones = expedicionesDeProd;
                    listaExpediciones.push(expedicionNueva);
                    const lotesTerminados = updateFormData.expedicionDeProductoLotes.filter((lote) => lote.loteCantidad <= 0);

                    const expedicionesLote = listaExpediciones.filter(exp => {
                      return exp.expedicionDeProductoLotes.some(lote => lotesTerminados.some(loteTerm => loteTerm.loteId.toString() === lote.loteId.toString()));
                    });
                    if (lotesTerminados !== undefined && lotesTerminados !== null && lotesTerminados.length > 0) {
                      const lotesId = lotesTerminados.map((lote) => lote.loteId);
                      axios.post("/buscar-diarias-de-produccion-lotes", lotesId, {
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`,
                          "Content-Type": "application/json"
                        }
                      })
                        .then(response => {
                          const diarias = response.data;
                          const mapaLotesClientes = {};
                          let usuario = {};
                          expedicionesLote.forEach(expedicion => {
                            usuario = expedicion.expedicionDeProductoUsuario;
                            expedicion.expedicionDeProductoLotes.forEach(lote => {
                              const loteId = lote.loteId;
                              if (!mapaLotesClientes[loteId]) {
                                mapaLotesClientes[loteId] = [];
                              }
                              mapaLotesClientes[loteId].push(expedicion.expedicionDeProductoCliente);
                            });
                          });
                          const resumenes = [];
                          diarias.forEach(diar => {
                            expedicionesLote.forEach(exp => {
                              exp.expedicionDeProductoLotes.forEach(lote => {
                                if (diar.diariaDeProduccionLote.loteId === lote.loteId) {
                                  const loteId = lote.loteId;
                                  const clienteVisto = {};
                                  const clientes = mapaLotesClientes[loteId].filter(cliente => {
                                    const cliId = cliente.clienteId;
                                    if (!clienteVisto[cliId]) {
                                      clienteVisto[cliId] = true;
                                      return true;
                                    }
                                    return false;
                                  })
                                  const resumen = {
                                    resumenDeTrazabilidadFecha: exp.expedicionDeProductoFecha,
                                    resumenDeTrazabilidadLote: lote,
                                    resumenDeTrazabilidadProducto: lote.loteProducto,
                                    resumenDeTrazabilidadCantidadProducida: diar.diariaDeProduccionCantidadProducida,
                                    resumenDeTrazabilidadMatPrimaCarnica: diar.diariaDeProduccionInsumosCarnicos,
                                    resumenDeTrazabilidadMatPrimaNoCarnica: diar.diariaDeProduccionAditivos,
                                    resumenDeTrazabilidadDestino: clientes,
                                    resumenDeTrazabilidadResponsable: usuario,
                                  }
                                  resumenes.push(resumen);
                                }
                              })
                            })
                          })

                          const lotesVistos = {};
                          const resumenesDeTrazabilidad = resumenes.filter(resumen => {
                            const loteId = resumen.resumenDeTrazabilidadLote.loteId;
                            if (!lotesVistos[loteId]) {
                              lotesVistos[loteId] = true;
                              return true;
                            }
                            return false;
                          });

                          for (let i = 0; i < resumenesDeTrazabilidad.length; i++) {
                            resumenesDeTrazabilidad[i].resumenDeTrazabilidadLote.loteCantidad = 0;
                          }

                          axios.post('/agregar-resumen-de-trazabilidad', resumenesDeTrazabilidad, {
                            headers: {
                              'Authorization': `Bearer ${localStorage.getItem('token')}`,
                              "Content-Type": "application/json"
                            }
                          })
                            .then(response => {
                            })
                            .catch(error => {

                            })

                        })
                        .catch(error => {
                        })
                    }
                  } else {
                    updateErrorAlert('No se logró agregar la expedición de producto, revise los datos ingresados.')
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
                    updateErrorAlert('No se logró agregar la expedición de producto, revise los datos ingresados.');
                    setShowAlertError(true);
                    setTimeout(() => {
                      setShowAlertError(false);
                    }, 2500);
                  }
                })
            }
          }
        } else {
          updateErrorAlert(`La cantidad ingresada para vender del/los lote/lotes: ${resultado} es mayor a la disponible.`);
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 3000);
        }
      } else {
        updateErrorAlert(`No se pueden repetir los lotes.`);
        setShowAlertError(true);
        setTimeout(() => {
          setShowAlertError(false);
        }, 2500);
      }
    }
  }

  const redirect = () => {
    navigate('/listar-expedicion-de-producto')
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
                        En esta página puedes registrar las ventas a empresas o clientes de la chacinería, asegúrate de completar los campos necesarios para registrar el estado.
                      </span>
                      <br />
                      <span>
                        Este formulario cuenta con 4 campos:
                        <ul>
                          <li>
                            <span className={classes.liTitleBlue}>Fecha</span>: En este campo se debe ingresar la fecha en la que se vendio el lote/lotes.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Lote y Cantidad</span>: Este campo se divide en 2, en el primero llamado lote donde se selecciona el lote que se vendió
                            y el segundo es cantidad, en el cual se ingresa la cantidad que se vendió, a su vez
                            este campo cuenta con un icono de más a la derecha del campo de lote para añadir otros 2 campos también denominados lote y cantidad, en caso de que se quiera vender mas de un lote,
                            cuando añades más campos de lote y cantidad, del que ya está predeterminado, el icono de más cambia por una X por si deseas eliminar los nuevos campos generados.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Cliente</span>: En este campo se debe seleccionar al cliente o a la empresa que se le va a vender el/los lote/lotes.
                          </li>
                          <li>
                            <span className={classes.liTitleBlue}>Documento</span>: En este campo se debe ingresar el documento de la venta.
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
                        - Una vez se registre la expedición de producto, no se le redirigirá al listar. Se determinó así por si está buscando registrar otra expedición de producto.
                        <br />
                        - Cuando la cantidad restante del lote llegue a 0 se eliminará lógicamente.
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
          expedicionDeProductoLote: loteSelect,
          expedicionDeProductoCliente: clienteSelect,
        }}
      />
    </Grid>
  )
}

export default AgregarExpedicionDeProducto;