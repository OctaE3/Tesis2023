import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { Grid, Typography, Tooltip, IconButton, createStyles, makeStyles, createTheme } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
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
  }
}));

function ListarControlDeAlarmaLuminicaYSonoraDeCloro() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const [deleteItem, setDeleteItem] = useState(false);
  const navigate = useNavigate();

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);

  const [alertSuccess, setAlertSuccess] = useState({
    title: 'Correcto', body: 'Se elimino el estado de las alarmas con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar el estado de las alarmas, recargue la pagina.', severity: 'error', type: 'description'
  });

  const [alertWarning, setAlertWarning] = useState({
    title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-control-de-alarma-luminica-y-sonora-de-cloro', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data.map((control) => ({
          ...control,
          Id: control.controlDeAlarmaLuminicaYSonaraDeCloroId,
        }));
        const ResponsableData = ResponsableResponse.data;

        setData(data);
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
    setDeleteItem(false);
  }, [deleteItem]);

  const tableHeadCells = [
    { id: 'controlDeAlarmaLuminicaYSonoraDeCloroFechaHora', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica', numeric: false, disablePadding: false, label: 'Alarma Luminca' },
    { id: 'controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora', numeric: false, disablePadding: false, label: 'Alarma Sonora' },
    { id: 'controlDeAlarmaLuminicaYSonoraDeCloroObservaciones', numeric: false, disablePadding: false, label: 'Observaciones' },
    { id: 'controlDeAlarmaLuminicaYSonoraDeCloroResponsable', numeric: false, disablePadding: false, label: 'Resposnsable' }
  ];

  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'datetime', options: ['desde', 'hasta'] },
    { id: 'luminica', label: 'Alarma Luminica', type: 'select', options: ['Funciona', 'No Funciona'] },
    { id: 'sonora', label: 'Alarma Sonora', type: 'select', options: ['Funciona', 'No Funciona'] },
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
    if (key === 'controlDeAlarmaLuminicaYSonoraDeCloroFechaHora') {
      if (item.controlDeAlarmaLuminicaYSonoraDeCloroFechaHora) {
        const fechaArray = item.controlDeAlarmaLuminicaYSonoraDeCloroFechaHora;
        const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
        return format(fecha, 'yyyy-MM-dd HH:mm');
      } else {
        return '';
      }
    }
    else if (key === 'controlDeAlarmaLuminicaYSonoraDeCloroResponsable.usuarioNombre') {
      if (item.controlDeAlarmaLuminicaYSonoraDeCloroResponsable && item.controlDeAlarmaLuminicaYSonoraDeCloroResponsable.usuarioNombre) {
        return item.controlDeAlarmaLuminicaYSonoraDeCloroResponsable.usuarioNombre;
      } else {
        return '';
      }
    } else if (key === 'controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica') {
      return item[key] ? 'Funciona' : 'No funciona';
    } else if (key === 'controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora') {
      return item[key] ? 'Funciona' : 'No funciona';
    } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const fechaArray = item.controlDeAlarmaLuminicaYSonoraDeCloroFechaHora;
    const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
    const fechaFromat = format(fecha, 'yyyy-MM-dd HH:mm');

    const lowerCaseItem = {
      controlDeAlarmaLuminicaYSonoraDeCloroFechaHora: fechaFromat,
      controlDeAlarmaLuminicaYSonoraDeCloroObservaciones: item.controlDeAlarmaLuminicaYSonoraDeCloroObservaciones ? item.controlDeAlarmaLuminicaYSonoraDeCloroObservaciones.toLowerCase() : '',
      controlDeAlarmaLuminicaYSonoraDeCloroResponsable: item.controlDeAlarmaLuminicaYSonoraDeCloroResponsable.usuarioNombre ? item.controlDeAlarmaLuminicaYSonoraDeCloroResponsable.usuarioNombre.toLowerCase() : '',
    };

    console.log(lowerCaseItem.controlDeAlarmaLuminicaYSonoraDeCloroFechaHora);
    console.log("aaaaa " + filtros['fecha-desde']);
    if (
      (!filtros['fecha-desde'] || fechaFromat >= filtros['fecha-desde']) &&
      (!filtros['fecha-hasta'] || fechaFromat <= filtros['fecha-hasta']) &&
      (!filtros.luminica || (filtros.luminica === 'funciona' && item.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica) || (filtros.luminica === 'no funciona' && !item.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaLuminica)) &&
      (!filtros.sonora || (filtros.sonora === 'funciona' && item.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora) || (filtros.sonora === 'no funciona' && !item.controlDeAlarmaLuminicaYSonoraDeCloroAlarmaSonora)) &&
      (!filtros.observaciones || lowerCaseItem.controlDeAlarmaLuminicaYSonoraDeCloroObservaciones.startsWith(filtros.observaciones)) &&
      (!filtros.responsable || lowerCaseItem.controlDeAlarmaLuminicaYSonoraDeCloroResponsable.startsWith(filtros.responsable))
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    controlDeAlarmaLuminicaYSonoraDeCloroResponsable: (responsable) => responsable.usuarioNombre
  };

  const handleEditControl = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-control-de-alarma-luminica-y-sonora-de-cloro/${id}`);
  }

  const handleDeleteControl = (rowData) => {
    const id = rowData.Id;
    axios.delete(`/borrar-control-de-alarma-luminica-y-sonora-de-cloro/${id}`, {
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

  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Lista de Control De Alarma Luminica Y Sonora De Cloro</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todos los insumos almacenados en el sistema y puedes simplificar tu busqueda atraves de los filtros.
            </Typography>
          }>
            <IconButton>
              <HelpOutlineIcon fontSize="large" color="primary" />
            </IconButton>
          </Tooltip>
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
        dataKey="controlDeAlarmaLuminicaYSonoraDeCloro"
        tableHeadCells={tableHeadCells}
        title="Listar Control De Alarma Luminica Y Sonora De Cloro"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditControl}
        onDeleteButton={handleDeleteControl}
      />    </div>
  );
}

export default ListarControlDeAlarmaLuminicaYSonoraDeCloro;
