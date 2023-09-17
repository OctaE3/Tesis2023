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

function ListarControlDeCloroLibre() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-control-de-cloro-libre', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data.map((controlDeCloroLibre) => ({
            ...controlDeCloroLibre,
            Id: controlDeCloroLibre.controlDeCloroLibreId,
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
    { id: 'controlDeCloroLibreFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'controlDeCloroLibreGrifoPico', numeric: false, disablePadding: false, label: 'Pico/Grafo'},
    { id: 'controlDeCloroLibreResultado', numeric: false, disablePadding: false, label: 'Resultado' },
    { id: 'controlDeCloroLibreObservaciones', numeric: false, disablePadding: false, label: 'Observaciones' },
    { id: 'controlDeCloroLibreResponsable', numeric: false, disablePadding: false, label: 'Resposnsable' }
  ];
 
  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'datetime', options: ['desde', 'hasta']},
    { id: 'pico', label: 'Pico/Grafo', type: 'text' },
    { id: 'resultado', label: 'Resultado', type: 'text' },
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
    if (key === 'controlDeCloroLibreFecha') {
      if (item.controlDeCloroLibreFecha) {
        const fechaArray = item.controlDeCloroLibreFecha;
        const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
        return format(fecha, 'yyyy-MM-dd HH:mm');
      } else {
        return '';
      }
    }
    else if(key === 'controlDeCloroLibreResponsable.usuarioNombre') {
      if (item.controlDeCloroLibreResponsable && item.controlDeCloroLibreResponsable.usuarioNombre) {
        return item.controlDeCloroLibreResponsable.usuarioNombre;
      } else {
        return '';
      }
    }else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const fechaArray = item.controlDeCloroLibreFecha;
    const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
    const fechaFromat = format(fecha, 'yyyy-MM-dd HH:mm');

    const lowerCaseItem = {
        controlDeCloroLibreFecha: fechaFromat,
        controlDeCloroLibreGrifoPico : item.controlDeCloroLibreGrifoPico,
        controlDeCloroLibreResultado : item.controlDeCloroLibreResultado,
        controlDeCloroLibreObservaciones: item.controlDeCloroLibreObservaciones ? item.controlDeCloroLibreObservaciones.toLowerCase() : '',
        controlDeCloroLibreResponsable: item.controlDeCloroLibreResponsable.usuarioNombre ? item.controlDeCloroLibreResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros['fecha-desde'] || fechaFromat >= filtros['fecha-desde']) &&
      (!filtros['fecha-hasta'] || fechaFromat <= filtros['fecha-hasta']) && 
      (!filtros.pico || lowerCaseItem.controlDeCloroLibreGrifoPico.toString().startsWith(filtros.pico)) && 
      (!filtros.resultado || lowerCaseItem.controlDeCloroLibreResultado.toString().startsWith(filtros.resultado)) && 
      (!filtros.observaciones || lowerCaseItem.controlDeCloroLibreObservaciones.startsWith(filtros.observaciones)) && 
      (!filtros.responsable || lowerCaseItem.controlDeCloroLibreResponsable.startsWith(filtros.responsable))     
      ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    controlDeCloroLibreResponsable: (responsable) => responsable.usuarioNombre
  };

  const handleEditCliente = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-controlDeCloroLibre/${id}`);
  };

  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Lista de Control de Cloro Libre</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todos los controles de cloro libre almacenados en el sistema y puedes simplificar tu busqueda atraves de los filtros.
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
        dataKey="listarcontrolDeCloroLibreResponsable"
        tableHeadCells={tableHeadCells}
        title="Control De Cloro Libre Responsable"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditCliente}
      />    </div>
  );
}

export default ListarControlDeCloroLibre;
