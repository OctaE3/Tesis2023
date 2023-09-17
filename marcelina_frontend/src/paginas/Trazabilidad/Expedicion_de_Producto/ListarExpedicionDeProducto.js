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

function ListarExpedicionDeProducto() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();
  const [responsable, setResponsable] = useState([]);
  const [producto, setProducto] = useState([]);
  const [lote, setLote] = useState([]);
  const [cliente, setCliente] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-expedicion-de-productos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ResponsableResponse = await axios.get('/listar-usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const LoteResponse = await axios.get('/listar-lotes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ProductoResponse = await axios.get('/listar-productos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ClienteResponse = await axios.get('/listar-clientes', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          
        const data = response.data.map((recepcionDeMateriasPrimasCarnicas) => ({
            ...recepcionDeMateriasPrimasCarnicas,
            Id: recepcionDeMateriasPrimasCarnicas.recepcionDeMateriasPrimasCarnicas,
        }));
        const ResponsableData = ResponsableResponse.data;
        const LoteData = LoteResponse.data;
        const ProductoData = ProductoResponse.data;
        const ClienteData = ClienteResponse.data;

        setData(data);
        setResponsable(ResponsableData.map((usuario) => usuario.usuarioNombre));
        setProducto(ProductoData.map((producto) => producto.productoNombre));
        setCliente(ClienteData.map((cliente) =>cliente.clienteNombre));
        setLote(LoteData.map((lote) => lote.loteCodigo));
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  const tableHeadCells = [
    { id: 'expedicionDeProductoProductos', numeric: false, disablePadding: false, label: 'Producto - Lotes - Cantidad' },
    { id: 'expedicionDeProductoCliente', numeric: false, disablePadding: false, label: 'Cliente' },
    { id: 'expedicionDeProductoDocumento', numeric: false, disablePadding: false, label: 'Documento' },
    { id: 'expedicionDeProductoUsuario', numeric: false, disablePadding: false, label: 'Responsable' },
    { id: 'expedicionDeProductoFecha', numeric: false, disablePadding: false, label: 'Fecha' },
  ];
 
  const filters = [
    { id: 'producto', label: 'Producto', type: 'select', options: producto },
    { id: 'lote', label: 'Lote', type: 'select', options: lote },
    { id: 'cantidad', label: 'Cantidad', type: 'text' },
    { id: 'cliente', label: 'Cliente', type: 'select', options: cliente },
    { id: 'documento', label: 'Documento', type: 'text' },
    { id: 'resposable', label: 'Responsable', type: 'select',options: responsable },
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta']},
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
    if (key === 'expedicionDeProductoFecha') {
      if (item.expedicionDeProductoFecha) {
        const fecha = new Date(item.expedicionDeProductoFecha); // Convertir fecha a objeto Date
        return format(fecha, 'dd/MM/yyyy');
      } else {
        return '';
      }
    } 
    else if(key === 'expedicionDeProductoUsuario.usuarioNombre') {
      if (item.expedicionDeProductoUsuario && item.expedicionDeProductoUsuario.usuarioNombre) {
        return item.expedicionDeProductoUsuario.usuarioNombre;
      } else {
        return '';
      }
    } else if (key === 'expedicionDeProductoProductos') {
      if (item.expedicionDeProductoProductos && item.expedicionDeProductoProductos.length > 0) {
        const nombresProductos = item.expedicionDeProductoProductos.map(producto => `${producto.productoNombre}`);
        const loteProductos = item.expedicionDeProductoLotes.map(lote => `${lote.loteCodigo}`);
        const cantidadProductos = item.expedicionDeProductoCantidad.map(cantidadproducto => cantidadproducto.detalleCantidadLoteCantidadVendida);
        const cantidad = [[`${nombresProductos} - ${loteProductos} - ${cantidadProductos} Kg`]]
        return cantidad;
      } else {
        return [];
      }
    } else if(key === 'expedicionDeProductoCliente.clienteNombre') {
      if (item.expedicionDeProductoCliente && item.expedicionDeProductoCliente.clienteNombre) {
        return item.expedicionDeProductoCliente.clienteNombre;
      } else {
        return '';
      }
    } else {
      return item[key];
    }
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      expedicionDeProductoProductos: item.expedicionDeProductoProductos.map(expedicionDeProductoProductos => expedicionDeProductoProductos),
      expedicionDeProductoLotes: item.expedicionDeProductoLotes.map(expedicionDeProductoLotes => expedicionDeProductoLotes),
      expedicionDeProductoCliente: item.expedicionDeProductoCliente ? item.expedicionDeProductoCliente : '',
      expedicionDeProductoDocumento: item.expedicionDeProductoDocumento ? item.expedicionDeProductoDocumento : '',
      expedicionDeProductoUsuario: item.expedicionDeProductoUsuario ? item.expedicionDeProductoUsuario : '',
      expedicionDeProductoFecha: new Date(item.expedicionDeProductoFecha)
    };

    if (
      (!filtros.producto || lowerCaseItem.expedicionDeProductoProductos.some(producto => producto.productoNombre.toLowerCase().includes(filtros.producto))) &&
      (!filtros.lote || lowerCaseItem.diariaDeProduccionAditivos.some(lote => lote.loteCodigo.includes(filtros.lote))) &&
      (!filtros.cliente || lowerCaseItem.expedicionDeProductoCliente.startsWith(filtros.cliente)) && 
      (!filtros.documento || lowerCaseItem.expedicionDeProductoDocumento.startsWith(filtros.documento)) && 
      (!filtros.responsable || lowerCaseItem.expedicionDeProductoUsuario.startsWith(filtros.responsable)) &&
      (!filtros['fecha-desde'] || lowerCaseItem.expedicionDeProductoFecha >= new Date(filtros['fecha-desde'])) &&
      (!filtros['fecha-hasta'] || lowerCaseItem.expedicionDeProductoFecha <= new Date(filtros['fecha-hasta']))
      ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    expedicionDeProductoUsuario: (responsable) => responsable.usuarioNombre,
    expedicionDeProductoCliente: (cliente) => cliente.clienteNombre,
    expedicionDeProductoProductos: (prod) => <ColumnaReutilizable contacts={prod} />,
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
      <FiltroReutilizable filters={filters} handleFilter={handleFilter} />
      <ListaReutilizable
        data={filteredData}
        dataKey="listarDiariaDeProduccion"
        tableHeadCells={tableHeadCells}
        title="Diaria De Produccion"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditCliente}
      />    </div>
  );
}


export default ListarExpedicionDeProducto;
