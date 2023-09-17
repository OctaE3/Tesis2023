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

function ListarControlDeProductosQuimicos() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-control-de-productos-quimicos', {
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


        const data = response.data.map((controlDeProductosQuimicos) => ({
            ...controlDeProductosQuimicos,
            Id: controlDeProductosQuimicos.controlDeProductosQuimicosId,
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
    { id: 'controlDeProductosQuimicosFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'controlDeProductosQuimicosProductoQuimico', numeric: false, disablePadding: false, label: 'Nombre' },
    { id: 'controlDeProductosQuimicosProveedor', numeric: false, disablePadding: false, label: 'Proveedor' },
    { id: 'controlDeProductosQuimicosLote', numeric: false, disablePadding: false, label: 'Lote' },
    { id: 'controlDeProductosQuimicosMotivoDeRechazo', numeric: false, disablePadding: false, label: 'Motivo de rechazo' },
    { id: 'controlDeProductosQuimicosResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
  ];
 
  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta']},
    { id: 'nombre', label: 'Nombre', type: 'text' },
    { id: 'proveedor', label: 'Proveedor', type: 'select', options: proveedor },
    { id: 'nroLote', label: 'NroLote', type: 'text' },
    { id: 'motivoDeRechazo', label: 'MotivoDeRechazo', type: 'text' },
    { id: 'resposable', label: 'responsable', type: 'select',options: responsable },
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
    if (key === 'controlDeProductosQuimicosFecha') {
      if (item.controlDeProductosQuimicosFecha) {
        const fecha = new Date(item.controlDeProductosQuimicosFecha); // Convertir fecha a objeto Date
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    } 
    else if(key === 'controlDeProductosQuimicosResponsable.usuarioNombre') {
      if (item.controlDeProductosQuimicosResponsable && item.controlDeProductosQuimicosResponsable.usuarioNombre) {
        return item.controlDeProductosQuimicosResponsable.usuarioNombre;
      } else {
        return '';
      }
    }else if(key === 'controlDeProductosQuimicosProveedor.proveedorNombre') {
      if (item.controlDeProductosQuimicosProveedor && item.controlDeProductosQuimicosProveedor.proveedorNombre) {
        return item.controlDeProductosQuimicosProveedor.proveedorNombre;
      } else {
        return '';
      }
    } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      controlDeProductosQuimicosProductoQuimico: item.controlDeProductosQuimicosProductoQuimico.toLowerCase(),
      controlDeProductosQuimicosFecha: new Date(item.controlDeProductosQuimicosFecha),
      controlDeProductosQuimicosProveedor: item.controlDeProductosQuimicosProveedor.proveedorNombre ? item.controlDeProductosQuimicosProveedor.proveedorNombre.toLowerCase() : '',
      controlDeProductosQuimicosLote: item.controlDeProductosQuimicosLote.toLowerCase(),
      controlDeProductosQuimicosMotivoDeRechazo: item.controlDeProductosQuimicosMotivoDeRechazo.toLowerCase(),
      controlDeProductosQuimicosResponsable: item.controlDeProductosQuimicosResponsable.usuarioNombre ? item.controlDeProductosQuimicosResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros.nombre || lowerCaseItem.controlDeProductosQuimicosProductoQuimico.startsWith(filtros.nombre)) &&
      (!filtros['fecha-desde'] || lowerCaseItem.controlDeProductosQuimicosFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.controlDeProductosQuimicosFecha <= new Date(filtros['fecha-hasta'])) && 
      (!filtros.proveedor || lowerCaseItem.controlDeProductosQuimicosProveedor.startsWith(filtros.proveedor)) && 
      (!filtros.nroLote || lowerCaseItem.controlDeProductosQuimicosLote.startsWith(filtros.nroLote)) &&
      (!filtros.motivoDeRechazo|| lowerCaseItem.controlDeProductosQuimicosMotivoDeRechazo.startsWith(filtros.motivoDeRechazo)) &&
      (!filtros.responsable || lowerCaseItem.controlDeProductosQuimicosResponsable.startsWith(filtros.responsable)) 
      ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    controlDeProductosQuimicosProveedor: (proveedor) => proveedor.proveedorNombre,
    controlDeProductosQuimicosResponsable: (responsable) => responsable.usuarioNombre
  };

  const handleEditCliente = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-control-de-productos-quimicos/${id}`);
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

export default ListarControlDeProductosQuimicos;
