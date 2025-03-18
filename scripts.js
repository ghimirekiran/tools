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

    // Time and Date Display
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');

    function updateDateTime() {
        const now = new Date();
        
        // Update time
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;

        // Update date
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }

    // Update time immediately and then every second
    updateDateTime();
    setInterval(updateDateTime, 1000);

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
