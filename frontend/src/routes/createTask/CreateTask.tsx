import TaskForm from '../../components/taskForm/TaskForm';
import styles from './createTask.module.css';

const CreateTask = () => {
    return (
        <div className={styles.createTaskContainer}>
            <TaskForm/>
        </div>
    )
}

export default CreateTask;