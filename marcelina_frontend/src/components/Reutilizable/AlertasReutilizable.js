import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed', // Cambia a 'fixed' para que las alertas estén en la parte superior
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex', // Usa flexbox para alinear las alertas si es necesario
        flexDirection: 'column', // Alineación vertical
        alignItems: 'flex-start', // Alinea al principio
        gap: theme.spacing(2), // Espaciado entre alertas
      },
      alert: {
        transition: 'opacity 0.5s ease-in-out',
        width: '100%', // Asegúrate de que las alertas ocupen todo el ancho
      },
}));

const AlertasReutilizable = ({ alert, isVisible }) => {

    const classes = useStyles();
    const [open, setOpen] = useState(true);

    return (
        <div className={classes.alert}>
            {alert.map((alerta) => (
                alerta.type === 'description' ? (
                    <Fade in={isVisible} timeout={500}>
                        <div className={classes.root}>
                            <Alert severity={alerta.severity}>
                                <AlertTitle>{alerta.title}</AlertTitle>
                                {alerta.body}
                            </Alert>
                        </div>
                    </Fade>
                ) : alerta.type === 'actions' ? (
                    <div className={classes.root}>
                        <Collapse in={open}>
                            <Alert severity={alerta.severity}
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                            >
                                <AlertTitle>{alerta.title}</AlertTitle>
                                {alerta.body}
                            </Alert>
                        </Collapse>
                    </div>
                ) : null
            ))}
        </div>
    );

}

export default AlertasReutilizable;