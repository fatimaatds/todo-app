import { useState, useEffect } from 'react';

export default function Home() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Load tasks from localStorage (if valid)
  useEffect(() => {
    const saved = localStorage.getItem('my-todo-list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.every(item => typeof item === 'object' && 'text' in item);
          if (valid) setTasks(parsed);
        }
      } catch (err) {
        console.error('Error reading localStorage', err);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('my-todo-list', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (task.trim() === '') return;

    if (editingIndex !== null) {
      const updated = [...tasks];
      updated[editingIndex].text = task;
      setTasks(updated);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, { text: task, completed: false }]);
    }
    setTask('');
  };

  const handleDeleteTask = (index) => {
    const filtered = tasks.filter((_, i) => i !== index);
    setTasks(filtered);
  };

  const handleToggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const handleEditTask = (index) => {
    setTask(tasks[index].text);
    setEditingIndex(index);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>📝 My To-Do App</h1>

      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={{
            padding: '10px',
            width: '250px',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        />
        <button
          onClick={handleAddTask}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {editingIndex !== null ? 'Update' : 'Add Task'}
        </button>
      </div>

      <ul style={{
        listStyle: 'none',
        padding: 0,
        width: '300px',
        textAlign: 'left'
      }}>
        {tasks.map((t, index) => (
          <li key={index} style={{
            background: '#fff',
            marginBottom: '10px',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => handleToggleComplete(index)}
                style={{ marginRight: '10px' }}
              />
              <span style={{
                textDecoration: t.completed ? 'line-through' : 'none',
                fontSize: '1rem'
              }}>
                {t.text}
              </span>
            </div>
            <div>
              <button
                onClick={() => handleEditTask(index)}
                style={{
                  backgroundColor: '#ffc107',
                  border: 'none',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  marginRight: '5px',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(index)}
                style={{
                  backgroundColor: '#ff4d4f',
                  border: 'none',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
