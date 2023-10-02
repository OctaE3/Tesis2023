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

function ListarCarne() {
  const [data, setData] = useState([]);
  const [data30, setData30] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [buttonName, setButtonName] = useState('Listar Todos');
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
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
    title: 'Correcto', body: 'Se eliminó la carne con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar la carne, recargue la página.', severity: 'error', type: 'description'
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
        const response = await axios.get('/listar-carnes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const dataL = response.data.map((data, index) => {
          if (index < 30) {
            if (data.carneEliminado === false && data.carneCantidad > 0) {
              return {
                ...data,
                Id: data.carneId,
              }
            }
          }
        });
        const dataLast30 = dataL.filter((data) => data !== undefined);
        const data = response.data.map((data) => {
          if (data.carneEliminado === true && data.carneCantidad <= 0) {
            return {
              ...data,
              Id: data.carneId,
              isDelete: 'Yes',
              icl: 'Yes',
            }
          } else {
            return {
              ...data,
              Id: data.carneId,
            }
          }
        })

        setData(dataLast30);
        setData30(dataLast30)
        setDataAll(data)
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
    { id: 'carneNombre', numeric: false, disablePadding: false, label: 'Nombre' },
    { id: 'carneTipo', numeric: false, disablePadding: false, label: 'Tipo' },
    { id: 'carneCorte', numeric: false, disablePadding: false, label: 'Corte' },
    { id: 'carneCategoria', numeric: false, disablePadding: false, label: 'Categoría' },
    { id: 'carneCantidad', numeric: false, disablePadding: false, label: 'Cantidad' },
    { id: 'carneFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'carnePaseSanitario', numeric: false, disablePadding: false, label: 'Pase Sanitario' },
  ];

  const filters = [
    { id: 'nombre', label: 'Nombre', type: 'text' },
    { id: 'tipo', label: 'Tipo', type: 'select', options: ['Porcino', 'Bovino', 'Sangre', 'Tripas', 'Higado'] },
    { id: 'corte', label: 'Corte', type: 'select', options: ['Carcasa', 'Media res', 'Cortes c/h', 'Cortes s/h', 'Menudencias', 'Subproductos', 'Delantero', 'Trasero', 'Sangre', 'Tripas', 'Higado'] },
    { id: 'categoria', label: 'Categoría', type: 'select', options: ['CarneSH', 'CarneCH', 'Grasa', 'Sangre', 'Tripas', 'Higado'] },
    { id: 'cantidad', label: 'Cantidad', type: 'text' },
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta'] },
    { id: 'paseSanitario', label: 'Pase Sanitario', type: 'text' },
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
      (!filtros.cantidad || lowerCaseItem.carneCantidad.toString() === filtros.cantidad) &&
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
          setDeleteItem(true);
          setShowAlertSuccess(true);
          setTimeout(() => {
            setShowAlertSuccess(false);
          }, 2000);
        } else {
          updateErrorAlert('No se logró eliminar la carne, recargue la página.')
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
          updateErrorAlert('No se logró eliminar la carne, recargue la página.')
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
          <Typography component='h1' variant='h5'>Lista de Carnes</Typography>
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
                    En esta página se encarga de listar las carnes que fueron registradas, a través de recepción de materias primas cárnicas y también se cuenta con filtros para facilitar la búsqueda de información.
                  </span>
                  <br />
                  <br />
                  <span style={{ fontWeight: 'bold' }}>
                    Filtros:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleBlue}>Nombre</span>: En este campo se puede ingresar el nombre de la carne por el cual se quiere filtrar la lista y se listarán todos los registros que empiecen o tengan ese nombre.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Tipo</span>: En este campo se puede seleccionar el tipo de carne por el cual se quiere filtrar la lista y se listarán todos los registros que tengan ese tipo.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Corte</span>: En este campo se puede seleccionar el corte de la carne por el cual se quiere filtrar la lista y se listarán todos los registros que tengan ese corte.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Categoría</span>: En este campo se puede seleccionar la categoría de la carne por la cual se quiere filtrar la lista y se listarán todos los registros que tengan esa categoría.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Cantidad</span>: En este campo se puede ingresar la cantidad(kg) por la cual se quiere filtrar la lista y se listarán todos los registros con esa cantidad.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Desde Fecha y Hasta Fecha</span>: Estos campos son utilizados para filtrar los registros entre un rango de fechas,
                        todas las fechas de los registros que estén comprendidas entre las 2 fechas ingresadas en los filtros, se mostraran en la lista, mientras que las demás no.
                        También es posible dejar uno de los 2 campos vacío y rellenar el otro, por ejemplo si ingresas una fecha en el campo de Desde Fecha y el Hasta Fecha se deja vacío,
                        se listará todos los registros que su fecha sea posterior a la fecha ingresada en Fecha Desde.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Pase Sanitario</span>: En este campo se puede ingresar el pase sanitario por el cual se quiere filtrar la lista y se listarán todos los registros que empiecen o tengan ese pase sanitario.
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
                        <span className={classes.liTitleRed}>Cantidad</span>: En esta columna se muestra la cantidad en Kg que queda disponible de carne.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Fecha</span>: En esta columna se muestra la fecha que se recibio la carne.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Pase sanitario</span>: En esta columna se muestran el pase sanitario que identifica que la carne que fueron recibidas están aprobadas.
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
                      <li>Las carnes con cantidad igual a 0, se eliminarán.</li>
                      <li>Cuando se listen todos los registros, aparecerán registros de color azul, los registros de color azul significan que están eliminados, en caso de que esa carne que está eliminada la quiere volver a agregar, solo modifique la cantidad de esa carne, para que sea superior a 0.</li>
                      <li>En caso de querer modificar el pase sanitario o la fecha, se tiene que modificar de la recepción de materias primas cárnicas.</li>
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
        titleListButton={buttonName}
        listButton={listRefresh}
        dataMapper={mapData}
        columnRenderers={""}
        onEditButton={handleEditCarne}
        onDeleteButton={handleDeleteCarne}
      />    </div>
  );
}

export default ListarCarne;
