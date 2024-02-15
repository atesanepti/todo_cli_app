// Title : Simple ToDo Application,
// Description : Simple CLI ToDo Application By Nodejs,
// Athor : San Bin Hoque,
// Data : 2/11/2024

// Dependencies
const fs = require("fs");
const readline = require("readline");

// Creating Interface For Read User Input
const rl = readline.createInterface(process.stdin, process.stdout);

// App Object ->
const app = {};

// App Commands
app.command = {
  ADD: "add",
  REMOVE: "remove",
  LIST: "list",
  COMPLETE: "complete",
  EXIT: "exit",
};

app.todoFile = `${__dirname}/todo_list.json`;

// Fetching ToDO Form The Local Json File
app.fetchToDo = () => {
  try {
    let todoList = fs.readFileSync(app.todoFile, "utf8");
    todoList = JSON.parse(todoList);
    return todoList;
  } catch (err) {
    console.log(err.message);
    return [];
  }
};

// Save New ToDo
app.saveToDo = (toDoList) => {
  const newToDo = JSON.stringify(toDoList, null, 2);
  fs.writeFileSync(app.todoFile, newToDo);
};

// Add ToDo
app.addToDo = (description, toDoList) => {
  const newToDo = {
    description,
    completed: false,
    serial: toDoList.length + 1,
  };
  toDoList.push(newToDo);
  app.saveToDo(toDoList);
  console.log("ToDo added successfully");
};

//Change ToDo serial no after any todo remove
app.changeToDoSerial = (toDoList)=>{
  toDoList.forEach((todo,index,array)=>{
    array[index].serial = index + 1;
  })
}

// Remove or Delete ToDo
app.removeToDo = (command, toDoList) => {
  command.sort((a, b) => b - a);
  command.forEach((cmd) => {
    let index = parseInt(cmd) - 1;
    if (index >= 0 && index < toDoList.length) {
      toDoList.splice(index, 1);
    } else {
      console.log("Invalid ToDo Index");
    }
  });
  app.changeToDoSerial(toDoList);
  app.saveToDo(toDoList);

  const removedToDo = command.join(",");
  console.log(removedToDo + " ToDo Removed");
};

// List or Show all ToDo
app.listAllToDo = (toDoList) => {
  console.log("ToDo List!");
  toDoList.forEach((toDo, index) => {
    const status = toDo.completed ? "panding" : "completed";
    console.log(`${index + 1}. ${toDo.description} [${status}]`);
  });
};

// Change ToDo Status
app.toDoStatus = (index, toDoList) => {
  if (index >= 0 && index < toDoList.length) {
    if (toDoList[index].completed) {
      console.log("This ToDo Already Completed!");
    } else {
      console.log("Changed! Now This Task Completed!");
      toDoList[index].completed = true;
      app.saveToDo(toDoList);
    }
  } else {
    console.log("Invalid ToDo Index");
  }
};

app.exit = () => {
  rl.close();
};

// Handle All Command
app.handleCommand = (input, toDoList) => {
  const arg = input.trim().split(" ");
  const command = arg.shift().toLowerCase();

  switch (command) {
    case app.command.ADD:
      app.addToDo(arg.join(" "), toDoList);
      break;
    case app.command.REMOVE:
      app.removeToDo(arg, toDoList);
      break;
    case app.command.LIST:
      app.listAllToDo(toDoList);
      break;
    case app.command.COMPLETE:
      app.toDoStatus(parseInt(arg[0]) - 1, toDoList);
      break;
    case app.command.EXIT:
      app.exit();
      break;
    default:
      console.log("Invalid Command");
  }
};

// Start The Applicatin
app.initApp = () => {
  console.log("Welcome to Todo Application!");
  rl.setPrompt("Enter Command $ ");
  rl.prompt();

  rl.on("line", (input) => {
    let toDoList = app.fetchToDo();
    app.handleCommand(input, toDoList);
    rl.prompt();
  });
  rl.on("close", () => {
    console.log(
      "App Is Closed\nDo You Want To Use This App again? Type This -> node script.js"
    );
    process.exit(0);
  });
};
app.initApp();
