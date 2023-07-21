import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../components/Formulario Reutilizable/ListaReutilizable';
import Navbar from '../../components/Navbar/Navbar';
import FiltroReutilizable from '../../components/Formulario Reutilizable/FiltroReutilizable';
import { Grid, Typography, Tooltip, IconButton, createStyles, makeStyles, createTheme } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

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

function ListarCarne() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-carnes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data; // Asumiendo que la respuesta de la API es un arreglo de objetos con los datos

        setData(data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  const tableHeadCells = [
    { id: 'carneNombre', numeric: false, disablePadding: true, label: 'Nombre' },
    { id: 'carneTipo', numeric: false, disablePadding: false, label: 'Tipo' },
    { id: 'carneCorte', numeric: false, disablePadding: false, label: 'Corte' },
    { id: 'carneCantidad', numeric: false, disablePadding: false, label: 'Cantidad' },
    { id: 'carnePaseSanitario', numeric: false, disablePadding: false, label: 'Pase sanitario' },
  ];

  const filters = [
    { id: 'nombre', label: 'Nombre', type: 'text' },
    { id: 'tipo', label: 'Tipo', type: 'select', options: ['Porcino', 'Bovino'] },
    { id: 'corte', label: 'Corte', type: 'text' },
    { id: 'cantidad', label: 'Cantidad', type: 'text' },
    { id: 'paseSanitario', label: 'Pase sanitario', type: 'text' },
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
      carneNombre: item.carneNombre.toLowerCase(),
      carneTipo: item.carneTipo.toLowerCase(),
      carneCorte: item.carneCorte.toLowerCase(),
      carneCantidad: item.carneCantidad,
      carnePaseSanitario: item.carnePaseSanitario.toLowerCase(),
    };

    if (
      (!filtros.nombre || lowerCaseItem.carneNombre.startsWith(filtros.nombre)) &&
      (!filtros.tipo || lowerCaseItem.carneTipo.startsWith(filtros.tipo)) &&
      (!filtros.corte || lowerCaseItem.carneCorte.startsWith(filtros.corte)) &&
      (!filtros.cantidad || lowerCaseItem.carneCantidad.startsWith(filtros.cantidad)) &&
      (!filtros.paseSanitario || lowerCaseItem.carnePaseSanitario.startsWith(filtros.paseSanitario))
    ) {
      return true;
    }
    return false;
  });


  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Lista de Carnes</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todas la carnes almacenadas en el sistema y puedes simplificar tu busqueda atraves de los filtros.
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
      <ListaReutilizable data={filteredData} tableHeadCells={tableHeadCells} title="Carnes" />
    </div>
  );
}

export default ListarCarne;
