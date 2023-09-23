import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { Grid, Typography, Button, IconButton, Dialog, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
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

function ListarAnualDeInsumosCarnicos() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
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
    title: 'Correcto', body: 'Se elimino el anual de insumos cárnicos con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró eliminar el anual de insumos cárnicos, recargue la pagina.', severity: 'error', type: 'description'
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
      updateErrorAlert('No se logró eliminar el anual de insumos cárnicos, recargue la pagina.')
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
        const localidadResponse = await axios.get('/listar-anual-de-insumos-carnicos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const localidadData = localidadResponse.data;

        setData(localidadData);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
    setDeleteItem(false)
  }, [deleteItem]);


  const mapData = (item, key) => {
    return item[key];
  };

  const tableHeadCells = [
    { id: 'anualDeInsumosCarnicosMes', numeric: false, disablePadding: true, label: 'Mes' },
    { id: 'anualDeInsumosCarnicosAnio', numeric: false, disablePadding: true, label: 'Año' },
    { id: 'anualDeInsumosCarnicosCarneBovinaSH', numeric: false, disablePadding: true, label: 'Bovina SH' },
    { id: 'anualDeInsumosCarnicosCarneBovinaCH', numeric: false, disablePadding: true, label: 'Bovina CH' },
    { id: 'anualDeInsumosCarnicosHigado', numeric: false, disablePadding: true, label: 'Higado' },
    { id: 'anualDeInsumosCarnicosCarnePorcinaSH', numeric: false, disablePadding: true, label: 'Porcina SH' },
    { id: 'anualDeInsumosCarnicosCarnePorcinaCH', numeric: false, disablePadding: true, label: 'Porcina CH' },
    { id: 'anualDeInsumosCarnicosCarnePorcinaGrasa', numeric: false, disablePadding: true, label: 'Porcina grasa' },
    { id: 'anualDeInsumosCarnicosTripasMadejas', numeric: false, disablePadding: true, label: 'Tripas madejas' },
    { id: 'anualDeInsumosCarnicosLitrosSangre', numeric: false, disablePadding: true, label: 'Sangre' },
  ];

  const filters = [
    { id: 'mes', label: 'Mes', type: 'text' },
    { id: 'anio', label: 'Año', type: 'text' },
    { id: 'bovinaSH', label: 'Bovina SH', type: 'text' },
    { id: 'bovinaCH', label: 'Bovina CH', type: 'text' },
    { id: 'higado', label: 'Higado', type: 'text' },
    { id: 'porcinaSH', label: 'Porcina SH', type: 'text' },
    { id: 'porcinaCH', label: 'Porcina CH', type: 'text' },
    { id: 'grasa', label: 'Porcinsa grasa', type: 'text' },
    { id: 'tripas', label: 'Tripas madejas', type: 'text' },
    { id: 'sangre', label: 'Sangre', type: 'text' },
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
      anualDeInsumosCarnicosMes: item.anualDeInsumosCarnicosMes ? item.anualDeInsumosCarnicosMes.toLowerCase() : '',
      anualDeInsumosCarnicosAnio: item.anualDeInsumosCarnicosAnio ? item.anualDeInsumosCarnicosAnio : '',
      anualDeInsumosCarnicosCarneBovinaSH: item.anualDeInsumosCarnicosCarneBovinaSH ? item.anualDeInsumosCarnicosCarneBovinaSH : '',
      anualDeInsumosCarnicosCarneBovinaCH: item.anualDeInsumosCarnicosCarneBovinaCH ? item.anualDeInsumosCarnicosCarneBovinaCH : '',
      anualDeInsumosCarnicosHigado: item.anualDeInsumosCarnicosHigado ? item.anualDeInsumosCarnicosHigado : '',
      anualDeInsumosCarnicosCarnePorcinaSH: item.anualDeInsumosCarnicosCarnePorcinaSH ? item.anualDeInsumosCarnicosCarnePorcinaSH : '',
      anualDeInsumosCarnicosCarnePorcinaCH: item.anualDeInsumosCarnicosCarnePorcinaCH ? item.anualDeInsumosCarnicosCarnePorcinaCH : '',
      anualDeInsumosCarnicosCarnePorcinaGrasa: item.anualDeInsumosCarnicosCarnePorcinaGrasa ? item.anualDeInsumosCarnicosCarnePorcinaGrasa : '',
      anualDeInsumosCarnicosTripasMadejas: item.anualDeInsumosCarnicosTripasMadejas ? item.anualDeInsumosCarnicosTripasMadejas : '',
      anualDeInsumosCarnicosLitrosSangre: item.anualDeInsumosCarnicosLitrosSangre ? item.anualDeInsumosCarnicosLitrosSangre : '',
    };

    if (
      (!filtros.mes || lowerCaseItem.anualDeInsumosCarnicosMes.toString().startsWith(filtros.mes)) &&
      (!filtros.anio || lowerCaseItem.anualDeInsumosCarnicosAnio.toString().startsWith(filtros.anio)) &&
      (!filtros.bovinoSH || lowerCaseItem.anualDeInsumosCarnicosCarneBovinaSH.toString().startsWith(filtros.bovinoSH)) &&
      (!filtros.bovinoCH || lowerCaseItem.anualDeInsumosCarnicosCarneBovinaCH.toString().startsWith(filtros.bovinoCH)) &&
      (!filtros.higado || lowerCaseItem.anualDeInsumosCarnicosHigado.toString().startsWith(filtros.higado)) &&
      (!filtros.porcinaSH || lowerCaseItem.anualDeInsumosCarnicosCarnePorcinaSH.toString().startsWith(filtros.porcinaSH)) &&
      (!filtros.porcinaCH || lowerCaseItem.anualDeInsumosCarnicosCarnePorcinaCH.toString().startsWith(filtros.porcinaCH)) &&
      (!filtros.grasa || lowerCaseItem.anualDeInsumosCarnicosCarnePorcinaGrasa.toString().startsWith(filtros.grasa)) &&
      (!filtros.tripas || lowerCaseItem.anualDeInsumosCarnicosTripasMadejas.toString().startsWith(filtros.tripas)) &&
      (!filtros.sangre || lowerCaseItem.anualDeInsumosCarnicosLitrosSangre.toString().startsWith(filtros.sangre))
    ) {
      return true;
    }
    return false;
  });

  const handleEditAnual = (rowData) => {
    const id = rowData.Id;
    navigate(`/modificar-anual-de-insumos-carnicos/${id}`);
  };

  const handleDeleteAnual = (rowData) => {
    const id = rowData.Id;
    axios.delete(`/borrar-anual-de-insumos-carnicos/${id}`, {
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
          updateErrorAlert('No se logró eliminar el anual de insumos cárnicos, recargue la pagina.')
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
          updateErrorAlert('No se logró eliminar el anual de insumos cárnicos, recargue la pagina.')
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
          <Typography component='h1' variant='h5'>Lista de Anual de Insumos Cárnicos</Typography>
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
                    En esta página se encarga de listar los anuales de insumos cárnicos que fueron registrados.
                  </span>
                  <br />
                  <br />
                  <span style={{ fontWeight: 'bold' }}>
                    Filtros:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleBlue}>Mes</span>: En este campo se puede ingresar el nombre de un mes y se listará los registros con el nombre de ese mes.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Año</span>: En este campo se puede ingresar un año y se listará los registros con ese año.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Bovina SH</span>: En este campo se puede ingresar la cantidad(kg) de carne bovina sin hueso y se listará los registros con esa cantidad.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Bovina CH</span>: En este campo se puede ingresar la cantidad(kg) de carne bovina con hueso y se listará los registros con esa cantidad.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Higado</span>: En este campo se puede ingresar la cantidad(kg) de higado y se listará los registros con esa cantidad.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Porcina SH</span>: En este campo se puede ingresar la cantidad(kg) de carne porcina sin hueso y se listará los registros con esa cantidad.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Porcina CH</span>: En este campo se puede ingresar la cantidad(kg) de carne porcina con hueso y se listará los registros con esa cantidad.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Porcina grasa</span>: En este campo se puede ingresar la cantidad(kg) de grasa porcina y se listará los registros con esa cantidad.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Tripas madejas</span>: En este campo se puede ingresar la cantidad(kg) de tripas y se listará los registros con esa cantidad.
                      </li>
                      <li>
                        <span className={classes.liTitleBlue}>Sangre</span>: En este campo se puede ingresar la cantidad(litros) de sangrew y se listará los registros con esa cantidad..
                      </li>
                    </ul>
                  </span>
                  <span style={{ fontWeight: 'bold' }}>
                    Lista:
                  </span>
                  <span>
                    <ul>
                      <li>
                        <span className={classes.liTitleRed}>Mes</span>: En este campo se muestra el mes en el que se registró el anual de insumos cárnicos.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Año</span>: En este campo se muestra el año en el que se registró el anual de insumos cárnicos.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Bovina SH</span>: En este campo se muestra la cantidad(kg) de carne bovina sin hueso que se recibió en un mes.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Bovina CH</span>: En este campo se muestra la cantidad(kg) de carne bovina con hueso que se recibió en un mes.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Higado</span>: En este campo se muestra la cantidad(kg) de higado que se recibió en un mes.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Porcina SH</span>: En este campo se muestra la cantidad(kg) de carne porcina sin hueso que se recibió en un mes.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Porcina CH</span>: En este campo se muestra la cantidad(kg) de carne porcina con hueso que se recibió en un mes.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Porcina grasa</span>: En este campo se muestra la cantidad(kg) de grasa porcina sin hueso que se recibió en un mes.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Tripas madejas</span>: En este campo se muestra la cantidad(kg) de tripas que se recibió en un mes.
                      </li>
                      <li>
                        <span className={classes.liTitleRed}>Sangre</span>: En este campo se muestra la cantidad(litros) de sangre que se recibió en un mes.
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
        dataKey="listarLocalidades"
        tableHeadCells={tableHeadCells}
        title="Localidades"
        dataMapper={mapData}
        columnRenderers={""}
        onEditButton={handleEditAnual}
        onDeleteButton={handleDeleteAnual}
      />

    </div>
  );
}

export default ListarAnualDeInsumosCarnicos;
