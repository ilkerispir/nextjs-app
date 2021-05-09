import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { SnackbarProvider, useSnackbar } from 'notistack';
import config from '../../config';
import { LinearProgress } from '@material-ui/core';
import axios from 'axios';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login(props) {
  console.log(props);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar('This is a success message!', { "variant": "success" });
  };

  return (
    <Button
    fullWidth
    variant="contained"
    color="primary"
    className={classes.submit}
    onClick={handleLogin}
  >
    Sign In
  </Button>
  );
}

export default function SignInSide(props) {
  const classes = useStyles();

  const { setIsAuth, setCookie } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const openNotification = (type, title, message) => {
    console.log(console.log({ type, title, message }));
  };

  const handleLogin = async function () {
    if (!username) {return openNotification("warning", "Login Error", "Username parameter is missing!");}
    if (!password) {return openNotification("warning", "Login Error", "Password parameter is missing!");}

    setIsLoading(true);

    try {
      const response = await axios({
        url: config.serverUrl,
        method: "GET",
        params: {
          function: "login",
          email: username,
          password: password
        }
      });

      if(!response.data.login) {
        throw new Error("Email or password is wrong");
      }

      setIsLoading(false);

      const session = await response.data.session;
      setCookie("session", session, { maxAge: 86400 });
      setCookie("email", username, { maxAge: 86400 });
      setIsAuth(true);

      openNotification("info", "Login successed!");
    } catch(error) {
      console.log(error.message);
      setIsLoading(false);

      const { response } = error;
      if (response) {
        const { request, ...errorObject } = response;
        console.log(errorObject);
        return openNotification("warning", "Login Error", errorObject.data.message);
      }
      else {
        return openNotification("error", "Login Error", error.message);
      }
    }
  }


  return (
    isLoading ? 
    <LinearProgress /> :
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={e => setUsername(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleLogin}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}