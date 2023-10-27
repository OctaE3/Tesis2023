import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { alpha, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { createTheme, ThemeProvider, Avatar, Grid, ListSubheader } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link, useLocation } from 'react-router-dom';
import '../Estilos/Estilos.css';
import Logo from "../../assets/images/LogoAzul.png";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


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
    width: 280,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 280,
  },
  logoStyle: {
    width: 90,
    height: 70,
  },
  titleSide: {
    display: 'flex',
    alignItems: 'center',
    lineHeight: 'normal'
  },
  secondSections: {
    marginLeft: 10,
  },
  primarySections: {
    fontSize: 18
  }
}));

const Navbar = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const [section1Open, setSection1Open] = useState(false);
  const handleSection1Toggle = () => {
    setSection1Open(!section1Open);
  };
  const [section2Open, setSection2Open] = useState(false);
  const handleSection2Toggle = () => {
    setSection2Open(!section2Open);
  };
  const [section3Open, setSection3Open] = useState(false);
  const handleSection3Toggle = () => {
    setSection3Open(!section3Open);
  };

  const [section4Open, setSection4Open] = useState(false);
  const handleSection4Toggle = () => {
    setSection4Open(!section4Open);
  };

  const [section5Open, setSection5Open] = useState(false);
  const handleSection5Toggle = () => {
    setSection5Open(!section5Open);
  };
  const [section6Open, setSection6Open] = useState(false);
  const handleSection6Toggle = () => {
    setSection6Open(!section6Open);
  };
  const [section7Open, setSection7Open] = useState(false);
  const handleSection7Toggle = () => {
    setSection7Open(!section7Open);
  };
  const [section8Open, setSection8Open] = useState(false);
  const handleSection8Toggle = () => {
    setSection8Open(!section8Open);
  };
  const [section9Open, setSection9Open] = useState(false);
  const handleSection9Toggle = () => {
    setSection9Open(!section9Open);
  };
  const [section10Open, setSection10Open] = useState(false);
  const handleSection10Toggle = () => {
    setSection10Open(!section10Open);
  };
  const [section11Open, setSection11Open] = useState(false);
  const handleSection11Toggle = () => {
    setSection11Open(!section11Open);
  };
  const [section12Open, setSection12Open] = useState(false);
  const handleSection12Toggle = () => {
    setSection12Open(!section12Open);
  };
  const [section13Open, setSection13Open] = useState(false);
  const handleSection13Toggle = () => {
    setSection13Open(!section13Open);
  };
  const [section14Open, setSection14Open] = useState(false);
  const handleSection14Toggle = () => {
    setSection14Open(!section14Open);
  };
  const [section15Open, setSection15Open] = useState(false);
  const handleSection15Toggle = () => {
    setSection15Open(!section15Open);
  };
  const [section16Open, setSection16Open] = useState(false);
  const handleSection16Toggle = () => {
    setSection16Open(!section16Open);
  };
  const [section17Open, setSection17Open] = useState(false);
  const handleSection17Toggle = () => {
    setSection17Open(!section17Open);
  };
  const [section18Open, setSection18Open] = useState(false);
  const handleSection18Toggle = () => {
    setSection18Open(!section18Open);
  };
  const [section19Open, setSection19Open] = useState(false);
  const handleSection19Toggle = () => {
    setSection19Open(!section19Open);
  };
  const [section20Open, setSection20Open] = useState(false);
  const handleSection20Toggle = () => {
    setSection20Open(!section20Open);
  };
  const [section21Open, setSection21Open] = useState(false);
  const handleSection21Toggle = () => {
    setSection21Open(!section21Open);
  };
  const [section22Open, setSection22Open] = useState(false);
  const handleSection22Toggle = () => {
    setSection22Open(!section22Open);
  };
  const [section23Open, setSection23Open] = useState(false);
  const handleSection23Toggle = () => {
    setSection23Open(!section23Open);
  };
  const [section24Open, setSection24Open] = useState(false);
  const handleSection24Toggle = () => {
    setSection24Open(!section24Open);
  };
  const [section25Open, setSection25Open] = useState(false);
  const handleSection25Toggle = () => {
    setSection25Open(!section25Open);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  //#endregion

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseSesion = () => {
    window.localStorage.clear();
    navigate('/')
  }

  const [sectionControlOpen, setSectionControlOpen] = useState(false);
  const handleSectionControlToggle = () => {
    setSectionControlOpen(!sectionControlOpen);
  };

  const [sectionProdOpen, setSectionProdOpen] = useState(false);
  const handleSectionProdToggle = () => {
    setSectionProdOpen(!sectionProdOpen);
  };

  const [sectionTrazOpen, setSectionTrazOpen] = useState(false);
  const handleSectionTrazToggle = () => {
    setSectionTrazOpen(!sectionTrazOpen);
  };

  const [sectionPersOpen, setSectionPersOpen] = useState(false);
  const handleSectionPersToggle = () => {
    setSectionPersOpen(!sectionPersOpen);
  };

  const sectionsFather = [
    {
      title: 'Controles',
      open: sectionControlOpen,
      toggle: handleSectionControlToggle,
      sections: [
        {
          title: 'Control de alarmas',
          open: section7Open,
          toggle: handleSection7Toggle,
          links: [
            { to: '/control-de-alarma-luminica-y-sonora-de-cloro', text: 'Añadir' },
            { to: '/listar-control-de-alarma-luminica-y-sonora-de-cloro', text: 'Ver' },
          ],
        },
        {
          title: 'Control de cloro libre',
          open: section8Open,
          toggle: handleSection8Toggle,
          links: [
            { to: '/control-de-cloro-libre', text: 'Añadir' },
            { to: '/listar-control-de-cloro-libre', text: 'Ver' },
          ],
        },
        {
          title: 'Control de limpieza y desinfección',
          open: section9Open,
          toggle: handleSection9Toggle,
          links: [
            { to: '/control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias', text: 'Añadir' },
            { to: '/listar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias', text: 'Ver' },
          ],
        },
        {
          title: 'Control de mejoras en instalaciones',
          open: section10Open,
          toggle: handleSection10Toggle,
          links: [
            { to: '/control-de-mejoras-en-instalaciones', text: 'Añadir' },
            { to: '/listar-control-de-mejoras-en-instalaciones', text: 'Ver' },
          ],
        },
        {
          title: 'Control de reposición de cloro',
          open: section11Open,
          toggle: handleSection11Toggle,
          links: [
            { to: '/control-de-reposicion-de-cloro', text: 'Añadir' },
            { to: '/listar-control-de-reposicion-de-cloro', text: 'Ver' },
          ],
        },
        {
          title: 'Control de temp. de esterilizadores',
          open: section12Open,
          toggle: handleSection12Toggle,
          links: [
            { to: '/control-de-temperatura-de-esterilizadores', text: 'Añadir' },
            { to: '/listar-control-de-temperatura-de-esterilizadores', text: 'Ver' },
          ],
        },
        {
          title: 'Control de temp. en cámaras',
          open: section13Open,
          toggle: handleSection13Toggle,
          links: [
            { to: '/control-de-temperatura-en-camaras', text: 'Añadir' },
            { to: '/listar-control-de-temperatura-en-camaras', text: 'Ver' },
          ],
        },
        {
          title: 'Control de nitrato',
          open: section14Open,
          toggle: handleSection14Toggle,
          links: [
            { to: '/control-de-nitratos', text: 'Añadir' },
            { to: '/listar-control-de-nitratos', text: 'Ver' },
          ],
        },
        {
          title: 'Control de nitrito',
          open: section15Open,
          toggle: handleSection15Toggle,
          links: [
            { to: '/control-de-nitritos', text: 'Añadir' },
            { to: '/listar-control-de-nitritos', text: 'Ver' },
          ],
        },
      ]
    },
    {
      title: 'Productos y Producción',
      open: sectionProdOpen,
      toggle: handleSectionProdToggle,
      sections: [
        {
          title: 'Recepción de materias primas cárnicas',
          open: section18Open,
          toggle: handleSection18Toggle,
          links: [
            { to: '/recepcion-de-materias-primas-carnicas', text: 'Añadir' },
            { to: '/listar-recepcion-de-materias-primas-carnicas', text: 'Ver' },
          ],
        },
        {
          title: 'Diaria de producción',
          open: section19Open,
          toggle: handleSection19Toggle,
          links: [
            { to: '/diaria-de-produccion', text: 'Añadir' },
            { to: '/listar-diaria-de-produccion', text: 'Ver' },
          ],
        },
        {
          title: 'Carnes',
          open: section3Open,
          toggle: handleSection3Toggle,
          links: [
            { to: '/listar-carne', text: 'Ver' },
          ],
        },
        {
          title: 'Insumos',
          open: section4Open,
          toggle: handleSection4Toggle,
          links: [
            { to: '/insumo', text: 'Añadir' },
            { to: '/listar-control-de-insumos', text: 'Ver' },
          ],
        },
        {
          title: 'Lotes',
          open: section25Open,
          toggle: handleSection25Toggle,
          links: [
            { to: '/listar-lote', text: 'Ver' },
          ],
        },
        {
          title: 'Control de productos químicos',
          open: section17Open,
          toggle: handleSection17Toggle,
          links: [
            { to: '/control-de-productos-quimicos', text: 'Añadir' },
            { to: '/listar-control-de-productos-quimicos', text: 'Ver' },
          ],
        },
        {
          title: 'Productos',
          open: section5Open,
          toggle: handleSection5Toggle,
          links: [
            { to: '/producto', text: 'Añadir' },
            { to: '/listar-producto', text: 'Ver' },
          ],
        },
      ]
    },
    {
      title: 'Trazabilidad',
      open: sectionTrazOpen,
      toggle: handleSectionTrazToggle,
      sections: [
        {
          title: 'Expedición de Producto',
          open: section16Open,
          toggle: handleSection16Toggle,
          links: [
            { to: '/expedicion-de-producto', text: 'Añadir' },
            { to: '/listar-expedicion-de-producto', text: 'Ver' },
          ],
        },
        {
          title: 'Resumen de trazabilidad',
          open: section20Open,
          toggle: handleSection20Toggle,
          links: [
            { to: '/listar-resumen-de-trazabilidad', text: 'Ver' },
          ],
        },
        {
          title: 'Monitoreo de SSOP operativo',
          open: section21Open,
          toggle: handleSection21Toggle,
          links: [
            { to: '/monitoreo-de-ssop-operativo', text: 'Añadir' },
            { to: '/listar-monitoreo-de-ssop-operativo', text: 'Ver' },
          ],
        },
        {
          title: 'Monitoreo de SSOP Pre-Operativo',
          open: section22Open,
          toggle: handleSection22Toggle,
          links: [
            { to: '/monitoreo-de-ssop-pre-operativo', text: 'Añadir' },
            { to: '/listar-monitoreo-de-ssop-pre-operativo', text: 'Ver' },
          ],
        },
        {
          title: 'Anual de insumos carnicos',
          open: section24Open,
          toggle: handleSection24Toggle,
          links: [
            { to: '/listar-anual-de-insumos-carnicos', text: 'Ver' },
          ],
        },
      ]
    },
    {
      title: 'Persona y Localidad',
      open: sectionPersOpen,
      toggle: handleSectionPersToggle,
      sections: [
        {
          title: 'Clientes',
          open: section2Open,
          toggle: handleSection2Toggle,
          links: [
            { to: '/cliente', text: 'Añadir' },
            { to: '/listar-cliente', text: 'Ver' },
          ],
        },
        {
          title: 'Proveedor',
          open: section6Open,
          toggle: handleSection6Toggle,
          links: [
            { to: '/proveedor', text: 'Añadir' },
            { to: '/listar-proveedor', text: 'Ver' },
          ],
        },
        {
          title: 'Usuarios',
          open: section23Open,
          toggle: handleSection23Toggle,
          links: [
            { to: '/agregar-usuario', text: 'Añadir' },
            { to: '/listar-usuarios', text: 'Ver' },
          ],
        },
        {
          title: 'Localidades',
          open: section1Open,
          toggle: handleSection1Toggle,
          links: [
            { to: '/localidad', text: 'Añadir' },
            { to: '/listar-localidad', text: 'Ver' },
          ],
        },
      ]
    },
  ];

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
            <ListItem style={{ fontSiz: 18 }} button component={Link} to="/inicio" onClick={handleDrawerClose}>
              <ListItemText primary="Inicio" />
            </ListItem>
            {sectionsFather.map((section, index) => (
              <div key={index}>
                <ListSubheader
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', lineHeight: 'normal' }}
                  onClick={section.toggle}
                  className={classes.primarySections}
                >
                  {section.title}
                  <IconButton>
                    {section.open ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </ListSubheader>
                <Collapse in={section.open} timeout="auto" unmountOnExit>
                  {section.sections.map((sect, index) => (
                    <div key={index} className={classes.secondSections}>
                      <ListSubheader
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', lineHeight: 'normal' }}
                        onClick={sect.toggle}
                      >
                        {sect.title}
                        <IconButton>
                          {sect.open ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </ListSubheader>
                      <Collapse in={sect.open} timeout="auto" unmountOnExit>
                        {sect.links.map((link, linkIndex) => (
                          <ListItem button component={Link} to={link.to} onClick={handleDrawerClose} key={linkIndex}>
                            <ListItemText primary={link.text} />
                          </ListItem>
                        ))}
                      </Collapse>
                    </div>
                  ))}
                </Collapse>
              </div>
            ))}
          </List>
        </Drawer>
      </div>
    </ThemeProvider>
  );
};
export default Navbar;
