import { useLocation, useNavigate } from 'react-router-dom';
import styles from './taskDetail.module.css';
import moment from 'moment';
import { getStatusClass } from '../../utils/constants';
import { taskForm } from '../taskForm/TaskForm';
import { FormEvent, useEffect, useState } from 'react';
import Select from 'react-select';
import { usersList } from '../../utils/data';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from 'react-redux';
import { selectisAdmin } from '../../redux/user/userSelector';
import { Tasktype } from '../../redux/tasks/taskTypes';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { clearErrors, deleteTaskStart, updateStatusStart, updateTaskStart } from '../../redux/tasks/taskActions';
import { selectTask, selectTaskError } from '../../redux/tasks/taskSelector';
import { RootState } from '../../redux/store';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';

const defaultFields: taskForm & { completionDate: string | null } = {
    name: '',
    description: '',
    startDate: '',
    dueDate: '',
    completionDate: '',
    userId: 0
}

const validateErrors = (formField: Tasktype, isAdmin: boolean | undefined) => {
    const errors: { name?: string, description?: string, startDate?: string, dueDate?: string, userId?: string, completionDate?: string, status?: string } = {};
    if (isAdmin) {
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
        }

        if (!formField.dueDate.trim()) {
            errors.dueDate = 'Due Date is required';
        }

        if (formField.completionDate && (new Date(formField.completionDate).getDate() < new Date(formField.startDate).getDate())) {
            errors.completionDate = 'Completion Date should be after Start Date';
        }else if(formField.completionDate && (new Date(formField.completionDate).getDate() > new Date().getDate())){
            errors.completionDate = 'Completion Date cannot be in future';
        }

        if (new Date(formField.startDate).getDate() > new Date(formField.dueDate).getDate()) {
            errors.dueDate = 'Due Date should be after Start Date';
        }

        if (formField.userId === 0) {
            errors.userId = 'User is required';
        }
    } else {
        if (new Date().getDate() < new Date(formField.startDate).getDate()) {
            errors.completionDate = 'Task cannot be completed before Start Date';
        }
    }


    return errors;
}

const TaskDetail = () => {
    const isAdmin = useSelector(selectisAdmin);
    const location = useLocation();
    const taskId: number = location.state.taskId;
    const data: Tasktype = useSelector((state: RootState) => selectTask(taskId)(state));
    const [formFields, setFormFields] = useState<Tasktype>(data);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ name?: string, description?: string, startDate?: string, dueDate?: string, userId?: string, completionDate?: string, status?: string }>({});

    const handleUpdate = (e: FormEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        const newErrors = validateErrors(formFields, isAdmin);
        if (Object.keys(newErrors).length > 0 || Object.keys(errors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setIsSubmitting(true);
        dispatch(updateTaskStart(formFields));
        setIsEditing(false);
    }

    const handleConfirmation = () => {
        setOpen(false);
        dispatch(deleteTaskStart(data.id));
        setTimeout(() => {
            navigate('/taskList');
        }, 2000);
    }


    const handleDelete = (e: FormEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        setOpen(true);
    }
    const handleUpdateStatus = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const newErrors = validateErrors(formFields, isAdmin);
        if (Object.keys(newErrors).length > 0 || Object.keys(errors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setIsSubmitting(true);
        dispatch(updateStatusStart(taskId, formFields.status));
        setIsEditing(false);
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Task"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are You Sure you want to delete this task?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmation} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <div className={styles.taskDetailContainer}>
                <h1>Task Details</h1>
                <div className={styles.taskTopContainer}>
                    <div className={styles.nameDiv}>
                        <h4 className={styles.taskName}>{data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h4>
                        <div className={styles.statusDiv}>
                            <p className={styles.taskDate}><span>Status</span> <span className={getStatusClass(styles, data.updatedStatus)}>{data.updatedStatus}</span></p>
                        </div>
                    </div>
                    <div className={styles.lhs}>
                        <p className={styles.taskDescription}>{data.description}</p>
                        <div className={styles.taskInfoDivs}>
                            <div className={styles.taskInfoDiv}>
                                <span className={styles.taskInfoKey}>Start Date:</span>
                                <span className={styles.taskInfoValue}>{moment(data.startDate).format('MMMM D, YYYY')}</span>
                            </div>
                            <div className={styles.taskInfoDiv}>
                                <span className={styles.taskInfoKey}>End Date:</span>
                                <span className={styles.taskInfoValue}>{moment(data.dueDate).format('MMMM D, YYYY')}</span>
                            </div>
                            {
                                isAdmin && (
                                    <div className={styles.taskInfoDiv}>
                                        <span className={styles.taskInfoKey}>User Assigned:</span>
                                        <span className={styles.taskInfoValue}>{data.user && data.user.username}</span>
                                    </div>
                                )
                            }
                            <div className={styles.taskInfoDiv}>
                                <span className={styles.taskInfoKey}>Completion Date:</span>
                                <span className={styles.taskInfoValue}>{data.completionDate ? moment(data.completionDate).format('MMMM D, YYYY') : 'Not Completed'}</span>
                            </div>
                        </div>
                    </div>

                </div>
                <div className={styles.taskBottomContainer}>
                    <form className={styles.addTaskForm}>
                        <div className={styles.addTaskItem}>
                            <label>Name</label>
                            <input type="text" defaultValue={data.name} placeholder="Name" required min={3} name='name' onChange={(e) => setFormFields({ ...formFields, name: e.target.value })} disabled={!isEditing || !isAdmin} />
                            {
                                errors.name && <span className={styles.errorMessage} >{errors.name}</span>
                            }
                        </div>

                        <div className={styles.addTaskItem}>
                            <label>Description</label>
                            <input type="text" defaultValue={data.description} placeholder="Description" required min={8} name='description' onChange={(e) => setFormFields({ ...formFields, description: e.target.value })} disabled={!isEditing || !isAdmin} />
                            {
                                errors.description && <span className={styles.errorMessage} >{errors.description}</span>
                            }
                        </div>

                        <div className={styles.addTaskItem}>
                            <label>Start Date</label>
                            <input type="date" defaultValue={moment(data.startDate).format('YYYY-MM-DD')} placeholder="Start Date" required name='startDate' onChange={(e) => setFormFields({ ...formFields, startDate: e.target.value })} disabled={!isEditing || !isAdmin} />
                            {
                                errors.startDate && <span className={styles.errorMessage} >{errors.startDate}</span>
                            }
                        </div>

                        <div className={styles.addTaskItem}>
                            <label>End Date</label>
                            <input type="date" defaultValue={moment(data.dueDate).format('YYYY-MM-DD')} placeholder="End Date" required name='dueDate' onChange={(e) => setFormFields({ ...formFields, dueDate: e.target.value })} disabled={!isEditing || !isAdmin} />
                            {
                                errors.dueDate && <span className={styles.errorMessage} >{errors.dueDate}</span>
                            }
                        </div>

                        <div className={styles.addTaskItem}>
                            <label>Completion Date</label>
                            <input type="date" {...(isAdmin ? { defaultValue: moment(data.completionDate).format('YYYY-MM-DD') } : { value: moment(data.completionDate).format('YYYY-MM-DD') })} placeholder="Completion Date" required name='completionDate' onChange={(e) => setFormFields({ ...formFields, completionDate: e.target.value })} disabled={!isEditing || !isAdmin} />
                            {
                                errors.completionDate && <span className={styles.errorMessage} >{errors.completionDate}</span>
                            }
                        </div>

                        {
                            isAdmin ? (
                                <div className={styles.addTaskItem}>
                                    <label>User</label>
                                    <Select onChange={(e) => setFormFields({ ...formFields, userId: e?.value as number })} defaultValue={usersList.find(user => user.id === data.userId) ? { value: data.userId, label: usersList.find(user => user.id === data.userId)!.username } : null} options={usersList.map(user => ({ value: user.id, label: user.username }))} isDisabled={!isEditing || !isAdmin} />
                                    {
                                        errors.userId && <span className={styles.errorMessage} >{errors.userId}</span>
                                    }
                                </div>
                            ) :
                                (
                                    <div className={styles.addTaskItem}>
                                        <label>Status</label>
                                        <Select onChange={(e) => setFormFields({ ...formFields, status: e?.value as number })} defaultValue={data.completionDate ? { value: 1, label: 'Completed' } : { value: 0, label: 'Not Completed' }} options={[{ value: 0, label: 'Not Completed' }, { value: 1, label: 'Completed' }]} isDisabled={!isEditing} />
                                        {
                                            errors.status && <span className={styles.errorMessage} >{errors.status}</span>
                                        }
                                    </div>
                                )
                        }

                    </form>
                    {
                        isAdmin ?
                            (<div className={styles.buttonsContainer}>
                                {
                                    isEditing ?
                                        (
                                            <button onClick={handleUpdate} className={styles.addTaskButton}>
                                                Update Task</button>
                                        )
                                        : (
                                            <button onClick={() => setIsEditing(true)} className={styles.addTaskButton}>
                                                <CiEdit className={styles.editIcon} />
                                                <span>Edit Task</span>
                                            </button>
                                        )
                                }
                                {
                                    isEditing ?
                                        (
                                            <button onClick={() => setIsEditing(false)} className={styles.addTaskButton}>
                                                <span>Cancel</span>
                                            </button>
                                        )
                                        : (
                                            <button onClick={handleDelete} className={styles.addTaskButton}>
                                                <MdDeleteOutline className={styles.deleteIcon} />
                                                Delete Task
                                            </button>
                                        )
                                }
                            </div>) :
                            (
                                <div className={styles.buttonsContainer}>
                                    {
                                        !isAdmin && isEditing ?
                                            (
                                                <>
                                                    <button onClick={handleUpdateStatus} className={styles.addTaskButton}>
                                                        Save</button>
                                                    <button onClick={() => setIsEditing(false)} className={styles.addTaskButton}>
                                                        <span>Cancel</span>
                                                    </button>
                                                </>

                                            )
                                            : (
                                                <button onClick={() => setIsEditing(true)} className={styles.addTaskButton}>
                                                    <CiEdit className={styles.editIcon} />
                                                    <span>Update Status</span>
                                                </button>
                                            )
                                    }
                                </div>
                            )
                    }
                </div>
            </div>
        </>
    )
}

export default TaskDetail;