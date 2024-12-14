import { FC } from 'react';
import styles from './tableRow.module.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { getStatusClass} from '../../utils/constants';
import { selectisAdmin } from '../../redux/user/userSelector';
import { useSelector } from 'react-redux';
import { Tasktype } from '../../redux/tasks/taskTypes';




const TableRow: FC<{ data: Tasktype }> = ({ data }) => {
    const navigate = useNavigate()
    const isAdmin = useSelector(selectisAdmin);

    const handleClick=()=>{
        navigate(`/taskDetail/${data.name.split(' ').join('-')}`,{state:{taskId:data.id}})
    }

    return (
        <tr className={styles.tableRowContainer} onClick={handleClick}>
            <td>{data.name}</td>
            <td>{data.description.length > 20 ? data.description.slice(0, 20) + "..." : data.description}</td>
            <td>{moment(data.startDate).format('MMMM D, YYYY')}</td>
            <td>{moment(data.dueDate).format('MMMM D, YYYY')}</td>
            {data.completionDate ? <td>{moment(data.completionDate).format('MMMM D, YYYY')}</td> : (
                <td>
                    <div className={styles.notCompleted}>
                        <p>Not Completed</p>
                    </div>
                </td>
            )}
            <td>
                <div className={`${styles.statusDiv} ${getStatusClass(styles,data.updatedStatus)}`}>
                    <p>{data.updatedStatus}</p>
                </div>
            </td>
            {
                isAdmin && <td>{data.user && data.user.username}</td>
            }
        </tr>
    );
}

export default TableRow;