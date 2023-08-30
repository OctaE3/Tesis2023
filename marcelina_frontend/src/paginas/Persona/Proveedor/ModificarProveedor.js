import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, makeStyles, createTheme, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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
}));

const ModificarCliente = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [proveedor, setProveedor] = useState({});
    const [proveedores, setProveedores] = useState([]);
    const [proveedorLocalidad, setProveedorLocalidad] = useState({});
    const [localidades, setLocalidades] = useState({});
    const [localidadesSelect, setLocalidadesSelect] = useState([]);
    const [telefonos, setTelefonos] = useState([]);


    useEffect(() => {
        const obtenerProveedores = () => {
            axios.get('/listar-proveedores', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const proveedores = response.data;
                    setProveedores(proveedores);
                    const proveedorEncontrado = proveedores.find((proveedor) => proveedor.proveedorId.toString() === id.toString());
                    setProveedor(proveedorEncontrado);
                    setTelefonos(proveedorEncontrado.proveedorContacto);
                    setProveedorLocalidad({
                        value: proveedorEncontrado.proveedorLocalidad.localidadId,
                        label: proveedorEncontrado.proveedorLocalidad.localidadCiudad,
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        };

        const obtenerLocalidades = () => {
            axios.get('/listar-localidades', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setLocalidades(response.data);
                    setLocalidadesSelect(
                        response.data.map((localidad) => ({
                            value: localidad.localidadId,
                            label: localidad.localidadCiudad,
                        }))
                    );
                })
                .catch(error => {
                    console.error(error);
                });
        };

        obtenerProveedores();
        obtenerLocalidades();
    }, []);

    const handleChange = event => {
        const { name, value } = event.target;
        setProveedor(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleChangeTelefono = (index, telefono) => {
        setTelefonos(prevTelefonos => {
            const nuevosTelefonos = [...prevTelefonos];
            nuevosTelefonos[index] = telefono;
            return nuevosTelefonos;
        });

        setProveedor(prevFormData => ({
            ...prevFormData,
            "proveedorContacto": telefonos.map(tel => tel),
        }));
    }

    const checkTelefono = (telefonos) => {
        const telefonosProveedores = [];
        proveedores.forEach(proveedor => {
            proveedor.proveedorContacto.forEach(telefono => {
                telefonosProveedores.push(telefono);
            })
        })

        const telefonosEncontrados = telefonos.filter(tel => {
            return telefonosProveedores.includes(tel);
        });

        return telefonosEncontrados.length > 0 ? telefonosEncontrados : null;
    }

    const checkRut = (rut) => {
        const rutProveedores = [];
        proveedores.forEach(proveedor => {
            rutProveedores.push(proveedor.proveedorRUT);
        })

        const rutEncontrado = rutProveedores.includes(rut);
        return rutEncontrado;
    }

    const checkEmail = (email) => {
        const emailProveedores = [];
        proveedores.forEach(proveedor => {
            emailProveedores.push(proveedor.proveedorEmail);
        })

        const emailEncontrado = emailProveedores.includes(email);
        return emailEncontrado;
    }

    const handleFormSubmit = () => {
        const localidadCompleta = localidades.find((localidad) => localidad.localidadId.toString() === proveedorLocalidad.toString());
        const data = {
            ...proveedor,
            proveedorLocalidad: localidadCompleta,
        };
        
        const telefonoCheck = checkTelefono(data.proveedorContacto);
        const rutCheck = checkRut(data.proveedorRUT);
        const emailCheck = checkEmail(data.proveedorEmail);

        if (telefonoCheck === null && rutCheck === false && emailCheck === false) {
            axios.put(`/modificar-proveedor/${id}`, data, {
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
        } else {
            if (telefonoCheck !== null) {
                console.log(`El/Los teléfono/teléfonos: ${telefonoCheck} están repetidos`);
            }
            if (rutCheck === true) {
                console.log(`El codigo RUT: ${data.proveedorRUT} ya esta asignado a otro proveedor`);
            }
            if (emailCheck === true) {
                console.log(`El email: ${data.proveedorEmail} ya esta asignado a otro proveedor`);
            }
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
                                    <Typography component='h1' variant='h4'>Modificar Proveedor</Typography>

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
                                            label="Nombre"
                                            defaultValue="Nombre"
                                            type="text"
                                            name="proveedorNombre"
                                            value={proveedor.proveedorNombre}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="RUT"
                                            defaultValue="RUT"
                                            type="text"
                                            name="proveedorRUT"
                                            value={proveedor.proveedorRUT}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Email"
                                            defaultValue="Email"
                                            type="email"
                                            name="proveedorEmail"
                                            value={proveedor.proveedorEmail}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    {telefonos.map((telefono, index) => (
                                        <Grid item lg={12} md={12} sm={12} xs={12} key={index}>
                                            <TextField
                                                fullWidth
                                                autoFocus
                                                margin="normal"
                                                variant="outlined"
                                                label={`Teléfono ${index + 1}`}
                                                type="text"
                                                name={`proveedorContacto-${index}`}
                                                value={telefono}
                                                onChange={(e) => handleChangeTelefono(index, e.target.value)}
                                            />
                                        </Grid>
                                    ))}
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel htmlFor={`outlined-localidad-native-simple`}>Localidad</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={proveedorLocalidad.value}
                                                label="Localidad"
                                                inputProps={{
                                                    name: "proveedorLocalidad",
                                                    id: `outlined-localidad-native-simple`,
                                                }}
                                                onChange={(e) => setProveedorLocalidad(e.target.value)}
                                            >
                                                <option>Seleccionar</option>
                                                {localidadesSelect.map((option, ind) => (
                                                    <option key={ind} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
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

export default ModificarCliente;