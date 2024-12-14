import { Tasktype } from '../../redux/tasks/taskTypes';
import TableRow from '../tableRow/TableRow';
import styles from './tableComponent.module.css';

const TableComponent: React.FC<{ data: Tasktype[], headings: string[] }> = ({ data, headings }) => {
    return (
        <table className={styles.tableContainer}>
            <thead>
                <tr>
                    {
                        headings.map((heading, index) => (
                            <th key={index}>{heading}</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {data.map((task, index) => (
                    <TableRow key={index} data={task} />
                ))}
            </tbody>
        </table>
    )
}

export default TableComponent;