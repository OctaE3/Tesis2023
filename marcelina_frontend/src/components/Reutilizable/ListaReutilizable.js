import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
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
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  titleT: {
    flex: '1',
    textAlign: 'center',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
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
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: '1 1 100%',
  },
  button: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, tableHeadCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {tableHeadCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span style={{ display: 'none' }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right">Acciones</TableCell> {/* Nueva columna para botones */}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  tableHeadCells: PropTypes.array.isRequired,
};

function ListaReutilizable({ data, dataKey, tableHeadCells, title, dataMapper, columnRenderers, onEditButton }) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(tableHeadCells[0].id);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const mappedRows = data.map((item) => {
      const row = {Id: item.Id};
      tableHeadCells.forEach((column) => {
        row[column.id] = dataMapper(item, column.id); // Utilizar la función dataMapper para acceder a los datos
      });
      return row;
    });
    setRows(mappedRows);
  }, [data, tableHeadCells, dataMapper]);


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

  const handleButtonClick = (rowData) => {
    
    console.log('Botón clickeado:', rowData);
  };

  const sortedRows = stableSort(rows, getComparator(order, orderBy));

  const handleClick = (event, property) => {
    handleRequestSort(event, property);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar className={classes.toolbar}>
          <Typography className={classes.titleT} variant="h6" id="tableTitle" component="div">
            {title}
          </Typography>
        </Toolbar>
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleClick}
              tableHeadCells={tableHeadCells}
            />
            <TableBody>
        {sortedRows
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (
            <TableRow key={index}>
              {tableHeadCells.map((column) => (
                <TableCell key={column.id} align={column.numeric ? 'right' : 'left'}>
                  {columnRenderers[column.id] ? (
                    columnRenderers[column.id](row[column.id])
                  ) : (
                    row[column.id]
                  )}
                </TableCell>
              ))}
              <TableCell align="right">
                <Button className={classes.button} variant="contained" color="primary" onClick={() => onEditButton(row)}>
                  <EditIcon />
                </Button>
                <Button className={classes.button} variant="contained" color="secondary" onClick={() => handleButtonClick(row)}>
                  <DeleteIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={tableHeadCells.length + 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
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

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

ListaReutilizable.propTypes = {
  data: PropTypes.array.isRequired,
  tableHeadCells: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default ListaReutilizable;
