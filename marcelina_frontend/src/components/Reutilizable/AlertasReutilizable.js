import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: theme.spacing(2),
    },
    alert: {
        transition: 'opacity 0.5s ease-in-out',
        width: '100%',
    },
    alertSuccesBgColor: {
        backgroundColor: 'ForestGreen',
        color: 'white',
    }
}));

const AlertasReutilizable = ({ alert, isVisible, open, setOpen }) => {

    const classes = useStyles();

    return (
        <div className={classes.alert}>
            {alert && alert.type === 'description' && (
                <Fade in={isVisible} timeout={500} key={alert.id}>
                    <div className={classes.root}>
                        <Alert className={alert.severity === 'success' ? classes.alertSuccesBgColor : ''} severity={alert.severity}>
                            <AlertTitle>{alert.title}</AlertTitle>
                            {alert.body}
                        </Alert>
                    </div>
                </Fade>
            )}
            {alert && alert.type === 'actions' && (
                <div className={classes.root}
                    key={alert.id}>
                    <Collapse in={open}>
                        <Alert severity={alert.severity}
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
                            <AlertTitle>{alert.title}</AlertTitle>
                            {alert.body}
                        </Alert>
                    </Collapse>
                </div>
            )}
        </div>
    );

}

export default AlertasReutilizable;