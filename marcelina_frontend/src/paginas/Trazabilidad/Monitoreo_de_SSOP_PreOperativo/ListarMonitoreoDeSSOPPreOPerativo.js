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

function ListarMonitoreoDeSSOPPreOPerativo() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-monitoreo-de-ssop-pre-operativo', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data.map((monitoreoDeSSOPPreOperativo) => ({
            ...monitoreoDeSSOPPreOperativo,
            Id: monitoreoDeSSOPPreOperativo.monitoreoDeSSOPPreOperativoId,
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
    { id: 'monitoreoDeSSOPPreOperativoFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'monitoreoDeSSOPPreOperativoDias', numeric: false, disablePadding: false, label: 'Dias' },
    { id: 'monitoreoDeSSOPPreOperativoSector', numeric: false, disablePadding: false, label: 'Sector' },
    { id: 'monitoreoDeSSOPPreOperativoArea', numeric: false, disablePadding: false, label: 'Area' },
    { id: 'monitoreoDeSSOPPreOperativoObservaciones', numeric: false, disablePadding: false, label: 'Observaciones' },
    { id: 'monitoreoDeSSOPPreOperativoAccCorrectivas', numeric: false, disablePadding: false, label: 'Acciones correctivas' },
    { id: 'monitoreoDeSSOPPreOperativoAccPreventivas', numeric: false, disablePadding: false, label: 'Acciones preventivas' },
    { id: 'monitoreoDeSSOPPreOperativoResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
  ];
 
  const filters = [
    { id: 'fechaInicio', label: 'Fecha Inicio', type: 'datetime', options: ['desde', 'hasta']},
    { id: 'dias', label: 'Dias', type: 'text' },
    { id: 'sector', label: 'Sector', type: 'text' },
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
    if (key === 'monitoreoDeSSOPPreOperativoFecha') {
        if (item.monitoreoDeSSOPPreOperativoFecha) {
          const fechaArray = item.monitoreoDeSSOPPreOperativoFecha;
          const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
          return format(fecha, 'yyyy-MM-dd HH:mm');
        } else {
          return '';
        }
      }
    else if(key === 'monitoreoDeSSOPPreOperativoResponsable.usuarioNombre') {
      if (item.monitoreoDeSSOPPreOperativoResponsable && item.monitoreoDeSSOPPreOperativoResponsable.usuarioNombre) {
        return item.monitoreoDeSSOPPreOperativoResponsable.usuarioNombre;
      } else {
        return '';
      }
    } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const fechaArray = item.monitoreoDeSSOPPreOperativoFecha;
    const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
    const fechaFromat = format(fecha, 'yyyy-MM-dd HH:mm');

    const lowerCaseItem = {
      monitoreoDeSSOPPreOperativoFecha:  fechaFromat,
      monitoreoDeSSOPPreOperativoDias: item.monitoreoDeSSOPPreOperativoDias ? item.monitoreoDeSSOPPreOperativoDias : '',
      monitoreoDeSSOPPreOperativoSector: item.monitoreoDeSSOPPreOperativoSector ? item.monitoreoDeSSOPPreOperativoSector.toLowerCase() : '',
      monitoreoDeSSOPPreOperativoArea: item.monitoreoDeSSOPPreOperativoArea ? item.monitoreoDeSSOPPreOperativoArea.toLowerCase() : '',
      monitoreoDeSSOPPreOperativoObservaciones: item.monitoreoDeSSOPPreOperativoObservaciones ? item.monitoreoDeSSOPPreOperativoObservaciones.toLowerCase() : '',
      monitoreoDeSSOPPreOperativoAccCorrectivas: item.monitoreoDeSSOPPreOperativoAccCorrectivas ? item.monitoreoDeSSOPPreOperativoAccCorrectivas.toLowerCase() : '',
      monitoreoDeSSOPPreOperativoAccPreventivas: item.monitoreoDeSSOPPreOperativoAccPreventivas ? item.monitoreoDeSSOPPreOperativoAccPreventivas.toLowerCase() : '',
      monitoreoDeSSOPPreOperativoResponsable: item.monitoreoDeSSOPPreOperativoResponsable.usuarioNombre ? item.monitoreoDeSSOPPreOperativoResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros['fecha-desde'] || fechaFromat >= filtros['fecha-desde']) &&
      (!filtros['fecha-hasta'] || fechaFromat <= filtros['fecha-hasta']) && 
      (!filtros.dias || lowerCaseItem.monitoreoDeSSOPPreOperativoDias.startsWith(filtros.dias)) && 
      (!filtros.sector || lowerCaseItem.monitoreoDeSSOPPreOperativoSector.startsWith(filtros.sector)) && 
      (!filtros.area || lowerCaseItem.monitoreoDeSSOPPreOperativoArea.startsWith(filtros.area)) &&
      (!filtros.observaciones|| lowerCaseItem.monitoreoDeSSOPPreOperativoObservaciones.startsWith(filtros.observaciones)) &&
      (!filtros.accCorrectivas|| lowerCaseItem.monitoreoDeSSOPPreOperativoAccCorrectivas.startsWith(filtros.accCorrectivas)) &&
      (!filtros.accPreventivas|| lowerCaseItem.monitoreoDeSSOPPreOperativoAccPreventivas.startsWith(filtros.accPreventivas)) &&
      (!filtros.responsable || lowerCaseItem.monitoreoDeSSOPPreOperativoResponsable.startsWith(filtros.responsable)) 
      ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    monitoreoDeSSOPPreOperativoResponsable: (responsable) => responsable.usuarioNombre,
    monitoreoDeSSOPPreOperativoDias: (dias) => <ColumnaReutilizable contacts={dias} />,
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
          <Typography component='h1' variant='h5'>Lista de Monitoreo de SSOP Pre Operativo</Typography>
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
        dataKey="listarMonitoreoDeSSOPPreOperativo"
        tableHeadCells={tableHeadCells}
        title="Monitoreo De SSOP Pre Operativo"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditCliente}
      />    </div>
  );
}

export default ListarMonitoreoDeSSOPPreOPerativo;
