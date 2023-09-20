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

function ListarControlDeReposicionDeCloro() {
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
    title: 'Correcto', body: 'Se elimino el control de reposición de cloro con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar el control de reposición de cloro, recargue la pagina.', severity: 'error', type: 'description'
  });

  const [alertWarning, setAlertWarning] = useState({
    title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

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

        const data = response.data.map((controlDeReposicionDeCloro) => ({
          ...controlDeReposicionDeCloro,
          Id: controlDeReposicionDeCloro.controlDeReposicionDeCloroId,
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
    { id: 'controlDeReposicionDeCloroFecha', numeric: false, disablePadding: true, label: 'Fecha' },
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
        const fecha = new Date(item.controlDeReposicionDeCloroFecha); // Convertir fecha a objeto Date
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
      controlDeReposicionDeCloroCantidadDeAgua: item.controlDeReposicionDeCloroCantidadDeAgua.toLowerCase(),
      controlDeReposicionDeCloroCantidadDeCloroAdicionado: item.controlDeReposicionDeCloroCantidadDeCloroAdicionado.toLowerCase(),
      controlDeReposicionDeCloroObservaciones: item.controlDeReposicionDeCloroObservaciones ? item.controlDeReposicionDeCloroObservaciones.toLowerCase() : '',
      controlDeReposicionDeCloroResponsable: item.controlDeReposicionDeCloroResponsable ? item.controlDeReposicionDeCloroResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros['fecha-desde'] || lowerCaseItem.controlDeReposicionDeCloroFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.controlDeReposicionDeCloroFecha <= new Date(filtros['fecha-hasta'])) &&
      (!filtros.cantidad || lowerCaseItem.controlDeReposicionDeCloroCantidadDeAgua.startsWith(filtros.cantidad)) &&
      (!filtros.adicionado || lowerCaseItem.controlDeReposicionDeCloroCantidadDeCloroAdicionado.startsWith(filtros.adicionado)) &&
      (!filtros.observaciones || lowerCaseItem.controlDeReposicionDeCloroObservaciones.startsWith(filtros.observaciones)) &&
      (!filtros.responsable || lowerCaseItem.controlDeReposicionDeCloroResponsable.startsWith(filtros.responsable))
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
          <Typography component='h1' variant='h5'>Lista de Control De Reposicion De Cloro</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todas las Reposiciones De Cloro almacenadas en el sistema y puedes simplificar tu busqueda atraves de los filtros.
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
        dataKey="listarControlDeReposicionDeCloro"
        tableHeadCells={tableHeadCells}
        title="Control De Reposicion De Cloro"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditControl}
        onDeleteButton={handleDeleteControl}
      />    </div>
  );
}

export default ListarControlDeReposicionDeCloro;
