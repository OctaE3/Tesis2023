import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import { Grid, Typography, Tooltip, IconButton, createStyles, makeStyles, createTheme } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ColumnaReutilizable from '../../../components/Reutilizable/ColumnaReutilizable';

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

function ListarCliente() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [localidades, setLocalidades] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesResponse = await axios.get('/listar-clientes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const localidadesResponse = await axios.get('/listar-localidades', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const clientesData = clientesResponse.data;
        const localidadesData = localidadesResponse.data;

        setData(clientesData);
        setLocalidades(localidadesData.map((localidad) => localidad.localidadDepartamento)); // Obtener solo los nombres de las localidades
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);


  const mapData = (item, key) => {
    if (key === 'clienteLocalidad.localidadDepartamento') {
      if (item.clienteLocalidad && item.clienteLocalidad.localidadDepartamento) {
        return item.clienteLocalidad.localidadDepartamento;
      } else {
        return '';
      }
    } else if (key === 'clienteContacto') {
      if (item.clienteContacto && item.clienteContacto.length > 0) {
        return item.clienteContacto;
      } else {
        return [];
      }
    } else {
      return item[key];
    }
  };

  const tableHeadCells = [
    { id: 'clienteNombre', numeric: false, disablePadding: true, label: 'Nombre' },
    { id: 'clienteEmail', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'clienteContacto', numeric: false, disablePadding: false, label: 'Telefonos' },
    { id: 'clienteObservaciones', numeric: false, disablePadding: false, label: 'Observaciones' },
    { id: 'clienteLocalidad.localidadDepartamento', numeric: false, disablePadding: false, label: 'Localidad' },
  ];

  const filters = [
    { id: 'nombre', label: 'Nombre', type: 'text' },
    { id: 'email', label: 'Email', type: 'text'},
    { id: 'telefono', label: 'Telefono', type: 'text' },
    { id: 'observaciones', label: 'Observaciones', type: 'text' },
    { id: 'localidad', label: 'Localidad', type: 'select', options: localidades },
  ];

  const handleFilter = (filter) => {
    const lowerCaseFilter = Object.keys(filter).reduce((acc, key) => {
      acc[key] = filter[key] ? filter[key].toLowerCase() : '';
      return acc;
    }, {});
    setFiltros(lowerCaseFilter);
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      clienteNombre: item.clienteNombre.toLowerCase(),
      clienteEmail: item.clienteEmail.toLowerCase(),
      clienteObservaciones: item.clienteObservaciones.toLowerCase(),
      clienteContacto: item.clienteContacto.map(contacto => contacto.toLowerCase()), // Convertir todos los contactos a minúsculas
      clienteLocalidad: item.clienteLocalidad ? item.clienteLocalidad.localidadDepartamento.toLowerCase() : '',
    };

    if (
      (!filtros.nombre || lowerCaseItem.clienteNombre.startsWith(filtros.nombre)) &&
      (!filtros.email || lowerCaseItem.clienteEmail.startsWith(filtros.email)) &&
      (!filtros.telefono || lowerCaseItem.clienteContacto.some(contacto => contacto.startsWith(filtros.telefono))) &&
      (!filtros.observaciones || lowerCaseItem.clienteObservaciones.startsWith(filtros.observaciones)) &&
      (!filtros.localidad || lowerCaseItem.clienteLocalidad.startsWith(filtros.localidad))
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    clienteContacto: (contacts) => <ColumnaReutilizable contacts={contacts} />,
  };

  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Lista de Clientes</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todas los clientes registrados en el sistema y puedes simplificar tu busqueda atraves de los filtros.
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
        dataKey="cliente"
        tableHeadCells={tableHeadCells}
        title="Clientes"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
      />

    </div>
  );
}

export default ListarCliente;
