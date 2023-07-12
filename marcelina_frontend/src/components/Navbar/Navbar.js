import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { alpha, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { createTheme, Typography, ThemeProvider, Avatar, Grid } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link, useLocation } from 'react-router-dom';
import '../Estilos/Estilos.css';
import Logo from "../../assets/images/LogoAzul.png";


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

const Navbar = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
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
                <Avatar alt="La Marcelina" src={Logo} className={classes.logoStyle} />
              </Grid>
              <Grid item lg={11} md={11} sm={11} xs={11}></Grid>
            </Grid>
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
            <ListItem button component={Link} to="/cliente" onClick={handleDrawerClose}>
              <ListItemText primary="Clientes" />
            </ListItem>
            <ListItem button component={Link} to="/carne" onClick={handleDrawerClose}>
              <ListItemText primary="Carne" />
            </ListItem>
            <ListItem button component={Link} to="/insumo" onClick={handleDrawerClose}>
              <ListItemText primary="Insumo" />
            </ListItem>
            <ListItem button component={Link} to="/proveedor" onClick={handleDrawerClose}>
              <ListItemText primary="Proveedor" />
            </ListItem>
          </List>
        </Drawer>
      </div>
    </ThemeProvider>
  );
};

export default Navbar;
