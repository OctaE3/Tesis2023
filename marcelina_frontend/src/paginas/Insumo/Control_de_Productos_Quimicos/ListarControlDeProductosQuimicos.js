import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
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
  const [deleteItem, setDeleteItem] = useState(false);
  const navigate = useNavigate();

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);

  const [alertSuccess, setAlertSuccess] = useState({
    title: 'Correcto', body: 'Se elimino el control de productos químicos con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar el control de productos químicos, recargue la pagina.', severity: 'error', type: 'description'
  });

  const [alertWarning, setAlertWarning] = useState({
    title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

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
  }, [deleteItem]);

  const tableHeadCells = [
    { id: 'controlDeProductosQuimicosFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'controlDeProductosQuimicosProductoQuimico', numeric: false, disablePadding: false, label: 'Nombre' },
    { id: 'controlDeProductosQuimicosProveedor', numeric: false, disablePadding: false, label: 'Proveedor' },
    { id: 'controlDeProductosQuimicosLote', numeric: false, disablePadding: false, label: 'Lote' },
    { id: 'controlDeProductosQuimicosMotivoDeRechazo', numeric: false, disablePadding: false, label: 'Motivo de rechazo' },
    { id: 'controlDeProductosQuimicosResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
  ];

  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta'] },
    { id: 'nombre', label: 'Nombre', type: 'text' },
    { id: 'proveedor', label: 'Proveedor', type: 'select', options: proveedor },
    { id: 'nroLote', label: 'NroLote', type: 'text' },
    { id: 'motivoDeRechazo', label: 'MotivoDeRechazo', type: 'text' },
    { id: 'resposable', label: 'responsable', type: 'select', options: responsable },
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
    else if (key === 'controlDeProductosQuimicosResponsable.usuarioNombre') {
      if (item.controlDeProductosQuimicosResponsable && item.controlDeProductosQuimicosResponsable.usuarioNombre) {
        return item.controlDeProductosQuimicosResponsable.usuarioNombre;
      } else {
        return '';
      }
    } else if (key === 'controlDeProductosQuimicosProveedor.proveedorNombre') {
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
      controlDeProductosQuimicosMotivoDeRechazo: item.controlDeProductosQuimicosMotivoDeRechazo ? item.controlDeProductosQuimicosMotivoDeRechazo.toLowerCase() : '',
      controlDeProductosQuimicosResponsable: item.controlDeProductosQuimicosResponsable.usuarioNombre ? item.controlDeProductosQuimicosResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros.nombre || lowerCaseItem.controlDeProductosQuimicosProductoQuimico.startsWith(filtros.nombre)) &&
      (!filtros['fecha-desde'] || lowerCaseItem.controlDeProductosQuimicosFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.controlDeProductosQuimicosFecha <= new Date(filtros['fecha-hasta'])) &&
      (!filtros.proveedor || lowerCaseItem.controlDeProductosQuimicosProveedor.startsWith(filtros.proveedor)) &&
      (!filtros.nroLote || lowerCaseItem.controlDeProductosQuimicosLote.startsWith(filtros.nroLote)) &&
      (!filtros.motivoDeRechazo || lowerCaseItem.controlDeProductosQuimicosMotivoDeRechazo.startsWith(filtros.motivoDeRechazo)) &&
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

  const handleEditControl = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-control-de-productos-quimicos/${id}`);
  };

  const handleDeleteControl = (rowData) => {
    const id = rowData.Id;
    axios.delete(`/borrar-control-de-productos-quimicos/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.status === 204) {
          setShowAlertSuccess(true);
          setTimeout(() => {
            setShowAlertSuccess(false);
          }, 5000);
          setDeleteItem(true);
        } else {
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 5000);
        }
      })
      .catch(error => {
        if (error.request.status === 401) {
          setShowAlertWarning(true);
          setTimeout(() => {
            setShowAlertWarning(false);
          }, 5000);
        }
        else if (error.request.status === 500) {
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 5000);
        }
      })
  }

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
      <Grid container spacing={0}>
        <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
        <Grid item lg={4} md={4} sm={4} xs={4}>
          <AlertasReutilizable alert={alertSuccess} isVisible={showAlertSuccess} />
          <AlertasReutilizable alert={alertError} isVisible={showAlertError} />
          <AlertasReutilizable alert={alertWarning} isVisible={showAlertWarning} />
        </Grid>
        <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
      </Grid>
      <FiltroReutilizable filters={filters} handleFilter={handleFilter} />
      <ListaReutilizable
        data={filteredData}
        dataKey="listarProductoQuimicos"
        tableHeadCells={tableHeadCells}
        title="Productos Quimicos"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditControl}
        onDeleteButton={handleDeleteControl}
      />    </div>
  );
}

export default ListarControlDeProductosQuimicos;
