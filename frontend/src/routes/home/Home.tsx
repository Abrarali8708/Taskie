import moment from 'moment';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import styles from './home.module.css';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps, PieChart, Pie, Cell, Legend, Text, Label, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { selectisAdmin } from '../../redux/user/userSelector';
import { selectAdminDashboardData, selectUserDashboardData } from '../../redux/data/dataSelector';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAdminDashboardDataStart, fetchUserDashboardDataStart } from '../../redux/data/dataActions';

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.customTooltip}>
                <p className={styles.title}>{`${label}`}</p>
                <p className={styles.label}>{`Tasks : ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const Home = () => {
    const isAdmin = useSelector(selectisAdmin);
    const dispatch = useDispatch();
    const userDashboardData = useSelector(selectUserDashboardData);
    const adminDashboardData = useSelector(selectAdminDashboardData);
    const dashboardData = isAdmin ? adminDashboardData : userDashboardData;
    const [windowwidth, setWindowWidth] = useState(window.innerWidth);
    const [barChartData, setBarChartData] = useState<any>([]);
    const { totalTasks, completedTasks, pendingTasks, tasksCompletedToday, overdueTasks, taskCompletedPerDay }: {
        totalTasks: number,
        completedTasks: number,
        pendingTasks: number,
        tasksCompletedToday?: number,
        overdueTasks: number,
        taskCompletedPerDay?: { [key: string]: number }
    } = dashboardData;

    const BarChartdata = taskCompletedPerDay && Object.entries(taskCompletedPerDay).map(([date, amt]) => ({ date: moment(date).format('MMMM D'), amt })).reverse();

    useEffect(() => {
        const handleresize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleresize);
        return () => window.removeEventListener('resize', handleresize);
    }, [])

    useEffect(() => {
        if (windowwidth < 650 && BarChartdata) {
            setBarChartData(BarChartdata.reverse().slice(0, 3).reverse());
        } else {
            setBarChartData(BarChartdata);
        }
    }, [windowwidth])

    useEffect(() => {
        if (isAdmin) {
            dispatch(fetchAdminDashboardDataStart());
        } else {
            dispatch(fetchUserDashboardDataStart());
        }
    }, [dispatch])




    const PieChartdata = [
        { name: 'Completed', value: completedTasks },
        { name: 'Pending', value: pendingTasks },
        { name: 'Overdue', value: overdueTasks },
    ].filter(item => item.value > 0);

    console.log(PieChartdata);

    return (
        <div className={styles.homeContainer}>
            <div className={styles.dashboardInfoContainer}>
                <FeaturedInfo title='Total Tasks' value={totalTasks} />
                <FeaturedInfo title='Completed Tasks' value={completedTasks} />
                <FeaturedInfo title='Pending Tasks' value={pendingTasks} />
                {tasksCompletedToday && isAdmin ? <FeaturedInfo title='Tasks Completed Today' value={tasksCompletedToday} /> : <FeaturedInfo title='Overdue Tasks' value={overdueTasks} />}
            </div>
            <div className={styles.chartsContainer}>
                {isAdmin &&
                    <div className={styles.chartContainer}>
                        <p className={styles.chartTitle}>Tasks Completed in Last 7 days</p>
                        <ResponsiveContainer width="90%" height={400}>
                            <BarChart
                                width={600}
                                height={400}
                                data={barChartData ? barChartData : BarChartdata}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <XAxis dataKey="date" interval={0} tickLine={false} angle={-35} height={70} tickMargin={0} tickSize={25} />
                                <YAxis axisLine={false} tickCount={3} label={{ value: "Task Count", angle: -90, position: 'insideLeft' }} tickLine={false} />
                                <CartesianGrid vertical={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="amt" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                }
                <div className={styles.chartContainer}>
                    <p className={styles.chartTitle}>All tasks by completion status</p>
                    <ResponsiveContainer width="90%" height={isAdmin ? "90%" : "94%"}>
                        <PieChart width={600} height={300}>
                            <Pie
                                data={PieChartdata}
                                innerRadius={"55%"}
                                outerRadius={"90%"}
                                dataKey="value"
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                <Label value={totalTasks} className={styles.pieChartLabel} position="centerBottom" />
                                {PieChartdata.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>

                            <Tooltip />
                            <Legend layout='vertical' verticalAlign={windowwidth<500? 'bottom' : 'middle'} align={windowwidth<500 ? 'center' : 'right'} iconSize={20} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Home;