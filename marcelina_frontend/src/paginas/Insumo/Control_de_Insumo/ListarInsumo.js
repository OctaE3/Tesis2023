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

function ListarInsumo() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-control-de-insumos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ProveedorResponse = await axios.get('/listar-proveedores', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });


        const data = response.data.map((data) => ({
          ...data,
          Id: data.insumoId,
        }));
        const ResponsableData = ResponsableResponse.data;
        const ProveedorData = ProveedorResponse.data;

        setData(data);
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
        setProveedor(ProveedorData.map((proveedor) => proveedor.proveedorNombre));
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  const tableHeadCells = [
    { id: 'insumoNombre', numeric: false, disablePadding: true, label: 'Nombre' },
    { id: 'insumoFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'insumoProveedor', numeric: false, disablePadding: false, label: 'Proveedor' },
    { id: 'insumoTipo', numeric: false, disablePadding: false, label: 'Tipo' },
    { id: 'insumoCantidad', numeric: false, disablePadding: false, label: 'Cantidad' },
    { id: 'insumoUnidad', numeric: false, disablePadding: false, label: 'Unidad' },
    { id: 'insumoNroLote', numeric: false, disablePadding: false, label: 'Nro lote' },
    { id: 'insumoMotivoDeRechazo', numeric: false, disablePadding: false, label: 'Motivo de rechazo' },
    { id: 'insumoResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
    { id: 'insumoFechaVencimiento', numeric: false, disablePadding: false, label: 'Fecha vencimiento' },
  ];
 
  const filters = [
    { id: 'nombre', label: 'Nombre', type: 'text' },
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta']},
    { id: 'proveedor', label: 'Proveedor', type: 'select', options: proveedor },
    { id: 'tipo', label: 'Tipo', type: 'select', options: ['Aditivo', 'Otros'] },
    { id: 'cantidad', label: 'Cantidad', type: 'text' },
    { id: 'unidad', label: 'Unidad', type: 'select', options: ['Kg', 'Metros', 'Litros'] },
    { id: 'nroLote', label: 'NroLote', type: 'text' },
    { id: 'motivoDeRechazo', label: 'MotivoDeRechazo', type: 'text' },
    { id: 'resposable', label: 'responsable', type: 'select',options: responsable },
    { id: 'fechaVencimiento', label: 'FechaVencimiento', type: 'date', options: ['desde', 'hasta']},
  ];

  const handleFilter = (filter) => {
    const lowerCaseFilter = Object.keys(filter).reduce((acc, key) => {
      if (filter[key]) {
        if (key === 'fecha') {
          const [desde, hasta] = filter[key].split(' hasta ');
          acc['fecha-desde'] = desde;
          acc['fecha-hasta'] = hasta;
        }
        else if (key === 'fechaVencimiento') {
          const [desdeV, hastaV] = filter[key].split(' hasta ');
          acc['fechaVencimiento-desde'] = desdeV;
          acc['fechaVencimiento-hasta'] = hastaV;
        }  else {
          acc[key] = filter[key].toLowerCase();
        }
      }
      return acc;
    }, {});
    setFiltros(lowerCaseFilter);
  };

  const mapData = (item, key) => {
    if (key === 'insumoFecha') {
      if (item.insumoFecha) {
        const fecha = new Date(item.insumoFecha); // Convertir fecha a objeto Date
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    } else if (key === 'insumoFechaVencimiento') {
      if (item.insumoFechaVencimiento) {
        const fechaV = new Date(item.insumoFechaVencimiento); // Convertir fecha a objeto Date
        return format(fechaV, 'dd/MM/yyyy');
      } else {
        return '';
      }
    }
    else if(key === 'insumoResponsable.usuarioNombre') {
      if (item.insumoResponsable && item.insumoResponsable.usuarioNombre) {
        return item.insumoResponsable.usuarioNombre;
      } else {
        return '';
      }
    }else if(key === 'insumoProveedor.proveedorNombre') {
      if (item.insumoProveedor && item.insumoProveedor.proveedorNombre) {
        return item.insumoProveedor.proveedorNombre;
      } else {
        return '';
      }
    } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      insumoNombre: item.insumoNombre.toLowerCase(),
      insumoFecha: new Date(item.insumoFecha),
      insumoProveedor: item.insumoProveedor.proveedorNombre ? item.insumoProveedor.proveedorNombre.toLowerCase() : '',
      insumoTipo: item.insumoTipo.toLowerCase(),
      insumoCantidad: item.insumoCantidad,
      insumoUnidad: item.insumoUnidad.toLowerCase(),
      insumoNroLote: item.insumoNroLote.toLowerCase(),
      insumoMotivoDeRechazo: item.insumoMotivoDeRechazo.toLowerCase(),
      insumoResponsable: item.insumoResponsable.usuarioNombre ? item.insumoResponsable.usuarioNombre.toLowerCase() : '',
      insumofechaVencimiento: new Date(item.insumofechaVencimiento),
    };

    if (
      (!filtros.nombre || lowerCaseItem.insumoNombreNombre.startsWith(filtros.nombre)) &&
      (!filtros['fecha-desde'] || lowerCaseItem.insumoFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.insumoFecha <= new Date(filtros['fecha-hasta'])) && 
      (!filtros.proveedor || lowerCaseItem.insumoProveedor.startsWith(filtros.proveedor)) && 
      (!filtros.tipo || lowerCaseItem.insumoTipo.startsWith(filtros.tipo)) &&
      (!filtros.cantidad || lowerCaseItem.insumoCantidad.startsWith(filtros.cantidad)) &&
      (!filtros.unidad || lowerCaseItem.insumoUnidad.startsWith(filtros.unidad)) &&
      (!filtros.nroLote || lowerCaseItem.insumoNroLote.startsWith(filtros.nroLote)) &&
      (!filtros.motivoDeRechazo|| lowerCaseItem.insumoMotivoDeRechazo.startsWith(filtros.motivoDeRechazo)) &&
      (!filtros.responsable || lowerCaseItem.insumoResponsable.startsWith(filtros.responsable)) &&
      (!filtros['fechaVencimiento-desde'] || lowerCaseItem.insumoFechaVencimiento >= new Date(filtros['fechaVencimiento-desde'])) &&
      (!filtros['fechaVencimiento-hasta'] || lowerCaseItem.insumoFechaVencimiento <= new Date(filtros['fechaVencimiento-hasta']))      
      ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    insumoProveedor: (proveedor) => proveedor.proveedorNombre,
    insumoResponsable: (responsable) => responsable.usuarioNombre
  };

  const handleEditControl = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-insumo/${id}`);
  }

  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Lista de Insumos</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todos los insumos almacenados en el sistema y puedes simplificar tu busqueda atraves de los filtros.
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
        dataKey="insumo"
        tableHeadCells={tableHeadCells}
        title="Insumos"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditControl}
      />    </div>
  );
}

export default ListarInsumo;
