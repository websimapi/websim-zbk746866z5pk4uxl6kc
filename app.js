// Using ES modules and modern JavaScript
// Initialize the WebsimSocket instance to handle realtime database operations
const room = new WebsimSocket();

const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

let todos = [];

// Helper function to create an HTML element with classes and attributes
function createElement(type, options = {}) {
  const el = document.createElement(type);
  if (options.classes) {
    options.classes.forEach(cls => el.classList.add(cls));
  }
  if (options.attributes) {
    Object.keys(options.attributes).forEach(attr => {
      el.setAttribute(attr, options.attributes[attr]);
    });
  }
  if (options.text) {
    el.textContent = options.text;
  }
  return el;
}

// Render the todo list
function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = createElement('li', { classes: ['todo-item'] });
    if (todo.completed) li.classList.add('todo-completed');

    const span = createElement('span', { classes: ['todo-text'], text: todo.text });
    li.appendChild(span);

    const actionsDiv = createElement('div', { classes: ['todo-actions'] });
    
    // Complete button
    const completeBtn = createElement('button', { classes: ['btn', 'complete'] });
    completeBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18">
        <polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" stroke-width="2"/>
      </svg>
    `;
    completeBtn.addEventListener('click', () => toggleComplete(index));
    actionsDiv.appendChild(completeBtn);

    // Delete button
    const deleteBtn = createElement('button', { classes: ['btn', 'delete'] });
    deleteBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18">
        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
      </svg>
    `;
    deleteBtn.addEventListener('click', () => deleteTodo(index));
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(actionsDiv);
    todoList.appendChild(li);
  });
}

// Add todo item and persist to the database
async function addTodo() {
  const text = todoInput.value.trim();
  if (text === "") return;
  const newTodo = { text, completed: false };
  
  // Add to local list and render immediately
  todos.push(newTodo);
  renderTodos();
  todoInput.value = "";

  // Persist the todo entry to the database using WebsimSocket's collection API
  try {
    await room.collection('todo').create(newTodo);
    console.log('Todo saved:', newTodo);
  } catch (error) {
    console.error('Error saving todo:', error);
  }
}

// Toggle todo completion and update the database if needed
function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  renderTodos();
  // Optionally, you could persist the update here with:
  // room.collection('todo').update(todoId, { completed: todos[index].completed });
}

// Delete todo item and update the database if needed
function deleteTodo(index) {
  const removed = todos.splice(index, 1)[0];
  renderTodos();
  // Optionally, you could persist the deletion here with:
  // room.collection('todo').delete(todoId);
}

// Event listeners
addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') addTodo();
});
  
// Initial render
renderTodos();