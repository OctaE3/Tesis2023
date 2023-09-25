import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { Grid, Typography, Button, Tooltip, IconButton, Dialog, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

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

function ListarCarne() {
  const [data, setData] = useState([]);
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

  const [blinking, setBlinking] = useState(true);

  const [alertSuccess, setAlertSuccess] = useState({
    title: 'Correcto', body: 'Se elimino la carne con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar la carne, recargue la pagina.', severity: 'error', type: 'description'
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
        const response = await axios.get('/listar-carnes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data.map((data) => ({
          ...data,
          Id: data.carneId,
        }));

        setData(data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, [deleteItem]);

  const tableHeadCells = [
    { id: 'carneNombre', numeric: false, disablePadding: true, label: 'Nombre' },
    { id: 'carneTipo', numeric: false, disablePadding: false, label: 'Tipo' },
    { id: 'carneCorte', numeric: false, disablePadding: false, label: 'Corte' },
    { id: 'carneCategoria', numeric: false, disablePadding: false, label: 'Categoría' },
    { id: 'carneCantidad', numeric: false, disablePadding: false, label: 'Cantidad' },
    { id: 'carneFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'carnePaseSanitario', numeric: false, disablePadding: false, label: 'Pase sanitario' },
  ];

  const filters = [
    { id: 'nombre', label: 'Nombre', type: 'text' },
    { id: 'tipo', label: 'Tipo', type: 'select', options: ['Porcino', 'Bovino', 'Sangre', 'Tripas', 'Higado'] },
    { id: 'corte', label: 'Corte', type: 'select', options: ['Carcasa', 'Media res', 'Cortes c/h', 'Cortes s/h', 'Menudencias', 'Subproductos', 'Delantero', 'Trasero', 'Sangre', 'Tripas', 'Higado'] },
    { id: 'categoria', label: 'Categoria', type: 'select', options:['CarneSH', 'CarneCH', 'Grasa', 'Sangre', 'Tripas', 'Higado'] },
    { id: 'cantidad', label: 'Cantidad', type: 'text' },
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta'] },
    { id: 'paseSanitario', label: 'Pase sanitario', type: 'text' },
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
    if (key === 'carneFecha') {
      if (item.carneFecha) {
        const fecha = new Date(item.carneFecha); // Convertir fecha a objeto Date
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
      carneNombre: item.carneNombre ? item.carneNombre.toLowerCase() : '',
      carneTipo: item.carneTipo ? item.carneTipo.toLowerCase() : '',
      carneCorte: item.carneCorte ? item.carneCorte.toLowerCase() : '',
      carneCategoria: item.carneCategoria ? item.carneCategoria.toLowerCase() : '',
      carneCantidad: item.carneCantidad ? item.carneCantidad : '',
      carneFecha: new Date(item.carneFecha),
      carnePaseSanitario: item.carnePaseSanitario ? item.carnePaseSanitario.toLowerCase() : '',
    };

    if (
      (!filtros.nombre || lowerCaseItem.carneNombre.startsWith(filtros.nombre)) &&
      (!filtros.tipo || lowerCaseItem.carneTipo.startsWith(filtros.tipo)) &&
      (!filtros.corte || lowerCaseItem.carneCorte.startsWith(filtros.corte)) &&
      (!filtros.cantidad || lowerCaseItem.carneCantidad.toString().startsWith(filtros.cantidad)) &&
      (!filtros.categoria || lowerCaseItem.carneCategoria.startsWith(filtros.categoria)) &&
      (!filtros['fecha-desde'] || lowerCaseItem.carneFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.carneFecha <= new Date(filtros['fecha-hasta'])) &&
      (!filtros.paseSanitario || lowerCaseItem.carnePaseSanitario.startsWith(filtros.paseSanitario))
    ) {
      return true;
    }
    return false;
  });

  const handleEditCarne = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-carne/${id}`);
  }

  const handleDeleteCarne = (rowData) => {
    const id = rowData.Id;
    axios.put(`/borrar-carne/${id}`, null, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.status === 200) {
          setShowAlertSuccess(true);
          setTimeout(() => {
            setShowAlertSuccess(false);
          }, 5000);
          setDeleteItem(true);
        } else {
          updateErrorAlert('No se logró eliminar la carne, recargue la pagina.')
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
          updateErrorAlert('No se logró eliminar la carne, recargue la pagina.')
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
          <Typography component='h1' variant='h5'>Lista de Carnes</Typography>
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
                    En esta página se encarga de listar las carnes que fueron registrados.
                  </span>
                  <br />
                  <br />
                  <span style={{ fontWeight: 'bold' }}>
                    Filtros:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleBlue}>Nombre</span>: En este campo se puede ingresar el nombre de la carne por el cual se quiere filtrar la lista.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Tipo</span>: En este campo se puede seleccionar el tipo de carne por el cual se quiere filtrar la lista.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Corte</span>: En este campo se puede ingresar el corte de la carne por el cual se quiere filtrar la lista.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Categoría</span>: En este campo se puede ingresar ingresar la categoría de la carne por la cual se quiere filtrar la lista.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Cantidad</span>: En este campo se puede ingresar la cantidad(kg) por la cual se quiere filtrar la lista.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Desde Fecha y Hasta Fecha</span>: Estos campos son utilizados para filtrar los registros entre un rango de fechas,
                        todas las fechas de los registros que estén comprendidas entre las 2 fechas ingresadas en los filtros, se mostraran en la lista, mientras que las demás no.
                        También es posible dejar uno de los 2 campos vacío y rellenar el otro, por ejemplo si ingresas una fecha en el campo de Desde Fecha y el Hasta Fecha se deja vacío,
                        se listará todos los registros que su fecha sea posterior a la fecha ingresada en Fecha Desde.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Pase sanitario</span>: En este campo se puede ingresar el pase sanitario por el cual se quiere filtrar la lista.
                      </li>
                    </ul>
                  </span>
                  <span style={{ fontWeight: 'bold' }}>
                    Lista:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleRed}>Nombre</span>: En esta columna se muestra el nombre de la carne.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Tipo</span>: En esta columna se muestra el tipo a la que pertenece la carne.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Corte</span>: En esta columna se muestra el tipo de corte al que pertenece la carne.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Categoría</span>: En esta columna se muestra la categoría a la que pertenece la carne.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Cantidad</span>: En esta columna se muestra la cantidad en Kg que se recibió de esa carne.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Fecha</span>: En esta columna se muestra la fecha que se registró o recibió la carne.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Pase sanitario</span>: En esta columna se muestran el pase sanitario que identifica la carne que fueron recibida y aprobada.
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
        dataKey="carne"
        tableHeadCells={tableHeadCells}
        title="Carnes"
        dataMapper={mapData}
        columnRenderers={""}
        onEditButton={handleEditCarne}
        onDeleteButton={handleDeleteCarne}
      />    </div>
  );
}

export default ListarCarne;
