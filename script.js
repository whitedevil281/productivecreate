const temp = document.querySelector(".temp");
const weather = document.querySelector(".weather");
const humidity = document.querySelector(".humidity");
const windspeed = document.querySelector(".wind");
const cityhtml = document.querySelector(".city");
const date = document.querySelector(".date");
const day = document.querySelector(".day");
const time = document.querySelector(".time-data");
const exitbuttons = document.querySelectorAll(".exitbutton");
const section1 = document.querySelector(".section-view1");
const section2 = document.querySelector(".section-view2");
const anchors = document.querySelectorAll(".box-anchor");
const todoapp = document.querySelector(".todo-main");
const titlepomodoro = document.querySelector(".timer-title");
const minpomodoro = document.querySelector("#pomodoro-min");
const secpomodoro = document.querySelector("#pomodoro-sec");
const startbutton = document.querySelector("#pomodoro-start");
const pausebutton = document.querySelector("#pomodoro-pause");
const resetbutton = document.querySelector("#pomodoro-reset");
const changetheme = document.querySelector("#changetheme");
const mainbox   = document.querySelector("main");

const anchorboxes = {
  todo: document.querySelector(".anchor-todo-bg"),
  dailyplanner: document.querySelector(".anchor-dailyplanner-bg"),
  motivation: document.querySelector(".anchor-motivation-bg"),
  pomodoro: document.querySelector(".anchor-pomodoro-bg"),
  kanbanboard: document.querySelector(".anchor-kanbanboard-bg"),
};

const mainboxes = document.querySelectorAll(".box-main");
const apiKey = "4863e3e4964b7207c4672e8370219e8e";

// Todo App Variables
const todoInput = document.getElementById("todo-input");
const todoAddBtn = document.getElementById("todo-add-btn");
const todoList = document.querySelector(".todo-list");
const todoImpCheckbox = document.getElementById("todo-imp-checkbox");
let todos = [];

async function getWeatherInfo() {
  try {
    const city = await fetch("https://ipinfo.io/json");
    const citydata = await city.json();
    cityhtml.innerHTML = citydata.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${citydata.city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    console.log(citydata.city);
    const data = await response.json();
    console.log(data);
    const finaldata = {
      temp: data.main.temp,
      humidity: data.main.humidity,
      windspeed: data.wind.speed,
      weather: `${data.weather[0].description[0].toUpperCase()}${data.weather[0].description.slice(
        1
      )}`,
    };
    console.log(finaldata);
    temp.innerHTML = `${Math.round(finaldata.temp)}°C`;
    weather.innerHTML = `${finaldata.weather}`;
    humidity.innerHTML = `Humidity: ${finaldata.humidity}%`;
    windspeed.innerHTML = `Wind Speed: ${Math.round(finaldata.windspeed)} km/h`;
  } catch (error) {
    console.log(error);
  }
}

async function showDayDateTime() {
  try {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const newDate = new Date();
    let daynum = newDate.getDay();
    if (daynum === 7) {
      daynum = 0;
    }
    const month = newDate.getMonth();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const datetext = newDate.getDate();
    const year = newDate.getFullYear();
    date.innerHTML = `${datetext} ${months[month]} ${year}`;
    day.innerHTML = days[daynum];
    time.innerHTML = newDate.toLocaleTimeString();
  } catch (error) {
    console.log(error);
  }
}

setInterval(() => {
  showDayDateTime();
}, 1000);

getWeatherInfo();

//pomodoro timer

// At the top with other variables
let timerpomodoro = null;
let isrunning = false;

function pomodoroTimerstart(){
  if(isrunning){
    return;
  }
  isrunning = true;
  
  // Remove 'const' here - just assign to the outer variable
  timerpomodoro = setInterval(() => {
    let min = parseInt(minpomodoro.innerHTML);
    let sec = parseInt(secpomodoro.innerHTML);
    
    if(min === 0 && sec === 0){
      if(titlepomodoro.innerHTML === "Work Session"){
        minpomodoro.innerHTML = "5";
        secpomodoro.innerHTML = "00";
        titlepomodoro.innerHTML = "Break Session";
        clearInterval(timerpomodoro);
        isrunning = false;
        return;
      }
      else{
        minpomodoro.innerHTML = "25";
        secpomodoro.innerHTML = "00";
        titlepomodoro.innerHTML = "Work Session";
        clearInterval(timerpomodoro);
        isrunning = false;
        return;
      }
    }
    else if(sec === 0){
      minpomodoro.innerHTML = min - 1;
      secpomodoro.innerHTML = "59";
    }
    else{
      secpomodoro.innerHTML = String(sec - 1).padStart(2, "0");
    }
  }, 10); // Changed from 10ms to 1000ms (1 second)
}

function pomodoroTimerpause(){
  clearInterval(timerpomodoro);
  isrunning = false;
}

function pomodoroTimerreset(){
  clearInterval(timerpomodoro);
  isrunning = false;
  minpomodoro.innerHTML = "25";
  secpomodoro.innerHTML = "00";
  titlepomodoro.innerHTML = "Work Session";
}


//exit button on click function
 function exitbutton_anchor(anchor, id, targetid, buttonexit) {
  try {
    anchor.style.positionAnchor = `--${id}`;
    anchor.id = targetid;
    anchor.classList.remove("fullscreen");
    mainbox.style.overflowY = "scroll";
    buttonexit.style.display = "none";
    const app = buttonexit.id.split("-")[0];
    console.log(app + "appexit");
    setTimeout(() => {
      document.querySelector(`.${app}app`).style.display = "none";
    }, 100);
    document.body.classList.remove("has-fullscreen");
  } catch (error) {
    console.log(error);
  }
}

//anchor fullscreen function
async function changeAnchor(anchor, id, targetid, buttonexit) {
  try {
    // GOING TO FULLSCREEN
    console.log(anchor, id, targetid);
    mainbox.style.overflowY = "hidden";
    document.body.classList.add("has-fullscreen");
    buttonexit.style.display = "block";
    anchor.style.positionAnchor = "--main";
    anchor.classList.add("fullscreen");
    const app = buttonexit.id.split("-")[0];
    console.log(app + "app");
    if(app === "motivation"){
      if(document.querySelector("#motivation-text").innerHTML === ""){
      const quoteapi =  await fetch("https://api.api-ninjas.com/v2/quoteoftheday" , {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "P5c8z6P+Tt8xCsQME3nbYA==WVjmmWIIgrFxtLUF"
        },
      });
      const quoteData = await quoteapi.json();
      const quote = quoteData[0].quote;
      const author = quoteData[0].author;
      document.querySelector("#motivation-text").innerHTML =`"${quote}"`;
      document.querySelector("#author-name").innerHTML = `-${author}`;
    }}
    setTimeout(() => {
      document.querySelector(`.${app}app`).style.display = "grid";
    }, 100);

    anchor.id = "";
  } catch (error) {
    console.log(error);
  }
}



//pomodoro timer events
startbutton.addEventListener("click", (e) => {
  e.stopPropagation();
  pomodoroTimerstart();
});

pausebutton.addEventListener("click", (e) => {
  e.stopPropagation();
  pomodoroTimerpause();
});

resetbutton.addEventListener("click", (e) => {
  e.stopPropagation();
  pomodoroTimerreset();
});




//exit button on click event using exit button function
exitbuttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const buttonElement = e.currentTarget;
    const anchorElement = buttonElement.closest(".box-anchor");
    const originalId = anchorElement.dataset.originalId;
    const anchor_id = originalId.split("-")[2];
    const anchor = anchorboxes[anchor_id];
    exitbutton_anchor(anchor, anchor_id, originalId, buttonElement);
  });
});

//anchor on click fullscreen event using change anchor function
anchors.forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const anchorElement = e.currentTarget;
    const originalId = anchorElement.dataset.originalId;
    const exitbutton = anchorElement.querySelector(".exitbutton");
    const boxid = originalId.split("-")[2];
    changeAnchor(anchorElement, boxid, originalId, exitbutton);
  });
});

//main box on click fullscreen event using change anchor function
mainboxes.forEach((mainbox) => {
  mainbox.addEventListener("click", (e) => {
    const anchor_id = e.currentTarget.id.split("-")[0];
    const anchor = anchorboxes[anchor_id];
    changeAnchor(
      anchor,
      anchor_id,
      anchor.id,
      anchor.querySelector(".exitbutton")
    );
  });
});

// ============================================
// TODO APP FUNCTIONALITY WITH LOCALSTORAGE
// ============================================

// Load todos from localStorage on page load
function loadTodos() {
  try {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      todos = JSON.parse(storedTodos);
    }
    renderTodos();
  } catch (error) {
    console.log("Error loading todos:", error);
    todos = [];
    renderTodos();
  }
}

// Save todos to localStorage
function saveTodos() {
  try {
    localStorage.setItem("todos", JSON.stringify(todos));
  } catch (error) {
    console.error("Error saving todos:", error);
  }
}

// Render todos to the DOM
function renderTodos() {
  todoList.innerHTML = "";
  
  if (todos.length === 0) {
    todoList.innerHTML = `
      <li style="
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        font-size: 1.2rem;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.5);
      ">
        No todo.
      </li>
    `;
    return;
  }
  
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
    
    li.innerHTML = `
      <div class="todo-text-wrapper">
        <span class="todo-text">${todo.text}</span>
        ${todo.important ? '<span class="imp-badge">IMP</span>' : ''}
      </div>
      <div class="todo-actions">
        <button class="edit-btn" data-index="${index}">✎</button>
        <button class="complete-btn" data-index="${index}">✓</button>
      </div>
    `;
    
    todoList.appendChild(li);
  });
  
  // Add event listeners to edit and complete buttons
  attachTodoEventListeners();
}

// Attach event listeners to dynamically created buttons
function attachTodoEventListeners() {
  const editButtons = document.querySelectorAll(".edit-btn");
  const completeButtons = document.querySelectorAll(".complete-btn");
  
  editButtons.forEach(btn => {
    btn.addEventListener("click", handleEdit);
  });
  
  completeButtons.forEach(btn => {
    btn.addEventListener("click", handleComplete);
  });
}

// Add new todo
function addTodo() {
  const text = todoInput.value.trim();
  
  if (text === "") {
    return;
  }
  
  const newTodo = {
    id: Date.now(),
    text: text,
    important: todoImpCheckbox.checked,
    completed: false
  };
  
  todos.push(newTodo);
  saveTodos();
  renderTodos();
  todoInput.value = "";
  todoImpCheckbox.checked = false;
}

// Handle edit
function handleEdit(e) {
  const index = e.target.dataset.index;
  const todoItem = todos[index];
  
  const newText = prompt("Edit your task:", todoItem.text);
  
  if (newText !== null && newText.trim() !== "") {
    todos[index].text = newText.trim();
    saveTodos();
    renderTodos();
  }
}

// Handle complete (toggle completion status)

function handleComplete(e) {
  const index = e.target.dataset.index;

  // remove todo from array
  todos.splice(index, 1);

  saveTodos();
  renderTodos();
}


// Event Listeners for Todo App
todoAddBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

// Initialize todo app
loadTodos();

const root = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
}

changetheme.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-theme");

  if (currentTheme === "dark") {
    root.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
});
