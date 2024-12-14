import Select from 'react-select';
import styles from './taskList.module.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TableComponent from '../../components/table/TableComponent';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import React, { useEffect, useState } from 'react';
import { adminTableHeadings, userTableHeadings } from '../../utils/constants';
import { selectisAdmin } from '../../redux/user/userSelector';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { selecttasks } from '../../redux/tasks/taskSelector';
import { adminTaskListStart, userTaskListStart } from '../../redux/tasks/taskActions';
import moment from 'moment';
import { selectUsernames } from '../../redux/data/dataSelector';
import { fetchUsersListStart } from '../../redux/data/dataActions';



const TaskList = () => {
    const usersList = useSelector(selectUsernames);
    const isAdmin = useSelector(selectisAdmin);
    const [status, setStatus] = useState<number | undefined>(undefined);
    const [page, setPage] = React.useState<number | undefined>(undefined);
    const [startDate, setStartDate] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);
    const [username, setUsername] = useState<string | undefined>(undefined);
    const dispatch = useDispatch();
    const taskList = useSelector(selecttasks);
    useEffect(() => {
        if (!isAdmin) {
            dispatch(userTaskListStart(page, status));
        } else {
            dispatch(adminTaskListStart(page, username, startDate, endDate, status));
        }
    }, [page, status, username, startDate, endDate]);

    useEffect(() => {
        dispatch(fetchUsersListStart());
        if (isAdmin) {
            dispatch(adminTaskListStart())
        } else {
            dispatch(userTaskListStart());
        }
    }, [dispatch])
    const handlePagination = (e: any, value: any) => {
        e.preventDefault();
        setPage(value);
    }
    return (
        <div className={styles.taskListContainer}>
            <h1>Tasks</h1>
            <div className={styles.filtersDiv}>
                <div className={styles.filterDiv}>
                    <Select
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                marginTop: 10
                            }),
                        }}
                        onChange={(e) => setStatus(e?.value)}
                        classNamePrefix="mySelect"
                        placeholder="Status"
                        isClearable={true}
                        isSearchable={false}
                        options={[{ value: 0, label: 'Pending' }, { value: 1, label: 'Completed' }]} />
                </div>
                {
                    isAdmin && <>
                        <div className={styles.filterDiv}>
                            <div className={styles.innerDiv}>
                                <input className={styles.dateInput} type="date" placeholder="Start Date" name='startDate' onChange={(e) => (setStartDate(e.target.value))} />
                            </div>
                        </div>
                        <div className={styles.filterDiv}>
                            <div className={styles.innerDiv}>
                                <input className={styles.dateInput} type="date" placeholder="Due Date" name='dueDate' onChange={(e) => (setEndDate(e.target.value))} />
                            </div>
                        </div>
                        <div className={styles.filterDiv}>
                            <Select
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        marginTop: 10
                                    }),
                                }}
                                isClearable={true}
                                onChange={(e) => setUsername(e?.label)}
                                classNamePrefix="mySelect"
                                placeholder="User"
                                isSearchable={true}
                                options={usersList.map((user) => ({ value: user.id, label: user.username }))} />
                        </div>
                    </>
                }
            </div>
            {/* <div className={styles.separator} /> */}
            <div className={styles.taskListDiv}>
                {
                    isAdmin ? <TableComponent headings={adminTableHeadings} data={taskList.tasks} /> : <TableComponent headings={userTableHeadings} data={taskList.tasks} />
                }
            </div>
            <div className={styles.pagination}>
                <Stack spacing={2} >
                    <Pagination count={Math.ceil(taskList.totalSize / 8)} variant="outlined" shape="rounded" onChange={handlePagination} />
                </Stack>
            </div>
        </div>
    )
}

export default TaskList;