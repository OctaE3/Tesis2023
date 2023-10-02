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

function ListarControlDeReposicionDeCloro() {
  const [data, setData] = useState([]);
  const [data30, setData30] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [buttonName, setButtonName] = useState('Listar Todos');
  const [responsable, setResponsable] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [deleteItem, setDeleteItem] = useState(false);
  const navigate = useNavigate();

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [checkToken, setCheckToken] = useState(false);

  const [blinking, setBlinking] = useState(true);

  const [alertSuccess] = useState({
    title: 'Correcto', body: 'Se eliminó el control de reposición de cloro con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar el control de reposición de cloro, recargue la pagina.', severity: 'error', type: 'description'
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
        const response = await axios.get('/listar-control-de-reposicion-de-cloro', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const dataL = response.data.map((control, index) => {
          if (index < 30) {
            return {
              ...control,
              Id: control.controlDeReposicionDeCloroId,
            }
          }
        });
        const dataLast30 = dataL.filter((data) => data !== undefined);
        const data = response.data.map((control) => ({
          ...control,
          Id: control.controlDeReposicionDeCloroId,
        }));
        const ResponsableData = ResponsableResponse.data;

        setData(dataLast30);
        setData30(dataLast30);
        setDataAll(data)
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
        setButtonName('Listar Todos')
        setDeleteItem(false)
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
    { id: 'controlDeReposicionDeCloroFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'controlDeReposicionDeCloroCantidadDeAgua', numeric: false, disablePadding: false, label: 'Cantidad de Agua' },
    { id: 'controlDeReposicionDeCloroCantidadDeCloroAdicionado', numeric: false, disablePadding: false, label: 'Cloro Adicionado' },
    { id: 'controlDeReposicionDeCloroObservaciones', numeric: false, disablePadding: false, label: 'Observaciones' },
    { id: 'controlDeReposicionDeCloroResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
  ];

  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta'] },
    { id: 'cantidad', label: 'Cantidad de Agua', type: 'text' },
    { id: 'adicionado', label: 'Cloro Adicionado', type: 'text' },
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

  const mapData = (item, key) => {
    if (key === 'controlDeReposicionDeCloroFecha') {
      if (item.controlDeReposicionDeCloroFecha) {
        const fecha = new Date(item.controlDeReposicionDeCloroFecha);
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    }
    else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      controlDeReposicionDeCloroFecha: new Date(item.controlDeReposicionDeCloroFecha),
      controlDeReposicionDeCloroCantidadDeAgua: item.controlDeReposicionDeCloroCantidadDeAgua ? item.controlDeReposicionDeCloroCantidadDeAgua : '',
      controlDeReposicionDeCloroCantidadDeCloroAdicionado: item.controlDeReposicionDeCloroCantidadDeCloroAdicionado ? item.controlDeReposicionDeCloroCantidadDeCloroAdicionado : '',
      controlDeReposicionDeCloroObservaciones: item.controlDeReposicionDeCloroObservaciones ? item.controlDeReposicionDeCloroObservaciones.toLowerCase() : '',
      controlDeReposicionDeCloroResponsable: item.controlDeReposicionDeCloroResponsable ? item.controlDeReposicionDeCloroResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros['fecha-desde'] || lowerCaseItem.controlDeReposicionDeCloroFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.controlDeReposicionDeCloroFecha <= new Date(filtros['fecha-hasta'])) &&
      (!filtros.cantidad || lowerCaseItem.controlDeReposicionDeCloroCantidadDeAgua.startsWith(filtros.cantidad)) &&
      (!filtros.adicionado || lowerCaseItem.controlDeReposicionDeCloroCantidadDeCloroAdicionado.startsWith(filtros.adicionado)) &&
      (!filtros.observaciones || lowerCaseItem.controlDeReposicionDeCloroObservaciones.includes(filtros.observaciones)) &&
      (!filtros.responsable || lowerCaseItem.controlDeReposicionDeCloroResponsable === filtros.responsable)
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    controlDeReposicionDeCloroResponsable: (responsable) => responsable.usuarioNombre
  };

  const handleEditControl = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-control-de-reposicion-de-cloro/${id}`);
  };

  const handleDeleteControl = (rowData) => {
    const id = rowData.Id;
    axios.delete(`/borrar-control-de-reposicion-de-cloro/${id}`, {
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
          updateErrorAlert('No se logró eliminar el control de reposición de cloro, recargue la pagina.')
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
          updateErrorAlert('No se logró eliminar el control de reposición de cloro, recargue la pagina.')
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
    navigate('/control-de-reposicion-de-cloro')
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
          <Typography component='h1' variant='h5'>Listar de Control De Reposición De Cloro</Typography>
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
                    En esta página se encarga de listar los controles de reposición de cloro que fueron registrados y también se cuenta con filtros para facilitar la búsqueda de información.
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
                        <span className={classes.liTitleBlue}>Cantidad de Agua</span>: En este campo se puede ingresar la cantidad de agua por el cual se quiere filtrar la lista y mostrar los registros que empiecen o sean iguales a ese número.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Cloro Adicionado</span>: En este campo se puede ingresar el cloro adicionado por el cual se quiere filtrar la lista y mostrar los registros que empiecen o sean iguales a ese número.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Observaciones</span>: En este campo se puede ingresar una palabra o frase y se listarán los registros que incluyan esa palabra o frase en observaciones.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Responsable</span>: En este campo se puede seleccionar un responsable y se listará los registros asociados a ese responsable.
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
                        <span className={classes.liTitleRed}>Fecha</span>: En esta columna se muestra la fecha en el que se registró el control de reposición de cloro.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Cantidad de Agua</span>: En esta columna se muestra la cantidad de agua a la que se le añadió cloro.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Cloro Adicionado</span>: En esta columna se muestra la cantidad de cloro que se le añadió al agua.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Observaciones</span>: En esta columna se muestra las observaciones o detalles que se encontraron cuando se añadio el cloro al agua.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Responsable</span>: En esta columna se muestra el responsable que registró el control de reposición de cloro.
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
        dataKey="listarControlDeReposicionDeCloro"
        tableHeadCells={tableHeadCells}
        title="Lista de Controles de Reposición de Cloro"
        linkButton={redirect}
        titleListButton={buttonName}
        listButton={listRefresh}
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditControl}
        onDeleteButton={handleDeleteControl}
      />    </div>
  );
}

export default ListarControlDeReposicionDeCloro;
