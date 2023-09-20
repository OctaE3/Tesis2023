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

function ListarDiariaDeProduccion() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const [producto, setProducto] = useState([]);
  const [insumo, setInsumo] = useState([]);
  const [carne, setCarne] = useState([]);
  const [deleteItem, setDeleteItem] = useState(false);
  const navigate = useNavigate();

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);

  const [alertSuccess, setAlertSuccess] = useState({
    title: 'Correcto', body: 'Se elimino la diaria de producción con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar la diaria de producción, recargue la pagina.', severity: 'error', type: 'description'
  });

  const [alertWarning, setAlertWarning] = useState({
    title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-diaria-de-produccion', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const InsumoResponse = await axios.get('/listar-aditivos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ProductoResponse = await axios.get('/listar-productos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const carneResponse = await axios.get('/listar-carnes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });


        const data = response.data.map((diaria) => ({
          ...diaria,
          Id: diaria.diariaDeProduccionId,
        }));
        const ResponsableData = ResponsableResponse.data;
        const InsumoData = InsumoResponse.data;
        const ProductoData = ProductoResponse.data;
        const CarneData = carneResponse.data;

        setData(data);
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
        setProducto(ProductoData.map((producto) => producto.productoNombre));
        setCarne(CarneData.map((carne) => `${carne.carneNombre} - ${carne.carneCorte}`));
        setInsumo(InsumoData.map((insumo) => insumo.insumoNombre));
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, [deleteItem]);

  const tableHeadCells = [
    { id: 'diariaDeProduccionProducto', numeric: false, disablePadding: false, label: 'Producto' },
    { id: 'diariaDeProduccionInsumosCarnicos', numeric: false, disablePadding: false, label: 'Insumo carnico - Cantidad utilizada' },
    { id: 'diariaDeProduccionAditivos', numeric: false, disablePadding: false, label: 'Aditivos - Cantidad utilizada' },
    { id: 'diariaDeProduccionCantidadProducida', numeric: false, disablePadding: false, label: 'Cantidad producida (Kg)' },
    { id: 'diariaDeProduccionFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'diariaDeProduccionLote', numeric: false, disablePadding: false, label: 'Lote' },
    { id: 'diariaDeProduccionResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
    { id: 'diariaDeProduccionEnvasado', numeric: false, disablePadding: false, label: 'Envasado' },
    { id: 'diariaDeProduccionFechaVencimiento', numeric: false, disablePadding: false, label: 'Fecha Vencimiento' },
  ];

  const filters = [
    { id: 'producto', label: 'Producto', type: 'select', options: producto },
    { id: 'carne', label: 'Carne', type: 'select', options: carne },
    { id: 'cantidadCarne', label: 'Cantidad Carne', type: 'text' },
    { id: 'insumo', label: 'Insumo', type: 'select', options: insumo },
    { id: 'cantidadInsumo', label: 'Cantidad Insumo', type: 'text' },
    { id: 'cantidadProducida', label: 'Cantidad Producida', type: 'text' },
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta'] },
    { id: 'producto', label: 'Producto', type: 'select', options: carne },
    { id: 'lote', label: 'Lote', type: 'text' },
    { id: 'resposable', label: 'responsable', type: 'select', options: responsable },
    { id: 'envasado', label: 'Envasado', type: 'select', options: ['Si', 'No'] },
    { id: 'fechaVencimiento', label: 'FechaVencimiento', type: 'date', options: ['desde', 'hasta'] },
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
    else if (key === 'diariaDeProduccionResponsable.usuarioNombre') {
      if (item.diariaDeProduccionResponsable && item.diariaDeProduccionResponsable.usuarioNombre) {
        return item.diariaDeProduccionResponsable.usuarioNombre;
      } else {
        return '';
      }
    } else if (key === 'diariaDeProduccionProducto.productoNombre') {
      if (item.diariaDeProduccionProducto && item.diariaDeProduccionProducto.productoNombre) {
        return item.diariaDeProduccionProducto.productoNombre;
      } else {
        return '';
      }
    } else if (key === 'diariaDeProduccionInsumosCarnicos') {
      if (item.diariaDeProduccionInsumosCarnicos && item.diariaDeProduccionInsumosCarnicos.length > 0) {
        const nombresProductos = item.diariaDeProduccionInsumosCarnicos.map(producto => `${producto.carneNombre} - ${producto.carneCorte}`);
        const cantidadProductos = item.diariaDeProduccionCantidadUtilizadaCarnes.map(cantidadproducto => cantidadproducto.detalleCantidadCarneCantidad);
        const cantidadCarne = [[`${nombresProductos} - ${cantidadProductos} Kg`]]
        return cantidadCarne;
      } else {
        return [];
      }
    } else if (key === 'diariaDeProduccionAditivos') {
      if (item.diariaDeProduccionAditivos && item.diariaDeProduccionAditivos.length > 0) {
        const nombresAditivos = item.diariaDeProduccionAditivos.map(aditivo => `${aditivo.insumoNombre} - ${aditivo.insumoUnidad}`);
        const cantidadAditivos = item.diariaDeProduccionCantidadUtilizadaInsumos.map(cantidadinsumo => cantidadinsumo.detalleCantidadInsumoCantidad);
        const cantidadAditivo = [[`${nombresAditivos} - ${cantidadAditivos}`]]
        return cantidadAditivo;
      } else {
        return [];
      }
    } else if (key === 'diariaDeProduccionEnvasado') {
      return item[key] ? 'Si' : 'No';
    } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      diariaDeProduccionProducto: item.diariaDeProduccionProducto,
      diariaDeProduccionInsumosCarnicos: item.diariaDeProduccionInsumosCarnicos.map(diariaDeProduccionInsumosCarnicos => diariaDeProduccionInsumosCarnicos),
      diariaDeProduccionAditivos: item.diariaDeProduccionAditivos.map(diariaDeProduccionAditivos => diariaDeProduccionAditivos),
      diariaDeProduccionCantidadProducida: item.diariaDeProduccionCantidadProducida,
      diariaDeProduccionFecha: new Date(item.diariaDeProduccionFecha),
      diariaDeProduccionLote: item.diariaDeProduccionLote ? item.diariaDeProduccionLote : '',
      diariaDeProduccionResponsable: item.diariaDeProduccionResponsable ? item.diariaDeProduccionResponsable : '',
      diariaDeProduccionFechaVencimiento: new Date(item.diariaDeProduccionFechaVencimiento)
    };

    if (
      (!filtros.producto || lowerCaseItem.diariaDeProduccionProducto.startsWith(filtros.producto)) &&
      (!filtros.carne || lowerCaseItem.diariaDeProduccionInsumosCarnicos.some(carne => carne.carneNombre.toLowerCase().includes(filtros.carne))) &&
      (!filtros.insumo || lowerCaseItem.diariaDeProduccionAditivos.some(insumo => insumo.insumoNombre.toLowerCase().includes(filtros.insumo))) &&
      (!filtros.cantidadProducida || lowerCaseItem.diariaDeProduccionCantidadProducida.toString().startsWith(filtros.cantidadProducida)) &&
      (!filtros['fecha-desde'] || lowerCaseItem.diariaDeProduccionFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.diariaDeProduccionFecha <= new Date(filtros['fecha-hasta'])) &&
      (!filtros.lote || lowerCaseItem.diariaDeProduccionLote.startsWith(filtros.lote)) &&
      (!filtros.responsable || lowerCaseItem.diariaDeProduccionResponsable.startsWith(filtros.responsable)) &&
      (!filtros.envasado || (filtros.envasado === 'Si' && item.diariaDeProduccionEnvasado) || (filtros.envasado === 'No' && !item.diariaDeProduccionEnvasado)) &&
      (!filtros['fecha-desde'] || lowerCaseItem.diariaDeProduccionFechaVencimiento >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.diariaDeProduccionFechaVencimiento <= new Date(filtros['fecha-hasta']))
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    diariaDeProduccionLote: (lote) => lote.loteCodigo,
    diariaDeProduccionResponsable: (responsable) => responsable.usuarioNombre,
    diariaDeProduccionProducto: (producto) => producto.productoNombre,
    diariaDeProduccionInsumosCarnicos: (carnes) => <ColumnaReutilizable contacts={carnes} />,
    diariaDeProduccionAditivos: (aditivos) => <ColumnaReutilizable contacts={aditivos} />,
  };

  const handleEditControl = (rowData) => {
    console.log(rowData);
    const id = rowData.Id;
    navigate(`/modificar-diaria-de-produccion/${id}`);
  };

  const handleDeleteControl = (rowData) => {
    const id = rowData.Id;
    axios.delete(`/borrar-diaria-de-produccion/${id}`, {
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
          <Typography component='h1' variant='h5'>Lista de Diaria De Produccion</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todas las plantillas diarias de produccion en el sistema y puedes simplificar tu busqueda atraves de los filtros.
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
        dataKey="listarDiariaDeProduccion"
        tableHeadCells={tableHeadCells}
        title="Diaria De Produccion"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditControl}
        onDeleteButton={handleDeleteControl}
      />    </div>
  );
}


export default ListarDiariaDeProduccion;
