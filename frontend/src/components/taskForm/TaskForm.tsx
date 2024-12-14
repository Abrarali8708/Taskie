import { FormEvent, useEffect, useState } from 'react';
import styles from './taskForm.module.css';
import Select from 'react-select'
import { useSelector } from 'react-redux';
import { selectUsernames } from '../../redux/data/dataSelector';
import { useDispatch } from 'react-redux';
import { fetchUsersListStart } from '../../redux/data/dataActions';
import { ToastContainer, toast } from 'react-toastify';
import { clearErrors, createTaskStart } from '../../redux/tasks/taskActions';
import { selectTaskError } from '../../redux/tasks/taskSelector';

export type taskForm = {
    name: string,
    description: string,
    startDate: string,
    dueDate: string,
    userId: number
}

const defaultFields: taskForm = {
    name: '',
    description: '',
    startDate: '',
    dueDate: '',
    userId: 0
}

const validateErrors = (formField: taskForm) => {
    const errors: { name?: string, description?: string, startDate?: string, dueDate?: string, userId?: string } = {};
    if (!formField.name.trim()) {
        errors.name = 'Name is required';
    } else if (formField.name.length < 3) {
        errors.name = 'Name should be at least 3 characters';
    } else if (!/^[A-Za-z]/.test(formField.name)) {
        errors.name = 'Name should start with an alphabet';
    }

    if (!formField.description.trim()) {
        errors.description = 'Description is required';
    } else if (formField.description.length < 10) {
        errors.description = 'Description should be at least 10 characters';
    }

    if (!formField.startDate.trim()) {
        errors.startDate = 'Start Date is required';
    } else if (new Date(formField.startDate).getDate() < new Date().getDate()) {
        errors.startDate = 'Start Date should be in future';
    } else if (new Date().toISOString !== new Date(formField.startDate).toISOString) {
        errors.startDate = 'Start Date should be in future';
    }

    if (!formField.dueDate.trim()) {
        errors.dueDate = 'Due Date is required';
    } else if (new Date(formField.dueDate).getDate() < new Date().getDate()) {
        errors.dueDate = 'Due Date should be in future';
    } else if (new Date().toISOString !== new Date(formField.dueDate).toISOString) {
        errors.dueDate = 'Due Date should be in future';
    }

    if (new Date(formField.startDate).getTime() > new Date(formField.dueDate).getTime()) {
        errors.dueDate = 'Due Date should be after Start Date';
    }

    if (formField.userId === 0) {
        errors.userId = 'User is required';
    }

    return errors;
}

const TaskForm = () => {
    const usersList = useSelector(selectUsernames);
    const [formFields, setFormFields] = useState<taskForm>(defaultFields);
    const [errors, setErrors] = useState<{ name?: string, description?: string, startDate?: string, dueDate?: string, userId?: string }>({});
    const dispatch = useDispatch();
    
    useEffect(()=>{
        dispatch(fetchUsersListStart());
    },[])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validateErrors(formFields);
        if (Object.keys(newErrors).length > 0 || Object.keys(errors).length > 0) {
            setErrors(newErrors);
            return;
        }
        dispatch(createTaskStart(formFields));
    }
    return (
        <div className={styles.taskFormContainer}>
            <div className={styles.addTask}>
                <h1>New Task</h1>
                <form onSubmit={handleSubmit} className={styles.addTaskForm}>
                    <div className={styles.addTaskItem}>
                        <label>Name</label>
                        <input type="text" placeholder="Name" required min={3} name='name' onChange={(e) => setFormFields({ ...formFields, name: e.target.value })} />
                        {
                            errors.name && <span className={styles.errorMessage} >{errors.name}</span>
                        }
                    </div>

                    <div className={styles.addTaskItem}>
                        <label>Description</label>
                        <input type="text" placeholder="Description" required min={8} name='description' onChange={(e) => setFormFields({ ...formFields, description: e.target.value })} />
                        {
                            errors.description && <span className={styles.errorMessage} >{errors.description}</span>
                        }
                    </div>

                    <div className={styles.addTaskItem}>
                        <label>Start Date</label>
                        <input type="date" placeholder="Start Date" required name='startDate' onChange={(e) => setFormFields({ ...formFields, startDate: e.target.value })} />
                        {
                            errors.startDate && <span className={styles.errorMessage} >{errors.startDate}</span>
                        }
                    </div>

                    <div className={styles.addTaskItem}>
                        <label>End Date</label>
                        <input type="date" placeholder="End Date" required name='dueDate' onChange={(e) => setFormFields({ ...formFields, dueDate: e.target.value })} />
                        {
                            errors.dueDate && <span className={styles.errorMessage} >{errors.dueDate}</span>
                        }
                    </div>

                    <div className={styles.addTaskItem}>
                        <label>User</label>
                        <Select options={usersList.map(user => ({ value: user.id, label: user.username }))} onChange={(e) => setFormFields({ ...formFields, userId: e?.value as number})} />
                        {
                            errors.userId && <span className={styles.errorMessage} >{errors.userId}</span>
                        }
                    </div>

                    <button className={styles.addTaskButton}>Create Task</button>
                </form>
            </div>
        </div>
    )
}

export default TaskForm;