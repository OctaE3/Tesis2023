import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { Grid, Typography, Button, IconButton, Dialog, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ColumnaReutilizable from '../../../components/Reutilizable/ColumnaReutilizable';

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
  container: {
    marginTop: theme.spacing(2),
  },
  info: {
    marginTop: theme.spacing(1)
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

function ListarExpedicionDeProducto() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const [producto, setProducto] = useState([]);
  const [lote, setLote] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [deleteItem, setDeleteItem] = useState(false);
  const navigate = useNavigate();

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [blinking, setBlinking] = useState(true);

  const [alertSuccess, setAlertSuccess] = useState({
    title: 'Correcto', body: 'Expedición de producto eliminado con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logro eliminar la expedición de producto, recargue la página.', severity: 'error', type: 'description'
  });

  const [alertWarning, setAlertWarning] = useState({
    title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  const updateErrorAlert = (newBody) => {
    setAlertError((prevAlert) => ({
      ...prevAlert,
      body: newBody,
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      updateErrorAlert('El token no existe, inicie sesión nuevamente.')
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
        navigate('/')
      }, 5000);
    } else {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      console.log(payload)

      const tokenExpiration = payload.exp * 1000;
      console.log(tokenExpiration)
      const currentTime = Date.now();
      console.log(currentTime)

      if (tokenExpiration < currentTime) {
        setShowAlertWarning(true);
        setTimeout(() => {
          setShowAlertWarning(false);
          navigate('/')
        }, 3000);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-expedicion-de-productos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const LoteResponse = await axios.get('/listar-lotes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ProductoResponse = await axios.get('/listar-productos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ClienteResponse = await axios.get('/listar-clientes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });


        const data = response.data.map((recepcionDeMateriasPrimasCarnicas) => ({
          ...recepcionDeMateriasPrimasCarnicas,
          Id: recepcionDeMateriasPrimasCarnicas.recepcionDeMateriasPrimasCarnicas,
        }));
        const ResponsableData = ResponsableResponse.data;
        const LoteData = LoteResponse.data;
        const ProductoData = ProductoResponse.data;
        const ClienteData = ClienteResponse.data;

        setData(data);
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
        setProducto(ProductoData.map((producto) => producto.productoNombre));
        setCliente(ClienteData.map((cliente) => cliente.clienteNombre));
        setLote(LoteData.map((lote) => lote.loteCodigo));
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
    setDeleteItem(false)
  }, [deleteItem]);

  const tableHeadCells = [
    { id: 'expedicionDeProductoProductos', numeric: false, disablePadding: false, label: 'Producto - Lotes - Cantidad' },
    { id: 'expedicionDeProductoCliente', numeric: false, disablePadding: false, label: 'Cliente' },
    { id: 'expedicionDeProductoDocumento', numeric: false, disablePadding: false, label: 'Documento' },
    { id: 'expedicionDeProductoUsuario', numeric: false, disablePadding: false, label: 'Responsable' },
    { id: 'expedicionDeProductoFecha', numeric: false, disablePadding: false, label: 'Fecha' },
  ];

  const filters = [
    { id: 'producto', label: 'Producto', type: 'select', options: producto },
    { id: 'lote', label: 'Lote', type: 'select', options: lote },
    { id: 'cantidad', label: 'Cantidad', type: 'text' },
    { id: 'cliente', label: 'Cliente', type: 'select', options: cliente },
    { id: 'documento', label: 'Documento', type: 'text' },
    { id: 'resposable', label: 'Responsable', type: 'select', options: responsable },
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta'] },
  ];

  const handleFilter = (filter) => {
    const lowerCaseFilter = Object.keys(filter).reduce((acc, key) => {
      if (filter[key]) {
        if (key === 'fecha') {
          const [desde, hasta] = filter[key].split(' hasta ');
          acc['fecha-desde'] = desde;
          acc['fecha-hasta'] = hasta;
        } else {
          acc[key] = filter[key].toLowerCase();
        }
      }
      return acc;
    }, {});
    setFiltros(lowerCaseFilter);
  };

  const mapData = (item, key) => {
    if (key === 'expedicionDeProductoFecha') {
      if (item.expedicionDeProductoFecha) {
        const fecha = new Date(item.expedicionDeProductoFecha); // Convertir fecha a objeto Date
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    }
    else if (key === 'expedicionDeProductoUsuario.usuarioNombre') {
      if (item.expedicionDeProductoUsuario && item.expedicionDeProductoUsuario.usuarioNombre) {
        return item.expedicionDeProductoUsuario.usuarioNombre;
      } else {
        return '';
      }
    } else if (key === 'expedicionDeProductoProductos') {
      if (item.expedicionDeProductoProductos && item.expedicionDeProductoProductos.length > 0) {
        const nombresProductos = item.expedicionDeProductoProductos.map(producto => `${producto.productoNombre}`);
        const loteProductos = item.expedicionDeProductoLotes.map(lote => `${lote.loteCodigo}`);
        const cantidadProductos = item.expedicionDeProductoCantidad.map(cantidadproducto => cantidadproducto.detalleCantidadLoteCantidadVendida);
        const cantidad = [[`${nombresProductos} - ${loteProductos} - ${cantidadProductos} Kg`]]
        return cantidad;
      } else {
        return [];
      }
    } else if (key === 'expedicionDeProductoCliente.clienteNombre') {
      if (item.expedicionDeProductoCliente && item.expedicionDeProductoCliente.clienteNombre) {
        return item.expedicionDeProductoCliente.clienteNombre;
      } else {
        return '';
      }
    } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      expedicionDeProductoProductos: item.expedicionDeProductoProductos.map(expedicionDeProductoProductos => expedicionDeProductoProductos),
      expedicionDeProductoLotes: item.expedicionDeProductoLotes.map(expedicionDeProductoLotes => expedicionDeProductoLotes),
      expedicionDeProductoCliente: item.expedicionDeProductoCliente ? item.expedicionDeProductoCliente : '',
      expedicionDeProductoDocumento: item.expedicionDeProductoDocumento ? item.expedicionDeProductoDocumento : '',
      expedicionDeProductoUsuario: item.expedicionDeProductoUsuario ? item.expedicionDeProductoUsuario : '',
      expedicionDeProductoFecha: new Date(item.expedicionDeProductoFecha)
    };

    if (
      (!filtros.producto || lowerCaseItem.expedicionDeProductoProductos.some(producto => producto.productoNombre.toLowerCase().includes(filtros.producto))) &&
      (!filtros.lote || lowerCaseItem.diariaDeProduccionAditivos.some(lote => lote.loteCodigo.includes(filtros.lote))) &&
      (!filtros.cliente || lowerCaseItem.expedicionDeProductoCliente.startsWith(filtros.cliente)) &&
      (!filtros.documento || lowerCaseItem.expedicionDeProductoDocumento.startsWith(filtros.documento)) &&
      (!filtros.responsable || lowerCaseItem.expedicionDeProductoUsuario.startsWith(filtros.responsable)) &&
      (!filtros['fecha-desde'] || lowerCaseItem.expedicionDeProductoFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.expedicionDeProductoFecha <= new Date(filtros['fecha-hasta']))
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    expedicionDeProductoUsuario: (responsable) => responsable.usuarioNombre,
    expedicionDeProductoCliente: (cliente) => cliente.clienteNombre,
    expedicionDeProductoProductos: (prod) => <ColumnaReutilizable contacts={prod} />,
  };

  const handleEditExpd = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-expedicion-de-producto/${id}`);
  };

  const handleDeleteExpd = (rowData) => {
    const id = rowData.Id;
    axios.delete(`/borrar-expedicion-de-producto/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.status === 204) {
          setShowAlertSuccess(true);
          setTimeout(() => {
            setShowAlertSuccess(false);
          }, 5000);
          setDeleteItem(true);
        } else {
          updateErrorAlert('No se logro eliminar la expedición de producto, recargue la página.')
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
          updateErrorAlert('No se logro eliminar la expedición de producto, recargue la página.')
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 5000);
        }
      })
  }

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


  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Lista de Expedición de Productos</Typography>
          <div className={classes.info}>
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
              <DialogTitle id="responsive-dialog-title">Explicación de la página.</DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.text}>
                  <span>
                    En esta página se encarga de listar las expediciones de productos que fueron registradas.
                  </span>
                  <br />
                  <br />
                  <span style={{ fontWeight: 'bold' }}>
                    Filtros:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleBlue}>Producto</span>: En este campo se puede seleccionar el producto por el cual se quiere filtrar la lista.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Lote</span>: En este campo se puede seleccionar el lote por el cual se quiere filtrar la lista.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Cantidad</span>: En este campo se puede ingresar la cantidad(kg) que se vendio del producto y filtrar por cantidad.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Cliente</span>: En este campo se puede seleccionar un cliente y mostrar todos los registros en los que aparece ese cliente.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Documento</span>: En este campo se puede ingresar un documento que es el que identifica la venta y ver que registro tiene ese documento.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Responsable</span>: En este campo se puede seleccionar un responsable y ver que registros están asociados a ese usuario.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Desde Fecha y Hasta Fecha</span>: Estos campos son utilizados para filtrar los registros entre un rango de fechas,
                        todas las fechas de los registros que estén comprendidas entre las 2 fechas ingresadas en los filtros, se mostraran en la lista, mientras que las demás no.
                        También es posible dejar uno de los 2 campos vacío y rellenar el otro, por ejemplo si ingresas una fecha en el campo de Desde Fecha y el Hasta Fecha se deja vacío,
                        se listará todos los registros que su fecha sea posterior a la fecha ingresada en Fecha Desde.
                      </li>
                    </ul>
                  </span>
                  <span style={{ fontWeight: 'bold' }}>
                    Lista:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleRed}>Produto - Lote - Cantidad</span>: En esta columna se muestra el producto que se vendió, a que lote pertenece y la cantidad vendida.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Cliente</span>: En esta columna se muestra a que cliente se vendió el producto.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Documento</span>: En esta columna se muestra el documneto que identifica la venta.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Responsable</span>: En este campo se muestra el responsable que registró la expedición de producto.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Fecha</span>: En esta columna se muestra la fecha en la que se registró o se vendió el producto.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Acciones</span>: En esta columna se muestra 2 botones, el botón con icono de un lápiz al presionarlo te llevará a un formulario con los datos del registro,
                        en ese formulario puedes modificar los datos y guardar el registro con los datos modificados, en cambio, el icono con un cubo de basura al presionarlo te mostrara un cartel que te preguntara si quieres eliminar ese registro,
                        si presionas "Si" se eliminara el registro de la lista y en caso de presionar "No" sé cerrera la ventana y el registro permanecerá en la lista.
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
      <FiltroReutilizable filters={filters} handleFilter={handleFilter} />
      <ListaReutilizable
        data={filteredData}
        dataKey="listarDiariaDeProduccion"
        tableHeadCells={tableHeadCells}
        title="Diaria De Produccion"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditExpd}
        onDeleteButton={handleDeleteExpd}
      />    </div>
  );
}


export default ListarExpedicionDeProducto;
