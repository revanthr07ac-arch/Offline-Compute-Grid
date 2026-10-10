import express from 'express';
import cors from 'cors';
import { devices, tasks, DeviceType, Task } from './data';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// In-memory data store
let currentDevices = [...devices];
let currentTasks = [...tasks];

// GET /api/devices
app.get('/api/devices', (req, res) => {
  res.json(currentDevices);
});

// GET /api/devices/:id
app.get('/api/devices/:id', (req, res) => {
  const device = currentDevices.find(d => d.id === req.params.id);
  if (device) {
    res.json(device);
  } else {
    res.status(404).json({ message: 'Device not found' });
  }
});

// GET /api/tasks
app.get('/api/tasks', (req, res) => {
  res.json(currentTasks);
});

// GET /api/tasks/:id
app.get('/api/tasks/:id', (req, res) => {
  const task = currentTasks.find(t => t.id === req.params.id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// POST /api/tasks
app.post('/api/tasks', (req, res) => {
  const { name, type, priority } = req.body;
  const newTask: Task = {
    id: `t${Date.now()}`,
    name: name || 'Unnamed Task',
    type: type || 'Unknown',
    priority: priority || 'medium',
    progress: 0,
    eta: '—',
    workers: 0,
    size: '0 MB',
    by: 'admin',
    status: 'pending',
  };
  currentTasks.push(newTask);
  res.status(201).json(newTask);
});

// GET /api/dashboard
app.get('/api/dashboard', (req, res) => {
  // Generate random data to simulate real-time metrics
  const cpuData = Array.from({ length: 20 }, (_, i) => ({ v: Math.round(40 + Math.sin(i / 3) * 20 + Math.random() * 15) }));
  const memData = Array.from({ length: 20 }, (_, i) => ({ v: Math.round(40 + Math.sin(i / 3) * 20 + Math.random() * 15) }));
  const netData = Array.from({ length: 20 }, (_, i) => ({ v: Math.round(40 + Math.sin(i / 3) * 20 + Math.random() * 15) }));
  const diskData = Array.from({ length: 20 }, (_, i) => ({ v: Math.round(40 + Math.sin(i / 3) * 20 + Math.random() * 15) }));

  res.json({
    metrics: {
      connectedDevices: currentDevices.length,
      onlineDevices: currentDevices.filter(d => d.status !== 'offline').length,
      runningTasks: currentTasks.filter(t => t.status === 'running').length,
      queuedTasks: currentTasks.filter(t => t.status === 'pending').length,
    },
    charts: {
      cpuData,
      memData,
      netData,
      diskData
    }
  });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Dummy authentication
  if (email && password) {
    res.json({ token: 'fake-jwt-token-123', user: { email } });
  } else {
    res.status(400).json({ message: 'Email and password required' });
  }
});

// Simulate task progression
setInterval(() => {
  currentTasks.forEach(task => {
    if (task.status === 'pending') {
      task.status = 'running';
      task.workers = Math.floor(Math.random() * 4) + 1;
    }
    if (task.status === 'running') {
      task.progress += Math.floor(Math.random() * 5) + 1;
      if (task.progress >= 100) {
        task.progress = 100;
        task.status = 'completed';
        task.eta = '—';
      } else {
        task.eta = `${Math.floor((100 - task.progress) / 5)} min`;
      }
    }
  });
}, 3000);

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
