'use client';

import { useState } from 'react';
import { useTasks } from '../contexts/taskContext';

export default function AddTask() {
  const [task, setTask] = useState('');
  const {dispatch} = useTasks();
  return (
    <>
      <input
        placeholder="Add task"
        value={task}
        onChange={e => setTask(e.target.value)}
      />
      <button onClick={() => {
        setTask('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: task,
        }); 
      }}>Add</button>
    </>
  );
}

let nextId = 3;
