import {
  IconButton,
  Input,
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@material-ui/core";
import React, { useState } from "react";
import { Alert } from "@material-ui/lab";
import * as XLSX from "xlsx";
// Icons
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";

import * as orderService from "../Services/Sales";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
    height: "500px",
  },
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    width: 60,
  },
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 130,
    height: 40,
  },
}));

const salesColumns = [
  { label: "", width: 70, id: 0 },
  { label: "Code", width: 180, id: 1 },
  { label: "Quantity", width: 180, id: 2 },
];

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  //console.log(row[name], "row[name]");
  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

function SalesOrder(props) {
  const [salesData, setSalesData] = useState([]);
  const [previous, setPrevious] = useState({});
  const [fileLoading, setFileLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const [error, setError] = useState();

  const classes = useStyles();

  const onToggleEditMode = (id) => {
    setSalesData((state) => {
      return salesData.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    let value = e.target.value;
    const name = e.target.name;
    value = name === "qnty" ? parseInt(value) : value;
    //console.log(name, value);
    const { id } = row;
    const newRows = salesData.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setSalesData(newRows);
  };

  const onRevert = (id) => {
    const newRows = salesData.map((row) => {
      if (row.id === id) {
        return previous[id] ? previous[id] : row;
      }
      return row;
    });
    setSalesData(newRows);
    setPrevious((state) => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
  };

  const handleFileReader = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    setError(null);
    setIsSuccess(null);
    setFileLoading(true);
    try {
      if (!file) {
        setError("No file is selected");
      }

      /* Boilerplate to set up FileReader */
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws);
        //const heading = data.shift();
        //increment and add id property for table
        data.forEach((item, i) => {
          item.id = i + 1;
        });
        //console.log(data, "sdasdasd");
        setSalesData(data);
        setFileLoading(false);
        /* Update state */
        // this.setState({ data: data, cols: make_cols(ws["!ref"]) });
      };
      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    } catch (error) {
      setError("Something wrong please select proper file");
      setFileLoading(false);
    }
    e.target.value = null;
  };

  const make_cols = (refstr) => {
    let o = [],
      C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i)
      o[i] = { name: XLSX.utils.encode_col(i), key: i };
    return o;
  };

  const handleSubmitData = (e) => {
    const newSalesData = [...salesData];
    newSalesData.forEach(function (v) {
      delete v.isEditMode;
    });
    e.preventDefault();
    if (!salesData) {
      setError("Sorry we could not submit data!");
      return;
    }
    orderService.SaveSales(newSalesData);
    setSalesData([]);
    setIsSuccess("Sales submited successfuly!");
  };

  const SheetJSFT = [
    "xlsx",
    "xlsb",
    "xlsm",
    "xls",
    "xml",
    "csv",
    "txt",
    "ods",
    "fods",
    "uos",
    "sylk",
    "dif",
    "dbf",
    "prn",
    "qpw",
    "123",
    "wb*",
    "wq*",
    "html",
    "htm",
  ]
    .map(function (x) {
      return "." + x;
    })
    .join(",");
  //console.log(fileLoading, "fileloading");
  return (
    <>
      <Grid container>
        <div styles={{ marginTop: "5px" }}>
          <input
            accept={SheetJSFT}
            className={classes.input}
            style={{ display: "none" }}
            id="raised-button-file"
            onChange={(e) => handleFileReader(e)}
            type="file"
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="outlined"
              component="span"
              color="primary"
              className={classes.button}
            >
              Upload Daily Sales
            </Button>
          </label>
          {salesData && salesData.length > 0 && (
            <Button
              variant="contained"
              component="span"
              color="primary"
              style={{ marginLeft: "15px" }}
              className={classes.button}
              onClick={(e) => handleSubmitData(e)}
            >
              Submit Sales Data
            </Button>
          )}
        </div>
      </Grid>
      <Grid container styles={{ marginTop: "5px" }}>
        <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
          <br />
          {fileLoading ? (
            `Loading...`
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : isSuccess ? (
            <Alert severity="success">{isSuccess}</Alert>
          ) : salesData && salesData.length > 0 ? (
            <Paper className={classes.root}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {salesColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesData.map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell className={classes.selectTableCell}>
                        {row.isEditMode ? (
                          <>
                            <IconButton
                              aria-label="done"
                              onClick={() => onToggleEditMode(row.id)}
                            >
                              <DoneIcon />
                            </IconButton>
                            <IconButton
                              aria-label="revert"
                              onClick={() => onRevert(row.id)}
                            >
                              <RevertIcon />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            aria-label="delete"
                            onClick={() => onToggleEditMode(row.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </TableCell>
                      <CustomTableCell {...{ row, name: "code", onChange }} />
                      <CustomTableCell {...{ row, name: "qnty", onChange }} />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : (
            <></>
          )}
        </div>
      </Grid>
    </>
  );
}

export default SalesOrder;
