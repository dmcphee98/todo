// Selectors
// The querySelector() method returns the FIRST element that matches a CSS selector
// In this case, the CSS selectors are classes from index.html, denoted .class
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOptions = document.querySelector('.filter-todo')

// Event listeners
// Subscribes a function to an event
// List of all events can be found at https://www.w3schools.com/jsref/dom_obj_event.asp
todoButton.addEventListener('click', addTodoFromEvent);
// This will trigger when any child element of the list is clicked
todoList.addEventListener('click', removeOrCheck);
// Triggered when the filter option is changed
filterOptions.addEventListener('change', filterTodo);
// Triggered when the page loads
document.addEventListener('DOMContentLoaded', readTodos);

// Functions

function addTodoFromEvent(event) {
    // Cancels the default action that belongs to an event. In this case, prevents form submission
    event.preventDefault();
    // Do nothing if todo input field is empty
    if (todoInput.value == "") return;
    addTodo(todoInput.value);
    // Clear todo input field
    todoInput.value = "";
    todoInput.focus();
}

function addTodo(todoText) {

    console.log("Creating Todo");

    const todoDiv = document.createElement('div');
    // Assigns the 'todo' class to todoDiv
    todoDiv.classList.add('todo')
    todoDiv.classList.add('todo-transition')

    // Create new todo list item
    const newTodo = document.createElement('li');
    // Adds plaintext between <li> </li> tags
    newTodo.innerText = todoText;

    newTodo.classList.add('todo-item');
    // Add as child of new div
    todoDiv.appendChild(newTodo);

    // Create new checkmark button
    const completeButton = document.createElement('button');
    // Adds HTML code between <button> </button> tags
    completeButton.innerHTML = '<i class="fa-solid fa-square-check"></i>';
    completeButton.classList.add('complete-btn');
    todoDiv.appendChild(completeButton);

    // Create new remove button
    const removeButton = document.createElement('button');
    removeButton.innerHTML = '<i class="fa-solid fa-square-xmark"></i>';
    removeButton.classList.add('remove-btn');
    todoDiv.appendChild(removeButton);

    // Add new todoDiv (with all its children) to todoList
    todoList.appendChild(todoDiv);

    // Update visibility status
    toggleTodoVisibility(filterOptions.value);
    // Add todo to local storage
    updateTodoLocalStorage()

    return todoDiv;
}

function removeOrCheck (event) {
    // event.target returns the element that was clicked within the list
    console.log(event.target);

    const item = event.target;

    // Remove button
    if (item.classList.contains('remove-btn')) {
        // Get the todo that contains this button and delete it
        const todo = item.parentElement;
        todo.classList.add('fall');
        // todo.remove(); This deleted the element before the transition ends
        // This waits until the transition finishes before deleting
        todo.addEventListener('transitionend', function(){
            todo.remove();
            // Update todo status in local storage
            updateTodoLocalStorage()
        });
    } 

    // Check button
    if (item.classList.contains('complete-btn')) {
        // Get the todo that contains this button and delete it
        const todo = item.parentElement;
        // classList.toggle adds the 'completed' class to todo if not 
        // already present, and removes the class if it is present
        todo.classList.toggle('complete');

        // Update visibility status
        toggleTodoVisibility(filterOptions.value);
        // Update todo status in local storage
        updateTodoLocalStorage()
    } 
}

function filterTodo(event) {
    toggleTodoVisibility(event.target.value);
}

function toggleTodoVisibility(filterValue) {
    // The below doesn't work because it returns an HTMLcollection, not a NodeList, 
    // and HTMLcollection doesn't have the forEach method defined.
    
    // const todos = todoList.children;

    // The below doesn't work because childNodes returns NODES, which include not only 
    // elements, but also text and even comments!

    // const todos = todoList.childNodes;
    const todos = document.querySelectorAll('.todo');

    // Loop through all todos and hide/reveal based on filter value
    todos.forEach(function(todo){
        switch(filterValue) {
            case "all":
                // .style allows access to the CSS properties of the element
                todo.style.display = 'flex';
                break;
            case "complete":
                if (todo.classList.contains('complete')) {
                    // Setting display = flex makes the element reappear
                    todo.style.display = 'flex';
                } else {
                    // Setting display = none hides the element
                    // Element acts as if it were completely removed
                    todo.style.display = 'none';
                }
                break;
            case "incomplete":
                if (todo.classList.contains('complete')) {
                    todo.style.display = 'none';
                } else {
                    todo.style.display = 'flex';
                }
                break; 
        }
    });
}

function updateTodoLocalStorage() {
    /* localStorage allows saving of key/value pairs in the browser,
    with no expiration date. See below link for more info.
     https://www.w3schools.com/jsref/prop_win_localstorage.asp */

    let todos = document.querySelectorAll('.todo');

    let todoContent = [];
    let todoCompleteStatus = [];

    todos.forEach(function(todo){
        todoContent.push(todo.innerText);
        if (todo.classList.contains('complete')) {
            todoCompleteStatus.push(1)
        } else {
            todoCompleteStatus.push(0)
        }

    });

    // JSON.stringify converts JS to JSON
    localStorage.setItem("todoContent", JSON.stringify(todoContent));
    localStorage.setItem("todoCompleteStatus", JSON.stringify(todoCompleteStatus));
}

function readTodos() {
    let todos;

    console.log("Reading todos from file.")
    // If no existing todo list saved locally, create new todo list
    if (localStorage.getItem('todoContent')) {
        todoContent = JSON.parse(localStorage.getItem('todoContent'));
        todoCompleteStatus = JSON.parse(localStorage.getItem('todoCompleteStatus'));
    }
    // This is a means of getting the index of the current forEach iteration
    todoContent.forEach(function callback(value, index){
        let todo = addTodo(value)
        if (todoCompleteStatus[index] == 1) {
            todo.classList.toggle('complete');
            updateTodoLocalStorage()
        }
    });
}

