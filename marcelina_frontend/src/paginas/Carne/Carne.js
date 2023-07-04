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
    }
}));

const Carne = () => {
    const formFields = [
        { name: 'carneNombre', label: 'Nombre', type: 'text' },
        { name: 'carneCorte', label: 'Corte', type: 'text' },
        { name: 'carneCantidad', label: 'Cantidad', type: 'text' },
        { name: 'carneNroPaseSanitario', label: 'Pase Sanitario', type: 'text' },
    ];

    const [formData, setFormData] = useState({});
    const [carneTipo, setCarneTipo] = useState('');

    const estilos = useStyles();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDropdownChange = (event) => {
        const selectedCarneTipo = event.target.value;
        if (selectedCarneTipo === 'carneTipo') {
            setCarneTipo('');
        } else {
            setCarneTipo(selectedCarneTipo);
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
                                <Grid item lg={2} md={2} sm={0} xs={0} ></Grid>
                                <Grid item lg={8} md={8} sm={12} xs={12} >
                                    <Typography component='h1' variant='h5'>Agregar Carne</Typography>
                                    <Tooltip title={
                                        <Typography fontSize={16}>
                                            En esta pagina puedes registrar los distinto tipos de carne y cortes que compran.
                                        </Typography>
                                    }>
                                        <IconButton>
                                            <HelpOutlineIcon fontSize="large" color="primary"/>
                                        </IconButton>
                                    </Tooltip>
                                    <FormularioReutilizable fields={formFields} formData={formData} handleChange={handleChange} />
                                    <FormControl variant="outlined" className={estilos.formControl}>
                                        <InputLabel htmlFor="outlined-age-native-simple">Tipo de Carne</InputLabel>
                                        <Select
                                            native
                                            value={carneTipo}
                                            onChange={handleDropdownChange}
                                            label="Tipo de Carne"
                                            inputProps={{
                                                name: 'carneTipo',
                                                id: 'outlined-age-native-simple',
                                            }}
                                        >
                                            <option value="Bovino">Bovino</option>
                                            <option value="Porcino">Porcino</option>
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
};

export default Carne;