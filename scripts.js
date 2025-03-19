document.addEventListener('DOMContentLoaded', () => {
    // Initialize local storage
    if (!localStorage.getItem('smokingData')) {
        localStorage.setItem('smokingData', JSON.stringify({
            todayCount: 0,
            weeklyData: Array(7).fill(0),
            lastReset: new Date().toDateString()
        }));
    }

    if (!localStorage.getItem('tasks')) {
        localStorage.setItem('tasks', JSON.stringify([]));
    }

    if (!localStorage.getItem('notes')) {
        localStorage.setItem('notes', JSON.stringify([]));
    }

    if (!localStorage.getItem('goals')) {
        localStorage.setItem('goals', JSON.stringify([]));
    }

    if (!localStorage.getItem('reminders')) {
        localStorage.setItem('reminders', JSON.stringify([]));
    }

    if (!localStorage.getItem('todos')) {
        localStorage.setItem('todos', JSON.stringify([]));
    }

    // Smoking Counter Logic
    const smokingData = JSON.parse(localStorage.getItem('smokingData'));
    const todayCountElement = document.getElementById('today-count');
    const weeklyAverageElement = document.getElementById('weekly-average');

    // Check if we need to reset the daily counter
    if (smokingData.lastReset !== new Date().toDateString()) {
        smokingData.weeklyData.shift();
        smokingData.weeklyData.push(smokingData.todayCount);
        smokingData.todayCount = 0;
        smokingData.lastReset = new Date().toDateString();
        localStorage.setItem('smokingData', JSON.stringify(smokingData));
    }

    function updateSmokingStats() {
        todayCountElement.textContent = smokingData.todayCount;
        const average = (smokingData.weeklyData.reduce((a, b) => a + b, 0) / 7).toFixed(1);
        weeklyAverageElement.textContent = average;
    }

    document.getElementById('add-cigarette').addEventListener('click', () => {
        smokingData.todayCount++;
        localStorage.setItem('smokingData', JSON.stringify(smokingData));
        updateSmokingStats();
    });

    document.getElementById('reset-counter').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset today\'s count?')) {
            smokingData.todayCount = 0;
            localStorage.setItem('smokingData', JSON.stringify(smokingData));
            updateSmokingStats();
        }
    });

    // Task Manager Logic
    const taskList = document.getElementById('task-list');
    const tasks = JSON.parse(localStorage.getItem('tasks'));

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task}</span>
                <button class="secondary-btn" onclick="deleteTask(${index})">Delete</button>
            `;
            taskList.appendChild(li);
        });
    }

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    document.getElementById('add-task').addEventListener('click', () => {
        const input = document.getElementById('new-task');
        const task = input.value.trim();
        if (task) {
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            input.value = '';
            renderTasks();
        }
    });

    // Notes Logic
    const notesList = document.getElementById('notes-list');
    const notes = JSON.parse(localStorage.getItem('notes'));

    function renderNotes() {
        notesList.innerHTML = '';
        notes.forEach((note, index) => {
            const div = document.createElement('div');
            div.className = 'note-card';
            div.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <button class="secondary-btn" onclick="deleteNote(${index})">Delete</button>
            `;
            notesList.appendChild(div);
        });
    }

    window.deleteNote = (index) => {
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
    };

    document.getElementById('save-note').addEventListener('click', () => {
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (title && content) {
            notes.push({ title, content });
            localStorage.setItem('notes', JSON.stringify(notes));
            titleInput.value = '';
            contentInput.value = '';
            renderNotes();
        }
    });

    // Goals Logic
    const goalList = document.getElementById('goal-list');
    const goals = JSON.parse(localStorage.getItem('goals'));

    function renderGoals() {
        goalList.innerHTML = '';
        goals.forEach((goal, index) => {
            const li = document.createElement('li');
            if (goal.completed) {
                li.classList.add('completed');
            }
            li.innerHTML = `
                <div class="goal-content">
                    <input type="checkbox" ${goal.completed ? 'checked' : ''} onchange="toggleGoal(${index})">
                    <span class="goal-text">${goal.text}</span>
                </div>
                <div class="goal-actions">
                    <button class="secondary-btn" onclick="deleteGoal(${index})">Delete</button>
                </div>
            `;
            goalList.appendChild(li);
        });
    }

    window.toggleGoal = (index) => {
        goals[index].completed = !goals[index].completed;
        localStorage.setItem('goals', JSON.stringify(goals));
        renderGoals();
    };

    window.deleteGoal = (index) => {
        goals.splice(index, 1);
        localStorage.setItem('goals', JSON.stringify(goals));
        renderGoals();
    };

    document.getElementById('add-goal').addEventListener('click', () => {
        const input = document.getElementById('new-goal');
        const goalText = input.value.trim();
        if (goalText) {
            goals.push({
                text: goalText,
                completed: false,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('goals', JSON.stringify(goals));
            input.value = '';
            renderGoals();
        }
    });

    // Reminders Logic
    const reminderList = document.getElementById('reminder-list');
    const reminders = JSON.parse(localStorage.getItem('reminders'));

    function renderReminders() {
        reminderList.innerHTML = '';
        reminders.sort((a, b) => {
            // Sort by completion status first
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            // Then by urgency
            if (a.urgent !== b.urgent) {
                return b.urgent ? 1 : -1;
            }
            // Finally by date
            return new Date(b.createdAt) - new Date(a.createdAt);
        }).forEach((reminder, index) => {
            const li = document.createElement('li');
            if (reminder.completed) {
                li.classList.add('completed');
            }
            if (reminder.urgent) {
                li.classList.add('urgent');
            }
            
            const date = new Date(reminder.createdAt);
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            li.innerHTML = `
                <div class="reminder-content">
                    <input type="checkbox" ${reminder.completed ? 'checked' : ''} onchange="toggleReminder(${index})">
                    <span class="reminder-text">${reminder.text}</span>
                    <span class="reminder-date">${formattedDate}</span>
                </div>
                <div class="reminder-actions">
                    <button class="secondary-btn" onclick="toggleUrgent(${index})">
                        ${reminder.urgent ? 'Remove Urgent' : 'Mark Urgent'}
                    </button>
                    <button class="secondary-btn" onclick="deleteReminder(${index})">Delete</button>
                </div>
            `;
            reminderList.appendChild(li);
        });
    }

    window.toggleReminder = (index) => {
        reminders[index].completed = !reminders[index].completed;
        localStorage.setItem('reminders', JSON.stringify(reminders));
        renderReminders();
    };

    window.toggleUrgent = (index) => {
        reminders[index].urgent = !reminders[index].urgent;
        localStorage.setItem('reminders', JSON.stringify(reminders));
        renderReminders();
    };

    window.deleteReminder = (index) => {
        reminders.splice(index, 1);
        localStorage.setItem('reminders', JSON.stringify(reminders));
        renderReminders();
    };

    document.getElementById('add-reminder').addEventListener('click', () => {
        const input = document.getElementById('new-reminder');
        const reminderText = input.value.trim();
        if (reminderText) {
            reminders.push({
                text: reminderText,
                completed: false,
                urgent: false,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('reminders', JSON.stringify(reminders));
            input.value = '';
            renderReminders();
        }
    });

    // Todo List Logic
    const todoList = document.getElementById('todo-list');
    const todos = JSON.parse(localStorage.getItem('todos'));

    function renderTodos() {
        todoList.innerHTML = '';
        todos.sort((a, b) => {
            // Sort by completion status first
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            
            // Then by priority (high to low)
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            if (a.priority !== b.priority) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            
            // Finally by date (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt);
        }).forEach((todo, index) => {
            const li = document.createElement('li');
            if (todo.completed) {
                li.classList.add('completed');
            }
            
            const priorityLabel = todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1);
            
            li.innerHTML = `
                <div class="todo-content">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${index})">
                    <span class="todo-text">${todo.text}</span>
                    <span class="todo-priority ${todo.priority}">${priorityLabel}</span>
                </div>
                <div class="todo-actions">
                    <button class="secondary-btn" onclick="editTodoPriority(${index})">Edit Priority</button>
                    <button class="secondary-btn" onclick="deleteTodo(${index})">Delete</button>
                </div>
            `;
            todoList.appendChild(li);
        });
    }

    window.toggleTodo = (index) => {
        todos[index].completed = !todos[index].completed;
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    };

    window.editTodoPriority = (index) => {
        const priorities = ['low', 'medium', 'high'];
        const currentPriority = todos[index].priority;
        const currentIndex = priorities.indexOf(currentPriority);
        const nextIndex = (currentIndex + 1) % priorities.length;
        
        todos[index].priority = priorities[nextIndex];
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    };

    window.deleteTodo = (index) => {
        todos.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    };

    document.getElementById('add-todo').addEventListener('click', () => {
        const input = document.getElementById('new-todo');
        const prioritySelect = document.getElementById('todo-priority');
        const todoText = input.value.trim();
        
        if (todoText) {
            todos.push({
                text: todoText,
                completed: false,
                priority: prioritySelect.value,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('todos', JSON.stringify(todos));
            input.value = '';
            renderTodos();
        }
    });

    // Add Enter key functionality for todo input
    document.getElementById('new-todo').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('add-todo').click();
        }
    });

    // Hamburger menu toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Initialize all components
    updateSmokingStats();
    renderTasks();
    renderNotes();
    renderGoals();
    renderReminders();
    renderTodos();

    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                navLinks.classList.remove('active'); // Close menu after clicking
            }
        });
    });

    // Add active state to navigation items
    const navLinksList = document.querySelectorAll('nav a');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            navLinksList.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
});
