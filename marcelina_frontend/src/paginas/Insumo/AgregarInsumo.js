import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Container, Box, Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, withStyles, makeStyles, CssBaseline, Tooltip, IconButton, createTheme } from '@material-ui/core';
import FormularioReutilizable from '../../components/Formulario Reutilizable/FormularioReutilizable';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Logo from "../../assets/images/Logo.png";

const theme = createTheme({
    palette: {
      primary: {
        main: '#2C2C71'
      }
    }
  });


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundImage: `url(${Logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: '100%',
        marginBottom: theme.spacing(2)
    },
    title: {
        fontFamily: 'Verdant'
    }
}));

const AgregarInsumo = () => {
    const formFields = [
        { name: 'insumoNombre', label: 'Nombre', type: 'text' },
        { name: 'insumoFecha', label: 'Fecha de entrada', tipo: 'fecha' },
        { name: 'insumoTipo', label: 'Tipo', type: 'text' },
        { name: 'insumoLote', label: 'Lote', type: 'text' },
        { name: 'insumoMotivoDeRechazo', label: 'Motivo de rechazo', type: 'text', multi: '3' },
        { name: 'insumoFechaVencimiento', label: 'Fecha vencimiento', tipo: 'fecha' },
    ];

    const [formData, setFormData] = useState({});
    const [insumoTipo, setInsumoTipo] = useState('');

    const estilos = useStyles();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDropdownChange = (event) => {
        const selectedInsumoTipo = event.target.value;
        if (selectedInsumoTipo === 'insumoTipo') {
            setInsumoTipo('');
        } else {
            setInsumoTipo(selectedInsumoTipo);
        }
    };

    return(
        <div>
            <CssBaseline>
                <Grid>
                    <Navbar />
                    <Container style={{ marginTop: 30 }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={0}>
                                <Grid item lg={2} md={2} sm={0} xs={0} ></Grid>
                                <Grid item lg={8} md={8} sm={12} xs={12} >
                                    <Typography component='h1' variant='h4'>Agregar Insumo</Typography>
                                    <Tooltip title={
                                        <Typography fontSize={16}>
                                            En esta pagina puedes registrar los distintos Insumos, Aditivos que compran.
                                        </Typography>
                                    }>
                                        <IconButton>
                                            <HelpOutlineIcon fontSize="large" color="primary"/>
                                        </IconButton>
                                    </Tooltip>
                                    <FormularioReutilizable fields={formFields} formData={formData} handleChange={handleChange} />
                                    <FormControl variant="outlined" className={estilos.formControl}>
                                        <InputLabel htmlFor="outlined-age-native-simple">Tipo de Insumo</InputLabel>
                                        <Select
                                            native
                                            value={insumoTipo}
                                            onChange={handleDropdownChange}
                                            label="Tipo de Insumo"
                                            inputProps={{
                                                name: 'insumoTipo',
                                                id: 'outlined-age-native-simple',
                                            }}
                                        >
                                            <option value="Aditivo">Aditivo</option>
                                            <option value="Insumo">Insumo</option>
                                            <option value="Mat.Prima No Cárnica">Mat.Prima No Cárnica</option>
                                            <option value="Otros">Otros</option>
                                        </Select>
                                    </FormControl>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"

                                    >
                                        Agregar
                                    </Button>
                                </Grid>
                                <Grid item lg={2} md={2} sm={0} xs={0}></Grid>
                            </Grid>
                        </Box>
                    </Container>
                </Grid>
            </CssBaseline>
        </div>
    );
}

export default AgregarInsumo;