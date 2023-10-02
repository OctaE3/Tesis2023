import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { Grid, Typography, Button, IconButton, Dialog, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ColumnaReutilizable from '../../../components/Reutilizable/ColumnaReutilizable';

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
  const [data30, setData30] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [buttonName, setButtonName] = useState('Listar Todos');
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const [producto, setProducto] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [deleteItem, setDeleteItem] = useState(false);
  const navigate = useNavigate();

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);
  const [checkToken, setCheckToken] = useState(false);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [blinking, setBlinking] = useState(true);

  const [alertSuccess] = useState({
    title: 'Correcto', body: 'Expedición de producto eliminada con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar la expedición de producto, recargue la página.', severity: 'error', type: 'description'
  });

  const [alertWarning] = useState({
    title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
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


        const dataL = response.data.map((exp, index) => {
          if (index < 30) {
            return {
              ...exp,
              Id: exp.expedicionDeProductoId,
            }
          }
        });
        const dataLast30 = dataL.filter((data) => data !== undefined);
        const data = response.data.map((exp) => ({
          ...exp,
          Id: exp.expedicionDeProductoId,
        }))
        const ResponsableData = ResponsableResponse.data;
        const LoteData = LoteResponse.data;
        const ProductoData = ProductoResponse.data;
        const ClienteData = ClienteResponse.data;

        setData(dataLast30);
        setData30(dataLast30);
        setDataAll(data);
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
        setProducto(ProductoData.map((producto) => producto.productoNombre));
        setCliente(ClienteData.map((cliente) => cliente.clienteNombre));
        setButtonName('Listar Todos')
        setDeleteItem(false);
      } catch (error) {
        if (error.request.status === 401) {
          setCheckToken(true);
        } else {
          updateErrorAlert('No se logró cargar la lista, recargue la página.')
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 2000);
        }
      }
    };

    fetchData();
    setDeleteItem(false)
  }, [deleteItem]);

  const tableHeadCells = [
    { id: 'Id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'expedicionDeProductoLotes', numeric: false, disablePadding: false, label: 'Lotes - Producto - Cantidad' },
    { id: 'expedicionDeProductoCliente', numeric: false, disablePadding: false, label: 'Cliente' },
    { id: 'expedicionDeProductoDocumento', numeric: false, disablePadding: false, label: 'Documento' },
    { id: 'expedicionDeProductoUsuario', numeric: false, disablePadding: false, label: 'Responsable' },
    { id: 'expedicionDeProductoFecha', numeric: false, disablePadding: false, label: 'Fecha' },
  ];

  const filters = [
    { id: 'producto', label: 'Producto', type: 'select', options: producto },
    { id: 'lote', label: 'Lote', type: 'text' },
    { id: 'cantidad', label: 'Cantidad', type: 'text' },
    { id: 'cliente', label: 'Cliente', type: 'select', options: cliente },
    { id: 'documento', label: 'Documento', type: 'text' },
    { id: 'responsable', label: 'Responsable', type: 'select', options: responsable },
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
    } else if (key === 'expedicionDeProductoLotes') {
      if (item.expedicionDeProductoLotes && item.expedicionDeProductoLotes.length > 0) {
        const cantidadLote = [];
        for (let i = 0; i < item.expedicionDeProductoLotes.length; i++) {
          const producto = item.expedicionDeProductoLotes[i].loteProducto;
          const lote = item.expedicionDeProductoLotes[i].loteCodigo;
          const cantidad = item.expedicionDeProductoCantidad[i].detalleCantidadLoteCantidadVendida;

          const texto = `${lote} - ${producto.productoNombre} - ${cantidad} Kg`;

          cantidadLote.push(texto);
        }
        return cantidadLote;
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
      expedicionDeProductoCliente: item.expedicionDeProductoCliente ? item.expedicionDeProductoCliente.clienteNombre.toLowerCase() : '',
      expedicionDeProductoDocumento: item.expedicionDeProductoDocumento ? item.expedicionDeProductoDocumento : '',
      expedicionDeProductoUsuario: item.expedicionDeProductoUsuario ? item.expedicionDeProductoUsuario.usuarioNombre.toLowerCase() : '',
      expedicionDeProductoFecha: new Date(item.expedicionDeProductoFecha)
    };

    if (
      (!filtros.producto || lowerCaseItem.expedicionDeProductoProductos.some(producto => producto.productoNombre.toLowerCase().includes(filtros.producto))) &&
      (!filtros.cantidad || item.expedicionDeProductoCantidad.some(cantidad => cantidad.detalleCantidadLoteCantidadVendida.toString() === filtros.cantidad)) &&
      (!filtros.lote || lowerCaseItem.expedicionDeProductoLotes.some(lote => lote.loteCodigo.toLowerCase().includes(filtros.lote))) &&
      (!filtros.cliente || lowerCaseItem.expedicionDeProductoCliente.startsWith(filtros.cliente)) &&
      (!filtros.documento || lowerCaseItem.expedicionDeProductoDocumento.toString().startsWith(filtros.documento)) &&
      (!filtros.responsable || lowerCaseItem.expedicionDeProductoUsuario === filtros.responsable) &&
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
    expedicionDeProductoLotes: (lote) => <ColumnaReutilizable contacts={lote} />,
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
          setDeleteItem(true);
          setShowAlertSuccess(true);
          setTimeout(() => {
            setShowAlertSuccess(false);
          }, 2000);
        } else {
          updateErrorAlert('No se logró eliminar la expedición de producto, recargue la página.')
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 2000);
        }
      })
      .catch(error => {
        if (error.request.status === 401) {
          setCheckToken(true);
        }
        else if (error.request.status === 500) {
          updateErrorAlert('No se logró eliminar la expedición de producto, recargue la página.')
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 2000);
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

  const redirect = () => {
    navigate('/expedicion-de-producto')
  }

  const listRefresh = () => {
    if (buttonName === 'Listar Todos') {
      setButtonName('Listar últimos 30')
      setData(dataAll);
    } else {
      setButtonName('Listar Todos')
      setData(data30);
    }
  }

  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Listar de Expedición de Productos</Typography>
          <div className={classes.info}>
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
              <DialogTitle id="responsive-dialog-title">Explicación de la página.</DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.text}>
                  <span>
                    En esta página se encarga de listar las expediciones de productos que fueron registradas y también se cuenta con filtros para facilitar la búsqueda de información.
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
                        <span className={classes.liTitleBlue}>Lote</span>: En este campo se puede ingresar parte de lote y se listarán todos los registros que incluyan esa parte del lote.
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
                        <span className={classes.liTitleRed}>Lote - Producto - Cantidad</span>: En esta columna se muestra el producto que se vendió, a que lote pertenece y la cantidad vendida.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Cliente</span>: En esta columna se muestra a que cliente se vendió el producto.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Documento</span>: En esta columna se muestra el documento que identifica la venta.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Responsable</span>: En este campo se muestra el responsable que registró la expedición de producto.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Fecha</span>: En esta columna se muestra la fecha en la que se registró o se vendió el producto.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Acciones</span>: En esta columna se muestran 2 botones, el botón de modificar es el que contiene un icono de una lapíz y el de eliminar el que tiene un cubo de basura,
                        el botón de modificar al presionarlo te enviará a un formulario con los datos del registro, para poder realizar la modificación. El botón de eliminar al presionarlo desplegará una ventana, que preguntará si
                        desea eliminar el registro, en caso de presionar si, el registro sera eliminado y si presiona no, la ventana se cerrará.
                      </li>
                    </ul>
                  </span>
                  <span>
                    Aclaraciones:
                    <ul>
                      <li>En la lista vienen por defecto listados los últimos 30 registros que se agregaron.</li>
                      <li>El botón llamado Aplicar Filtro al presionarlo, filtrará la lista según los datos ingresados en los campos.</li>
                      <li>El botón llamado Limpiar Filtro al presionarlo, borrará los datos ingresados en los campos y se listarán los últimos 30 registros agregados.</li>
                      <li>El botón denominado Añadir Registro al presionarlo te enviará a un formulario donde puedes agregar un nuevo registro.</li>
                      <li>El botón denominado Listar Todos al presionarlo actualizará la lista y mostrará todos los registros existentes.</li>
                      <li>Cuando se haya presionado el botón de Listar Todos y haya realizado su función, el nombre del botón habrá cambiado por Listar Últimos 30, que al presionarlo listará los últimos 30 registros que fueron agregados.</li>
                      <li>No se recomienda eliminar los registros, ya que se cuenta con una depuración</li>
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
        dataKey="listarExpediciondeProductos"
        tableHeadCells={tableHeadCells}
        title="Lista de Expediciones de Productos"
        titleButton="Expedición de Producto"
        linkButton={redirect}
        titleListButton={buttonName}
        listButton={listRefresh}
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditExpd}
        onDeleteButton={handleDeleteExpd}
      />    </div>
  );
}


export default ListarExpedicionDeProducto;
