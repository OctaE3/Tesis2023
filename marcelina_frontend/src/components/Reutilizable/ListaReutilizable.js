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
import AddIcon from '@material-ui/icons/Add';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, useMediaQuery, TextField } from '@material-ui/core';

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
  text: {
    color: 'black',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  paper: {
    width: '95%',
    marginBottom: theme.spacing(2),
    border: '1px solid black',
    marginLeft: '2.5%',
    overflowX: 'auto'
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
  },
  buttonAlta: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
      backgroundColor: 'darkgreen',
    },
  },
  colorExpired: {
    color: 'red',
  },
  colorDelete: {
    color: 'blue',
  },
  sendButton: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: '5%',
  },
  sendButtonList: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: '5%',
  },
  sendButtonListMarg: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: '1%',
  },
  sendButtonMarg: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: '1%',
  },
  sendButtonListSolo: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: '2.5%',
  },
  sendButtonQuery: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
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

function ListaReutilizable({ data, tableHeadCells, title, titleListButton, linkButton, listButton, dataMapper, columnRenderers, onEditButton, onDeleteButton, onAddButton }) {
  const classes = useStyles();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState(tableHeadCells[0].id);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [elementToDelete, setElementToDelete] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [elementToAdd, setElementToAdd] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [cantidadNueva, setCantidadNueva] = useState(0);
  const buttonQuery = useMediaQuery('(max-width:850px)');

  useEffect(() => {
    const mappedRows = data.map((item) => {
      const row = { Id: item.Id };
      tableHeadCells.forEach((column) => {
        row[column.id] = dataMapper(item, column.id);
      });
      if (item.isExpired) {
        row.isExpired = item.isExpired;
      }
      if (item.isDelete) {
        row.isDelete = item.isDelete;
      }
      if (item.icl) {
        row.icl = item.icl;
      }
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

  const sortedRows = stableSort(rows, getComparator(order, orderBy));

  const handleOpenDeleteDialog = (row) => {
    setElementToDelete(row)
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setElementToDelete(null)
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    onDeleteButton(elementToDelete);
    setOpenDeleteDialog(false);
  };

  const handleOpenAddDialog = (row) => {
    setElementToAdd(row)
    if (row.loteCantidad) {
      setCantidad(row.loteCantidad);
    }
    else if (row.carneCantidad) {
      setCantidad(row.carneCantidad);
    }
    else if (row.insumoCantidad) {
      setCantidad(row.insumoCantidad);
    }
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setElementToAdd(null)
    setOpenAddDialog(false);
  };

  const handleAdd = () => {
    const añadir = {
      ...elementToAdd,
      cantidaICL: cantidadNueva,
    }
    onAddButton(añadir);
    setOpenAddDialog(false);
  };

  const handleClick = (event, property) => {
    handleRequestSort(event, property);
  };

  return (
    <div>
      <div>
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="responsive-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="responsive-dialog-title">Confirmación</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" className={classes.text}>
              ¿Estás seguro de que deseas eliminar este elemento?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary" autoFocus>
              No
            </Button>
            <Button onClick={handleDelete} color="primary" autoFocus>
              Sí
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={openAddDialog}
          onClose={handleCloseAddDialog}
          aria-labelledby="responsive-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="responsive-dialog-title">Confirmación</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" className={classes.text}>
              ¿Estás seguro de que deseas agregar de nuevo este elemento?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} color="primary" autoFocus>
              No
            </Button>
            <Button onClick={handleAdd} color="primary" autoFocus>
              Sí
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {linkButton ? (
        <Grid container className={buttonQuery ? classes.sendButtonQuery : ''}>
          <Grid item lg={6} md={6} sm={6} xs={6}>
            <Grid className={!buttonQuery ? classes.sendButton : classes.sendButtonListMarg}>
              <Button type="submit" variant="contained" color="primary" onClick={linkButton}>Añadir Registro</Button>
            </Grid>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={6}>
            <Grid className={!buttonQuery ? classes.sendButtonList : classes.sendButtonMarg}>
              <Button type="submit" variant="contained" color="primary" onClick={listButton}>{titleListButton}</Button>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid className={buttonQuery ? classes.sendButtonQuery : classes.sendButtonListSolo}>
              <Button type="submit" variant="contained" color="primary" onClick={listButton}>{titleListButton}</Button>
            </Grid>
          </Grid>
        </Grid>
      )}
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
                        <TableCell
                          key={column.id}
                          align={column.numeric ? 'right' : 'left'}
                          className={row.isExpired ? classes.colorExpired : row.isDelete ? classes.colorDelete : ''}
                        >
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
                        {row.icl === undefined && (
                          <Button
                            className={onAddButton && row.isDelete ? classes.buttonAlta : classes.button}
                            variant="contained"
                            color={onAddButton && row.isDelete ? '' : "secondary"}
                            onClick={row.isDelete || row.isExpired ? () => handleOpenAddDialog(row) : () => handleOpenDeleteDialog(row)}
                          >
                            {onAddButton && row.isDelete ? <AddIcon /> : <DeleteIcon />}
                          </Button>
                        )}
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
            labelRowsPerPage="Filas por página"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div >
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
