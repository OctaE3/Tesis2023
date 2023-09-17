import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import { Grid, Typography, Tooltip, IconButton, createStyles, makeStyles, createTheme } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ColumnaReutilizable from '../../../components/Reutilizable/ColumnaReutilizable';
import { format } from 'date-fns';

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

function ListarControlDeNitrito() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [responsable, setResponsables] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesResponse = await axios.get('/listar-control-de-nitrito', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const responsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const clientesData = clientesResponse.data;
        const responsableData = responsableResponse.data;

        setData(clientesData);
        setResponsables(responsableData.map((usuario) => usuario.usuarioNombre)); // Obtener solo los nombres de las localidades
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);


  const mapData = (item, key) => {
    if (key === 'controlDeNitritoResponsable.usuarioNombre') {
      if (item.controlDeNitritoResponsable && item.controlDeNitritoResponsable.usuarioNombre) {
        return item.controlDeNitritoResponsable.usuarioNombre;
      } else {
        return '';
      }
    } 
    else if (key === 'controlDeNitritoFecha') {
      if (item.controlDeNitritoFecha) {
        const fecha = new Date(item.controlDeNitritoFecha); // Convertir fecha a objeto Date
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    } 
    else {
      return item[key];
    }
  };

  const tableHeadCells = [
    { id: 'controlDeNitritoFecha', numeric: false, disablePadding: true, label: 'Fecha' },
    { id: 'controlDeNitritoProductoLote', numeric: false, disablePadding: false, label: 'Lote' },
    { id: 'controlDeNitritoCantidadUtilizada', numeric: false, disablePadding: false, label: 'Cantidad' },
    { id: 'controlDeNitritoStock', numeric: false, disablePadding: false, label: 'Stock' },
    { id: 'controlDeNitritoObservaciones', numeric: false, disablePadding: false, label: 'Observaciones' },
    { id: 'controlDeNitritoResponsable.usuarioNombre', numeric: false, disablePadding: false, label: 'Responsable' },
  ];

  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta']},
    { id: 'lote', label: 'Lote', type: 'text' },
    { id: 'cantidad', label: 'Cantidad', type: 'text'},
    { id: 'stock', label: 'Stock', type: 'text' },
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
        }  else {
          acc[key] = filter[key].toLowerCase();
        }
      }
      return acc;
    }, {});
    setFiltros(lowerCaseFilter);
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      controlDeNitritoFecha: new Date(item.controlDeNitritoFecha),
      controlDeNitritoProductoLote: item.controlDeNitritoProductoLote ? item.controlDeNitritoProductoLote.toLowerCase() : '',
      controlDeNitritoCantidadUtilizada: item.controlDeNitritoCantidadUtilizada ? item.controlDeNitritoCantidadUtilizada : '',
      controlDeNitritoStock: item.controlDeNitritoStock ? item.controlDeNitritoStock : '',
      controlDeNitritoObservaciones: item.controlDeNitritoObservaciones ? item.controlDeNitritoObservaciones.toLowerCase() : '',
      controlDeNitritoResponsable: item.controlDeNitritoResponsable.usuarioNombre ? item.controlDeNitritoResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros['fecha-desde'] || lowerCaseItem.controlDeNitritoFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.controlDeNitritoFecha <= new Date(filtros['fecha-hasta'])) && 
      (!filtros.lote || lowerCaseItem.controlDeNitritoProductoLote.toString().startsWith(filtros.lote)) &&
      (!filtros.cantidad || lowerCaseItem.controlDeNitritoCantidadUtilizada.toString().startsWith(filtros.cantidad)) &&
      (!filtros.stock || lowerCaseItem.controlDeNitritoStock.toString().startsWith(filtros.stock)) &&
      (!filtros.observaciones || lowerCaseItem.controlDeNitritoObservaciones.startsWith(filtros.observaciones)) &&
      (!filtros.responsable || lowerCaseItem.controlDeNitritoResponsable.startsWith(filtros.responsable))
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    controlDeNitritoResponsable: (responsable) => responsable.usuarioNombre
  };

  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Lista de Control de Nitritos</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todas los controles de Nitritos registrados en el sistema y puedes simplificar tu busqueda atraves de los filtros.
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
        dataKey="listarControlDeNitrato"
        tableHeadCells={tableHeadCells}
        title="Control De Nitrito"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
      />

    </div>
  );
}

export default ListarControlDeNitrito;
