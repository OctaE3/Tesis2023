import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Container, Grid, makeStyles, createTheme } from '@material-ui/core';
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