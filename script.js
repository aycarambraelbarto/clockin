let workers = {};
let adminPassword = "12345";

function clockIn() {
    const code = document.getElementById('worker-code').value;
    if (workers[code]) {
        document.getElementById('worker-name').innerText = workers[code].name;
        document.getElementById('clock-in-form').style.display = 'none';
        document.getElementById('worker-info').style.display = 'block';
        displayHistory(code);
    } else {
        alert('Invalid code!');
    }
}

function logEvent(type) {
    const code = document.getElementById('worker-code').value;
    const time = new Date().toLocaleString();
    workers[code].history.push({ event: type, time: time });
    displayHistory(code);
}

function displayHistory(code) {
    const history = workers[code].history;
    const historyTable = document.getElementById('history').getElementsByTagName('tbody')[0];
    historyTable.innerHTML = '';
    history.forEach(entry => {
        const row = historyTable.insertRow();
        const eventCell = row.insertCell(0);
        const timeCell = row.insertCell(1);
        eventCell.innerText = entry.event.replace('_', ' ');
        timeCell.innerText = entry.time;
    });
}

function resetClockIn() {
    document.getElementById('worker-code').value = '';
    document.getElementById('clock-in-form').style.display = 'block';
    document.getElementById('worker-info').style.display = 'none';
}

function showAdminPage() {
    document.getElementById('clock-in-site').style.display = 'none';
    document.getElementById('admin-site').style.display = 'block';
}

function showClockInPage() {
    document.getElementById('admin-site').style.display = 'none';
    document.getElementById('clock-in-site').style.display = 'block';
    document.getElementById('admin-controls').style.display = 'none';
    document.getElementById('admin-content').innerHTML = '';
}

function validateAdmin() {
    const password = document.getElementById('admin-password').value;
    if (password === adminPassword) {
        document.getElementById('admin-controls').style.display = 'block';
        document.getElementById('admin-password').value = '';
    } else {
        alert('Incorrect password!');
    }
}

function showAddWorker() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function addWorker() {
    const name = document.getElementById('new-worker-name').value;
    const code = document.getElementById('new-worker-code').value;
    if (name && code) {
        workers[code] = { name: name, history: [] };
        alert('Worker added successfully!');
        closeModal();
    } else {
        alert('Please enter both name and code!');
    }
}

function showWorkers() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = '<h2>Workers</h2><table><thead><tr><th>Name</th><th>Code</th></tr></thead><tbody>';
    for (let code in workers) {
        adminContent.innerHTML += `<tr><td>${workers[code].name}</td><td>${code}</td></tr>`;
    }
    adminContent.innerHTML += '</tbody></table>';
}

function showTimeLogs() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = '<h2>Time Logs</h2>';
    for (let code in workers) {
        const totalHours = calculateTotalHours(workers[code].history);
        adminContent.innerHTML += `<h3>${workers[code].name} (${totalHours.total} hours, ${totalHours.overtime} overtime)</h3><table><thead><tr><th>Event</th><th>Time</th></tr></thead><tbody>`;
        workers[code].history.forEach(entry => {
            adminContent.innerHTML += `<tr><td>${entry.event.replace('_', ' ')}</td><td>${entry.time}</td></tr>`;
        });
        adminContent.innerHTML += '</tbody></table>';
    }
}

function calculateTotalHours(history) {
    let totalHours = 0;
    let overtime = 0;
    let inTime = null;

    history.forEach(entry => {
        if (entry.event === 'clock_in') {
            inTime = new Date(entry.time);
        } else if (entry.event === 'clock_out' && inTime) {
            const outTime = new Date(entry.time);
            const hours = (outTime - inTime) / 1000 / 3600;
            totalHours += hours;
            inTime = null;
        }
    });

    if (totalHours > 45) {
        overtime = totalHours - 45;
        totalHours = 45;
    }

    return { total: totalHours, overtime: overtime };
}
