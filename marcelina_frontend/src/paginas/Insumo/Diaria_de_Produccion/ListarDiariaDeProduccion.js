import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { Grid, Typography, Button, IconButton, Dialog, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
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
  },
  info: {
    marginTop: theme.spacing(1)
  },
  text: {
    color: '#2D2D2D',
  },
  liTitleBlue: {
    color: 'blue',
    fontWeight: 'bold',
  },
  liTitleRed: {
    color: 'red',
    fontWeight: 'bold',
  },
  blinkingButton: {
    animation: '$blink 1s infinite',
  },
  '@keyframes blink': {
    '0%': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    '50%': {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.main,
    },
    '100%': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  },
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

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [blinking, setBlinking] = useState(true);

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
    { id: 'diariaDeProduccionInsumosCarnicos', numeric: false, disablePadding: false, label: 'Insumo cárnico - Cantidad utilizada' },
    { id: 'diariaDeProduccionAditivos', numeric: false, disablePadding: false, label: 'Aditivos - Cantidad utilizada' },
    { id: 'diariaDeProduccionCantidadProducida', numeric: false, disablePadding: false, label: 'Cantidad producida (Kg)' },
    { id: 'diariaDeProduccionFecha', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'diariaDeProduccionLote', numeric: false, disablePadding: false, label: 'Lote' },
    { id: 'diariaDeProduccionResponsable', numeric: false, disablePadding: false, label: 'Responsable' },
    { id: 'diariaDeProduccionEnvasado', numeric: false, disablePadding: false, label: 'Envasado' },
    { id: 'diariaDeProduccionFechaVencimiento', numeric: false, disablePadding: false, label: 'Fecha vencimiento' },
  ];

  const filters = [
    { id: 'producto', label: 'Producto', type: 'select', options: producto },
    { id: 'carne', label: 'Carne', type: 'select', options: carne },
    { id: 'cantidadCarne', label: 'Cantidad carne', type: 'text' },
    { id: 'insumo', label: 'Aditivo', type: 'select', options: insumo },
    { id: 'cantidadInsumo', label: 'Cantidad aditivo', type: 'text' },
    { id: 'cantidadProducida', label: 'Cantidad producida', type: 'text' },
    { id: 'fecha', label: 'Fecha', type: 'date', options: ['desde', 'hasta'] },
    { id: 'lote', label: 'Lote', type: 'text' },
    { id: 'resposable', label: 'Responsable', type: 'select', options: responsable },
    { id: 'envasado', label: 'Envasado', type: 'select', options: ['Si', 'No'] },
    { id: 'fechaVencimiento', label: 'Fecha vencimiento', type: 'date', options: ['desde', 'hasta'] },
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

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking((prevBlinking) => !prevBlinking);
    }, 500);

    setTimeout(() => {
      clearInterval(blinkInterval);
      setBlinking(false);
    }, 5000);

    return () => {
      clearInterval(blinkInterval);
    };
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Lista de Diaria De Producción</Typography>
          <div className={classes.info}>
            <Button color="primary" onClick={handleClickOpen}>
              <IconButton className={blinking ? classes.blinkingButton : ''}>
                <HelpOutlineIcon fontSize="large" color="primary" />
              </IconButton>
            </Button>
            <Dialog
              fullScreen={fullScreen}
              fullWidth='md'
              maxWidth='md'
              open={open}
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">Explicación de la página.</DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.text}>
                  <span>
                    En esta página se encarga de listar las diarias de producción que fueron registrados.
                  </span>
                  <br />
                  <br />
                  <span style={{ fontWeight: 'bold' }}>
                    Filtros:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleBlue}>Producto</span>: En este campo se puede seleccionar el producto por el cual quiere filtrar la lista.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Carne y Cantidad carne</span>: En filtro esta compuesto por 2 campos ANAHSEEEEEEE.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Aditivo y Cantidad aditivo</span>: En filtro esta compuesto por 2 campos ANAHSEEEEEEE.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Cantidad producida</span>: En este campo se puede ingresar la cantidad que se produjo de un producto y filtrar la lista.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Desde Fecha y Hasta Fecha</span>: Estos campos son utilizados para filtrar los registros entre un rango de fechas,
                        todas las fechas de los registros que estén comprendidas entre las 2 fechas ingresadas en los filtros, se mostraran en la lista, mientras que las demás no.
                        También es posible dejar uno de los 2 campos vacío y rellenar el otro, por ejemplo si ingresas una fecha en el campo de Desde Fecha y el Hasta Fecha se deja vacío,
                        se listará todos los registros que su fecha sea posterior a la fecha ingresada en Fecha Desde.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Lote</span>: Anasheeeeeeeeeeeeee.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Responsable</span>: En este campo se puede seleccionar un responsable y mostrar todos los registros asociados a ese responsable.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Envasado</span>: En este campo se puede seleccionar si el producto esta envasado o no y filtar la lista por el envasado.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Desde Fecha vencimeinto y Hasta Fecha vencimeinto</span>: Estos campos funcionan de la misma manera que Desde Fecha y Hasta Fecha, 
                        nada más que se tiene en cuenta la fecha de vencimiento.
                      </li>
                    </ul>
                  </span>
                  <span style={{ fontWeight: 'bold' }}>
                    Lista:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleRed}>Producto</span>: En esta columna se muestra el producto que se produjo.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Insumo cárnico - Cantidad utilizada</span>: En esta columna se muestra las carnes que se utilizaron para realizar el producto y cuanto se utilizó de cada una.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Aditivos - Cantidad utilizada</span>: En esta columna se muestra los aditivos que se utilizaron para realizar el producto y cuanto se utilizó de cada uno.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Cantidad producida(kg)</span>: En esta columna se muestra la cantidad que se produjo del producto.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Fecha</span>: En esta columna se muestra la fecha en el que se registró o realizó el producto.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Lote</span>: En esta columna se muestra el lote al que pertenece el producto producido.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Responsable</span>: En esta columna se muestra el usuario que registró la diaria de producción.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Envasado</span>: En esta columna se muestra si el producto que se produjo esta envasado.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Fecha vencimeinto</span>: En esta columna se muestra la fecha de vencimiento del producto.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Acciones</span>: En esta columna se muestra 2 botones, el botón con icono de un lápiz al presionarlo te llevará a un formulario con los datos del registro,
                        en ese formulario puedes modificar los datos y guardar el registro con los datos modificados, en cambio, el icono con un cubo de basura al presionarlo te mostrara un cartel que te preguntara si quieres eliminar ese registro,
                        si presionas "Si" se eliminara el registro de la lista y en caso de presionar "No" sé cerrera la ventana y el registro permanecerá en la lista.
                      </li>
                    </ul>
                  </span>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus>
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
          </div>
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
        title="Diaria De Producción"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditControl}
        onDeleteButton={handleDeleteControl}
      />    </div>
  );
}


export default ListarDiariaDeProduccion;
