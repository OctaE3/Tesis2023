import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Container, Grid, makeStyles, createTheme } from '@material-ui/core'

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
}));


const Home = () => {
  const classes = useStyles();

  return (
    <Grid>
        <Navbar />
        <Container>
            <div className={classes.title}>
                Alito Bombon
            </div>
        </Container>
    </Grid>
  )
}

export default Home