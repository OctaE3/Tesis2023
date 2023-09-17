import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import { Grid, Typography, Tooltip, IconButton, createStyles, makeStyles, createTheme } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useNavigate } from 'react-router-dom';
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

function ListarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-canierias', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data.map((controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias) => ({
            ...controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias,
            Id: controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasId,
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
    { id: 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito', numeric: false, disablePadding: false, label: 'Deposito'},
    { id: 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias', numeric: false, disablePadding: false, label: 'Canieria' },
    { id: 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones', numeric: false, disablePadding: false, label: 'Observaciones' },
    { id: 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable', numeric: false, disablePadding: false, label: 'Resposnsable' }
  ];
 
  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'datetime', options: ['desde', 'hasta']},
    { id: 'deposito', label: 'Deposito', type: 'select', options: ['Deposito de Agua 1', 'Deposito de Agua 2', 'Deposito de Agua 3']},
    { id: 'canieria', label: 'Canieria', type: 'text' },
    { id: 'observaciones', label: 'Observaciones', type: 'text' },
    { id: 'resposable', label: 'Responsable', type: 'select',options: responsable },
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
    if (key === 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha') {
      if (item.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha) {
        const fechaArray = item.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha;
        const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
        return format(fecha, 'yyyy-MM-dd HH:mm');
      } else {
        return '';
      }
    }
    else if(key === 'controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable.usuarioNombre') {
      if (item.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable && item.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable.usuarioNombre) {
        return item.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable.usuarioNombre;
      } else {
        return '';
      }
    }else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const fechaArray = item.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha;
    const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
    const fechaFromat = format(fecha, 'yyyy-MM-dd HH:mm');

    const lowerCaseItem = {
        controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasFecha: fechaFromat,
        controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito : item.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito ? item.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito.toLowerCase() : '',
        controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias : item.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias,
        controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones: item.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones ? item.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones.toLowerCase() : '',
        controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable: item.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable.usuarioNombre ? item.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros['fecha-desde'] || fechaFromat >= filtros['fecha-desde']) &&
      (!filtros['fecha-hasta'] || fechaFromat <= filtros['fecha-hasta']) && 
      (!filtros.deposito || lowerCaseItem.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasDeposito.startsWith(filtros.deposito)) && 
      (!filtros.canieria || lowerCaseItem.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasCanierias.toString().startsWith(filtros.canieria)) && 
      (!filtros.observaciones || lowerCaseItem.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasObservaciones.startsWith(filtros.observaciones)) && 
      (!filtros.responsable || lowerCaseItem.controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable.startsWith(filtros.responsable))     
      ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    controlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanieriasResponsable: (responsable) => responsable.usuarioNombre
  };

  const handleEditCliente = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-canierias/${id}`);
  };

  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Lista de Control De Limpieza Y Desinfeccion De Depositos De Agua Y Canierias</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todos los controles De Limpieza Y Desinfeccion De Depositos De Agua Y Canierias almacenados en el sistema y puedes simplificar tu busqueda atraves de los filtros.
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
        dataKey="listarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias"
        tableHeadCells={tableHeadCells}
        title="Control De Limpieza Y Desinfeccion De Depositos De Agua Y Canierias"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditCliente}
      />    </div>
  );
}

export default ListarControlDeLimpiezaYDesinfeccionDeDepositosDeAguaYCanierias;
