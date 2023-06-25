import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Container, Grid } from '@material-ui/core'

const Home = () => {
  return (
    <Grid>
        <Navbar />
        <Container>
            <div>
                Alito Bombon
            </div>
        </Container>
    </Grid>
  )
}

export default Home