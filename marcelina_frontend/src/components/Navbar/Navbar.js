import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { alpha, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { createTheme, ThemeProvider, Avatar, Grid } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link, useLocation } from 'react-router-dom';
import '../Estilos/Estilos.css';
import Logo from "../../assets/images/LogoAzul.png";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C2C71'
    }
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    textAlign: 'left',
    marginLeft: 10,
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  text: {
    color: 'black',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  logoStyle: {
    width: 90,
    height: 70,
  }
}));

const Navbar = ({notifications}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseSesion = () => {
    window.localStorage.clear();
    navigate('/')
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <div>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="responsive-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="responsive-dialog-title">Confirmación</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description" className={classes.text}>
                ¿Estás seguro de que deseas cerrar sesión?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary" autoFocus>
                No
              </Button>
              <Button onClick={handleCloseSesion} color="primary" autoFocus>
                Sí
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Grid container>
              <Grid item lg={2} md={2} sm={2} xs={2}>
                <Avatar component={Link} to="/inicio" alt="La Marcelina" src={Logo} className={classes.logoStyle} />
              </Grid>
              <Grid item lg={11} md={11} sm={11} xs={11}></Grid>
            </Grid>
            <div>
              <IconButton
                edge="end"
                aria-label="account"
                aria-haspopup="true"
                color="inherit"
                onClick={handleOpenDialog}
              >
                <AccountCircle />
              </IconButton>
            </div>
            {isHomeRoute && (
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder=""
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="temporary"
          anchor="left"
          open={open}
          onClose={handleDrawerClose}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <List>
            <ListItem button component={Link} to="/localidad" onClick={handleDrawerClose}>
              <ListItemText primary="Localidades" />
            </ListItem>
            <ListItem button component={Link} to="/listar-localidad" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Localidades" />
            </ListItem>
            <ListItem button component={Link} to="/cliente" onClick={handleDrawerClose}>
              <ListItemText primary="Clientes" />
            </ListItem>
            <ListItem button component={Link} to="/listar-cliente" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Clientes" />
            </ListItem>
            <ListItem button component={Link} to="/modificar-cliente" onClick={handleDrawerClose}>
              <ListItemText primary="Modificar Clientes" />
            </ListItem>
            <ListItem button component={Link} to="/carne" onClick={handleDrawerClose}>
              <ListItemText primary="Carne" />
            </ListItem>
            <ListItem button component={Link} to="/listar-carne" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Carnes" />
            </ListItem>
            <ListItem button component={Link} to="/insumo" onClick={handleDrawerClose}>
              <ListItemText primary="Insumo" />
            </ListItem>
            <ListItem button component={Link} to="/listar-control-de-insumos" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Insumos" />
            </ListItem>
            <ListItem button component={Link} to="/producto" onClick={handleDrawerClose}>
              <ListItemText primary="Producto" />
            </ListItem>
            <ListItem button component={Link} to="/listar-producto" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Producto" />
            </ListItem>
            <ListItem button component={Link} to="/proveedor" onClick={handleDrawerClose}>
              <ListItemText primary="Proveedor" />
            </ListItem>
            <ListItem button component={Link} to="/listar-proveedor" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Proveedor" />
            </ListItem>
            <ListItem button component={Link} to="/control-de-alarma-luminica-y-sonora-de-cloro" onClick={handleDrawerClose}>
              <ListItemText primary="Control de Alarma Luminica y Sonora de Cloro" />
            </ListItem>
            <ListItem button component={Link} to="/listar-control-de-alarma-luminica-y-sonora-de-cloro" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Control de Alarma Luminica y Sonora de Cloro" />
            </ListItem>
            <ListItem button component={Link} to="/control-de-cloro-libre" onClick={handleDrawerClose}>
              <ListItemText primary="Control de Cloro Libre" />
            </ListItem>
            <ListItem button component={Link} to="/listar-control-de-cloro-libre" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Control de Cloro Libre" />
            </ListItem>
            <ListItem button component={Link} to="/control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias" onClick={handleDrawerClose}>
              <ListItemText primary="Control de Limpieza y Desinfeccion de Depositos de Agua y Cañerias" />
            </ListItem>
            <ListItem button component={Link} to="/listar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Control de Limpieza y Desinfeccion de Depositos de Agua y Cañerias" />
            </ListItem>
            <ListItem button component={Link} to="/control-de-mejoras-en-instalaciones" onClick={handleDrawerClose}>
              <ListItemText primary="Control de Mejoras en Instalaciones" />
            </ListItem>
            <ListItem button component={Link} to="/listar-control-de-mejoras-en-instalaciones" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Control de Mejoras en Instalaciones" />
            </ListItem>
            <ListItem button component={Link} to="/control-de-reposicion-de-cloro" onClick={handleDrawerClose}>
              <ListItemText primary="Control de Reposicion de Cloro" />
            </ListItem>
            <ListItem button component={Link} to="/listar-control-de-reposicion-de-cloro" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Control de Reposicion de Cloro" />
            </ListItem>
            <ListItem button component={Link} to="/control-de-temperatura-de-esterilizadores" onClick={handleDrawerClose}>
              <ListItemText primary="Control de Temperatura de Esterilizadores" />
            </ListItem>
            <ListItem button component={Link} to="/listar-control-de-temperatura-de-esterilizadores" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Control de Temperatura de Esterilizadores" />
            </ListItem>
            <ListItem button component={Link} to="/control-de-temperatura-en-camaras" onClick={handleDrawerClose}>
              <ListItemText primary="Control de Temperatura en Camaras" />
            </ListItem>
            <ListItem button component={Link} to="/listar-control-de-temperatura-en-camaras" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Control de Temperatura en Camaras" />
            </ListItem>
            <ListItem button component={Link} to="/control-de-nitratos" onClick={handleDrawerClose}>
              <ListItemText primary="Control de Nitratos" />
            </ListItem>
            <ListItem button component={Link} to="/listar-control-de-nitratos" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Control de Nitratos" />
            </ListItem>
            <ListItem button component={Link} to="/control-de-nitritos" onClick={handleDrawerClose}>
              <ListItemText primary="Control de Nitritos" />
            </ListItem>
            <ListItem button component={Link} to="/listar-control-de-nitritos" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Control de Nitritos" />
            </ListItem>
            <ListItem button component={Link} to="/expedicion-de-producto" onClick={handleDrawerClose}>
              <ListItemText primary="Expedición de Producto" />
            </ListItem>
            <ListItem button component={Link} to="/listar-expedicion-de-producto" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Expedición de Producto" />
            </ListItem>
            <ListItem button component={Link} to="/control-de-productos-quimicos" onClick={handleDrawerClose}>
              <ListItemText primary="Control de Productos Quimicos" />
            </ListItem>
            <ListItem button component={Link} to="/listar-control-de-productos-quimicos" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Control de Productos Quimicos" />
            </ListItem>
            <ListItem button component={Link} to="/recepcion-de-materias-primas-carnicas" onClick={handleDrawerClose}>
              <ListItemText primary="Recepcion de Materias Primas Carnicas" />
            </ListItem>
            <ListItem button component={Link} to="/listar-recepcion-de-materias-primas-carnicas" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Recepcion de Materias Primas Carnicas" />
            </ListItem>
            <ListItem button component={Link} to="/diaria-de-produccion" onClick={handleDrawerClose}>
              <ListItemText primary="Diaria de Producción" />
            </ListItem>
            <ListItem button component={Link} to="/listar-diaria-de-produccion" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Diaria de Producción" />
            </ListItem>
            <ListItem button component={Link} to="/resumen-de-trazabilidad" onClick={handleDrawerClose}>
              <ListItemText primary="Resumen de Trazabilidad" />
            </ListItem>
            <ListItem button component={Link} to="/listar-resumen-de-trazabilidad" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Resumen de Trazabilidad" />
            </ListItem>
            <ListItem button component={Link} to="/monitoreo-de-ssop-operativo" onClick={handleDrawerClose}>
              <ListItemText primary="Monitoreo de SSOP Operativo" />
            </ListItem>
            <ListItem button component={Link} to="/listar-monitoreo-de-ssop-operativo" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Monitoreo de SSOP Operativo" />
            </ListItem>
            <ListItem button component={Link} to="/monitoreo-de-ssop-pre-operativo" onClick={handleDrawerClose}>
              <ListItemText primary="Monitoreo de SSOP Pre-Operativo" />
            </ListItem>
            <ListItem button component={Link} to="/listar-monitoreo-de-ssop-pre-operativo" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Monitoreo de SSOP Pre-Operativo" />
            </ListItem>
            <ListItem button component={Link} to="/listar-usuarios" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Usuarios" />
            </ListItem>
            <ListItem button component={Link} to="/listar-anual-de-insumos-carnicos" onClick={handleDrawerClose}>
              <ListItemText primary="Ver Anual de insumos carnicos" />
            </ListItem>
          </List>
        </Drawer>
      </div>
    </ThemeProvider>
  );
};

export default Navbar;
