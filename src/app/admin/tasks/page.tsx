import AddTask from './addTask';
import TaskList from './taskList';
import { TasksProvider } from '@/app/admin/contexts/taskContext';

export default function Toaster() {
  return (
    <TasksProvider>
      <div>
        <h1>Day off in Baguio</h1>
        <div>
          <AddTask />
          <TaskList />
        </div>
      </div>
    </TasksProvider>
  );
}
