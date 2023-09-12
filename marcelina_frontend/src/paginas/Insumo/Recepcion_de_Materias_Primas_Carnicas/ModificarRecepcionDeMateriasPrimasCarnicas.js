import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, makeStyles, createTheme, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2C2C71'
        }
    },
});

const useStyles = makeStyles(theme => ({
    title: {
        textAlign: 'center',
    },
    formControl: {
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        minWidth: '100%',
        marginBottom: theme.spacing(1)
    },
    select: {
        width: '100%',
    },
    sendButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    table: {
        minWidth: '100%',
    },
    tabla: {
        border: '2px outset #BABABA'
    },
    gridTabla: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1.5),
    },
    tablaTitle: {
        marginLeft: theme.spacing(1),
    }
}));

const ModificarRecepcionDeMateriasPrimasCarnicas = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [control, setControl] = useState({});
    const [controles, setControles] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [proveedorSelect, setProveedorSelect] = useState([]);
    const [recepcionProveedor, setRecepcionProveedor] = useState({});
    const [recepcionCarnes, setRecepcionCarnes] = useState([]);

    useEffect(() => {
        const obtenerControles = () => {
            axios.get('/listar-recepcion-de-materias-primas-carnicas', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const controlesData = response.data;
                    const controlEncontrado = controlesData.find((control) => control.recepcionDeMateriasPrimasCarnicasId.toString() === id.toString());

                    setControles(controlesData);
                    console.log(controlEncontrado)

                    const carnes = controlEncontrado.recepcionDeMateriasPrimasCarnicasProductos;
                    setRecepcionCarnes(
                        carnes.map((carne) => ({
                            nombre: carne.carneNombre,
                            tipo: carne.carneTipo,
                            corte: carne.carneCorte,
                            categoria: carne.carneCategoria,
                            cantidad: carne.carneCantidad,
                        }))
                    );

                    setRecepcionProveedor({
                        value: controlEncontrado.recepcionDeMateriasPrimasCarnicasProveedor.proveedorId,
                        label: controlEncontrado.recepcionDeMateriasPrimasCarnicasProveedor.proveedorNombre,
                    });

                    const fechaControl = controlEncontrado.recepcionDeMateriasPrimasCarnicasFecha;
                    const fecha = new Date(fechaControl);
                    const fechaFormateada = format(fecha, 'yyyy-MM-dd');

                    const controlConFechaParseada = {
                        ...controlEncontrado,
                        recepcionDeMateriasPrimasCarnicasFecha: fechaFormateada,
                    }
                    console.log(controlConFechaParseada);
                    setControl(controlConFechaParseada);
                })
                .catch(error => {
                    console.error(error);
                });
        };

        const obtenerProveedores = () => {
            axios.get('/listar-proveedores', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setProveedores(response.data);
                    setProveedorSelect(
                        response.data.map((proveedor) => ({
                            value: proveedor.proveedorId,
                            label: proveedor.proveedorNombre,
                        }))
                    );

                })
                .catch(error => {
                    console.error(error);
                });
        };

        obtenerControles();
        obtenerProveedores();
    }, []);

    const handleChange = event => {
        const { name, value } = event.target;
        setControl(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleFormSubmit = () => {
        const proveedorSeleccionadaObj = proveedores.find((proveedor) => proveedor.proveedorId.toString() === recepcionProveedor.toString());
        const data = {
            ...control,
            recepcionDeMateriasPrimasCarnicasProveedor: proveedorSeleccionadaObj,
        };
        console.log(data);

        axios.put(`/modificar-recepcion-de-materias-primas-carnicas/${id}`, data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("Modificado");
                } else {
                    console.log("No modificado")
                }
            })
            .catch(error => {
                console.error(error);
            })
    };

    return (
        <div>
            <CssBaseline>
                <Grid>
                    <Navbar />
                    <Container style={{ marginTop: 30 }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={0}>
                                <Grid item lg={2} md={2}></Grid>
                                <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title} >
                                    <Typography component='h1' variant='h4'>Modificar Recepcion de Materias Primas Carnicas</Typography>
                                </Grid>
                                <Grid item lg={2} md={2}></Grid>
                            </Grid>
                            <Grid container >
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Fecha"
                                            defaultValue={new Date()}
                                            type="date"
                                            name="recepcionDeMateriasPrimasCarnicasFecha"
                                            value={control.recepcionDeMateriasPrimasCarnicasFecha}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel htmlFor={`outlined-recepcionDeMateriasPrimasCarnicasProveedor-native-simple`}>Proveedor</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={recepcionProveedor.value}
                                                name="recepcionDeMateriasPrimasCarnicasProveedor"
                                                label="Proveedor"
                                                inputProps={{
                                                    name: "recepcionDeMateriasPrimasCarnicasProveedor",
                                                    id: `outlined-recepcionDeMateriasPrimasCarnicasProveedor-native-simple`,
                                                }}
                                                onChange={(e) => setRecepcionProveedor(e.target.value)}
                                            >
                                                <option>Seleccionar</option>
                                                {proveedorSelect.map((option, ind) => (
                                                    <option key={ind} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12} className={classes.gridTabla}>
                                        <TableContainer component={Paper} className={classes.tabla}>
                                            <Typography className={classes.tablaTitle} component='h4' variant='h6'>Carnes</Typography>
                                            <Table className={classes.table} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Nombre</TableCell>
                                                        <TableCell align="right">Tipo</TableCell>
                                                        <TableCell align="right">Corte</TableCell>
                                                        <TableCell align="right">Categoria</TableCell>
                                                        <TableCell align="right">Cantidad</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {recepcionCarnes.map((carne) => (
                                                        <TableRow key={carne.id}>
                                                            <TableCell component="th" scope="row">
                                                                {carne.nombre}
                                                            </TableCell>
                                                            <TableCell align="right">{carne.tipo}</TableCell>
                                                            <TableCell align="right">{carne.corte}</TableCell>
                                                            <TableCell align="right">{carne.categoria}</TableCell>
                                                            <TableCell align="right">{carne.cantidad}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Pase Sanitario"
                                            defaultValue="Pase Sanitario"
                                            type="text"
                                            name="recepcionDeMateriasPrimasCarnicasPaseSanitario"
                                            value={control.recepcionDeMateriasPrimasCarnicasPaseSanitario}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Temperatura"
                                            defaultValue={0}
                                            type="number"
                                            name="recepcionDeMateriasPrimasCarnicasTemperatura"
                                            value={control.recepcionDeMateriasPrimasCarnicasTemperatura}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            minRows={3}
                                            multiline
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Motivo de rechazo"
                                            defaultValue="Motivo de rechazo"
                                            type="text"
                                            name="recepcionDeMateriasPrimasCarnicasMotivoDeRechazo"
                                            value={
                                                control.recepcionDeMateriasPrimasCarnicasMotivoDeRechazo ?
                                                    control.recepcionDeMateriasPrimasCarnicasMotivoDeRechazo :
                                                    ''
                                            }
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                            </Grid>
                            <Grid container justifyContent='flex-start' alignItems="center">
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                <Grid item lg={8} md={8} sm={8} xs={8} className={classes.sendButton}>
                                    <Button type="submit" variant="contained" color="primary" onClick={handleFormSubmit}>Modificar</Button>
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                            </Grid>
                        </Box>
                    </Container>
                </Grid>
            </CssBaseline>
        </div>
    );
};

export default ModificarRecepcionDeMateriasPrimasCarnicas;