import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Tooltip, IconButton, makeStyles, createTheme } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import FormularioReutilizanle from '../../../components/Reutilizable/FormularioReutilizable'
import axios from 'axios';

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
}));

const AgregarExpedicionDeProducto = () => {
  const campo = {
    name: 'expedicionDeProductoCantidad', label: 'Cantidad'
  };

  const formFields = [
    { name: 'expedicionDeProductoFecha', label: 'Fecha', type: 'date' },
    { name: 'expedicionDeProductoLote', label: 'Lote', type: 'cantidadMultiple', campo: campo },
    { name: 'expedicionDeProductoCliente', label: 'Cliente', type: 'selector' },
    { name: 'expedicionDeProductoDocumento', label: 'Documento', type: 'number' },
  ];

  const classes = useStyles();
  const [expedicionDeProducto, setExpedicionDeProducto] = useState({});
  const [lotes, setLotes] = useState('');
  const [loteSelect, setLoteSelect] = useState('');
  const [clientes, setClientes] = useState('');
  const [clienteSelect, setClienteSelect] = useState('');

  useEffect(() => {
    const obtenerLotes = () => {
      axios.get('/listar-lotes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          setLotes(response.data);
          setLoteSelect(
            response.data.map((lote) => ({
              value: lote.loteId,
              label: `${lote.loteCodigo} - ${lote.loteCantidad} Kg - ${lote.loteProducto.productoNombre}`,
            }))
          );
        })
        .catch(error => {
          console.error(error);
        });
    };

    const obtenerClientes = () => {
      axios.get('/listar-clientes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          setClientes(response.data);
          setClienteSelect(
            response.data.map((cliente) => ({
              value: cliente.clienteId,
              label: cliente.clienteNombre,
            }))
          );
        })
        .catch(error => {
          console.error(error);
        });
    };

    obtenerLotes();
    obtenerClientes();

  }, []);

  const handleFormSubmit = (formData) => {
    const { cantidad, ...formDataWithoutCantidad } = formData;
    //console.log(expedicionDeProducto);
    const cantidadValue = formData.cantidad;
    //console.log(cantidad);
    console.log(cantidadValue);
    const selectValues = cantidadValue.map(item => item.selectValue);

    const lotesCompletos = lotes.filter(lote => selectValues.includes(lote.loteId.toString()));
    const productosCompletos = lotesCompletos.map(lote => lote.loteProducto);

    console.log(lotesCompletos);
    const resultado = lotesCompletos.map(lote => {
      const cantidaValueEncontrada = cantidadValue.find(cv => cv.selectValue === lote.loteId.toString());
      console.log(cantidaValueEncontrada);
      if (cantidaValueEncontrada) {
        const cantidad = cantidaValueEncontrada.textFieldValue;
        console.log(cantidad);
        if (cantidad > lote.loteCantidad) {
          console.log(lote);
          return `${lote.loteCodigo} - ${lote.loteCantidad} Kg - ${lote.loteProducto.productoNombre} /`;
        }
      }
      return null;
    })

    console.log(resultado);

    const elementoUndefined = resultado.some(elemento => elemento === null);
    console.log(elementoUndefined);
    if (!elementoUndefined) {
      const clienteCompleto = clientes.filter((cliente) => cliente.clienteId.toString() === formDataWithoutCantidad.expedicionDeProductoCliente)[0];
    //console.log(clienteCompleto);

    const listaDetalleCantidaLote = [];
    const lotesCompletosConCantidadRestada = [];
    lotesCompletos.forEach((lote, index) => {
      const cantidadLote = cantidadValue[index].textFieldValue;
      const loteActualizado = {...lote, loteCantidad: lote.loteCantidad - cantidadLote };
      lotesCompletosConCantidadRestada.push(loteActualizado);
      console.log(loteActualizado);
      const detalleCantidadLote = {
        detalleCantidadLoteLote: loteActualizado,
        detalleCantidadLoteCantidadVendida: cantidadLote,
      };
      listaDetalleCantidaLote.push(detalleCantidadLote);
    });

    console.log(lotesCompletos);
    console.log(lotesCompletosConCantidadRestada);

    const updateFormData = {
      ...formDataWithoutCantidad,
      expedicionDeProductoCliente: clienteCompleto,
      expedicionDeProductoProductos: productosCompletos,
      expedicionDeProductoLotes: lotesCompletosConCantidadRestada,
      //expedicionDeProductoUsuario: window.localStorage.getItem('user'),
    }
    //console.log(updateFormData);
    //console.log(listaDetalleCantidaLote);

    const data = {
      expedicionDeProducto: updateFormData,
      listaCantidad: listaDetalleCantidaLote,
    }

    //console.log(data);

    axios.post('/agregar-expedicion-de-producto', data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.status === 201) {
          console.log(response.data);
          console.log("Expedición de producto agregada con éxito!");
        } else {
          console.log("No se logro agregar la expedición de producto");
        }
      })
      .catch(error => {
        console.error(error);
      })
    } else {
      console.log(`El/Los lotes: ${resultado} tienen una cantidad a vender mayor al la que hay del lote`)
    }
  }

  return (
    <Grid>
      <Navbar />
      <Container style={{ marginTop: 30 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid item lg={2} md={2} ></Grid>
            <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
              <Typography component='h1' variant='h4'>Agregar Expedición de Producto</Typography>
              <Tooltip title={
                <Typography fontSize={16}>
                  En esta pagina puedes registrar las localidades, que se asignaran a los proveedores, clientes, etc.
                </Typography>
              }>
                <IconButton>
                  <HelpOutlineIcon fontSize="large" color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item lg={2} md={2}></Grid>
          </Grid>
        </Box>
      </Container>
      <FormularioReutilizanle
        fields={formFields}
        onSubmit={handleFormSubmit}
        selectOptions={{
          expedicionDeProductoLote: loteSelect,
          expedicionDeProductoCliente: clienteSelect,
        }}
      />
    </Grid>
  )
}

export default AgregarExpedicionDeProducto;