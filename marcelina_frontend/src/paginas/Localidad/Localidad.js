import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Container, Typography,Grid, Button} from '@material-ui/core'
import FormularioReutilizanle from '../../components/Formulario Reutilizable/FormularioReutilizable'

const Localidad = () => { 
        const formFields1 = [
            { name: 'name', label: 'Nombre', type: 'text' },
          ];
  return (
    <Grid>
        <Navbar />
        <Container>
            <Typography component='h1' variant='h5'>Localidad</Typography>
            <FormularioReutilizanle  fields={formFields1}/>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Enviar
            </Button>
        </Container>
    </Grid>
  )
}

export default Localidad