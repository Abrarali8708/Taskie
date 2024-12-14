import { LineStyle, NoteAdd, Task, Timeline, WorkOutline } from '@mui/icons-material';
import styles from './sidebar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectisAdmin } from '../../redux/user/userSelector';
import { useDispatch } from 'react-redux';
import { SignOutStart } from '../../redux/user/userActions';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAdmin = useSelector(selectisAdmin);
    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.sidebarWrapper}>
                <div className={styles.sidebarMenu}>
                    <h3 className={styles.sidebarTitle}>Dashboard</h3>
                    <ul className={styles.sidebarList}>
                        <Link to='/' className={styles.sidebarLink}>
                            <li className={styles.sidebarListItem}>
                                <LineStyle className={styles.sidebarIcon} />
                                Home
                            </li>
                        </Link>
                        <Link to='/' className={styles.sidebarLink}>
                            <li className={styles.sidebarListItem}>
                                <Timeline className={styles.sidebarIcon} />
                                Analytics
                            </li>
                        </Link>
                        <Link to='/taskList' className={styles.sidebarLink}>
                            <li className={styles.sidebarListItem}>
                                <Task className={styles.sidebarIcon} />
                                Task List
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className={styles.sidebarMenu}>
                    <h3 className={styles.sidebarTitle}>Quick Access</h3>
                    <ul className={styles.sidebarList}>
                        {isAdmin && (<Link to='/createTask' className={styles.sidebarLink}>
                            <li className={styles.sidebarListItem}>
                                <NoteAdd className={styles.sidebarIcon} />
                                Create Task
                            </li>
                        </Link>)}
                        <Link to='/taskList' className={styles.sidebarLink}>
                            <li className={styles.sidebarListItem}>
                                <Task className={styles.sidebarIcon} />
                                Task List
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className={styles.sidebarMenu}>
                    <h3 className={styles.sidebarTitle}>Account</h3>
                    <ul className={styles.sidebarList}>
                        <li className={styles.sidebarListItem} onClick={()=>{dispatch(SignOutStart()); navigate('/login')}}>
                            <WorkOutline className={styles.sidebarIcon} />
                            Log Out
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;