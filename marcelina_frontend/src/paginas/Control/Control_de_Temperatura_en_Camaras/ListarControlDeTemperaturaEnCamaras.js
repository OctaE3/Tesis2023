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

function ListarControlDeTemperaturaEnCamaras() {
  const [data, setData] = useState([]);
  const [responsable, setResponsable] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [deleteItem, setDeleteItem] = useState(false);
  const navigate = useNavigate();

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);

  const [alertSuccess, setAlertSuccess] = useState({
    title: 'Correcto', body: 'Se elimino el control de temperaturas en cámaras con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar el control de temperaturas en cámaras, recargue la pagina.', severity: 'error', type: 'description'
  });

  const [alertWarning, setAlertWarning] = useState({
    title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-control-de-temperatura-en-camaras', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data.map((controlDeTemperaturaEnCamaras) => ({
          ...controlDeTemperaturaEnCamaras,
          Id: controlDeTemperaturaEnCamaras.controlDeTemperaturaEnCamarasId,
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
    { id: 'controlDeTemperaturaEnCamarasNroCamara', numeric: false, disablePadding: false, label: 'Número de Cámara' },
    { id: 'controlDeTemperaturaEnCamarasFecha', numeric: false, disablePadding: true, label: 'Fecha' },
    { id: 'controlDeTemperaturaEnCamarasHora', numeric: false, disablePadding: false, label: 'Hora' },
    { id: 'controlDeTemperaturaEnCamarasTempInterna', numeric: false, disablePadding: false, label: 'Temperatura Interna' },
    { id: 'controlDeTemperaturaEnCamaraTempExterna', numeric: false, disablePadding: false, label: 'Temperatura Externa' },
  ];

  const filters = [
    { id: 'numero', label: 'Número de Cámara', type: 'select', options: ['Camara 1', 'Camara 2', 'Camara 3', 'Camara 4', 'Camara 5', 'Camara 6'] },
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta'] },
    { id: 'hora', label: 'Hora', type: 'text' },
    { id: 'interna', label: 'Temperatura Interna', type: 'text' },
    { id: 'externa', label: 'Temperatura Externa', type: 'text' },

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
    if (key === 'controlDeTemperaturaEnCamarasFecha') {
      if (item.controlDeTemperaturaEnCamarasFecha) {
        const fecha = new Date(item.controlDeTemperaturaEnCamarasFecha); // Convertir fecha a objeto Date
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
      controlDeTemperaturaEnCamarasNroCamara: item.controlDeTemperaturaEnCamarasNroCamara.toLowerCase(),
      controlDeTemperaturaEnCamarasFecha: new Date(item.controlDeTemperaturaEnCamarasFecha),
      controlDeTemperaturaEnCamarasHora: item.controlDeTemperaturaEnCamarasHora,
      controlDeTemperaturaEnCamarasTempInterna: item.controlDeTemperaturaEnCamarasTempInterna,
      controlDeTemperaturaEnCamaraTempExterna: item.controlDeTemperaturaEnCamaraTempExterna,
    };

    if (
      (!filtros.numero || lowerCaseItem.controlDeTemperaturaEnCamarasNroCamara.startsWith(filtros.numero)) &&
      (!filtros['fecha-desde'] || lowerCaseItem.controlDeTemperaturaEnCamarasFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.controlDeTemperaturaEnCamarasFecha <= new Date(filtros['fecha-hasta'])) &&
      (!filtros.hora || lowerCaseItem.controlDeTemperaturaEnCamarasHora.toString().startsWith(filtros.hora)) &&
      (!filtros.interna || lowerCaseItem.controlDeTemperaturaEnCamarasTempInterna.toString().startsWith(filtros.interna)) &&
      (!filtros.externa || lowerCaseItem.controlDeTemperaturaEnCamaraTempExterna.toString().startsWith(filtros.externa))
    ) {
      return true;
    }
    return false;
  });


  const handleEditControl = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-control-de-temperatura-en-camaras/${id}`);
  };

  const handleDeleteControl = (rowData) => {
    const id = rowData.Id;
    axios.delete(`/borrar-control-de-temperatura-en-camaras/${id}`, {
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
          <Typography component='h1' variant='h5'>Lista de Control De Temperatura En Camaras</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todos los Controles De Temperatura En Camaras almacenados en el sistema y puedes simplificar tu busqueda atraves de los filtros.
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
        dataKey="listarControlDeTemperaturaEnCamaras"
        tableHeadCells={tableHeadCells}
        title="Control De Temperatura En Camaras"
        dataMapper={mapData}
        columnRenderers={""}
        onEditButton={handleEditControl}
        onDeleteButton={handleDeleteControl}
      />    </div>
  );
}

export default ListarControlDeTemperaturaEnCamaras;
