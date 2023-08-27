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
  liTitle: {
    color: 'black',
    fontWeight: 'bold',
  },
}));


const AgregarExpedicionDeProducto = () => {
  const campo = {
    name: 'expedicionDeProductoCantidad', label: 'Cantidad', color: 'primary'
  };

  const formFields = [
    { name: 'expedicionDeProductoFecha', label: 'Fecha', type: 'date', color: 'primary' },
    { name: 'expedicionDeProductoLote', label: 'Lote', type: 'cantidadMultiple', campo: campo, color: 'primary' },
    { name: 'expedicionDeProductoCliente', label: 'Cliente', type: 'selector', color: 'primary' },
    { name: 'expedicionDeProductoDocumento', label: 'Documento', type: 'number', color: 'primary' },
  ];

  const alertSuccess = [
    { title: 'Correcto', body: 'Expedición de producto agregada con éxito!', severity: 'success', type: 'description' },
  ];

  const alertError = [
    { title: 'Error', body: 'No se logro agregar la expedición de producto, revise los datos ingresados', severity: 'error', type: 'description' },
  ];

  const classes = useStyles();
  const [expedicionDeProducto, setExpedicionDeProducto] = useState({});
  const [lotes, setLotes] = useState('');
  const [loteSelect, setLoteSelect] = useState('');
  const [clientes, setClientes] = useState('');
  const [clienteSelect, setClienteSelect] = useState('');
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
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

    obtenerLotes();
    obtenerClientes();

  }, []);

  function hasDuplicate(list) {
    return new Set(list).size !== list.length;
  }

  const handleFormSubmit = (formData) => {
    const { cantidad, ...formDataWithoutCantidad } = formData;
    //console.log(expedicionDeProducto);
    const cantidadValue = formData.cantidad;
    //console.log(cantidad);
    console.log(cantidadValue);
    const selectValues = cantidadValue.map(item => item.selectValue);
    const hasDuplicateList = hasDuplicate(selectValues);

    if (hasDuplicateList) {
      const lotesCompletos = lotes.filter(lote => selectValues.includes(lote.loteId.toString()));
      const productosCompletos = lotesCompletos.map(lote => lote.loteProducto);

      console.log(lotesCompletos);
      const resultado = lotesCompletos.map(lote => {
        const cantidaValueEncontrada = cantidadValue.find(cv => cv.selectValue === lote.loteId.toString());
        console.log(cantidaValueEncontrada);
        if (cantidaValueEncontrada) {
          const cantidad = cantidaValueEncontrada.textFieldValue;
          console.log(cantidad);
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
      if (!elementoUndefined) {
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

        const updateFormData = {
          ...formDataWithoutCantidad,
          expedicionDeProductoCliente: clienteCompleto,
          expedicionDeProductoProductos: productosCompletos,
          expedicionDeProductoLotes: lotesCompletosConCantidadRestada,
          expedicionDeProductoUsuario: window.localStorage.getItem('user'),
        }
        //console.log(updateFormData);
        //console.log(listaDetalleCantidaLote);

        const data = {
          expedicionDeProducto: updateFormData,
          listaCantidad: listaDetalleCantidaLote,
        }

        //console.log(data);

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
              setShowAlertError(true);
              setTimeout(() => {
                setShowAlertError(false);
              }, 5000);
            }
          })
          .catch(error => {
            console.error(error);
          })
      } else {
        console.log(`El/Los lotes: ${resultado} tienen una cantidad a vender mayor al la que hay del lote`)
        alertError.forEach((alert) => {
          alert.body = `La cantidad ingresada para vender del/los lote/lotes: ${resultado} es mayor a la disponible`;
        });
        setShowAlertError(true);
        setTimeout(() => {
          setShowAlertError(false);
        }, 5000);
      }
    } else {
      console.log("No se pueden repetir los lotes!");
      alertError.forEach((alert) => {
        alert.body = `No se pueden repetir los lotes.`;
      });
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 5000);
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
                  <IconButton>
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
                            <span className={classes.liTitle}>Fecha</span>: en este campo se debe ingresar la fecha en la que se vende el lote/lotes.
                          </li>
                          <li>
                            <span className={classes.liTitle}>Lote y Cantidad</span>: en este campo se divide en 2, en el primero llamado lote donde se selecciona el lote que se va a vender
                            y el segundo es cantidad, en el cual se ingresa la cantidad que se le va a vender, a su vez,
                            este campo cuenta con un icono de más a la derecha del campo de lote para añadir otros 2 campos también denominados lote y cantidad, en caso de que se quiera vender mas de un lote,
                            cuando añades más campos de lote y cantidad, del que ya está predeterminado, el icono de más cambia por una X por si deseas eliminar los nuevos campos generados.
                          </li>
                          <li>
                            <span className={classes.liTitle}>Cliente</span>: en este campo se selecciona el cliente o la empresa a la que se le va a vender el/los lote/lotes.
                          </li>
                          <li>
                            <span className={classes.liTitle}>Documento</span>: en este campo se ingresa el documento de la venta.
                          </li>
                        </ul>
                      </span>
                      <span>
                        Campos obligatorios y no obligatorios:
                        <ul>
                          <li>
                            <span className={classes.liTitle}>Campos con contorno azul</span>: los campos con contorno azul son obligatorio, se tienen que completar sin excepción.
                          </li>
                          <li>
                            <span className={classes.liTitle}>Campos con contorno rojo</span>: en cambio, los campos con contorno rojo no son obligatorios, se pueden dejar vacíos de ser necesario.
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