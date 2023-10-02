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

function ListarRecepcionDeMateriasPrimasCarnicas() {
  const [data, setData] = useState([]);
  const [data30, setData30] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [buttonName, setButtonName] = useState('Listar Todos');
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [carne, setCarne] = useState([]);
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
    title: 'Correcto', body: 'Se eliminó la recepción de materias primas carnicas con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar la recepción de materias primas carnicas, recargue la página.', severity: 'error', type: 'description'
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
        const response = await axios.get('/listar-recepcion-de-materias-primas-carnicas', {
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
        const carneResponse = await axios.get('/listar-carnes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });


        const dataL = response.data.map((recepcion, index) => {
          if (index < 30) {
            return {
              ...recepcion,
              Id: recepcion.recepcionDeMateriasPrimasCarnicasId,
            }
          }
        });
        const dataLast30 = dataL.filter((data) => data !== undefined);
        const data = response.data.map((recepcion) => ({
          ...recepcion,
          Id: recepcion.recepcionDeMateriasPrimasCarnicasId,
        }))
        const ResponsableData = ResponsableResponse.data;
        const ProveedorData = ProveedorResponse.data;
        const CarneData = carneResponse.data;

        setData(dataLast30);
        setData30(dataLast30);
        setDataAll(data);
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
        setProveedor(ProveedorData.map((proveedor) => proveedor.proveedorNombre));
        setCarne(CarneData.map((carne) => carne.carneNombre));
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
    { id: 'recepcionDeMateriasPrimasCarnicasFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'recepcionDeMateriasPrimasCarnicasProveedor', numeric: false, disablePadding: false, label: 'Proveedor' },
    { id: 'recepcionDeMateriasPrimasCarnicasProductos', numeric: false, disablePadding: false, label: 'Carnes' },
    { id: 'recepcionDeMateriasPrimasCarnicasPaseSanitario', numeric: false, disablePadding: false, label: 'Pase sanitario' },
    { id: 'recepcionDeMateriasPrimasCarnicasTemperatura', numeric: false, disablePadding: false, label: 'Temperatura(°C)' },
    { id: 'recepcionDeMateriasPrimasCarnicasMotivoDeRechazo', numeric: false, disablePadding: false, label: 'Motivo de rechazo' },
    { id: 'recepcionDeMateriasPrimasCarnicasResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
  ];

  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta'] },
    { id: 'proveedor', label: 'Proveedor', type: 'select', options: proveedor },
    { id: 'producto', label: 'Carnes', type: 'text' },
    { id: 'paseSanitario', label: 'Pase sanitario', type: 'text' },
    { id: 'temperatura', label: 'Temperatura(°C)', type: 'text' },
    { id: 'motivoDeRechazo', label: 'Motivo de rechazo', type: 'text' },
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
    if (key === 'recepcionDeMateriasPrimasCarnicasFecha') {
      if (item.recepcionDeMateriasPrimasCarnicasFecha) {
        const fecha = new Date(item.recepcionDeMateriasPrimasCarnicasFecha); // Convertir fecha a objeto Date
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    }
    else if (key === 'recepcionDeMateriasPrimasCarnicasResponsable.usuarioNombre') {
      if (item.recepcionDeMateriasPrimasCarnicasResponsable && item.recepcionDeMateriasPrimasCarnicasResponsable.usuarioNombre) {
        return item.recepcionDeMateriasPrimasCarnicasResponsable.usuarioNombre;
      } else {
        return '';
      }
    } else if (key === 'recepcionDeMateriasPrimasCarnicasProveedor.proveedorNombre') {
      if (item.recepcionDeMateriasPrimasCarnicasProveedor && item.recepcionDeMateriasPrimasCarnicasProveedor.proveedorNombre) {
        return item.recepcionDeMateriasPrimasCarnicasProveedor.proveedorNombre;
      } else {
        return '';
      }
    } else if (key === 'recepcionDeMateriasPrimasCarnicasProductos') {
      if (item.recepcionDeMateriasPrimasCarnicasProductos && item.recepcionDeMateriasPrimasCarnicasProductos.length > 0) {
        const nombresProductos = item.recepcionDeMateriasPrimasCarnicasProductos.map(producto => `${producto.carneNombre} - ${producto.carneCorte}`);
        return nombresProductos;
      } else {
        return [];
      }
    } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      recepcionDeMateriasPrimasCarnicasFecha: new Date(item.recepcionDeMateriasPrimasCarnicasFecha),
      recepcionDeMateriasPrimasCarnicasProveedor: item.recepcionDeMateriasPrimasCarnicasProveedor.proveedorNombre ? item.recepcionDeMateriasPrimasCarnicasProveedor.proveedorNombre.toLowerCase() : '',
      recepcionDeMateriasPrimasCarnicasProductos: item.recepcionDeMateriasPrimasCarnicasProductos.map(recepcionDeMateriasPrimasCarnicasProductos => recepcionDeMateriasPrimasCarnicasProductos),
      recepcionDeMateriasPrimasCarnicasPaseSanitario: item.recepcionDeMateriasPrimasCarnicasPaseSanitario ? item.recepcionDeMateriasPrimasCarnicasPaseSanitario.toLowerCase() : '',
      recepcionDeMateriasPrimasCarnicasTemperatura: item.recepcionDeMateriasPrimasCarnicasTemperatura,
      recepcionDeMateriasPrimasCarnicasMotivoDeRechazo: item.recepcionDeMateriasPrimasCarnicasMotivoDeRechazo ? item.recepcionDeMateriasPrimasCarnicasMotivoDeRechazo.toLowerCase() : '',
      recepcionDeMateriasPrimasCarnicasResponsable: item.recepcionDeMateriasPrimasCarnicasResponsable.usuarioNombre ? item.recepcionDeMateriasPrimasCarnicasResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros['fecha-desde'] || lowerCaseItem.recepcionDeMateriasPrimasCarnicasFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.recepcionDeMateriasPrimasCarnicasFecha <= new Date(filtros['fecha-hasta'])) &&
      (!filtros.proveedor || lowerCaseItem.recepcionDeMateriasPrimasCarnicasProveedor.startsWith(filtros.proveedor)) &&
      (!filtros.producto || lowerCaseItem.recepcionDeMateriasPrimasCarnicasProductos.some(producto => producto.carneNombre.toLowerCase().includes(filtros.producto))) &&
      (!filtros.paseSanitario || lowerCaseItem.recepcionDeMateriasPrimasCarnicasPaseSanitario.startsWith(filtros.paseSanitario)) &&
      (!filtros.temperatura || lowerCaseItem.recepcionDeMateriasPrimasCarnicasTemperatura.toString() === filtros.temperatura) &&
      (!filtros.motivoDeRechazo || lowerCaseItem.recepcionDeMateriasPrimasCarnicasMotivoDeRechazo.includes(filtros.motivoDeRechazo)) &&
      (!filtros.responsable || lowerCaseItem.recepcionDeMateriasPrimasCarnicasResponsable === filtros.responsable)
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    recepcionDeMateriasPrimasCarnicasProveedor: (proveedor) => proveedor.proveedorNombre,
    recepcionDeMateriasPrimasCarnicasResponsable: (responsable) => responsable.usuarioNombre,
    recepcionDeMateriasPrimasCarnicasProductos: (products) => <ColumnaReutilizable contacts={products} />,
  };

  const handleEditRecepcion = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-recepcion-de-materias-primas-carnicas/${id}`);
  };

  const handleDeleteRecepcion = (rowData) => {
    const id = rowData.Id;
    axios.delete(`/borrar-recepcion-de-materias-primas-carnicas/${id}`, {
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
          updateErrorAlert('No se logró eliminar la recepción de materias primas cárnicas, recargue la página.')
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
          updateErrorAlert('No se logró eliminar la recepción de materias primas cárnicas, recargue la página.')
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
    navigate('/recepcion-de-materias-primas-carnicas')
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
          <Typography component='h1' variant='h5'>Listar de Recepción de Materias Primas Cárnicas</Typography>
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
                    En esta página se encarga de listar las recepciones de materias primas cárnicas que fueron registrados y también se cuenta con filtros para facilitar la búsqueda de información.
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
                        <span className={classes.liTitleBlue}>Proveedor</span>: En este campo se puede seleccionar el proveedor del que se recibió las carnes y filtrar la lista.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Carne</span>: En este campo se puede ingresar el nombre de una carne y se listarán todos los registros con ese nombre.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Pase sanitario</span>: En este campo se puede ingresar el pase sanitario y se filtrará la lista por ese pase sanitario.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Temperatura</span>: En este campo se puede ingresar la temperatura que tenía la carne cuando se recibió y filtrar la lista por esa temperatura.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Motivo de rechazo</span>: En este campo se puede ingresar una palabra o frase y mostrarán los registros en donde esté incluida esa palabra o frase.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Responsable</span>: En este campo se puede ingresar un responsable y se mostrarán todos los registros asociados a ese responsable.
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
                        <span className={classes.liTitleRed}>Fecha</span>: En esta columna se muestra la fecha en el que se recibió la carne.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Proveedor</span>: En esta columna se muestra el proveedor del que se recibió la carne.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Carnes</span>: En esta columna se muestran las carnes.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Pase sanitario</span>: En esta columna se muestra el pase sanitario por el cual se identifica las carnes y señala que las carnes estan aprobadas.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Temperatura</span>: En esta columna se muestra la temperatura(°C) en la que se recibió las carnes.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Motivo de rechazo</span>: En esta columna se muestra el motivo por el cual se rechazaron las carnes.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Responsable</span>: En esta columna se muestra el responsable que registró la recepción de materias primas cárnicas.
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
                      <li>No se recomienda eliminar registros de la lista, a menos que sea necesario.</li>
                      <li>Se recomienda no eliminar los registros de recepción de materias primas cárnicas, ya que la lista cuenta con depuración.</li>
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
        dataKey="listarRecepcionDeMateriasPrimasCarnicas"
        tableHeadCells={tableHeadCells}
        title="Lista de Recepción de Materias Primas Cárnicas"
        titleButton="Recepción de Materias Primas Cárnicas"
        linkButton={redirect}
        titleListButton={buttonName}
        listButton={listRefresh}
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditRecepcion}
        onDeleteButton={handleDeleteRecepcion}
      />    </div>
  );
}

export default ListarRecepcionDeMateriasPrimasCarnicas;
