import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { Grid, Typography, Button, IconButton, Dialog, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import ColumnaReutilizable from '../../../components/Reutilizable/ColumnaReutilizable';
import { useNavigate } from 'react-router-dom';

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
  const [data30, setData30] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [buttonName, setButtonName] = useState('Listar Todos');
  const [filtros, setFiltros] = useState({});
  const [localidades, setLocalidades] = useState([]);
  const classes = useStyles();
  const [deleteItem, setDeleteItem] = useState(false);
  const navigate = useNavigate();

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);
  const [checkToken, setCheckToken] = useState(false);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [blinking, setBlinking] = useState(true);

  const [alertSuccess, setAlertSuccess] = useState({
    title: 'Correcto', body: 'Se eliminó el proveedor con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar el proveedor, recargue la página.', severity: 'error', type: 'description'
  });

  const [alertWarning] = useState({
    title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  const updateSuccessAlert = (newBody) => {
    setAlertSuccess((prevAlert) => ({
      ...prevAlert,
      body: newBody,
    }));
  };

  const updateErrorAlert = (newBody) => {
    setAlertError((prevAlert) => ({
      ...prevAlert,
      body: newBody,
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/')
    } else {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));

      const tokenExpiration = payload.exp * 1000;
      const currentTime = Date.now();

      if (tokenExpiration < currentTime) {
        setShowAlertWarning(true);
        setTimeout(() => {
          setShowAlertWarning(false);
          navigate('/')
        }, 2000);
      }
    }
  }, [checkToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-proveedores', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const localidadesResponse = await axios.get('/listar-localidades', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const dataL = response.data.map((proveedor, index) => {
          if (index < 30) {
            if (proveedor.proveedorEliminado === false) {
              return {
                ...proveedor,
                Id: proveedor.proveedorId,
              }
            }
          }
        })
        const dataLast30 = dataL.filter((data) => data !== undefined);
        const data = response.data.map((proveedor) => {
          if (proveedor.proveedorEliminado === true) {
            return {
              ...proveedor,
              Id: proveedor.proveedorId,
              isDelete: 'Yes',
            }
          } else {
            return {
              ...proveedor,
              Id: proveedor.proveedorId,
            }
          }
        })
        const localidadesData = localidadesResponse.data;

        setData(dataLast30);
        setData30(dataLast30)
        setDataAll(data)
        setLocalidades(localidadesData.map((localidad) => localidad.localidadCiudad)); // Obtener solo los nombres de las localidades
        setButtonName('Listar Todos')
        setDeleteItem(false);
      } catch (error) {
        if (error.request.status === 401) {
          setCheckToken(true);
        } else {
          updateErrorAlert('No se logró cargar la lista, recargue la página.')
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 2000);
        }

      }
    };

    fetchData();
  }, [deleteItem]);


  const mapData = (item, key) => {
    if (key === 'proveedorLocalidad.localidadCiudad') {
      if (item.proveedorLocalidad && item.proveedorLocalidad.localidadCiudad) {
        return item.proveedorLocalidad.localidadCiudad;
      } else {
        return '';
      }
    } else if (key === 'proveedorContacto') {
      if (item.proveedorContacto && item.proveedorContacto.length > 0) {
        return item.proveedorContacto;
      } else {
        return [];
      }
    } else {
      return item[key];
    }
  };

  const tableHeadCells = [
    { id: 'Id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'proveedorNombre', numeric: false, disablePadding: false, label: 'Nombre' },
    { id: 'proveedorEmail', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'proveedorContacto', numeric: false, disablePadding: false, label: 'Teléfonos' },
    { id: 'proveedorRUT', numeric: false, disablePadding: false, label: 'RUT' },
    { id: 'proveedorLocalidad.localidadCiudad', numeric: false, disablePadding: false, label: 'Localidad' },
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
      proveedorNombre: item.proveedorNombre ? item.proveedorNombre.toLowerCase() : '',
      proveedorEmail: item.proveedorEmail ? item.proveedorEmail.toLowerCase() : '',
      proveedorContacto: item.proveedorContacto.map(contacto => contacto.toLowerCase()), // Convertir todos los contactos a minúsculas
      proveedorRUT: item.proveedorRUT ? item.proveedorRUT.toLowerCase() : '',
      proveedorLocalidad: item.proveedorLocalidad ? item.proveedorLocalidad.localidadCiudad.toLowerCase() : '',
    };

    if (
      (!filtros.nombre || lowerCaseItem.proveedorNombre === filtros.nombre) &&
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
        if (response.status === 200) {
          setDeleteItem(true);
          updateSuccessAlert('Se eliminó el proveedor con éxito!')
          setShowAlertSuccess(true);
          setTimeout(() => {
            setShowAlertSuccess(false);
          }, 2000);
        } else {
          updateErrorAlert('No se logró eliminar el proveedor, recargue la página.')
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 2000);
        }
      })
      .catch(error => {
        if (error.request.status === 401) {
          setCheckToken(true);
        }
        else if (error.request.status === 500) {
          updateErrorAlert('No se logró eliminar el proveedor, recargue la página.')
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 2000);
        }
      })
  }

  const handleAddProveedor = (rowData) => {
    const id = rowData.Id;
    axios.put(`/añadir-proveedor/${id}`, null, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.status === 200) {
          setDeleteItem(true);
          updateSuccessAlert('Se volvio a añadir el proveedor con éxito!')
          setShowAlertSuccess(true);
          setTimeout(() => {
            setShowAlertSuccess(false);
          }, 2000);
        } else {
          updateErrorAlert('No se logró añadir el proveedor, recargue la página.')
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 2000);
        }
      })
      .catch(error => {
        console.error(error)
        if (error.request.status === 401) {
          setCheckToken(true);
        }
        else if (error.request.status === 500) {
          updateErrorAlert('No se logró añadir el proveedor, recargue la página.')
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 2000);
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

  const redirect = () => {
    navigate('/proveedor')
  }

  const listRefresh = () => {
    if (buttonName === 'Listar Todos') {
      setButtonName('Listar últimos 30')
      setData(dataAll);
    } else {
      setButtonName('Listar Todos')
      setData(data30);
    }
  }


  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Listar de Proveedores</Typography>
          <div className={classes.info}>
            <IconButton className={blinking ? classes.blinkingButton : ''} onClick={handleClickOpen}>
              <HelpOutlineIcon fontSize="large" color="primary" />
            </IconButton>
            <Dialog
              fullScreen={fullScreen}
              fullWidth
              maxWidth='md'
              open={open}
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">Explicación de la página.</DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.text}>
                  <span>
                    En esta página se encarga de listar los proveedores que fueron registrados y también se cuenta con filtros para facilitar la búsqueda de información.
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
                        <span className={classes.liTitleBlue}>Localidad</span>: En este campo se puede seleccionar una localidad y mostrar los proveedores asociados a esa localidad.
                      </li>
                    </ul>
                  </span>
                  <span style={{ fontWeight: 'bold' }}>
                    Lista:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleRed}>Id</span>: En esta columna se muestra el identificador del registro
                      </li>
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
                        <span className={classes.liTitleRed}>Acciones</span>: En esta columna se muestran 2 botones, el botón de modificar es el que contiene un icono de una lapíz y el de eliminar el que tiene un cubo de basura,
                        el botón de modificar al presionarlo te enviará a un formulario con los datos del registro, para poder realizar la modificación. El botón de eliminar al presionarlo desplegará una ventana, que preguntará si
                        desea eliminar el registro, en caso de presionar si, el registro sera eliminado y si presiona no, la ventana se cerrará.
                      </li>
                    </ul>
                  </span>
                  <span>
                    Aclaraciones:
                    <ul>
                      <li>En la lista vienen por defecto listados los últimos 30 registros que se agregaron.</li>
                      <li>El botón llamado Aplicar Filtro al presionarlo, filtrará la lista según los datos ingresados en los campos.</li>
                      <li>El botón llamado Limpiar Filtro al presionarlo, borrará los datos ingresados en los campos y se listarán los últimos 30 registros agregados.</li>
                      <li>El botón denominado Añadir Registro al presionarlo te enviará a un formulario donde puedes agregar un nuevo registro.</li>
                      <li>El botón denominado Listar Todos al presionarlo actualizará la lista y mostrará todos los registros existentes.</li>
                      <li>Cuando se haya presionado el botón de Listar Todos y haya realizado su función, el nombre del botón habrá cambiado por Listar Últimos 30, que al presionarlo listará los últimos 30 registros que fueron agregados.</li>
                      <li>El registro de los proveedores eliminados aparecerá de color azul.</li>
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
        title="Lista de Proveedores"
        titleButton="Proveedor"
        linkButton={redirect}
        listButton={listRefresh}
        titleListButton={buttonName}
        dataMapper={mapData}
        columnRenderers={columnRenderers}
        onEditButton={handleEditProveedor}
        onDeleteButton={handleDeleteProveedor}
        onAddButton={handleAddProveedor}
      />

    </div>
  );
}

export default ListarProveedor;
