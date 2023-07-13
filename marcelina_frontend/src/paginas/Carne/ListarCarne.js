import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';

function createData(carneNombre, carneTipo, carneCorte, carneCantidad, carnePaseSanitario) {
  return { carneNombre, carneTipo, carneCorte, carneCantidad, carnePaseSanitario };
}

const headCells = [
  { id: 'carneNombre', numeric: false, disablePadding: true, label: 'Nombre' },
  { id: 'carneTipo', numeric: false, disablePadding: false, label: 'Tipo' },
  { id: 'carneCorte', numeric: false, disablePadding: false, label: 'Corte' },
  { id: 'carneCantidad', numeric: true, disablePadding: false, label: 'Cantidad' },
  { id: 'carnePaseSanitario', numeric: false, disablePadding: false, label: 'Pase sanitario' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = () => {
  const classes = useToolbarStyles();

  return (
    <Toolbar className={classes.root}>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Carnes
      </Typography>
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '95%',
    marginBottom: theme.spacing(2),
    border: '2px solid black', // Borde negro de 2px
    margin: '5% auto', // Margen del 5% y centrado horizontal
  },
  table: {
    minWidth: 750,
  },
  tableContainer: {
    padding: '5px', // Margen interno de 2px
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function ListarCarne() {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('carneNombre');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/listar-carnes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data; // Asumiendo que la respuesta de la API es un arreglo de objetos con los datos

        // Mapea los datos obtenidos y crea las filas para la tabla
        const rows = data.map((item) =>
          createData(
            item.carneNombre,
            item.carneTipo,
            item.carneCorte,
            item.carneCantidad,
            item.carnePaseSanitario
          )
        );

        // Asigna las filas a la variable rows en el estado del componente
        setRows(rows);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Navbar />
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <div className={classes.tableContainer}>
          <TableContainer>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row.name}
                      >
                        <TableCell component="th" scope="row" padding="none">
                          {row.carneNombre}
                        </TableCell>
                        <TableCell align="left">{row.carneTipo}</TableCell>
                        <TableCell align="left">{row.carneCorte}</TableCell>
                        <TableCell align="left">{row.carneCantidad}</TableCell>
                        <TableCell align="left">{row.carnePaseSanitario}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
