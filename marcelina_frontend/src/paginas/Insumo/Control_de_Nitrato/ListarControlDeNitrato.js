import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { Grid, Typography, Button, IconButton, Dialog, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

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

function ListarControlDeNitrato() {
  const [data, setData] = useState([]);
  const [data30, setData30] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [buttonName, setButtonName] = useState('Listar Todos');
  const [filtros, setFiltros] = useState({});
  const [responsable, setResponsables] = useState([]);
  const [deleteItem, setDeleteItem] = useState(false);
  const classes = useStyles();
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
    title: 'Correcto', body: 'Se eliminó el control de nitrato con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar el control de nitrato, recargue la pagina.', severity: 'error', type: 'description'
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
        const nitratosResponse = await axios.get('/listar-control-de-nitrato', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const responsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const nitratosDataL = nitratosResponse.data.map((nitrato, index) => {
          if (index < 30) {
            return {
              ...nitrato,
              Id: nitrato.controlDeNitratoId,
            }
          }
        });
        const nitratosLast30 = nitratosDataL.filter((data) => data !== undefined);
        const nitratosAll = nitratosResponse.data.map((nitrato) => ({
          ...nitrato,
          Id: nitrato.controlDeNitratoId,
        }))
        const responsableData = responsableResponse.data;

        setData(nitratosLast30);
        setData30(nitratosLast30);
        setDataAll(nitratosAll);
        setResponsables(responsableData.map((usuario) => usuario.usuarioNombre));
        setButtonName('Listar Todos');
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


  const mapData = (item, key) => {
    if (key === 'controlDeNitratoResponsable.usuarioNombre') {
      if (item.controlDeNitratoResponsable && item.controlDeNitratoResponsable.usuarioNombre) {
        return item.controlDeNitratoResponsable.usuarioNombre;
      } else {
        return '';
      }
    }
    else if (key === 'controlDeNitratoProductoLote.loteCodigo') {
      if (item.controlDeNitratoProductoLote && item.controlDeNitratoProductoLote.loteCodigo) {
        return item.controlDeNitratoProductoLote.loteCodigo;
      } else {
        return '';
      }
    }
    else if (key === 'controlDeNitratoFecha') {
      if (item.controlDeNitratoFecha) {
        const fecha = new Date(item.controlDeNitratoFecha); // Convertir fecha a objeto Date
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    }
    else {
      return item[key];
    }
  };

  const tableHeadCells = [
    { id: 'Id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'controlDeNitratoFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'controlDeNitratoProductoLote', numeric: false, disablePadding: false, label: 'Lote' },
    { id: 'controlDeNitratoCantidadUtilizada', numeric: false, disablePadding: false, label: 'Cantidad utilizada' },
    { id: 'controlDeNitratoStock', numeric: false, disablePadding: false, label: 'Stock' },
    { id: 'controlDeNitratoObservaciones', numeric: false, disablePadding: false, label: 'Observaciones' },
    { id: 'controlDeNitratoResponsable.usuarioNombre', numeric: false, disablePadding: false, label: 'Responsable' },
  ];

  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta'] },
    { id: 'lote', label: 'Lote', type: 'text' },
    { id: 'cantidad', label: 'Cantidad utilizada', type: 'text' },
    { id: 'stock', label: 'Stock', type: 'text' },
    { id: 'observaciones', label: 'Observaciones', type: 'text' },
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

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      controlDeNitratoFecha: new Date(item.controlDeNitratoFecha),
      controlDeNitratoProductoLote: item.controlDeNitratoProductoLote ? item.controlDeNitratoProductoLote.loteCodigo.toLowerCase() : '',
      controlDeNitratoCantidadUtilizada: item.controlDeNitratoCantidadUtilizada ? item.controlDeNitratoCantidadUtilizada : '',
      controlDeNitratoStock: item.controlDeNitratoStock ? item.controlDeNitratoStock : '',
      controlDeNitratoObservaciones: item.controlDeNitratoObservaciones ? item.controlDeNitratoObservaciones.toLowerCase() : '',
      controlDeNitratoResponsable: item.controlDeNitratoResponsable.usuarioNombre ? item.controlDeNitratoResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros['fecha-desde'] || lowerCaseItem.controlDeNitratoFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.controlDeNitratoFecha <= new Date(filtros['fecha-hasta'])) &&
      (!filtros.lote || lowerCaseItem.controlDeNitratoProductoLote.toString().includes(filtros.lote)) &&
      (!filtros.cantidad || lowerCaseItem.controlDeNitratoCantidadUtilizada.toString() === filtros.cantidad) &&
      (!filtros.stock || lowerCaseItem.controlDeNitratoStock.toString() === filtros.stock) &&
      (!filtros.observaciones || lowerCaseItem.controlDeNitratoObservaciones.includes(filtros.observaciones)) &&
      (!filtros.responsable || lowerCaseItem.controlDeNitratoResponsable === filtros.responsable)
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    controlDeNitratoResponsable: (responsable) => responsable.usuarioNombre,
    controlDeNitratoProductoLote: (lote) => lote.loteCodigo,
  };

  const handleEditControl = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-control-de-nitratos/${id}`);
  }

  const handleDeleteControl = (rowData) => {
    const id = rowData.Id;
    axios.delete(`/borrar-control-de-nitrato/${id}`, {
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
          updateErrorAlert('No se logró eliminar el control de nitrato, recargue la página.')
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
          updateErrorAlert('No se logró eliminar el control de nitrato, recargue la página.')
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
    navigate('/control-de-nitratos')
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
          <Typography component='h1' variant='h5'>Listar de Control de Nitratos</Typography>
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
                    En esta página se encarga de listar los controles de nitratos que fueron registrados y también se cuenta con filtros para facilitar la búsqueda de información.
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
                        <span className={classes.liTitleBlue}>Lote</span>: En este campo se puede ingresar el lote al que se le añadió el nitrato y filtrar la lista, al aplicar el filtro se listarán todos los registros que empiecen o tengan ese lote.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Cantidad utilizada</span>: En este campo se puede ingresar la cantidad de nitrato que se le añadió al lote y filtrar la lista, al aplicar el filtro se listarán todos los registros que tengan esa cantidad.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Stock</span>: En este campo se puede ingresar el stock por el cual filtrar la lista, al aplicar el filtro se listarán todos los registros que tengan esa cantidad.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Observaciones</span>: En este campo se puede ingresar una palabra o frase y se mostrará todos los registros que tengan esa palabra o frase incluida.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Responsable</span>: En este campo se puede seleccionar un responsable y mostrar todos los registros asociados a ese responsable.
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
                        <span className={classes.liTitleRed}>Fecha</span>: En esta columna se muestra la fecha que se registró el control de nitrato.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Lote</span>: En esta columna se muestra el lote al que se la añadió el nitrato.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Cantidad utilizada</span>: En esta columna se muestra la cantidad de nitrato que se le añadió al lote.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Stock</span>: En esta columna se muestra la cantidad restante que quedó de nitrato después de añadirle al lote.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Observaciones</span>: En esta columna se muestra los detalles o observaciones que encontraron al añadirle el nitrato al lote.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Responsable</span>: En esta columna se muestra el reponsable que registró el control de nitrato.
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
        dataKey="listarControlDeNitrato"
        tableHeadCells={tableHeadCells}
        title="Lista de Controles de Nitratos"
        titleButton="Control de Nitrato"
        linkButton={redirect}
        titleListButton={buttonName}
        listButton={listRefresh}
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditControl}
        onDeleteButton={handleDeleteControl}
      />

    </div>
  );
}

export default ListarControlDeNitrato;
