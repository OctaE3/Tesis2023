import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Container, Grid, makeStyles, Box, createTheme } from '@material-ui/core';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/images/LogoOp.png'

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
  root: {
    flexGrow: 1,
  },
  container: {
    display: 'flex', // Cambiamos a flexbox
    justifyContent: 'center', // Centramos horizontalmente
    alignItems: 'center', // Centramos verticalmente
  },
  card: {
    margin: theme.spacing(1),
    minHeight: '95%',
    minWidth: '95%',
    backgroundImage: `url(${Logo})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: '1px solid black',
  },
  box: {
    marginTop: theme.spacing(2),
  },
  cardCont: {

  },
  backgroundImage: {
    backgroundImage: `url(${Logo})`, // Reemplaza 'Logo' con la ruta correcta de tu imagen de fondo
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.5, // Ajusta el valor de opacidad según tus preferencias (0.0 - 1.0)
  },
}));

const Home = () => {
  const classes = useStyles();

  useEffect(() => {
    const fecha = new Date();
    console.log(window.localStorage.getItem('token'));
    if (fecha.getDate() === 15) {
      axios.post('/agregar-anual-de-insumos-carnicos-automatico', null, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          if (response.status === 201) {
            console.log(response.data);
          } else {
            console.log("Anashe");
          }
        })
        .catch(error => {
          console.error(error);
        })
    } else { }
  }, []);

  return (
    <div>
      <Navbar />
      <Container className={classes.root}>
        <Box className={classes.box}>
          <Grid container justifyContent='center' alignContent='center'>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent className={classes.cardCont}>
                  <Typography className={classes.title} variant="h5" component="h2" align='center'>
                  Diaria de producción
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de produccion diaria
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/diaria-de-produccion">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-diaria-de-produccion">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
              <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Expedicion de productos
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de expedicion de productos
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/expedicion-de-producto">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-expedicion-de-producto">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Resumen de trazabilidad
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de resumen de trazabilidad
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/resumen-de-trazabilidad">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-resumen-de-trazabilidad">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Recepcion de materaias primas carnicas
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de recepcion de materias primas carnicas
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/recepcion-de-materias-primas-carnicas">Añadir</Button>
                  <Button size="small"component={Link} to="/listar-recepcion-de-materias-primas-carnicas"> Ver</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' alignContent='center'>
          <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Monitoreo de SSOP operativo
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de monitoreo de SSOP operativo
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/monitoreo-de-ssop-operativo">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-monitoreo-de-ssop-operativo">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Monitoreo de SSOP pre-operativo
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de monitoreo de SSOP pre-operativo
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/monitoreo-de-ssop-pre-operativo">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-monitoreo-de-ssop-pre-operativo">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Control de nitritos
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de control de nitritos
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/control-de-nitritos">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-control-de-nitritos">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Control de nitratos
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de control de nitratos
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/control-de-nitratos">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-control-de-nitratos">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' alignContent='center'>
          <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Control de alarma luminica y sonora de cloro
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de control de alarma luminica y sonora de cloro
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/control-de-alarma-luminica-y-sonora-de-cloro">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-control-de-alarma-luminica-y-sonora-de-cloro">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Control de cloro libre
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de control de cloro libre
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/control-de-cloro-libre">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-control-de-cloro-libre">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Control de limpieza y desinfeccion de depositos de agua y cañerias
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de control de limpieza y desinfeccion de depositos de agua y cañerias
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-control-de-limpieza-y-desinfeccion-de-depositos-de-agua-y-cañerias">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Control de reposicion de cloro
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de control de reposicion de cloro
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/control-de-reposicion-de-cloro">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-control-de-reposicion-de-cloro">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' alignContent='center'>
          <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Control de temperatura de esterilizadores
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de control de temperatura de esterilizadores
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/control-de-temperatura-de-esterilizadores">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-control-de-temperatura-de-esterilizadores">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Control de temperatura en camaras
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de control de temperatura en camaras
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/control-de-temperatura-en-camaras">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-control-de-temperatura-en-camaras">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Control de mejoras en instalaciones
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de mejoras en instalaciones
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/control-de-mejoras-en-instalaciones">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-control-de-mejoras-en-instalaciones">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Control de productos quimicos
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de control de productos quimicos
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/control-de-productos-quimicos">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-control-de-productos-quimicos">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' alignContent='center'>
          <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Proveedores
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de proveedores
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/proveedor">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-proveedor">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Clientes
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de clientes
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/cliente">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-cliente">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Productos
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de productos
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/producto">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-producto">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Carnes
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de carnes
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/carne">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-carne">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' alignContent='center'>
          <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Localidades
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de localidades
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/localidad">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-localidad">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Usuarios
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla de usuarios
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="">Añadir</Button>
                  <Button size="small" component={Link} to="/listar-usuarios">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3} className={classes.container}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2" align='center'>
                  Anual de insumos carnicos
                  </Typography>
                  <Typography variant="body2" component="p">
                    <br/>
                    Planilla anual de insumos carnicos
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/listar-anual-de-insumos-carnicos">Ver</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  )
}

export default Home;
