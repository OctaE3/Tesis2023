import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import { Grid, Typography, Tooltip, IconButton, createStyles, makeStyles, createTheme } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
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

function ListarMonitoreoDeSSOPOPerativo() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-monitoreo-de-ssop-operativo', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data.map((monitoreoDeSSOPOperativo) => ({
            ...monitoreoDeSSOPOperativo,
            Id: monitoreoDeSSOPOperativo.monitoreoDeSSOPOperativoId,
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
    { id: 'monitoreoDeSSOPOperativoFechaInicio', numeric: false, disablePadding: false, label: 'Fecha inicio' },
    { id: 'monitoreoDeSSOPOperativoFechaFinal', numeric: false, disablePadding: false, label: 'Fecha final' },
    { id: 'monitoreoDeSSOPOperativoDias', numeric: false, disablePadding: false, label: 'Dias' },
    { id: 'monitoreoDeSSOPOperativoArea', numeric: false, disablePadding: false, label: 'Area' },
    { id: 'monitoreoDeSSOPOperativoObservaciones', numeric: false, disablePadding: false, label: 'Observaciones' },
    { id: 'monitoreoDeSSOPOperativoAccCorrectivas', numeric: false, disablePadding: false, label: 'Acciones correctivas' },
    { id: 'monitoreoDeSSOPOperativoAccPreventivas', numeric: false, disablePadding: false, label: 'Acciones preventivas' },
    { id: 'monitoreoDeSSOPOperativoResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
  ];
 
  const filters = [
    { id: 'fechaInicio', label: 'Fecha Inicio', type: 'date', options: ['desde', 'hasta']},
    { id: 'fechaFinal', label: 'Fecha Final', type: 'date', options: ['desde', 'hasta']},
    { id: 'dias', label: 'Dias', type: 'text' },
    { id: 'area', label: 'Area', type: 'text' },
    { id: 'observaciones', label: 'Observaciones', type: 'text' },
    { id: 'motivoDeRechazo', label: 'MotivoDeRechazo', type: 'text' },
    { id: 'accCorrectivas', label: 'Acciones Correctivas', type: 'text' },
    { id: 'accPreventivas', label: 'Acciones Preventivas', type: 'text' },
    { id: 'resposable', label: 'Responsable', type: 'select',options: responsable },
  ];

  const handleFilter = (filter) => {
    const lowerCaseFilter = Object.keys(filter).reduce((acc, key) => {
      if (filter[key]) {
        if (key === 'fechaInicio') {
          const [desde, hasta] = filter[key].split(' hasta ');
          acc['fechaInicio-desde'] = desde;
          acc['fechaInicio-hasta'] = hasta;
        } else if (key === 'fechaFinal') {
            const [desde, hasta] = filter[key].split(' hasta ');
            acc['fechaFinal-desde'] = desde;
            acc['fechaFinal-hasta'] = hasta;
          } else {
          acc[key] = filter[key].toLowerCase();
        }
      }
      return acc;
    }, {});
    setFiltros(lowerCaseFilter);
  };

  const mapData = (item, key) => {
    if (key === 'monitoreoDeSSOPOperativoFechaInicio') {
      if (item.monitoreoDeSSOPOperativoFechaInicio) {
        const fecha = new Date(item.monitoreoDeSSOPOperativoFechaInicio); // Convertir fecha a objeto Date
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    } 
    else if (key === 'monitoreoDeSSOPOperativoFechaFinal') {
        if (item.monitoreoDeSSOPOperativoFechaFinal) {
          const fecha = new Date(item.monitoreoDeSSOPOperativoFechaFinal); // Convertir fecha a objeto Date
          return format(fecha, 'dd/MM/yyyy');
        } else {
          return '';
        }
      } 
    else if(key === 'monitoreoDeSSOPOperativoResponsable.usuarioNombre') {
      if (item.monitoreoDeSSOPOperativoResponsable && item.monitoreoDeSSOPOperativoResponsable.usuarioNombre) {
        return item.monitoreoDeSSOPOperativoResponsable.usuarioNombre;
      } else {
        return '';
      }
    } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      monitoreoDeSSOPOperativoFechaInicio: new Date(item.monitoreoDeSSOPOperativoFechaInicio),
      monitoreoDeSSOPOperativoFechaFinal: new Date(item.monitoreoDeSSOPOperativoFechaFinal),
      monitoreoDeSSOPOperativoDias: item.monitoreoDeSSOPOperativoDias ? item.monitoreoDeSSOPOperativoDias : '',
      monitoreoDeSSOPOperativoArea: item.monitoreoDeSSOPOperativoArea ? item.monitoreoDeSSOPOperativoArea.toLowerCase() : '',
      monitoreoDeSSOPOperativoObservaciones: item.monitoreoDeSSOPOperativoObservaciones ? item.monitoreoDeSSOPOperativoObservaciones.toLowerCase() : '',
      monitoreoDeSSOPOperativoAccCorrectivas: item.monitoreoDeSSOPOperativoAccCorrectivas ? item.monitoreoDeSSOPOperativoAccCorrectivas.toLowerCase() : '',
      monitoreoDeSSOPOperativoAccPreventivas: item.monitoreoDeSSOPOperativoAccPreventivas ? item.monitoreoDeSSOPOperativoAccPreventivas.toLowerCase() : '',
      monitoreoDeSSOPOperativoResponsable: item.monitoreoDeSSOPOperativoResponsable.usuarioNombre ? item.monitoreoDeSSOPOperativoResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros['fechaInicio-desde'] || lowerCaseItem.monitoreoDeSSOPOperativoFechaInicio >= new Date(filtros['fechaInicio-desde'])) &&
      (!filtros['fechaInicio-hasta'] || lowerCaseItem.monitoreoDeSSOPOperativoFechaInicio <= new Date(filtros['fechaInicio-hasta'])) && 
      (!filtros['fechaFinal-desde'] || lowerCaseItem.monitoreoDeSSOPOperativoFechaFinal >= new Date(filtros['fechaFinal-desde'])) &&
      (!filtros['fechaFinal-hasta'] || lowerCaseItem.monitoreoDeSSOPOperativoFechaFinal <= new Date(filtros['fechaFinal-hasta'])) && 
      (!filtros.dias || lowerCaseItem.monitoreoDeSSOPOperativoDias.startsWith(filtros.dias)) && 
      (!filtros.area || lowerCaseItem.monitoreoDeSSOPOperativoArea.startsWith(filtros.area)) &&
      (!filtros.observaciones|| lowerCaseItem.monitoreoDeSSOPOperativoObservaciones.startsWith(filtros.observaciones)) &&
      (!filtros.accCorrectivas|| lowerCaseItem.monitoreoDeSSOPOperativoAccCorrectivas.startsWith(filtros.accCorrectivas)) &&
      (!filtros.accPreventivas|| lowerCaseItem.monitoreoDeSSOPOperativoAccPreventivas.startsWith(filtros.accPreventivas)) &&
      (!filtros.responsable || lowerCaseItem.monitoreoDeSSOPOperativoAccResponsable.startsWith(filtros.responsable)) 
      ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    monitoreoDeSSOPOperativoResponsable: (responsable) => responsable.usuarioNombre,
    monitoreoDeSSOPOperativoDias: (dias) => <ColumnaReutilizable contacts={dias} />,
  };

  const handleEditCliente = (rowData) => {
    const id = rowData.Id;
    navigate(`/buscar-monitoreo-de-ssop-operativo/${id}`);
  };

  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Lista de Productos Quimicos</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todos los productos quimicos en el sistema y puedes simplificar tu busqueda atraves de los filtros.
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
        dataKey="listarProductoQuimicos"
        tableHeadCells={tableHeadCells}
        title="Productos Quimicos"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditCliente}
      />    </div>
  );
}

export default ListarMonitoreoDeSSOPOPerativo;
