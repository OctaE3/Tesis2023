import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, Button, CssBaseline, Dialog, IconButton, makeStyles, createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
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
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'blue',
        },
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
        border: '2px outset blue'
    },
    gridTabla: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1.5),
    },
    tablaTitle: {
        marginLeft: theme.spacing(1),
    },
    customOutlinedRed: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'red',
        },
    },
    customOutlinedBlue: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'blue',
        },
    },
    customLabelBlue: {
        color: 'blue',
    },
    customLabelRed: {
        color: 'red',
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
    liTitleBlue: {
        color: 'blue',
        fontWeight: 'bold',
    },
    liTitleRed: {
        color: 'red',
        fontWeight: 'bold',
    },
    text: {
        color: '#2D2D2D',
    },
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

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const navigate = useNavigate();

    const [alertSuccess, setAlertSuccess] = useState({
        title: 'Correcto', body: 'Recepcion de materia primas carnicas modificada con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logro modificar la recepcion de materia primas carnicas, revise los datos ingresados.', severity: 'error', type: 'description'
    });

    const [alertWarning, setAlertWarning] = useState({
        title: 'Advertencia', body: 'Expiro el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const updateErrorAlert = (newBody) => {
        setAlertError((prevAlert) => ({
            ...prevAlert,
            body: newBody,
        }));
    };

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

    const handleChange = event => {
        const { name, value } = event.target;
        if (name === "recepcionDeMateriasPrimasCarnicasPaseSanitario") {
            const regex = new RegExp("^[0-9]{0,15}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
        else if (name === "recepcionDeMateriasPrimasCarnicasTemperatura") {
            const regex = new RegExp("^[0-9]{0,10}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
        else if (name === "recepcionDeMateriasPrimasCarnicasMotivoDeRechazo") {
            const regex = new RegExp("^[A-Za-z0-9\\s,.]{0,250}$");
            if (regex.test(value)) {
                setControl(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        } else {
            setControl(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    }

    const checkError = (fecha, proveedor, pase, temperatura) => {
        if (fecha === undefined || fecha === null) {
            return false;
        }
        else if (proveedor === undefined || proveedor === null || proveedor === "Seleccionar") {
            return false;
        }
        else if (pase === undefined || pase === null || pase === '') {
            return false;
        }
        else if (temperatura === undefined || temperatura === null || temperatura === '') {
            return false;
        }
        return true;
    }

    const handleFormSubmit = () => {
        const proveedorSeleccionadaObj = proveedores.find((proveedor) => proveedor.proveedorId.toString() === recepcionProveedor.toString());
        const data = {
            ...control,
            recepcionDeMateriasPrimasCarnicasProveedor: proveedorSeleccionadaObj,
        };
        console.log(data);

        const check = checkError(data.recepcionDeMateriasPrimasCarnicasFecha, data.recepcionDeMateriasPrimasCarnicasProveedor,
            data.recepcionDeMateriasPrimasCarnicasPaseSanitario, data.recepcionDeMateriasPrimasCarnicasTemperatura);

        if (check === false) {
            updateErrorAlert(`Revise los datos ingresados, no se permite dejar campos vacíos y tampoco se permite seleccionar la opción "Seleccionar".`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 5000);
        } else {
            axios.put(`/modificar-recepcion-de-materias-primas-carnicas/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        setShowAlertSuccess(true);
                        setTimeout(() => {
                            setShowAlertSuccess(false);
                        }, 5000);
                    } else {
                        updateErrorAlert('No se logro modificar la recepcion de materia primas carnicas, revise los datos ingresados.')
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
                        updateErrorAlert('No se logro modificar la recepcion de materia primas carnicas, revise los datos ingresados.');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 5000);
                    }
                })
        }
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
                                    <div>
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
                                            <DialogTitle id="responsive-dialog-title">Explicación del formulario.</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText className={classes.text}>
                                                    <span>
                                                        En esta página puedes registrar los productos carnicos que recibe large chacinería, asegúrate de completar los campos necesarios para registrar el estado.
                                                    </span>
                                                    <br />
                                                    <span>
                                                        Este formulario cuenta con 6 campos:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Fecha</span>: en este campo se debe ingresar la fecha en la que se recibio la carne.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Proveedor</span>: en este campo se debe seleccionar el proveedor al que se le compro la carne.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Productos</span>: en este campo se muestran por medio de una tabla los productos carnicos recibidos,
                                                                donde se muestran sus datos, en caso de querer modificar las carnes, es posible a traves del modificar de carne. En caso de modificar el pase santitario,
                                                                se le asignara el nuevo pase sanitario a las carnes vinculadas.
                                                                La tabla cuenta con 5 columnas:
                                                                <ul>
                                                                    <li><span className={classes.liTitleBlue}>Nombre</span>: en esta columna se muestra el nombre de la carne o producto cárnico que se recibio.</li>
                                                                    <li><span className={classes.liTitleBlue}>Tipo</span>: en este columna se muestra el tipo de producto que se recibio, hay 5 tipos Bovino, Porcino, Higado, Tripa y Sangre.</li>
                                                                    <li><span className={classes.liTitleBlue}>Corte</span>: en este columna se muestra el grupo en el que entra el producto recibido.</li>
                                                                    <li><span className={classes.liTitleBlue}>Categoria</span>: en este columna se muestra se muestra la categoria de la carne.</li>
                                                                    <li><span className={classes.liTitleBlue}>Cantidad</span>: en este columna se muestra la cantidad recibida del producto carnico.</li>
                                                                </ul>
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Pase Sanitario</span>: en este campo se ingresa el número del pase sanitario.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Temperatura</span>: en este campo se ingresa la temperatura en la que se recibio la carne.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Motivo de rechazo</span>: en este campo se puede dar los motivos o los detalles de por que se rechazó el producto cárnico recibido.
                                                            </li>
                                                        </ul>
                                                    </span>
                                                    <span>
                                                        Campos obligatorios y no obligatorios:
                                                        <ul>
                                                            <li>
                                                                <span className={classes.liTitleBlue}>Campos con contorno azul y con asterisco en su nombre</span>: los campos con contorno azul y asterisco son obligatorios, se tienen que completar sin excepción.
                                                            </li>
                                                            <li>
                                                                <span className={classes.liTitleRed}>Campos con contorno rojo</span>: en cambio, los campos con contorno rojo no son obligatorios, se pueden dejar vacíos de ser necesario.
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
                            <Grid container >
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
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
                                            <InputLabel className={classes.customLabelBlue} htmlFor={`outlined-recepcionDeMateriasPrimasCarnicasProveedor-native-simple`}>Proveedor *</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={recepcionProveedor.value}
                                                name="recepcionDeMateriasPrimasCarnicasProveedor"
                                                label="Proveedor *"
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
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
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
                                            className={classes.customOutlinedBlue}
                                            InputLabelProps={{ className: classes.customLabelBlue }}
                                            color="primary"
                                            margin="normal"
                                            variant="outlined"
                                            label="Temperatura"
                                            defaultValue={0}
                                            type="text"
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
                                            className={classes.customOutlinedRed}
                                            InputLabelProps={{ className: classes.customLabelRed }}
                                            color="secondary"
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