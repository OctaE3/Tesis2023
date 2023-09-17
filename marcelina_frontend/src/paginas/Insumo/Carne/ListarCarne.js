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

function ListarCarne() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-carnes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data.map((data) => ({
          ...data,
          Id: data.carneId,
        }));

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
    { id: 'carneCategoria', numeric: false, disablePadding: false, label: 'Categoria' },
    { id: 'carneCantidad', numeric: false, disablePadding: false, label: 'Cantidad' },
    { id: 'carneFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'carnePaseSanitario', numeric: false, disablePadding: false, label: 'Pase sanitario' },
  ];

  const filters = [
    { id: 'nombre', label: 'Nombre', type: 'text' },
    { id: 'tipo', label: 'Tipo', type: 'select', options: ['Porcino', 'Bovino'] },
    { id: 'corte', label: 'Corte', type: 'text' },
    { id: 'categoria', label: 'Categoria', type: 'text' },
    { id: 'cantidad', label: 'Cantidad', type: 'text' },
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta']},
    { id: 'paseSanitario', label: 'Pase sanitario', type: 'text' },
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
    if (key === 'carneFecha') {
      if (item.carneFecha) {
        const fecha = new Date(item.carneFecha); // Convertir fecha a objeto Date
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
      carneNombre: item.carneNombre.toLowerCase(),
      carneTipo: item.carneTipo.toLowerCase(),
      carneCorte: item.carneCorte.toLowerCase(),
      carneCategoria: item.carneCategoria.toLowerCase(),
      carneCantidad: item.carneCantidad,
      carneFecha: new Date(item.carneFecha),
      carnePaseSanitario: item.carnePaseSanitario.toLowerCase(),
    };
  
    if (
      (!filtros.nombre || lowerCaseItem.carneNombre.startsWith(filtros.nombre)) &&
      (!filtros.tipo || lowerCaseItem.carneTipo.startsWith(filtros.tipo)) &&
      (!filtros.corte || lowerCaseItem.carneCorte.startsWith(filtros.corte)) &&
      (!filtros.cantidad || lowerCaseItem.carneCantidad.toString().startsWith(filtros.cantidad)) &&
      (!filtros.categoria || lowerCaseItem.carneCategoria.startsWith(filtros.cantidad)) &&
      (!filtros['fecha-desde'] || lowerCaseItem.carneFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.carneFecha <= new Date(filtros['fecha-hasta'])) && 
      (!filtros.paseSanitario || lowerCaseItem.carnePaseSanitario.startsWith(filtros.paseSanitario))
    ) {
      return true;
    }
    return false;
  });

  const handleEditControl = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-carne/${id}`);
  }

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
      <ListaReutilizable
        data={filteredData}
        dataKey="carne"
        tableHeadCells={tableHeadCells}
        title="Carnes"
        dataMapper={mapData}
        columnRenderers={""}
        onEditButton={handleEditControl}
      />    </div>
  );
}

export default ListarCarne;
