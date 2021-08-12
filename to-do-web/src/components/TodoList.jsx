import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  TableHead,
  Typography,
  withStyles,
} from "@material-ui/core";
import axios from "axios";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:8000/");

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:8000/fetchAllTasks")
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleAddTask = () => {
    socket.emit("add", newTask);
    setTasks([...tasks, newTask]);
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs>
        <Card
          style={{
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            maxHeight: "50%",
          }}
        >
          <CardContent>
            <Grid container>
              <Grid item></Grid>
              <Grid item>
                <Typography color="textPrimary">
                  <strong>Note App</strong>
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              direction="row"
              alignItems="center"
              justifyContent="center"
            >
              <Grid item style={{ marginRight: "10px" }}>
                <TextField
                  placeholder="New Note..."
                  variant="outlined"
                  onChange={(e) => setNewTask(e.target.value)}
                  style={{ height: "10%" }}
                />
              </Grid>
              <Grid item xs>
                <Button
                  variant="contained"
                  style={{
                    background: newTask ? "#990000" : "#808080",
                    color: newTask ? "white" : "black",
                  }}
                  startIcon={<AddCircleIcon color="inherit" />}
                  disabled={newTask ? false : true}
                  onClick={handleAddTask}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            <Grid
              style={{
                maxHeight: "400px",
                overflow: "auto",
                overflowY: "scroll",
                scrollbarColor: "#990000 #808080",
              }}
            >
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Notes</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks &&
                      tasks.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
