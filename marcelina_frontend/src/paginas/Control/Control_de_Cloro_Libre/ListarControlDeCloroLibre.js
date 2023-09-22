import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { Grid, Typography, Button, IconButton, Dialog, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

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

function ListarControlDeCloroLibre() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
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
    title: 'Correcto', body: 'Se elimino el control de cloro libre con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar el control de cloro libre, recargue la pagina.', severity: 'error', type: 'description'
  });

  const [alertWarning, setAlertWarning] = useState({
    title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-control-de-cloro-libre', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data.map((controlDeCloroLibre) => ({
          ...controlDeCloroLibre,
          Id: controlDeCloroLibre.controlDeCloroLibreId,
        }));
        const ResponsableData = ResponsableResponse.data;

        setData(data);
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, [deleteItem]);

  const tableHeadCells = [
    { id: 'controlDeCloroLibreFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'controlDeCloroLibreGrifoPico', numeric: false, disablePadding: false, label: 'Pico/Grifo' },
    { id: 'controlDeCloroLibreResultado', numeric: false, disablePadding: false, label: 'Resultado' },
    { id: 'controlDeCloroLibreObservaciones', numeric: false, disablePadding: false, label: 'Observaciones' },
    { id: 'controlDeCloroLibreResponsable', numeric: false, disablePadding: false, label: 'Resposnsable' }
  ];

  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'datetime', options: ['desde', 'hasta'] },
    { id: 'pico', label: 'Pico/Grifo', type: 'text' },
    { id: 'resultado', label: 'Resultado', type: 'text' },
    { id: 'observaciones', label: 'Observaciones', type: 'text' },
    { id: 'resposable', label: 'Responsable', type: 'select', options: responsable },
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
    if (key === 'controlDeCloroLibreFecha') {
      if (item.controlDeCloroLibreFecha) {
        const fechaArray = item.controlDeCloroLibreFecha;
        const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
        return format(fecha, 'yyyy-MM-dd HH:mm');
      } else {
        return '';
      }
    }
    else if (key === 'controlDeCloroLibreResponsable.usuarioNombre') {
      if (item.controlDeCloroLibreResponsable && item.controlDeCloroLibreResponsable.usuarioNombre) {
        return item.controlDeCloroLibreResponsable.usuarioNombre;
      } else {
        return '';
      }
    } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const fechaArray = item.controlDeCloroLibreFecha;
    const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
    const fechaFromat = format(fecha, 'yyyy-MM-dd HH:mm');

    const lowerCaseItem = {
      controlDeCloroLibreFecha: fechaFromat,
      controlDeCloroLibreGrifoPico: item.controlDeCloroLibreGrifoPico,
      controlDeCloroLibreResultado: item.controlDeCloroLibreResultado,
      controlDeCloroLibreObservaciones: item.controlDeCloroLibreObservaciones ? item.controlDeCloroLibreObservaciones.toLowerCase() : '',
      controlDeCloroLibreResponsable: item.controlDeCloroLibreResponsable.usuarioNombre ? item.controlDeCloroLibreResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros['fecha-desde'] || fechaFromat >= filtros['fecha-desde']) &&
      (!filtros['fecha-hasta'] || fechaFromat <= filtros['fecha-hasta']) &&
      (!filtros.pico || lowerCaseItem.controlDeCloroLibreGrifoPico.toString().startsWith(filtros.pico)) &&
      (!filtros.resultado || lowerCaseItem.controlDeCloroLibreResultado.toString().startsWith(filtros.resultado)) &&
      (!filtros.observaciones || lowerCaseItem.controlDeCloroLibreObservaciones.startsWith(filtros.observaciones)) &&
      (!filtros.responsable || lowerCaseItem.controlDeCloroLibreResponsable.startsWith(filtros.responsable))
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    controlDeCloroLibreResponsable: (responsable) => responsable.usuarioNombre
  };

  const handleEditControl = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-control-de-cloro-libre/${id}`);
  };

  const handleDeleteControl = (rowData) => {
    const id = rowData.Id;
    axios.delete(`/borrar-control-de-cloro-libre/${id}`, {
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
          <Typography component='h1' variant='h5'>Lista de Control de Cloro Libre</Typography>
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
                    En esta página se encarga de listar los controles de cloro libre que fueron registrados.
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
                        <span className={classes.liTitleBlue}>Pico/Grifo</span>: En este campo se puede ingresar el número del grifo, para listar todos los controles de cloro libre que se le hicieron a ese grifo.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Resultado</span>: Este campo se puede filtrar por el resultado que dio al medir grifo.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Observaciones</span>: En este campo se puede ingresar una palabra y se listarán las observaciones que tienen esa palabra.
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
                        <span className={classes.liTitleRed}>Fecha</span>: En esta columna se muestra la fecha que se registró el control de cloro.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Pico/Grifo</span>: En esta columna se muestra el número por el cual se identifica el grifo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Resultado</span>: En esta columna se muestra el resultado que se obtuvo en la medición del grifo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Observaciones</span>: En esta columna se muestra las observaciones que se encontraron cuando se registró el control de cloro libre.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Responsable</span>: En esta columna se muestra el responsable que registró el control de cloro libre.
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
        dataKey="listarcontrolDeCloroLibre"
        tableHeadCells={tableHeadCells}
        title="Control De Cloro Libre"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditControl}
        onDeleteButton={handleDeleteControl}
      />    </div>
  );
}

export default ListarControlDeCloroLibre;
