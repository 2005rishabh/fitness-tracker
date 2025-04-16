const userGreeting = document.getElementById('userGreeting');
const loginLink = document.getElementById('loginLink');
const signupLink = document.getElementById('signupLink');
const logoutBtn = document.getElementById('logoutBtn');
const user = JSON.parse(localStorage.getItem('user'));

const form = document.getElementById('workoutForm');
const workoutList = document.getElementById('workoutList');
const totalWorkoutsEl = document.getElementById('totalWorkouts');
const totalDurationEl = document.getElementById('totalDuration');
const averageDurationEl = document.getElementById('averageDuration');
const summarySection = document.getElementById('summary');

let workouts = JSON.parse(localStorage.getItem('workouts')) || [];

if (user) {
    userGreeting.textContent = `Welcome, ${user.name}`;
    userGreeting.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    loginLink.classList.add('hidden');
    signupLink.classList.add('hidden');
    summarySection.classList.remove('hidden');
    renderWorkouts();
} else {
    alert('Please login to access the workout tracker.');
    window.location.href = 'login.html';
}

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    alert('You have been logged out.');
    window.location.reload();
});

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const exercise = document.getElementById('exercise').value;
    const duration = parseInt(document.getElementById('duration').value);
    const date = new Date().toLocaleDateString();

    const workout = { exercise, duration, date };
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    renderWorkouts();
    form.reset();

    if (workouts.length % 3 === 0) {
        alert('Great job! You have logged 3 workouts! 💪');
    }
});

function renderWorkouts() {
    workoutList.innerHTML = '';
    let totalDuration = 0;

    workouts.forEach((w, index) => {
        const li = document.createElement('li');
        li.className = 'bg-white p-4 rounded shadow flex justify-between items-center';

        const info = document.createElement('div');
        info.textContent = `${w.date}: ${w.exercise} - ${w.duration} min`;

        const buttons = document.createElement('div');
        buttons.className = 'space-x-2';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'bg-yellow-400 text-white px-2 py-1 rounded';
        editBtn.dataset.index = index;
        editBtn.addEventListener('click', handleEdit);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'bg-red-500 text-white px-2 py-1 rounded';
        deleteBtn.dataset.index = index;
        deleteBtn.addEventListener('click', handleDelete);

        buttons.appendChild(editBtn);
        buttons.appendChild(deleteBtn);

        li.appendChild(info);
        li.appendChild(buttons);
        workoutList.appendChild(li);

        totalDuration += w.duration;
    });

    const totalWorkouts = workouts.length;
    const averageDuration = totalWorkouts ? (totalDuration / totalWorkouts).toFixed(1) : 0;

    totalWorkoutsEl.textContent = totalWorkouts;
    totalDurationEl.textContent = totalDuration;
    averageDurationEl.textContent = averageDuration;
}

function handleEdit(e) {
    const index = e.target.dataset.index;
    const workout = workouts[index];

    const newExercise = prompt('Edit exercise name:', workout.exercise);
    const newDuration = prompt('Edit duration in minutes:', workout.duration);

    if (newExercise && newDuration) {
        workouts[index] = {
            ...workout,
            exercise: newExercise,
            duration: parseInt(newDuration),
        };
        localStorage.setItem('workouts', JSON.stringify(workouts));
        renderWorkouts();
    }
}

function handleDelete(e) {
    const index = e.target.dataset.index;
    const confirmDelete = confirm('Are you sure you want to delete this workout?');
    if (confirmDelete) {
        workouts.splice(index, 1);
        localStorage.setItem('workouts', JSON.stringify(workouts));
        renderWorkouts();
    }
}