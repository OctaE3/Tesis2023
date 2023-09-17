import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
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

function ListarControlDeTemperaturaDeEsterilizadores() {
  const [data, setData] = useState([]);
  const [responsable, setResponsable] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-control-de-temperatura-de-esterilizadores', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data.map((controlDeTemperaturaDeEsterilizadores) => ({
            ...controlDeTemperaturaDeEsterilizadores,
            Id: controlDeTemperaturaDeEsterilizadores.controlDeTemperaturaDeEsterilizadoresId,
        }));
        const ResponsableData = ResponsableResponse.data;

        setData(data);
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  const tableHeadCells = [
    { id: 'controlDeTemperaturaDeEsterilizadoresFecha', numeric: false, disablePadding: true, label: 'Fecha' },
    { id: 'controlDeTemperaturaDeEsterilizadoresTemperatura1', numeric: false, disablePadding: false, label: 'Temperatura 1' },
    { id: 'controlDeTemperaturaDeEsterilizadoresTemperatura2', numeric: false, disablePadding: false, label: 'Temperatura 2' },
    { id: 'controlDeTemperaturaDeEsterilizadoresTemperatura3', numeric: false, disablePadding: false, label: 'Temperatura 3' },
    { id: 'controlDeTemperaturaDeEsterilizadoresObservaciones', numeric: false, disablePadding: false, label: 'Observaciones' },
    { id: 'controlDeTemperaturaDeEsterilizadoresResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
  ];

  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'datetime', options: ['desde', 'hasta']},
    { id: 'temperatura1', label: 'Temperatura 1', type: 'text' },
    { id: 'temperatura2', label: 'Temperatura 2', type: 'text' },
    { id: 'temperatura3', label: 'Temperatura 3', type: 'text' },
    { id: 'observaciones', label: 'Observaciones', type: 'text' },
    { id: 'responsable', label: 'Responsable', type: 'select', options: responsable},
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
    if (key === 'controlDeTemperaturaDeEsterilizadoresFecha') {
        if (item.controlDeTemperaturaDeEsterilizadoresFecha) {
            const fechaArray = item.controlDeTemperaturaDeEsterilizadoresFecha;
            const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
            return format(fecha, 'yyyy-MM-dd HH:mm');
          } else {
            return '';
          }
    }
    else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const fechaArray = item.controlDeTemperaturaDeEsterilizadoresFecha;
    const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
    const fechaFromat = format(fecha, 'yyyy-MM-dd HH:mm');

    const lowerCaseItem = {
        controlDeTemperaturaDeEsterilizadoresFecha: fechaFromat,
        controlDeTemperaturaDeEsterilizadoresTemperatura1: item.controlDeTemperaturaDeEsterilizadoresTemperatura1,
        controlDeTemperaturaDeEsterilizadoresTemperatura2: item.controlDeTemperaturaDeEsterilizadoresTemperatura2,
        controlDeTemperaturaDeEsterilizadoresTemperatura3: item.controlDeTemperaturaDeEsterilizadoresTemperatura3,
        controlDeTemperaturaDeEsterilizadoresObservaciones: item.controlDeTemperaturaDeEsterilizadoresObservaciones ? item.controlDeTemperaturaDeEsterilizadoresObservaciones.toLowerCase() : '',
        controlDeTemperaturaDeEsterilizadoresResponsable: item.controlDeTemperaturaDeEsterilizadoresResponsable ? item.controlDeTemperaturaDeEsterilizadoresResponsable.usuarioNombre.toLowerCase() : '',
    };
  
    if (
      (!filtros['fecha-desde'] || fechaFromat >= filtros['fecha-desde']) &&
      (!filtros['fecha-hasta'] || fechaFromat <= filtros['fecha-hasta']) && 
      (!filtros.temperatura1 || lowerCaseItem.controlDeTemperaturaDeEsterilizadoresTemperatura1.toString().startsWith(filtros.temperatura1)) &&
      (!filtros.temperatura2 || lowerCaseItem.controlDeTemperaturaDeEsterilizadoresTemperatura2.toString().startsWith(filtros.temperatura2)) &&
      (!filtros.temperatura3 || lowerCaseItem.controlDeTemperaturaDeEsterilizadoresTemperatura3.toString().startsWith(filtros.temperatura3)) &&
      (!filtros.observaciones || lowerCaseItem.controlDeTemperaturaDeEsterilizadoresObservaciones.startsWith(filtros.observaciones)) &&
      (!filtros.responsable || lowerCaseItem.controlDeTemperaturaDeEsterilizadoresResponsable.startsWith(filtros.responsable))
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    controlDeTemperaturaDeEsterilizadoresResponsable: (responsable) => responsable.usuarioNombre
  };

  const handleEditCliente = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-control-de-temperatura-de-esterilizadores/${id}`);
  };

  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Lista de Control De Temperatura De Esterilizadores</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todos los Controles De Temperatura De Esterilizadores almacenados en el sistema y puedes simplificar tu busqueda atraves de los filtros.
            </Typography>
          }>
            <IconButton>
              <HelpOutlineIcon fontSize="large" color="primary" />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item lg={2} md={2}></Grid>
      </Grid>
      <FiltroReutilizable filters={filters} handleFilter={handleFilter} />
      <ListaReutilizable
        data={filteredData}
        dataKey="listarControlDeTemperaturaDeEsterilizadores"
        tableHeadCells={tableHeadCells}
        title="Control De Temperatura De Esterilizadores"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditCliente}
      />    </div>
  );
}

export default ListarControlDeTemperaturaDeEsterilizadores;
