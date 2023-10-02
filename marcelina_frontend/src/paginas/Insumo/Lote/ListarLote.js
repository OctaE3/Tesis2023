import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaReutilizable from '../../../components/Reutilizable/ListaReutilizable';
import Navbar from '../../../components/Navbar/Navbar';
import FiltroReutilizable from '../../../components/Reutilizable/FiltroReutilizable';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { Grid, Typography, Button, IconButton, Dialog, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    title: {
        textAlign: 'center',
    },
    container: {
        marginTop: theme.spacing(2),
    },
    info: {
        marginTop: theme.spacing(1)
    },
    text: {
        color: '#2D2D2D',
    },
    liTitleBlue: {
        color: 'blue',
        fontWeight: 'bold',
    },
    liTitleRed: {
        color: 'red',
        fontWeight: 'bold',
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
}));

function ListarLote() {
    const [data, setData] = useState([]);
    const [data30, setData30] = useState([]);
    const [dataAll, setDataAll] = useState([]);
    const [productos, setProductos] = useState([]);
    const [buttonName, setButtonName] = useState('Listar Todos');
    const [filtros, setFiltros] = useState({});
    const classes = useStyles();
    const [deleteItem, setDeleteItem] = useState(false);
    const [checkToken, setCheckToken] = useState(false);
    const navigate = useNavigate();

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertWarning, setShowAlertWarning] = useState(false);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [blinking, setBlinking] = useState(true);

    const [alertSuccess, setAlertSuccess] = useState({
        title: 'Correcto', body: 'Se eliminó el lote con éxito!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'No se logró eliminar el lote, recargue la página.', severity: 'error', type: 'description'
    });

    const [alertWarning] = useState({
        title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
    });

    const updateSuccesAlert = (newBody) => {
        setAlertSuccess((prevAlert) => ({
            ...prevAlert,
            body: newBody,
        }));
    };

    const updateErrorAlert = (newBody) => {
        setAlertError((prevAlert) => ({
            ...prevAlert,
            body: newBody,
        }));
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/')
        } else {
            const tokenParts = token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));

            const tokenExpiration = payload.exp * 1000;
            const currentTime = Date.now();

            if (tokenExpiration < currentTime) {
                setShowAlertWarning(true);
                setTimeout(() => {
                    setShowAlertWarning(false);
                    navigate('/')
                }, 2000);
            }
        }
    }, [checkToken]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loteResponse = await axios.get('/listar-lotes', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const productoResponse = await axios.get('/listar-productos', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const loteDataL = loteResponse.data.map((lote, index) => {
                    if (index < 30) {
                        if (lote.loteEliminado === false && lote.loteCantidad > 0) {
                            return {
                                ...lote,
                                Id: lote.loteId,
                            }
                        }
                    }
                });

                const dataLast30 = loteDataL.filter((data) => data !== undefined);
                const data = loteResponse.data.map((lote) => {
                    if (lote.loteEliminado === true || lote.loteCantidad <= 0) {
                        return {
                            ...lote,
                            Id: lote.loteId,
                            isDelete: 'Yes',
                            icl: 'Yes',
                        }
                    } else {
                        return {
                            ...lote,
                            Id: lote.loteId,
                        }
                    }
                })
                const productos = productoResponse.data;

                setData(dataLast30);
                setData30(dataLast30);
                setDataAll(data);
                setProductos(productos.map((producto) => `${producto.productoNombre} - ${producto.productoCodigo}`));
                setButtonName('Listar Todos')
                setDeleteItem(false);
            } catch (error) {
                if (error.request.status === 401) {
                    setCheckToken(true);
                } else {
                    updateErrorAlert('No se logró cargar la lista, recargue la página.')
                    setShowAlertError(true);
                    setTimeout(() => {
                        setShowAlertError(false);
                    }, 2000);
                }
            }
        };

        fetchData();
    }, [deleteItem]);

    const tableHeadCells = [
        { id: 'Id', numeric: false, disablePadding: false, label: 'Id' },
        { id: 'loteCodigo', numeric: false, disablePadding: false, label: 'Código' },
        { id: 'loteProducto', numeric: false, disablePadding: false, label: 'Producto' },
        { id: 'loteCantidad', numeric: false, disablePadding: false, label: 'Cantidad' },
    ];

    const filters = [
        { id: 'codigo', label: 'Cóodigo', type: 'text' },
        { id: 'producto', label: 'Producto', type: 'select', options: productos },
        { id: 'cantidad', label: 'Cantidad', type: 'text' },
    ];

    const handleFilter = (filter) => {
        const lowerCaseFilter = Object.keys(filter).reduce((acc, key) => {
            acc[key] = filter[key] ? filter[key].toLowerCase() : '';
            return acc;
        }, {});
        setFiltros(lowerCaseFilter);
    };

    const mapData = (item, key) => {
        if (key === 'loteProducto') {
            if (item.loteProducto) {
                return `${item.loteProducto.productoNombre} - ${item.loteProducto.productoCodigo}`;
            } else {
                return '';
            }
        } else {
            return item[key];
        }
    };

    const filteredData = data.filter((item) => {
        const lowerCaseItem = {
            loteCodigo: item.loteCodigo ? item.loteCodigo.toLowerCase() : '',
            loteProducto: item.loteProducto ? `${item.loteProducto.productoNombre} - ${item.loteProducto.productoCodigo}` : '',
            loteCantidad: item.loteCantidad ? item.loteCantidad : ''
        };

        if (
            (!filtros.codigo || lowerCaseItem.loteCodigo.toString().includes(filtros.codigo)) &&
            (!filtros.producto || lowerCaseItem.loteProducto.toLowerCase().includes(filtros.producto.toLowerCase())) &&
            (!filtros.cantidad || lowerCaseItem.loteCantidad.toString() === filtros.cantidad)
        ) {
            return true;
        }
        return false;
    });

    const handleEditLote = (rowData) => {
        const id = rowData.Id;
        navigate(`/modificar-lote/${id}`);
    };

    const handleDeleteLote = (rowData) => {
        const id = rowData.Id;
        axios.put(`/borrar-lote/${id}`, null, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.status === 200) {
                    setDeleteItem(true);
                    setShowAlertSuccess(true);
                    setTimeout(() => {
                        setShowAlertSuccess(false);
                    }, 2000);
                } else {
                    updateErrorAlert('No se logró eliminar el lote, recargue la página.')
                    setShowAlertError(true);
                    setTimeout(() => {
                        setShowAlertError(false);
                    }, 2000);
                }
            })
            .catch(error => {
                if (error.request.status === 401) {
                    setCheckToken(true);
                }
                else if (error.request.status === 500) {
                    updateErrorAlert('No se logró eliminar el lote, recargue la página.')
                    setShowAlertError(true);
                    setTimeout(() => {
                        setShowAlertError(false);
                    }, 2000);
                }
            })
    }

    const handleAddLote = (rowData) => {
        const id = rowData.Id;
        axios.put(`/añadir-lote/${id}`, null, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.status === 200) {
                    setDeleteItem(true);
                    setShowAlertSuccess(true);
                    setTimeout(() => {
                        setShowAlertSuccess(false);
                    }, 2500);
                } else {
                    updateErrorAlert('No se logró eliminar el lote, recargue la página.')
                    setShowAlertError(true);
                    setTimeout(() => {
                        setShowAlertError(false);
                    }, 2500);
                }
            })
            .catch(error => {
                if (error.request.status === 401) {
                    setCheckToken(true);
                }
                else if (error.request.status === 500) {
                    updateErrorAlert('No se logró eliminar el lote, recargue la página.')
                    setShowAlertError(true);
                    setTimeout(() => {
                        setShowAlertError(false);
                    }, 2500);
                }
            })
    }

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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const listRefresh = () => {
        if (buttonName === 'Listar Todos') {
            setButtonName('Listar últimos 30')
            setData(dataAll);
        } else {
            setButtonName('Listar Todos')
            setData(data30);
        }
    }

    return (
        <div>
            <Navbar />
            <Grid container justifyContent='center' alignContent='center' className={classes.container} >
                <Grid item lg={2} md={2}></Grid>
                <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title}>
                    <Typography component='h1' variant='h5'>Listar de Lote</Typography>
                    <div className={classes.info}>
                        <IconButton className={blinking ? classes.blinkingButton : ''} onClick={handleClickOpen}>
                            <HelpOutlineIcon fontSize="large" color="primary" />
                        </IconButton>
                        <Dialog
                            fullScreen={fullScreen}
                            fullWidth
                            maxWidth='md'
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">Explicación de la página.</DialogTitle>
                            <DialogContent>
                                <DialogContentText className={classes.text}>
                                    <span>
                                        En esta página se encarga de listar las lotes que fueron registrados y también se cuenta con filtros para facilitar la búsqueda de información.
                                    </span>
                                    <br />
                                    <br />
                                    <span style={{ fontWeight: 'bold' }}>
                                        Filtros:
                                    </span>
                                    <span>
                                        <ul>
                                            <li>
                                                <span className={classes.liTitleBlue}>Código</span>: En este campo se puede ingresar el código que identifica al lote o un número, a raíz del código o número ingresado
                                                se listarán todos los registros que contengan ese código o número.
                                            </li>
                                            <li>
                                                <span className={classes.liTitleBlue}>Producto</span>: En este campo se puede seleccionar un producto, de los productos que se pueden seleccionar se muestra su nombre y código identificador,
                                                al seleccionar un producto se listarán todos los registros que estén asociados a ese producto.
                                            </li>
                                            <li>
                                                <span className={classes.liTitleBlue}>Cantidad</span>: En este campo se puede ingresar la cantidad que tiene el lot y solo se mostrarán los
                                                registros que tengan la misma cantidad que la ingresada en el campo.
                                            </li>
                                        </ul>
                                    </span>
                                    <span style={{ fontWeight: 'bold' }}>
                                        Lista:
                                    </span>
                                    <span>
                                        <ul>
                                            <li>
                                                <span className={classes.liTitleRed}>Id</span>: En este columna se muestra la Id del registro.
                                            </li>
                                            <li>
                                                <span className={classes.liTitleRed}>Código</span>: En este columna se muestra el código que identifica el lote.
                                            </li>
                                            <li>
                                                <span className={classes.liTitleRed}>Producto</span>: En esta columna se muestra el producto que compone al lote.
                                            </li>
                                            <li>
                                                <span className={classes.liTitleRed}>Cantidad</span>: En esta columna se muestra la cantidad restante del lote.
                                            </li>
                                            <li>
                                                <span className={classes.liTitleRed}>Acciones</span>: En esta columna se muestran 2 botones, el botón de modificar es el que contiene un icono de una lapíz y el de eliminar el que tiene un cubo de basura,
                                                el botón de modificar al presionarlo te enviará a un formulario con los datos del registro, para poder realizar la modificación. El botón de eliminar al presionarlo desplegará una ventana, que preguntará si
                                                desea eliminar el registro, en caso de presionar si, el registro sera eliminado y si presiona no, la ventana se cerrará.
                                            </li>
                                        </ul>
                                    </span>
                                    <span>
                                        Aclaraciones:
                                        <ul>
                                            <li>En la lista vienen por defecto listados los últimos 30 registros que se agregaron.</li>
                                            <li>El botón llamado Aplicar Filtro al presionarlo, filtrará la lista según los datos ingresados en los campos.</li>
                                            <li>El botón llamado Limpiar Filtro al presionarlo, borrará los datos ingresados en los campos y se listarán los últimos 30 registros agregados.</li>
                                            <li>El botón denominado Añadir Registro al presionarlo te enviará a un formulario donde puedes agregar un nuevo registro.</li>
                                            <li>El botón denominado Listar Todos al presionarlo actualizará la lista y mostrará todos los registros existentes.</li>
                                            <li>Cuando se haya presionado el botón de Listar Todos y haya realizado su función, el nombre del botón habrá cambiado por Listar Últimos 30, que al presionarlo listará los últimos 30 registros que fueron agregados.</li>
                                            <li>No se recomienda eliminar registros de la lista, a menos que sea necesario.</li>
                                            <li>Se tiene que tener en cuenta que los lotes que cuenten con una cantidad igual a 0 (están eliminados), solo se podrán volver a añadir, modificando su cantidad.</li>
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
            <FiltroReutilizable filters={filters} handleFilter={handleFilter} />
            <ListaReutilizable
                data={filteredData}
                dataKey="listarLotes"
                tableHeadCells={tableHeadCells}
                title="Lista de Lotes"
                titleListButton={buttonName}
                listButton={listRefresh}
                dataMapper={mapData}
                columnRenderers={""}
                onEditButton={handleEditLote}
                onDeleteButton={handleDeleteLote}
                onAddButton={handleAddLote}
            />

        </div>
    );
}

export default ListarLote;