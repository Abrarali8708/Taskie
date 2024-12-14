import { FC } from 'react';
import styles from './featuredInfo.module.css';

type featuredInfoProps = {
    title: string,
    value:number
}

const FeaturedInfo:FC<featuredInfoProps> = ({title,value}) => {
    return (
        <div className={styles.featuredInfoContainer}>
            <div className={styles.featuredItem}>
                <span className={styles.featuredTitle}>{title}</span>
                <p className={styles.featuredValue}>{value}</p>
                <p className={styles.featuredSubtitle}>Task count</p>
            </div>
        </div>
    )
}

export default FeaturedInfo;