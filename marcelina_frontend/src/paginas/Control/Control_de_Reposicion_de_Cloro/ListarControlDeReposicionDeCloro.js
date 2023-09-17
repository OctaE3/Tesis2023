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

function ListarControlDeReposicionDeCloro() {
  const [data, setData] = useState([]);
  const [responsable, setResponsable] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const navigate = useNavigate();

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
  }, []);

  const tableHeadCells = [
    { id: 'controlDeReposicionDeCloroFecha', numeric: false, disablePadding: true, label: 'Fecha' },
    { id: 'controlDeReposicionDeCloroCantidadDeAgua', numeric: false, disablePadding: false, label: 'Cantidad de Agua' },
    { id: 'controlDeReposicionDeCloroCantidadDeCloroAdicionado', numeric: false, disablePadding: false, label: 'Cloro Adicionado' },
    { id: 'controlDeReposicionDeCloroObservaciones', numeric: false, disablePadding: false, label: 'Observaciones' },
    { id: 'controlDeReposicionDeCloroResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
  ];

  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta']},
    { id: 'cantidad', label: 'Cantidad de Agua', type: 'text' },
    { id: 'adicionado', label: 'Cloro Adicionado', type: 'text' },
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

  const handleEditCliente = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-control-de-reposicion-de-cloro/${id}`);
  };

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
      <FiltroReutilizable filters={filters} handleFilter={handleFilter} />
      <ListaReutilizable
        data={filteredData}
        dataKey="listarControlDeReposicionDeCloro"
        tableHeadCells={tableHeadCells}
        title="Control De Reposicion De Cloro"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditCliente}
      />    </div>
  );
}

export default ListarControlDeReposicionDeCloro;
