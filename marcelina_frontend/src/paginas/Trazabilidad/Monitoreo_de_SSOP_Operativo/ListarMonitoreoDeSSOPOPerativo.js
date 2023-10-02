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

function ListarMonitoreoDeSSOPOPerativo() {
  const [data, setData] = useState([]);
  const [data30, setData30] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [buttonName, setButtonName] = useState('Listar Todos');
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
  
const [checkToken, setCheckToken] = useState(false);

  const [blinking, setBlinking] = useState(true);

  const [alertSuccess] = useState({
    title: 'Correcto', body: 'Monitoreo de ssop operativo eliminado con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar el monitoreo de ssop operativo, revise los datos ingresados.', severity: 'error', type: 'description'
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
        const response = await axios.get('/listar-monitoreo-de-ssop-operativo', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const dataL = response.data.map((monitoreo, index) => {
          if (index < 30) {
            return {
              ...monitoreo,
              Id: monitoreo.monitoreoDeSSOPOperativoId,
            }
          }
        });
        const dataLast30 = dataL.filter((data) => data !== undefined);
        const data = response.data.map((monitoreo) => ({
          ...monitoreo,
          Id: monitoreo.monitoreoDeSSOPOperativoId,
        }));
        const ResponsableData = ResponsableResponse.data;

        setData(dataLast30);
        setData30(dataLast30)
        setDataAll(data);
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
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
    { id: 'monitoreoDeSSOPOperativoFechaInicio', numeric: false, disablePadding: false, label: 'Fecha inicio' },
    { id: 'monitoreoDeSSOPOperativoFechaFinal', numeric: false, disablePadding: false, label: 'Fecha final' },
    { id: 'monitoreoDeSSOPOperativoDias', numeric: false, disablePadding: false, label: 'Días' },
    { id: 'monitoreoDeSSOPOperativoArea', numeric: false, disablePadding: false, label: 'Área' },
    { id: 'monitoreoDeSSOPOperativoObservaciones', numeric: false, disablePadding: false, label: 'Observaciones' },
    { id: 'monitoreoDeSSOPOperativoAccCorrectivas', numeric: false, disablePadding: false, label: 'Acciones correctivas' },
    { id: 'monitoreoDeSSOPOperativoAccPreventivas', numeric: false, disablePadding: false, label: 'Acciones preventivas' },
    { id: 'monitoreoDeSSOPOperativoResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
  ];

  const filters = [
    { id: 'fechaInicio', label: 'Fecha Inicio', type: 'date', options: ['desde', 'hasta'] },
    { id: 'fechaFinal', label: 'Fecha Final', type: 'date', options: ['desde', 'hasta'] },
    { id: 'dias', label: 'Días', type: 'select', options: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'] },
    { id: 'area', label: 'Área', type: 'select', options: ['Mesadas', 'Pisos', 'Utensilios', 'Equipos', 'Lavamanos', 'Bandejas Plasticas', 'Personal', 'Otras'] },
    { id: 'observaciones', label: 'Observaciones', type: 'text' },
    { id: 'accCorrectivas', label: 'Acciones Correctivas', type: 'text' },
    { id: 'accPreventivas', label: 'Acciones Preventivas', type: 'text' },
    { id: 'responsable', label: 'Responsable', type: 'select', options: responsable },
  ];

  const handleFilter = (filter) => {
    const lowerCaseFilter = Object.keys(filter).reduce((acc, key) => {
      if (filter[key]) {
        if (key === 'fechaInicio') {
          const [desde, hasta] = filter[key].split(' hasta ');
          acc['fechaInicio-desde'] = desde;
          acc['fechaInicio-hasta'] = hasta;
        } else if (key === 'fechaFinal') {
          const [desde, hasta] = filter[key].split(' hasta ');
          acc['fechaFinal-desde'] = desde;
          acc['fechaFinal-hasta'] = hasta;
        } else {
          acc[key] = filter[key].toLowerCase();
        }
      }
      return acc;
    }, {});
    setFiltros(lowerCaseFilter);
  };

  const mapData = (item, key) => {
    if (key === 'monitoreoDeSSOPOperativoFechaInicio') {
      if (item.monitoreoDeSSOPOperativoFechaInicio) {
        const fecha = new Date(item.monitoreoDeSSOPOperativoFechaInicio); // Convertir fecha a objeto Date
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    }
    else if (key === 'monitoreoDeSSOPOperativoFechaFinal') {
      if (item.monitoreoDeSSOPOperativoFechaFinal) {
        const fecha = new Date(item.monitoreoDeSSOPOperativoFechaFinal); // Convertir fecha a objeto Date
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    }
    else if (key === 'monitoreoDeSSOPOperativoResponsable.usuarioNombre') {
      if (item.monitoreoDeSSOPOperativoResponsable && item.monitoreoDeSSOPOperativoResponsable.usuarioNombre) {
        return item.monitoreoDeSSOPOperativoResponsable.usuarioNombre;
      } else {
        return '';
      }
    } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      monitoreoDeSSOPOperativoFechaInicio: new Date(item.monitoreoDeSSOPOperativoFechaInicio),
      monitoreoDeSSOPOperativoFechaFinal: new Date(item.monitoreoDeSSOPOperativoFechaFinal),
      monitoreoDeSSOPOperativoDias: item.monitoreoDeSSOPOperativoDias ? item.monitoreoDeSSOPOperativoDias.map(monitoreoDeSSOPOperativoDias => monitoreoDeSSOPOperativoDias.toLowerCase()) : '',
      monitoreoDeSSOPOperativoArea: item.monitoreoDeSSOPOperativoArea ? item.monitoreoDeSSOPOperativoArea.toLowerCase() : '',
      monitoreoDeSSOPOperativoObservaciones: item.monitoreoDeSSOPOperativoObservaciones ? item.monitoreoDeSSOPOperativoObservaciones.toLowerCase() : '',
      monitoreoDeSSOPOperativoAccCorrectivas: item.monitoreoDeSSOPOperativoAccCorrectivas ? item.monitoreoDeSSOPOperativoAccCorrectivas.toLowerCase() : '',
      monitoreoDeSSOPOperativoAccPreventivas: item.monitoreoDeSSOPOperativoAccPreventivas ? item.monitoreoDeSSOPOperativoAccPreventivas.toLowerCase() : '',
      monitoreoDeSSOPOperativoResponsable: item.monitoreoDeSSOPOperativoResponsable ? item.monitoreoDeSSOPOperativoResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros['fechaInicio-desde'] || lowerCaseItem.monitoreoDeSSOPOperativoFechaInicio >= new Date(filtros['fechaInicio-desde'])) &&
      (!filtros['fechaInicio-hasta'] || lowerCaseItem.monitoreoDeSSOPOperativoFechaInicio <= new Date(filtros['fechaInicio-hasta'])) &&
      (!filtros['fechaFinal-desde'] || lowerCaseItem.monitoreoDeSSOPOperativoFechaFinal >= new Date(filtros['fechaFinal-desde'])) &&
      (!filtros['fechaFinal-hasta'] || lowerCaseItem.monitoreoDeSSOPOperativoFechaFinal <= new Date(filtros['fechaFinal-hasta'])) &&
      (!filtros.dias || lowerCaseItem.monitoreoDeSSOPOperativoDias.some(dias => dias.includes(filtros.dias))) &&
      (!filtros.area || lowerCaseItem.monitoreoDeSSOPOperativoArea.startsWith(filtros.area)) &&
      (!filtros.observaciones || lowerCaseItem.monitoreoDeSSOPOperativoObservaciones.includes(filtros.observaciones)) &&
      (!filtros.accCorrectivas || lowerCaseItem.monitoreoDeSSOPOperativoAccCorrectivas.includes(filtros.accCorrectivas)) &&
      (!filtros.accPreventivas || lowerCaseItem.monitoreoDeSSOPOperativoAccPreventivas.includes(filtros.accPreventivas)) &&
      (!filtros.responsable || lowerCaseItem.monitoreoDeSSOPOperativoResponsable === filtros.responsable)
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    monitoreoDeSSOPOperativoResponsable: (responsable) => responsable.usuarioNombre,
    monitoreoDeSSOPOperativoDias: (dias) => <ColumnaReutilizable contacts={dias} />,
  };

  const handleEditMont = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-monitoreo-de-ssop-operativo/${id}`);
  };

  const handleDeleteMont = (rowData) => {
    const id = rowData.Id;
    axios.delete(`/borrar-monitoreo-de-ssop-operativo/${id}`, {
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
          updateErrorAlert('No se logró eliminar el monitoreo de ssop operativo, recargue la página.')
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
          updateErrorAlert('No se logró eliminar el monitoreo de ssop operativo, recargue la página.')
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
    navigate('/monitoreo-de-ssop-operativo')
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
          <Typography component='h1' variant='h5'>Listar de Monitoreo de SSOP Operativo</Typography>
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
                    En esta página se encarga de listar los monitoreos de ssop operativos que fueron registradas y también se cuenta con filtros para facilitar la búsqueda de información.
                  </span>
                  <br />
                  <br />
                  <span style={{ fontWeight: 'bold' }}>
                    Filtros:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleBlue}>Desde Fecha Inicio y Hasta Fecha Inicio</span>: Estos campos son utilizados para filtrar los registros entre un rango de fechas,
                        todas las fechas de los registros que estén comprendidas entre las 2 fechas ingresadas en los filtros, se mostraran en la lista, mientras que las demás no.
                        También es posible dejar uno de los 2 campos vacío y rellenar el otro, por ejemplo si ingresas una fecha en el campo de Desde Fecha y el Hasta Fecha se deja vacío,
                        se listará todos los registros que su fecha sea posterior a la fecha ingresada en Fecha Desde.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Desde Fecha Final y Hasta Fecha Final</span>: Estos campos funcionan de la misma manera que Desde Fecha Inicio y Hasta Fecha Inicio,
                        nada más que se tiene en cuenta la fecha final.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Días</span>: En este campo se puede seleccionar un día de la semana y filtrar los registros por ese día.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Área</span>: En este campo se puede seleccionar un área y filtrar la lista por el área seleccionado.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Observaciones</span>: En este campo se puede ingresar una palabra y los registros que incluyan esa palabra se listarán.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Acciones Correctivas</span>: En este campo se puede ingresar una palabra y los registros que incluyan esa palabra se listarán.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Acciones Preventivas</span>: En este campo se puede ingresar una palabra y los registros que incluyan esa palabra se listarán.
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
                        <span className={classes.liTitleRed}>Fecha Inicio</span>: En esta columna se muestra la fecha en la que inició el monitoreo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Fecha Final</span>: En esta columna se muestra la fecha en la que finaliza el monitoreo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Días</span>: En esta columna se muestra los días en lo que se realizó el monitoreo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Área</span>: En este campo se muestra en que área se hizo el monitoreo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Observaciones</span>: En esta columna se muestra la observaciones o detalles que se encontraron al hacer el monitoreo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Acciones Correctivas</span>: En esta columna se muestra las acciones tomadas para corregir el problema.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Acciones Preventivas</span>: En esta columna se muestra las acciones que se pueden o pudieron tomar para prevenir el problema.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Responsable</span>: En esta columna se muestra el responsable que registro el monitoreo de ssop operativo.
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
        dataKey="listarMonitoreoDeSSOPOperativo"
        tableHeadCells={tableHeadCells}
        title="Lista de Monitoreos de SSOP Operativo"
        titleButton="Monitoreo de SSOP Operativo"
        linkButton={redirect}
        titleListButton={buttonName}
        listButton={listRefresh}
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditMont}
        onDeleteButton={handleDeleteMont}
      />    </div>
  );
}

export default ListarMonitoreoDeSSOPOPerativo;
