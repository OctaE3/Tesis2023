import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import { Grid, Typography, Tooltip, IconButton, createStyles, makeStyles, createTheme } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';


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

function ListarAnualDeInsumosCarnicos() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const classes = useStyles();

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
  }, []);


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
    { id: 'anualDeInsumosCarnicosCarnePorcinaGrasa', numeric: false, disablePadding: true, label: 'Porcina Grasa' },
    { id: 'anualDeInsumosCarnicosTripasMadejas', numeric: false, disablePadding: true, label: 'Tripas Madejas' },
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
    { id: 'tripas', label: 'Tripas madeja', type: 'text' },
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
      anualDeInsumosCarnicosAnio: item.anualDeInsumosCarnicosAnio ? item.anualDeInsumosCarnicosAnio: '',
      anualDeInsumosCarnicosCarneBovinaSH: item.anualDeInsumosCarnicosCarneBovinaSH ? item.anualDeInsumosCarnicosCarneBovinaSH: '',
      anualDeInsumosCarnicosCarneBovinaCH: item.anualDeInsumosCarnicosCarneBovinaCH ? item.anualDeInsumosCarnicosCarneBovinaCH: '',
      anualDeInsumosCarnicosHigado: item.anualDeInsumosCarnicosHigado ? item.anualDeInsumosCarnicosHigado: '',
      anualDeInsumosCarnicosCarnePorcinaSH: item.anualDeInsumosCarnicosCarnePorcinaSH ? item.anualDeInsumosCarnicosCarnePorcinaSH: '',
      anualDeInsumosCarnicosCarnePorcinaCH: item.anualDeInsumosCarnicosCarnePorcinaCH ? item.anualDeInsumosCarnicosCarnePorcinaCH: '',
      anualDeInsumosCarnicosCarnePorcinaGrasa: item.anualDeInsumosCarnicosCarnePorcinaGrasa ? item.anualDeInsumosCarnicosCarnePorcinaGrasa: '',
      anualDeInsumosCarnicosTripasMadejas: item.anualDeInsumosCarnicosTripasMadejas ? item.anualDeInsumosCarnicosTripasMadejas: '',
      anualDeInsumosCarnicosLitrosSangre: item.anualDeInsumosCarnicosLitrosSangre ? item.anualDeInsumosCarnicosLitrosSangre: '',
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

  return (
    <div>
      <Navbar />
      <Grid container justifyContent='center' alignContent='center' className={classes.container} >
        <Grid item lg={2} md={2}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
          <Typography component='h1' variant='h5'>Lista de Localidades</Typography>
          <Tooltip title={
            <Typography fontSize={16}>
              En esta pagina puedes comprobar todas las localidades registradas en el sistema y puedes simplificar tu busqueda atraves de los filtros.
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
        dataKey="listarLocalidades"
        tableHeadCells={tableHeadCells}
        title="Localidades"
        dataMapper={mapData}
        columnRenderers={""}
      />

    </div>
  );
}

export default ListarAnualDeInsumosCarnicos;
