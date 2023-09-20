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

function ListarRecepcionDeMateriasPrimasCarnicas() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [carne, setCarne] = useState([]);
  const [deleteItem, setDeleteItem] = useState(false);
  const navigate = useNavigate();

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);

  const [alertSuccess, setAlertSuccess] = useState({
    title: 'Correcto', body: 'Se elimino la recepción de materias primas carnicas con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar la recepción de materias primas carnicas, recargue la pagina.', severity: 'error', type: 'description'
  });

  const [alertWarning, setAlertWarning] = useState({
    title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-recepcion-de-materias-primas-carnicas', {
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
        const carneResponse = await axios.get('/listar-carnes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });


        const data = response.data.map((recepcionDeMateriasPrimasCarnicas) => ({
          ...recepcionDeMateriasPrimasCarnicas,
          Id: recepcionDeMateriasPrimasCarnicas.recepcionDeMateriasPrimasCarnicas,
        }));
        const ResponsableData = ResponsableResponse.data;
        const ProveedorData = ProveedorResponse.data;
        const CarneData = carneResponse.data;

        setData(data);
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
        setProveedor(ProveedorData.map((proveedor) => proveedor.proveedorNombre));
        setCarne(CarneData.map((carne) => carne.carneNombre));
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, [deleteItem]);

  const tableHeadCells = [
    { id: 'recepcionDeMateriasPrimasCarnicasFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'recepcionDeMateriasPrimasCarnicasProveedor', numeric: false, disablePadding: false, label: 'Proveedor' },
    { id: 'recepcionDeMateriasPrimasCarnicasProductos', numeric: false, disablePadding: false, label: 'Producto' },
    { id: 'recepcionDeMateriasPrimasCarnicasPaseSanitario', numeric: false, disablePadding: false, label: 'Pase Sanitario' },
    { id: 'recepcionDeMateriasPrimasCarnicasTemperatura', numeric: false, disablePadding: false, label: 'Temperatura' },
    { id: 'recepcionDeMateriasPrimasCarnicasMotivoDeRechazo', numeric: false, disablePadding: false, label: 'Motivo de Rechazo' },
    { id: 'recepcionDeMateriasPrimasCarnicasResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
  ];

  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta'] },
    { id: 'proveedor', label: 'Proveedor', type: 'select', options: proveedor },
    { id: 'producto', label: 'Producto', type: 'select', options: carne },
    { id: 'paseSanitario', label: 'Pase Sanitario', type: 'text' },
    { id: 'temperatura', label: 'Temperatura', type: 'text' },
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
    if (key === 'recepcionDeMateriasPrimasCarnicasFecha') {
      if (item.recepcionDeMateriasPrimasCarnicasFecha) {
        const fecha = new Date(item.recepcionDeMateriasPrimasCarnicasFecha); // Convertir fecha a objeto Date
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    }
    else if (key === 'recepcionDeMateriasPrimasCarnicasResponsable.usuarioNombre') {
      if (item.recepcionDeMateriasPrimasCarnicasResponsable && item.recepcionDeMateriasPrimasCarnicasResponsable.usuarioNombre) {
        return item.recepcionDeMateriasPrimasCarnicasResponsable.usuarioNombre;
      } else {
        return '';
      }
    } else if (key === 'recepcionDeMateriasPrimasCarnicasProveedor.proveedorNombre') {
      if (item.recepcionDeMateriasPrimasCarnicasProveedor && item.recepcionDeMateriasPrimasCarnicasProveedor.proveedorNombre) {
        return item.recepcionDeMateriasPrimasCarnicasProveedor.proveedorNombre;
      } else {
        return '';
      }
    } else if (key === 'recepcionDeMateriasPrimasCarnicasProductos') {
      if (item.recepcionDeMateriasPrimasCarnicasProductos && item.recepcionDeMateriasPrimasCarnicasProductos.length > 0) {
        const nombresProductos = item.recepcionDeMateriasPrimasCarnicasProductos.map(producto => producto.carneNombre);
        console.log(nombresProductos)
        return nombresProductos;
      } else {
        return [];
      }
    } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      recepcionDeMateriasPrimasCarnicasFecha: new Date(item.recepcionDeMateriasPrimasCarnicasFecha),
      recepcionDeMateriasPrimasCarnicasProveedor: item.recepcionDeMateriasPrimasCarnicasProveedor.proveedorNombre ? item.recepcionDeMateriasPrimasCarnicasProveedor.proveedorNombre.toLowerCase() : '',
      recepcionDeMateriasPrimasCarnicasProductos: item.recepcionDeMateriasPrimasCarnicasProductos.map(recepcionDeMateriasPrimasCarnicasProductos => recepcionDeMateriasPrimasCarnicasProductos),
      recepcionDeMateriasPrimasCarnicasPaseSanitario: item.recepcionDeMateriasPrimasCarnicasPaseSanitario ? item.recepcionDeMateriasPrimasCarnicasPaseSanitario.toLowerCase() : '',
      recepcionDeMateriasPrimasCarnicasTemperatura: item.recepcionDeMateriasPrimasCarnicasTemperatura,
      recepcionDeMateriasPrimasCarnicasMotivoDeRechazo: item.recepcionDeMateriasPrimasCarnicasMotivoDeRechazo ? item.recepcionDeMateriasPrimasCarnicasMotivoDeRechazo.toLowerCase() : '',
      recepcionDeMateriasPrimasCarnicasResponsable: item.recepcionDeMateriasPrimasCarnicasResponsable.usuarioNombre ? item.recepcionDeMateriasPrimasCarnicasResponsable.usuarioNombre.toLowerCase() : '',
    };

    if (
      (!filtros['fecha-desde'] || lowerCaseItem.recepcionDeMateriasPrimasCarnicasFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.recepcionDeMateriasPrimasCarnicasFecha <= new Date(filtros['fecha-hasta'])) &&
      (!filtros.proveedor || lowerCaseItem.recepcionDeMateriasPrimasCarnicasProveedor.startsWith(filtros.proveedor)) &&
      (!filtros.producto || lowerCaseItem.recepcionDeMateriasPrimasCarnicasProductos.some(producto => producto.carneNombre.toLowerCase().includes(filtros.producto))) &&
      (!filtros.paseSanitario || lowerCaseItem.recepcionDeMateriasPrimasCarnicasPaseSanitario.startsWith(filtros.paseSanitario)) &&
      (!filtros.temperatura || lowerCaseItem.recepcionDeMateriasPrimasCarnicasTemperatura.toString().startsWith(filtros.temperatura)) &&
      (!filtros.motivoDeRechazo || lowerCaseItem.recepcionDeMateriasPrimasCarnicasMotivoDeRechazo.startsWith(filtros.motivoDeRechazo)) &&
      (!filtros.responsable || lowerCaseItem.recepcionDeMateriasPrimasCarnicasResponsable.startsWith(filtros.responsable))
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    recepcionDeMateriasPrimasCarnicasProveedor: (proveedor) => proveedor.proveedorNombre,
    recepcionDeMateriasPrimasCarnicasResponsable: (responsable) => responsable.usuarioNombre,
    recepcionDeMateriasPrimasCarnicasProductos: (products) => <ColumnaReutilizable contacts={products} />,
  };

  const handleEditRecepcion = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-recepcion-de-materias-primas-carnicas/${id}`);
  };

  const handleDeleteRecepcion = (rowData) => {
    const id = rowData.Id;
    axios.delete(`/borrar-recepcion-de-materias-primas-carnicas/${id}`, {
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
          <Typography component='h1' variant='h5'>Lista de Recepcion De Materias Primas Carnicas</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todos las recepciones de materias primas carnicas en el sistema y puedes simplificar tu busqueda atraves de los filtros.
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
        dataKey="listarRecepcionDeMateriasPrimasCarnicas"
        tableHeadCells={tableHeadCells}
        title="Recepcion De Materias Primas Carnicas"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditRecepcion}
        onDeleteButton={handleDeleteRecepcion}
      />    </div>
  );
}

export default ListarRecepcionDeMateriasPrimasCarnicas;
