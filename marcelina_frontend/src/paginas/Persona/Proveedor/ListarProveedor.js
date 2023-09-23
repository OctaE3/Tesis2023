import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { Grid, Typography, Button, IconButton, Dialog, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import ColumnaReutilizable from '../../../components/Reutilizable/ColumnaReutilizable';
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

function ListarProveedor() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [localidades, setLocalidades] = useState([]);
  const classes = useStyles();
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
    title: 'Correcto', body: 'Se elimino el proveedor con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar el proveedor, recargue la pagina.', severity: 'error', type: 'description'
  });

  const [alertWarning, setAlertWarning] = useState({
    title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  const updateErrorAlert = (newBody) => {
    setAlertError((prevAlert) => ({
      ...prevAlert,
      body: newBody,
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      updateErrorAlert('El token no existe, inicie sesión nuevamente.')
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
        navigate('/')
      }, 5000);
    } else {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      console.log(payload)

      const tokenExpiration = payload.exp * 1000;
      console.log(tokenExpiration)
      const currentTime = Date.now();
      console.log(currentTime)

      if (tokenExpiration < currentTime) {
        setShowAlertWarning(true);
        setTimeout(() => {
          setShowAlertWarning(false);
          navigate('/')
        }, 3000);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Response = await axios.get('/listar-proveedores', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const localidadesResponse = await axios.get('/listar-localidades', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const Data = Response.data.map((proveedor) => ({
          ...proveedor,
          Id: proveedor.proveedorId,
        }))
        const localidadesData = localidadesResponse.data;

        setData(Data);
        setLocalidades(localidadesData.map((localidad) => localidad.localidadDepartamento)); // Obtener solo los nombres de las localidades
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, [deleteItem]);


  const mapData = (item, key) => {
    if (key === 'proveedorLocalidad.localidadDepartamento') {
      if (item.proveedorLocalidad && item.proveedorLocalidad.localidadDepartamento) {
        return item.proveedorLocalidad.localidadDepartamento;
      } else {
        return '';
      }
    } else if (key === 'proveedorContacto') {
      if (item.proveedorContacto && item.proveedorContacto.length > 0) {
        console.log(item.proveedorContacto)
        return item.proveedorContacto;
      } else {
        return [];
      }
    } else {
      return item[key];
    }
  };

  const tableHeadCells = [
    { id: 'proveedorNombre', numeric: false, disablePadding: true, label: 'Nombre' },
    { id: 'proveedorEmail', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'proveedorContacto', numeric: false, disablePadding: false, label: 'Teléfonos' },
    { id: 'proveedorRUT', numeric: false, disablePadding: false, label: 'RUT' },
    { id: 'proveedorLocalidad.localidadDepartamento', numeric: false, disablePadding: false, label: 'Localidad' },
  ];

  const filters = [
    { id: 'nombre', label: 'Nombre', type: 'text' },
    { id: 'email', label: 'Email', type: 'text' },
    { id: 'telefono', label: 'Teléfono', type: 'text' },
    { id: 'RUT', label: 'RUT', type: 'text' },
    { id: 'localidad', label: 'Localidad', type: 'select', options: localidades },
  ];

  const handleFilter = (filter) => {
    const lowerCaseFilter = Object.keys(filter).reduce((acc, key) => {
      acc[key] = filter[key] ? filter[key].toLowerCase() : '';
      return acc;
    }, {});
    setFiltros(lowerCaseFilter);
  };

  const filteredData = data.filter((item) => {
    const lowerCaseItem = {
      proveedorNombre: item.proveedorNombre.toLowerCase(),
      proveedorEmail: item.proveedorEmail ? item.proveedorEmail.toLowerCase() : '',
      proveedorContacto: item.proveedorContacto.map(contacto => contacto.toLowerCase()), // Convertir todos los contactos a minúsculas
      proveedorRUT: item.proveedorRUT.toLowerCase(),
      proveedorLocalidad: item.proveedorLocalidad ? item.proveedorLocalidad.localidadDepartamento.toLowerCase() : '',
    };

    if (
      (!filtros.nombre || lowerCaseItem.proveedorNombre.startsWith(filtros.nombre)) &&
      (!filtros.email || lowerCaseItem.proveedorEmail.startsWith(filtros.email)) &&
      (!filtros.telefono || lowerCaseItem.proveedorContacto.some(contacto => contacto.startsWith(filtros.telefono))) &&
      (!filtros.RUT || lowerCaseItem.proveedorRUT.startsWith(filtros.RUT)) &&
      (!filtros.localidad || lowerCaseItem.proveedorLocalidad.startsWith(filtros.localidad))
    ) {
      return true;
    }
    return false;
  });

  const columnRenderers = {
    proveedorContacto: (contacts) => <ColumnaReutilizable contacts={contacts} />,
  };

  const handleEditProveedor = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-proveedor/${id}`);
  };

  const handleDeleteProveedor = (rowData) => {
    const id = rowData.Id;
    axios.put(`/borrar-proveedor/${id}`, null, {
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
          updateErrorAlert('No se logró eliminar el proveedor, recargue la pagina.')
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
          updateErrorAlert('No se logró eliminar el proveedor, recargue la pagina.')
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
          <Typography component='h1' variant='h5'>Lista de Proveedores</Typography>
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
                    En esta página se encarga de listar los proveedores que fueron registrados.
                  </span>
                  <br />
                  <br />
                  <span style={{ fontWeight: 'bold' }}>
                    Filtros:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleBlue}>Nombre</span>: En este campo se puede ingresar un nombre por el cual se quiere filtrar la lista.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Email</span>: En este campo se puede ingresar un email por el cual se quiere filtrar la lista.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Teléfono</span>: En este campo se puede ingresar un teléfono por el cual se quiere filtrar la lista.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>RUT</span>: En este campo se puede ingresar un código RUT y se mostrará el proveedor con ese código.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Localidad</span>: En este campo se puede seleccionar una localidad y mostrar los clientes asociados a esa localidad.
                      </li>
                    </ul>
                  </span>
                  <span style={{ fontWeight: 'bold' }}>
                    Lista:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleRed}>Nombre</span>: En esta columna se muestra el nombre del proveedor o de su empresa.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Email</span>: En esta columna se muestra el mail del proveedor.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Teléfonos</span>: En esta columna se muestran los teléfonos del proveedor.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>RUT</span>: En esta columna se muestra el código RUT que identifica al proveedor.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Localidad</span>: En esta columna se muestra la localidad a la que pertenece la empresa o el proveedor.
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
        dataKey="proveedor"
        tableHeadCells={tableHeadCells}
        title="Proveedores"
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditProveedor}
        onDeleteButton={handleDeleteProveedor}
      />

    </div>
  );
}

export default ListarProveedor;
