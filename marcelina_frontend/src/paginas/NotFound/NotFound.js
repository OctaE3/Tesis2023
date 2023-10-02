import React from 'react';
import { Grid, createTheme, makeStyles } from '@material-ui/core';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2C2C71'
        }
    }
})

const useStyles = makeStyles((theme) => ({
    img: {
        width: '50%',
        height: '70%',
    },
    imgCentrado: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
}))

const NotFound = () => {
    const url = "https://static.vecteezy.com/system/resources/previews/012/362/823/non_2x/retro-distressed-sticker-of-a-cartoon-broken-robot-vector.jpg";
    const classes = useStyles();
    return (
        <div>
            <Grid style={{ textAlign: 'center' }}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <h1>Error 404</h1>
                    <h3>La página a la que intenta acceder, no existe.</h3>
                    <br />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item lg={12} md={12} sm={12} xs={12} className={classes.imgCentrado}>
                    <img alt="Error 404" src={url} className={classes.img} />
                </Grid>
            </Grid>
        </div>
    );
}

export default NotFound;