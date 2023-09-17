import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
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

function ListarLocalidad() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const localidadResponse = await axios.get('/listar-localidades', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const localidadData = localidadResponse.data;

        setData(localidadData);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);


  const mapData = (item, key) => {
    return item[key];
  };

  const tableHeadCells = [
    { id: 'localidadCiudad', numeric: false, disablePadding: true, label: 'Ciudad' },
    { id: 'localidadDepartamento', numeric: false, disablePadding: false, label: 'Departamento' },
  ];

  const filters = [
    { id: 'ciudad', label: 'Ciudad', type: 'text' },
    { id: 'departamento', label: 'Departamento', type: 'text'},
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
      localidadCiudad: item.localidadCiudad ? item.localidadCiudad.toLowerCase() : '',
      localidadDepartamento: item.localidadDepartamento ? item.localidadDepartamento.toLowerCase() : ''
    };

    if (
      (!filtros.ciudad || lowerCaseItem.localidadCiudad.toString().startsWith(filtros.ciudad)) &&
      (!filtros.departamento || lowerCaseItem.localidadDepartamento.toString().startsWith(filtros.departamento))
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
          <Typography component='h1' variant='h5'>Lista de Localidades</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todas las localidades registradas en el sistema y puedes simplificar tu busqueda atraves de los filtros.
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
        dataKey="listarLocalidades"
        tableHeadCells={tableHeadCells}
        title="Localidades"
        dataMapper={mapData}
        columnRenderers={""}
      />

    </div>
  );
}

export default ListarLocalidad;
