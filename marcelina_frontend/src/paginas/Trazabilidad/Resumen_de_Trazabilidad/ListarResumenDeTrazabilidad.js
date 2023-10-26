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

function ListarResumenDeTrazabilidad() {
  const [data, setData] = useState([]);
  const [data30, setData30] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [buttonName, setButtonName] = useState('Listar Todos');
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const [lote, setLotes] = useState([]);
  const [producto, setProducto] = useState([]);
  const [insumo, setInsumo] = useState([]);
  const [carne, setCarne] = useState([]);
  const [cliente, setClientes] = useState([]);
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
    title: 'Correcto', body: 'Resumen de trazabilidad eliminado con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar el resumen de trazabilidad, revise los datos ingresados.', severity: 'error', type: 'description'
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
  }, [checkToken]);

  useEffect(() => {
    axios.delete(`/eliminar-resumenes-no-permitidos`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
      })
      .catch(error => { 
      })
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-resumen-de-trazabilidad', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const InsumoResponse = await axios.get('/listar-aditivos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ProductoResponse = await axios.get('/listar-productos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const carneResponse = await axios.get('/listar-carnes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const loteResponse = await axios.get('/listar-lotes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const clienteResponse = await axios.get('/listar-clientes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });


        const dataL = response.data.map((resumen, index) => {
          if (index < 30) {
            return {
              ...resumen,
              Id: resumen.resumenDeTrazabilidadId,
            }
          }
        });
        const dataLast30 = dataL.filter((data) => data !== undefined);
        const data = response.data.map((resumen) => ({
          ...resumen,
          Id: resumen.resumenDeTrazabilidadId,
        }))
        const ResponsableData = ResponsableResponse.data;
        const InsumoData = InsumoResponse.data;
        const ProductoData = ProductoResponse.data;
        const CarneData = carneResponse.data;
        const LoteData = loteResponse.data;
        const ClienteData = clienteResponse.data;

        setData(dataLast30);
        setData30(dataLast30);
        setDataAll(data);
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
        setProducto(ProductoData.map((producto) => producto.productoNombre));
        setCarne(CarneData.map((carne) => carne.carneNombre));
        setInsumo(InsumoData.map((insumo) => insumo.insumoNombre));
        setLotes(LoteData.map((lote) => lote.loteCodigo));
        setClientes(ClienteData.map((cliente) => cliente.clienteNombre));
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
    setDeleteItem(false);
  }, [deleteItem]);

  const tableHeadCells = [
    { id: 'Id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'resumenDeTrazabilidadFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'resumenDeTrazabilidadLote', numeric: false, disablePadding: false, label: 'Lote' },
    { id: 'resumenDeTrazabilidadProducto', numeric: false, disablePadding: false, label: 'Producto' },
    { id: 'resumenDeTrazabilidadCantidadProducida', numeric: false, disablePadding: false, label: 'Cantidad producida (Kg)' },
    { id: 'resumenDeTrazabilidadMatPrimaCarnica', numeric: false, disablePadding: false, label: 'Materia prima cárnica' },
    { id: 'resumenDeTrazabilidadMatPrimaNoCarnica', numeric: false, disablePadding: false, label: 'Materia prima no cárnica' },
    { id: 'resumenDeTrazabilidadDestino', numeric: false, disablePadding: false, label: 'Destinos / Clientes' },
    { id: 'resumenDeTrazabilidadResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
  ];

  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta'] },
    { id: 'lote', label: 'Lote', type: 'select', options: lote },
    { id: 'producto', label: 'Producto', type: 'select', options: producto },
    { id: 'cantidad', label: 'Cantidad producida', type: 'text' },
    { id: 'carne', label: 'Materia prima cárnica', type: 'select', options: carne },
    { id: 'aditivo', label: 'Materia prima no cárnica', type: 'select', options: insumo },
    { id: 'cliente', label: 'Cliente', type: 'select', options: cliente },
    { id: 'responsable', label: 'Responsable', type: 'select', options: responsable },

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
    if (key === 'resumenDeTrazabilidadFecha') {
      if (item.resumenDeTrazabilidadFecha) {
        const fecha = new Date(item.resumenDeTrazabilidadFecha); // Convertir fecha a objeto Date
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    }
    else if (key === 'resumenDeTrazabilidadResponsable.usuarioNombre') {
      if (item.resumenDeTrazabilidadResponsable && item.resumenDeTrazabilidadResponsable.usuarioNombre) {
        return item.resumenDeTrazabilidadResponsable.usuarioNombre;
      } else {
        return '';
      }
    } else if (key === 'resumenDeTrazabilidadProducto.productoNombre') {
      if (item.resumenDeTrazabilidadProducto && item.resumenDeTrazabilidadProducto.productoNombre) {
        return item.resumenDeTrazabilidadProducto.productoNombre;
      } else {
        return '';
      }
    } else if (key === 'resumenDeTrazabilidadLote.loteCodigo') {
      if (item.resumenDeTrazabilidadLote && item.resumenDeTrazabilidadLote.loteCodigo) {
        return item.resumenDeTrazabilidadLote.loteCodigo;
      } else {
        return '';
      }
    } else if (key === 'resumenDeTrazabilidadMatPrimaCarnica') {
      if (item.resumenDeTrazabilidadMatPrimaCarnica && item.resumenDeTrazabilidadMatPrimaCarnica.length > 0) {
        const carnes = item.resumenDeTrazabilidadMatPrimaCarnica.map(producto => `${producto.carneNombre} - ${producto.carneCorte}`);
        return carnes;
      } else {
        return [];
      }
    } else if (key === 'resumenDeTrazabilidadMatPrimaNoCarnica') {
      if (item.resumenDeTrazabilidadMatPrimaNoCarnica && item.resumenDeTrazabilidadMatPrimaNoCarnica.length > 0) {
        const insumo = item.resumenDeTrazabilidadMatPrimaNoCarnica.map(insumo => insumo.insumoNombre);
        return insumo;
      } else {
        return [];
      }
    } else if (key === 'resumenDeTrazabilidadDestino') {
      if (item.resumenDeTrazabilidadDestino && item.resumenDeTrazabilidadDestino.length > 0) {
        const cliente = item.resumenDeTrazabilidadDestino.map(cliente => cliente.clienteNombre);
        return cliente;
      } else {
        return [];
      }
    } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      resumenDeTrazabilidadFecha: new Date(item.resumenDeTrazabilidadFecha),
      resumenDeTrazabilidadLote: item.resumenDeTrazabilidadLote ? item.resumenDeTrazabilidadLote.loteCodigo.toLowerCase() : '',
      resumenDeTrazabilidadProducto: item.resumenDeTrazabilidadProducto ? item.resumenDeTrazabilidadProducto.productoNombre.toLowerCase() : '',
      resumenDeTrazabilidadCantidadProducida: item.resumenDeTrazabilidadCantidadProducida ? item.resumenDeTrazabilidadCantidadProducida : '',
      resumenDeTrazabilidadMatPrimaCarnica: item.resumenDeTrazabilidadMatPrimaCarnica.map(carne => `${carne.carneNombre} - ${carne.carneCorte}`),
      resumenDeTrazabilidadMatPrimaNoCarnica: item.resumenDeTrazabilidadMatPrimaNoCarnica.map(resumenDeTrazabilidadMatPrimaNoCarnica => resumenDeTrazabilidadMatPrimaNoCarnica),
      resumenDeTrazabilidadDestino: item.resumenDeTrazabilidadDestino.map(resumenDeTrazabilidadDestino => resumenDeTrazabilidadDestino),
      resumenDeTrazabilidadResponsable: item.resumenDeTrazabilidadResponsable ? item.resumenDeTrazabilidadResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros['fecha-desde'] || lowerCaseItem.resumenDeTrazabilidadFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.resumenDeTrazabilidadFecha <= new Date(filtros['fecha-hasta'])) &&
      (!filtros.lote || lowerCaseItem.resumenDeTrazabilidadLote.startsWith(filtros.lote)) &&
      (!filtros.producto || lowerCaseItem.resumenDeTrazabilidadProducto.startsWith(filtros.producto)) &&
      (!filtros.cantidad || lowerCaseItem.resumenDeTrazabilidadCantidadProducida.toString() === filtros.cantidad) &&
      (!filtros.carne || lowerCaseItem.resumenDeTrazabilidadMatPrimaCarnica.some(carne => carne.toLowerCase().includes(filtros.carne))) &&
      (!filtros.aditivo || lowerCaseItem.resumenDeTrazabilidadMatPrimaNoCarnica.some(aditivo => aditivo.insumoNombre.toLowerCase().includes(filtros.aditivo))) &&
      (!filtros.cliente || lowerCaseItem.resumenDeTrazabilidadDestino.some(cliente => cliente.clienteNombre.toLowerCase().includes(filtros.cliente))) &&
      (!filtros.responsable || lowerCaseItem.resumenDeTrazabilidadResponsable === filtros.responsable)
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    resumenDeTrazabilidadLote: (lote) => lote.loteCodigo,
    resumenDeTrazabilidadProducto: (producto) => producto.productoNombre,
    resumenDeTrazabilidadMatPrimaCarnica: (carnes) => <ColumnaReutilizable contacts={carnes} />,
    resumenDeTrazabilidadMatPrimaNoCarnica: (aditivo) => <ColumnaReutilizable contacts={aditivo} />,
    resumenDeTrazabilidadDestino: (cliente) => <ColumnaReutilizable contacts={cliente} />,
    resumenDeTrazabilidadResponsable: (usuario) => usuario.usuarioNombre,
  };

  const handleEditTraz = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-resumen-de-trazabilidad/${id}`);
  };

  const handleDeleteTraz = (rowData) => {
    const id = rowData.Id;
    axios.delete(`/borrar-resumen-de-trazabilidad/${id}`, {
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
          }, 2500);
        } else {
          updateErrorAlert('No se logró eliminar el resumen de trazabilidad, recargue la página.')
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
          updateErrorAlert('No se logró eliminar el resumen de trazabilidad, recargue la página.')
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 2500);
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
    navigate('/resumen-de-trazabilidad')
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
          <Typography component='h1' variant='h5'>Listar de Resumen de Trazabilidad</Typography>
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
                    En esta página se encarga de listar los resumenes de trazabilidad que fueron registradas y también se cuenta con filtros para facilitar la búsqueda de información.
                  </span>
                  <br />
                  <br />
                  <span style={{ fontWeight: 'bold' }}>
                    Filtros:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleBlue}>Desde Fecha y Hasta Fecha</span>: Estos campos son utilizados para filtrar los registros entre un rango de fechas,
                        todas las fechas de los registros que estén comprendidas entre las 2 fechas ingresadas en los filtros, se mostraran en la lista, mientras que las demás no.
                        También es posible dejar uno de los 2 campos vacío y rellenar el otro, por ejemplo si ingresas una fecha en el campo de Desde Fecha y el Hasta Fecha se deja vacío,
                        se listará todos los registros que su fecha sea posterior a la fecha ingresada en Fecha Desde.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Lote</span>: En este campo se puede seleccionar un lote y mostrar todos los registros en donde está ese lote.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Producto</span>: En este campo se puede seleccionar un producto y filtrar la lista por ese producto.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Cantidad producida</span>: En este campo se puede ingresar una cantidad(kg) y listará los registros con esa cantidad.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Materia prima cárnica</span>: En este campo se puede seleccionar una carne y se listará todos los registros que contengan esa carne.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Materia prima no cárnica</span>: En este campo se puede seleccionar un aditivo y se listará todos los registros que contengan ese aditivo.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Cliente</span>: En este campo se puede seleccionar un cliente y se listará todos los registros en donde se encuentre ese cliente.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Responsable</span>: En este campo se puede seleccionar un responsable y ver que registros están asociados a ese usuario.
                      </li>
                    </ul>
                  </span>
                  <span style={{ fontWeight: 'bold' }}>
                    Lista:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleRed}>Id</span>: En esta columna se muestra el identificador del registro.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Fecha</span>: En esta columna se muestra la fecha y la hora en la que se registró el resumen de trazabilidad.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Lote</span>: En esta columna se muestra el lote que se vendió.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Producto</span>: En esta columna se muestra el producto que contiene el lote.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Cantidad producida(kg)</span>: En este campo se muestra la cantidad en kg que se produjo de ese producto.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Materia prima cárnica</span>: En esta columna se muestran las carnes que se utilizaron para hacer el producto.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Materia prima no cárnica</span>: En esta columna se muestran los aditivos que se utilizaron para hacer el producto.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Destinos / Clientes</span>: En esta columna se muestra los clientes a los que se le va a vender o se le vendió el producto.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Responsable</span>: En esta columna se muestra el responsable que registro el resumen de trazabilidad.
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
        dataKey="listarResumenDeTrazabilidad"
        tableHeadCells={tableHeadCells}
        title="Lista de Resumenes de Trazabilidad"
        linkButton={redirect}
        dataMapper={mapData}
        titleListButton={buttonName}
        listButton={listRefresh}
        columnRenderers={columnRenderers}
        onEditButton={handleEditTraz}
        onDeleteButton={handleDeleteTraz}
      />    </div>
  );
}


export default ListarResumenDeTrazabilidad;
