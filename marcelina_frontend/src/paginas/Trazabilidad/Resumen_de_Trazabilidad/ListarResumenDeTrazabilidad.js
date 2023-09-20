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

function ListarResumenDeTrazabilidad() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const [lote, setLotes] = useState([]);
  const [producto, setProducto] = useState([]);
  const [insumo, setInsumo] = useState([]);
  const [carne, setCarne] = useState([]);
  const [cliente, setClientes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-resumen-de-trazabilidad', {
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
          const loteResponse = await axios.get('/listar-lotes', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const clienteResponse = await axios.get('/listar-clientes', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          
        const data = response.data.map((recepcionDeMateriasPrimasCarnicas) => ({
            ...recepcionDeMateriasPrimasCarnicas,
            Id: recepcionDeMateriasPrimasCarnicas.recepcionDeMateriasPrimasCarnicas,
        }));
        const ResponsableData = ResponsableResponse.data;
        const InsumoData = InsumoResponse.data;
        const ProductoData = ProductoResponse.data;
        const CarneData = carneResponse.data;
        const LoteData = loteResponse.data;
        const ClienteData = clienteResponse.data;

        setData(data);
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
        setProducto(ProductoData.map((producto) => producto.productoNombre));
        setCarne(CarneData.map((carne) => `${carne.carneNombre} - ${carne.carneCorte}`));
        setInsumo(InsumoData.map((insumo) => insumo.insumoNombre));
        setLotes(LoteData.map((lote) => lote.loteCodigo));
        setClientes(ClienteData.map((cliente) => cliente.clienteNombre));
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  const tableHeadCells = [
    { id: 'resumenDeTrazabilidadFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'resumenDeTrazabilidadLote', numeric: false, disablePadding: false, label: 'Lote' },
    { id: 'resumenDeTrazabilidadProducto', numeric: false, disablePadding: false, label: 'Producto' },
    { id: 'resumenDeTrazabilidadCantidadProducida', numeric: false, disablePadding: false, label: 'Cantidad producida (Kg)' },
    { id: 'resumenDeTrazabilidadMatPrimaCarnica', numeric: false, disablePadding: false, label: 'Materia prima carnica' },
    { id: 'resumenDeTrazabilidadMatPrimaNoCarnica', numeric: false, disablePadding: false, label: 'Materia prima no carnica' },
    { id: 'resumenDeTrazabilidadDestino', numeric: false, disablePadding: false, label: 'Destino' },
    { id: 'resumenDeTrazabilidadResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
  ];
 
  const filters = [
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta']},
    { id: 'lote', label: 'Lote', type: 'select', options: lote },
    { id: 'producto', label: 'Producto', type: 'select', options: producto },
    { id: 'cantidad', label: 'Cantidad producida', type: 'text' },
    { id: 'carne', label: 'Materia prima cárnica', type: 'select', options: carne },
    { id: 'adtivo', label: 'Materia prima no cárnica',type: 'select', options: insumo },
    { id: 'cliente', label: 'Cliente', type: 'select', options: cliente },
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
    if (key === 'resumenDeTrazabilidadFecha') {
      if (item.resumenDeTrazabilidadFecha) {
        const fecha = new Date(item.resumenDeTrazabilidadFecha); // Convertir fecha a objeto Date
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    } 
    else if(key === 'resumenDeTrazabilidadResponsable.usuarioNombre') {
      if (item.resumenDeTrazabilidadResponsable && item.resumenDeTrazabilidadResponsable.usuarioNombre) {
        return item.resumenDeTrazabilidadResponsable.usuarioNombre;
      } else {
        return '';
      }
    }else if(key === 'resumenDeTrazabilidadProducto.productoNombre') {
      if (item.resumenDeTrazabilidadProducto && item.resumenDeTrazabilidadProducto.productoNombre) {
        return item.resumenDeTrazabilidadProducto.productoNombre;
      } else {
        return '';
      }
    }else if(key === 'resumenDeTrazabilidadLote.loteCodigo') {
        if (item.resumenDeTrazabilidadLote && item.resumenDeTrazabilidadLote.loteCodigo) {
          return item.resumenDeTrazabilidadLote.loteCodigo;
        } else {
          return '';
        }
      }else if (key === 'resumenDeTrazabilidadMatPrimaCarnica') {
        if (item.resumenDeTrazabilidadMatPrimaCarnica && item.resumenDeTrazabilidadMatPrimaCarnica.length > 0) {
          const carnes = item.resumenDeTrazabilidadMatPrimaCarnica.map(producto => `${producto.carneNombre} - ${producto.carneCorte}`);
          return carnes;
        } else {
          return [];
        }
      }else if(key === 'resumenDeTrazabilidadMatPrimaNoCarnica') {
        if (item.resumenDeTrazabilidadMatPrimaNoCarnica && item.resumenDeTrazabilidadMatPrimaNoCarnica.length > 0) {
            const insumo = item.resumenDeTrazabilidadMatPrimaNoCarnica.map(insumo => insumo.insumoNombre);
            return insumo;
          } else {
            return [];
          }
      }else if(key === 'resumenDeTrazabilidadDestino') {
        if (item.resumenDeTrazabilidadDestino && item.resumenDeTrazabilidadDestino.length > 0) {
            const cliente = item.resumenDeTrazabilidadDestino.map(cliente => cliente.clienteNombre);
            return cliente;
          } else {
            return [];
          }
      } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      resumenDeTrazabilidadFecha: new Date(item.resumenDeTrazabilidadFecha),
      resumenDeTrazabilidadLote: item.resumenDeTrazabilidadLote ? item.resumenDeTrazabilidadLote : '',
      resumenDeTrazabilidadProducto: item.resumenDeTrazabilidadProducto ? item.resumenDeTrazabilidadProducto : '',
      resumenDeTrazabilidadCantidadProducida: item.resumenDeTrazabilidadCantidadProducida ? item.resumenDeTrazabilidadCantidadProducida : '',
      resumenDeTrazabilidadMatPrimaCarnica: item.resumenDeTrazabilidadMatPrimaCarnica.map(resumenDeTrazabilidadMatPrimaCarnica => resumenDeTrazabilidadMatPrimaCarnica),
      resumenDeTrazabilidadMatPrimaNoCarnica: item.resumenDeTrazabilidadMatPrimaNoCarnica.map(resumenDeTrazabilidadMatPrimaNoCarnica => resumenDeTrazabilidadMatPrimaNoCarnica),
      resumenDeTrazabilidadDestino: item.resumenDeTrazabilidadDestino.map(resumenDeTrazabilidadDestino => resumenDeTrazabilidadDestino),
      resumenDeTrazabilidadResponsable: item.resumenDeTrazabilidadResponsable ? item.resumenDeTrazabilidadResponsable : '',
    };

    if (
      (!filtros['fecha-desde'] || lowerCaseItem.resumenDeTrazabilidadFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.resumenDeTrazabilidadFecha <= new Date(filtros['fecha-hasta'])) && 
      (!filtros.lote || lowerCaseItem.resumenDeTrazabilidadLote.startsWith(filtros.lote)) && 
      (!filtros.producto || lowerCaseItem.resumenDeTrazabilidadProducto.startsWith(filtros.producto)) && 
      (!filtros.cantidad || lowerCaseItem.resumenDeTrazabilidadCantidadProducida.toString().startsWith(filtros.cantidad)) && 
      (!filtros.carne || lowerCaseItem.resumenDeTrazabilidadMatPrimaCarnica.some(carne => carne.carneNombre.toLowerCase().includes(filtros.carne))) &&
      (!filtros.aditivo || lowerCaseItem.resumenDeTrazabilidadMatPrimaNoCarnica.some(aditivo => aditivo.insumoNombre.toLowerCase().includes(filtros.aditivo))) &&
      (!filtros.cliente || lowerCaseItem.resumenDeTrazabilidadDestino.some(cliente => cliente.clienteNombre.toLowerCase().includes(filtros.cliente))) &&
      (!filtros.responsable || lowerCaseItem.resumenDeTrazabilidadResponsable.startsWith(filtros.responsable))
      ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    resumenDeTrazabilidadLote: (lote) => lote.loteCodigo,
    resumenDeTrazabilidadProducto: (producto) => producto.productoNombre,
    resumenDeTrazabilidadMatPrimaCarnica: (carnes) => <ColumnaReutilizable contacts={carnes} />,
    resumenDeTrazabilidadMatPrimaNoCarnica: (aditivo) => <ColumnaReutilizable contacts={aditivo} />,
    resumenDeTrazabilidadDestino: (cliente) => <ColumnaReutilizable contacts={cliente} />,
    resumenDeTrazabilidadResponsable: (usuario) => usuario.usuarioNombre,
  };

  const handleEditCliente = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-diaria-de-produccion/${id}`);
  };

  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Lista de Resumen De Trazabilidad</Typography>
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
      <FiltroReutilizable filters={filters} handleFilter={handleFilter} />
      <ListaReutilizable
        data={filteredData}
        dataKey="listarResumenDeTrazabilidad"
        tableHeadCells={tableHeadCells}
        title="Resumen De Trazabilidad"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditCliente}
      />    </div>
  );
}


export default ListarResumenDeTrazabilidad;
