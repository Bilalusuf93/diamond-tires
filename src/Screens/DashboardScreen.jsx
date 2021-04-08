import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import {
  Button,
  Container,
  LinearProgress,
  AppBar,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { Redirect } from "react-router-dom";

import * as authService from "../Services/auth";
import * as orderService from "../Services/Orders";
import SalesOrder from "../components/SalesOrder";

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const columns = [
  { field: "id", headerName: "Id", width: 70 },
  { field: "type", headerName: "Type", width: 180 },
  { field: "size", headerName: "Size", width: 150 },
  { field: "qty", headerName: "Qty", width: 110 },
  {
    field: "date",
    headerName: "Date",
    type: "date",
    width: 120,
  },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params) =>
  //     `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
  // },
];

function DashboardScreen() {
  const [ordersData, setOrdersData] = useState([]);

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = () => {
    setError(null);
    try {
      setLoading(true);
      const orders = orderService.GetOrders();
      if (!orders) return;
      //console.log(orders);
      setOrdersData(orders);
      setLoading(false);
    } catch (error) {
      setError("We can not find orders data!");
      setLoading(false);
    }
  };

  const userInfo = authService.GetUserFromLS();
  const classes = useStyles();
  if (!userInfo) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
            <Typography variant="h6" className={classes.title}>
              <img src="./logo.png" alt="logo" />
            </Typography>
            <Typography>{userInfo && `Welcome ${userInfo}`}</Typography>
            <Button
              color="inherit"
              onClick={() => {
                authService.Logout();
                window.location = "/";
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      <Container component="main" maxWidth="lg">
        <div style={{ height: 400, width: "100%" }}>
          {loading && <LinearProgress color="secondary" />}
          {ordersData.length < 1 ? (
            <Alert severity="info">No data found!</Alert>
          ) : (
            <DataGrid
              className={classes.table}
              rows={ordersData}
              columns={columns}
              pageSize={5}
            />
          )}
        </div>

        <div style={{ marginTop: "5px" }}>
          <SalesOrder />
        </div>
      </Container>
    </>
  );
}

export default DashboardScreen;
