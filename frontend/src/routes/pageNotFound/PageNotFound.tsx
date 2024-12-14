import styles from './pageNotFound.module.css';
import { PiSmileySad } from "react-icons/pi";

const PageNotFound = () => {
    return (
        <div className={styles.pageNotFoundContainer}>
            <PiSmileySad className={styles.pageNotFoundIcon} />
            <p className={styles.pageCode}>404</p>
            <p className={styles.pageMessage}>Page Not Found</p>
        </div>
    )
}

export default PageNotFound;