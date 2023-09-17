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

function ListarControlDeMejorasEnInstalaciones() {
  const [data, setData] = useState([]);
  const [responsable, setResponsable] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-control-de-mejoras-en-instalaciones', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data.map((controlDeMejorasEnInstalaciones) => ({
            ...controlDeMejorasEnInstalaciones,
            Id: controlDeMejorasEnInstalaciones.controlDeMejorasEnInstalacionesId,
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
    { id: 'controlDeMejorasEnInstalacionesFecha', numeric: false, disablePadding: true, label: 'Fecha' },
    { id: 'controlDeMejorasEnInstalacionesSector', numeric: false, disablePadding: false, label: 'Sector' },
    { id: 'controlDeMejorasEnInstalacionesDefecto', numeric: false, disablePadding: false, label: 'Defecto' },
    { id: 'controlDeMejorasEnInstalacionesMejoraRealizada', numeric: false, disablePadding: false, label: 'Mejora Realizada' },
    { id: 'controlDeMejorasEnInstalacionesResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
  ];

  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta']},
    { id: 'sector', label: 'Sector', type: 'text' },
    { id: 'defecto', label: 'Defecto', type: 'text' },
    { id: 'mejora', label: 'Mejora Realizada', type: 'text' },
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
    if (key === 'controlDeMejorasEnInstalacionesFecha') {
      if (item.controlDeMejorasEnInstalacionesFecha) {
        const fecha = new Date(item.controlDeMejorasEnInstalacionesFecha); // Convertir fecha a objeto Date
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
      controlDeMejorasEnInstalacionesFecha: new Date(item.controlDeMejorasEnInstalacionesFecha),
      controlDeMejorasEnInstalacionesSector: item.controlDeMejorasEnInstalacionesSector.toLowerCase(),
      controlDeMejorasEnInstalacionesDefecto: item.controlDeMejorasEnInstalacionesDefecto.toLowerCase(),
      controlDeMejorasEnInstalacionesMejoraRealizada: item.controlDeMejorasEnInstalacionesMejoraRealizada.toLowerCase(),
      controlDeMejorasEnInstalacionesResponsable: item.controlDeMejorasEnInstalacionesResponsable ? item.controlDeMejorasEnInstalacionesResponsable.usuarioNombre.toLowerCase() : '',
    };
  
    if (
      (!filtros['fecha-desde'] || lowerCaseItem.controlDeMejorasEnInstalacionesFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.controlDeMejorasEnInstalacionesFecha <= new Date(filtros['fecha-hasta'])) && 
      (!filtros.sector || lowerCaseItem.controlDeMejorasEnInstalacionesSector.startsWith(filtros.sector)) &&
      (!filtros.defecto || lowerCaseItem.controlDeMejorasEnInstalacionesDefecto.startsWith(filtros.defecto)) &&
      (!filtros.mejora || lowerCaseItem.controlDeMejorasEnInstalacionesMejoraRealizada.startsWith(filtros.mejora)) &&
      (!filtros.responsable || lowerCaseItem.controlDeMejorasEnInstalacionesResponsable.startsWith(filtros.responsable))
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    controlDeMejorasEnInstalacionesResponsable: (responsable) => responsable.usuarioNombre
  };

  const handleEditCliente = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-control-de-mejoras-en-instalaciones/${id}`);
  };

  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Lista de Control De Mejoras En Instalaciones</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todas las Mejoras En Instalaciones almacenadas en el sistema y puedes simplificar tu busqueda atraves de los filtros.
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
        dataKey="listarControlDeMejorasEnInstalaciones"
        tableHeadCells={tableHeadCells}
        title="Control De Mejoras En Instalaciones"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditCliente}
      />    </div>
  );
}

export default ListarControlDeMejorasEnInstalaciones;
