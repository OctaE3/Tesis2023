import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { Grid, Typography, Button, IconButton, Dialog, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import { format, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

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

function ListarInsumo() {
  const [data, setData] = useState([]);
  const [data30, setData30] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [buttonName, setButtonName] = useState('Listar Todos');
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [deleteItem, setDeleteItem] = useState(false);
  const [checkToken, setCheckToken] = useState(false);
  const navigate = useNavigate();

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [blinking, setBlinking] = useState(true);

  const [alertSuccess] = useState({
    title: 'Correcto', body: 'Se eliminó el insumo con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar el insumo, recargue la página.', severity: 'error', type: 'description'
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
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-control-de-insumos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ProveedorResponse = await axios.get('/listar-proveedores', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });


        const data = response.data.map((data) => {
          const fechaVencimiento = new Date(data.insumoFechaVencimiento);
          const fechaActual = new Date();
          const diferenciaDias = differenceInDays(fechaVencimiento, fechaActual);
          if (diferenciaDias <= 3 && diferenciaDias >= 0) {
            return {
              ...data,
              Id: data.insumoId,
              isExpired: 'Yes',
            };
          } else if (diferenciaDias < 0 || data.insumoCantidad === 0 || data.insumoEliminado === true) {
            return {
              ...data,
              Id: data.insumoId,
              isDelete: 'Yes',
              icl: 'Yes',
            }
          } else {
            return {
              ...data,
              Id: data.insumoId,
            };
          }
        });
        const dataL = data.map((insumo, index) => {
          const cantidad = insumo.insumoCantidad;
          const fechaVencimiento = new Date(insumo.insumoFechaVencimiento);
          const fechaActual = new Date();
          if (index < 30) {
            if (fechaVencimiento > fechaActual && cantidad > 0) {
              return { ...insumo };
            }
          }
        })
        const dataLast30 = dataL.filter((data) => data !== undefined);
        const ResponsableData = ResponsableResponse.data;
        const ProveedorData = ProveedorResponse.data;

        setData(dataLast30);
        setData30(dataLast30);
        setDataAll(data);
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
        setProveedor(ProveedorData.map((proveedor) => proveedor.proveedorNombre));
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
  }, [deleteItem]);

  const tableHeadCells = [
    { id: 'Id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'insumoNombre', numeric: false, disablePadding: false, label: 'Nombre' },
    { id: 'insumoFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'insumoProveedor', numeric: false, disablePadding: false, label: 'Proveedor' },
    { id: 'insumoTipo', numeric: false, disablePadding: false, label: 'Tipo' },
    { id: 'insumoCantidad', numeric: false, disablePadding: false, label: 'Cantidad' },
    { id: 'insumoUnidad', numeric: false, disablePadding: false, label: 'Unidad' },
    { id: 'insumoNroLote', numeric: false, disablePadding: false, label: 'Número Lote' },
    { id: 'insumoMotivoDeRechazo', numeric: false, disablePadding: false, label: 'Motivo de rechazo' },
    { id: 'insumoResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
    { id: 'insumoFechaVencimiento', numeric: false, disablePadding: false, label: 'Fecha vencimiento' },
  ];

  const filters = [
    { id: 'nombre', label: 'Nombre', type: 'text' },
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta'] },
    { id: 'proveedor', label: 'Proveedor', type: 'select', options: proveedor },
    { id: 'tipo', label: 'Tipo', type: 'select', options: ['Aditivo', 'Otros'] },
    { id: 'cantidad', label: 'Cantidad', type: 'text' },
    { id: 'unidad', label: 'Unidad', type: 'select', options: ['Kg', 'Metros', 'Litros'] },
    { id: 'nroLote', label: 'Número Lote', type: 'text' },
    { id: 'motivoDeRechazo', label: 'Motivo de rechazo', type: 'text' },
    { id: 'responsable', label: 'Responsable', type: 'select', options: responsable },
    { id: 'fechaVencimiento', label: 'Fecha vencimiento', type: 'date', options: ['desde', 'hasta'] },
  ];

  const handleFilter = (filter) => {
    const lowerCaseFilter = Object.keys(filter).reduce((acc, key) => {
      if (filter[key]) {
        if (key === 'fecha') {
          const [desde, hasta] = filter[key].split(' hasta ');
          acc['fecha-desde'] = desde;
          acc['fecha-hasta'] = hasta;
        }
        else if (key === 'fechaVencimiento') {
          const [desdeV, hastaV] = filter[key].split(' hasta ');
          acc['fechaVencimiento-desde'] = desdeV;
          acc['fechaVencimiento-hasta'] = hastaV;
        } else {
          acc[key] = filter[key].toLowerCase();
        }
      }
      return acc;
    }, {});
    setFiltros(lowerCaseFilter);
  };

  const mapData = (item, key) => {
    if (key === 'insumoFecha') {
      if (item.insumoFecha) {
        const fecha = new Date(item.insumoFecha);
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    } else if (key === 'insumoFechaVencimiento') {
      if (item.insumoFechaVencimiento) {
        const fechaV = new Date(item.insumoFechaVencimiento);
        return format(fechaV, 'dd/MM/yyyy');
      } else {
        return '';
      }
    }
    else if (key === 'insumoResponsable.usuarioNombre') {
      if (item.insumoResponsable && item.insumoResponsable.usuarioNombre) {
        return item.insumoResponsable.usuarioNombre;
      } else {
        return '';
      }
    } else if (key === 'insumoProveedor.proveedorNombre') {
      if (item.insumoProveedor && item.insumoProveedor.proveedorNombre) {
        return item.insumoProveedor.proveedorNombre;
      } else {
        return '';
      }
    } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      insumoNombre: item.insumoNombre ? item.insumoNombre.toLowerCase() : '',
      insumoFecha: new Date(item.insumoFecha),
      insumoProveedor: item.insumoProveedor.proveedorNombre ? item.insumoProveedor.proveedorNombre.toLowerCase() : '',
      insumoTipo: item.insumoTipo ? item.insumoTipo.toLowerCase() : '',
      insumoCantidad: item.insumoCantidad ? item.insumoCantidad : '',
      insumoUnidad: item.insumoUnidad ? item.insumoUnidad.toLowerCase() : '',
      insumoNroLote: item.insumoNroLote ? item.insumoNroLote.toLowerCase() : '',
      insumoMotivoDeRechazo: item.insumoMotivoDeRechazo ? item.insumoMotivoDeRechazo.toLowerCase() : '',
      insumoResponsable: item.insumoResponsable.usuarioNombre ? item.insumoResponsable.usuarioNombre.toLowerCase() : '',
      insumoFechaVencimiento: new Date(item.insumoFechaVencimiento),
    };

    if (
      (!filtros.nombre || lowerCaseItem.insumoNombre.startsWith(filtros.nombre)) &&
      (!filtros['fecha-desde'] || lowerCaseItem.insumoFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.insumoFecha <= new Date(filtros['fecha-hasta'])) &&
      (!filtros.proveedor || lowerCaseItem.insumoProveedor.startsWith(filtros.proveedor)) &&
      (!filtros.tipo || lowerCaseItem.insumoTipo.startsWith(filtros.tipo)) &&
      (!filtros.cantidad || lowerCaseItem.insumoCantidad.toString() === filtros.cantidad) &&
      (!filtros.unidad || lowerCaseItem.insumoUnidad.startsWith(filtros.unidad)) &&
      (!filtros.nroLote || lowerCaseItem.insumoNroLote.startsWith(filtros.nroLote)) &&
      (!filtros.motivoDeRechazo || lowerCaseItem.insumoMotivoDeRechazo.includes(filtros.motivoDeRechazo)) &&
      (!filtros.responsable || lowerCaseItem.insumoResponsable === filtros.responsable) &&
      (!filtros['fechaVencimiento-desde'] || lowerCaseItem.insumoFechaVencimiento >= new Date(filtros['fechaVencimiento-desde'])) &&
      (!filtros['fechaVencimiento-hasta'] || lowerCaseItem.insumoFechaVencimiento <= new Date(filtros['fechaVencimiento-hasta']))
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    insumoProveedor: (proveedor) => proveedor.proveedorNombre,
    insumoResponsable: (responsable) => responsable.usuarioNombre
  };

  const handleEditInsumo = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-insumo/${id}`);
  }

  const handleDeleteInsumo = (rowData) => {
    const id = rowData.Id;
    axios.put(`/borrar-control-de-insumos/${id}`, null, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.status === 200) {
          setDeleteItem(true);
          setShowAlertSuccess(true);
          setTimeout(() => {
            setShowAlertSuccess(false);
          }, 2000);
        } else {
          updateErrorAlert('No se logró eliminar el insumo, recargue la página.')
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
          updateErrorAlert('No se logró eliminar el insumo, recargue la página.')
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
    navigate('/insumo')
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
          <Typography component='h1' variant='h5'>Lista de Insumos</Typography>
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
                    En esta página se encarga de listar los insumos que fueron registrados y también se cuenta con filtros para facilitar la búsqueda de información.
                  </span>
                  <br />
                  <br />
                  <span style={{ fontWeight: 'bold' }}>
                    Filtros:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleBlue}>Nombre</span>: En este campo se puede ingresar el nombre del insumo por el cual se quiere filtrar la lista y se listarán todos los registros que empiecen o tengan ese nombre.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Desde Fecha y Hasta Fecha</span>: Estos campos son utilizados para filtrar los registros entre un rango de fechas,
                        todas las fechas de los registros que estén comprendidas entre las 2 fechas ingresadas en los filtros, se mostraran en la lista, mientras que las demás no.
                        También es posible dejar uno de los 2 campos vacío y rellenar el otro, por ejemplo si ingresas una fecha en el campo de Desde Fecha y el Hasta Fecha se deja vacío,
                        se listará todos los registros que su fecha sea posterior a la fecha ingresada en Fecha Desde.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Proveedor</span>: En este campo se puede seleccionar el proveedor del insumo por el cual se quiere filtrar la lista y se listarán todos los registros que contengan ese proveedor.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Tipo</span>: En este campo se puede seleccionar el tipo del insumo por el cual se quiere filtrar la lista y se listarán todos los registros que contengan ese tipo.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Cantidad</span>: En este campo se puede ingresar la cantidad del insumo por la cual se quiere filtrar la lista y se listarán todos los registros tengan esa cantidad.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Unidad</span>: En este campo se puede seleccionar la unidad de medida del insumo por la cual se quiere filtrar la lista y se listarán todos los registros que contengan esa unidad.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Número Lote</span>: En este campo se puede ingresar el lote al que pertenece el insumo por el cual se quiere filtrar la lista y se listarán todos los registros que empiecen o tengan ese lote.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Motivo de rechazo</span>: En este campo se puede ingresar una palabra o frase y se listarán los registros que incluyan esa palabra o frase en motivo de rechazo.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Responsable</span>: En este campo se puede seleccionar un responsable y se filtrará la lista con los registros asociados a ese responsable.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Desde Fecha vencimeinto y Hasta Fecha vencimeinto</span>: Estos campos funcionan de la misma manera que Desde Fecha y Hasta Fecha,
                        nada más que se tiene en cuenta la fecha de vencimiento.
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
                        <span className={classes.liTitleRed}>Nombre</span>: En esta columna se muestra el nombre del insumo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Fecha</span>: En esta columna se muestra la fecha que se registró o recibió el insumo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Proveedor</span>: En esta columna se muestra el proveedor al que se le compró el insumo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Tipo</span>: En esta columna se muestra el tipo al que pertenece el insumo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Cantidad</span>: En esta columna se muestra la cantidad que hay del insumo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Unidad</span>: En esta columna se muestra la unidad de medida del insumo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Número Lote</span>: En esta columna se muestra el lote al que pertenece el insumo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Motivo de rechazo</span>: En esta columna se muestra el porqué fue rechazado el insumo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Responsable</span>: En esta columna se muestra el responsable que registró el insumo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Fecha vencimeinto</span>: En esta columna se muestra la fecha en la que se vence el insumo.
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
                      <li>Los insumos con cantidad igual a 0, se eliminarán.</li>
                      <li>Cuando se listen todos los registros, aparecerán registros de color azul, los registros de color azul significan que están eliminados, en caso de que ese insumo que está eliminada lo quiere volver a agregar, solo modifique la cantidad de ese insumo, para que sea superior a 0.</li>
                      <li>Los registros de color rojo significa que el insumo esta por caducar.</li>
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
        dataKey="insumo"
        tableHeadCells={tableHeadCells}
        title="Insumos"
        titleButton="Insumo"
        linkButton={redirect}
        titleListButton={buttonName}
        listButton={listRefresh}
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditInsumo}
        onDeleteButton={handleDeleteInsumo}
      />    </div>
  );
}

export default ListarInsumo;