import { FormEvent, useState } from 'react';
import styles from './login.module.css';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SignInStart } from '../../redux/user/userActions';
import { useSelector } from 'react-redux';
import { selectLoginError } from '../../redux/user/userSelector';
import Notification from '../../components/notification/Notification';

const defaultFields: { username: string, password: string } = {
    username: '',
    password: ''
}

type errors={
    username?: string,
    password?: string
}

const Login = () => {
    const [formFields, setFormFields] = useState<{ username: string, password: string }>(defaultFields);
    const [errors,setErrors] = useState<errors>({});
    const { username, password } = formFields;
    const dispatch = useDispatch();
    const error:any = useSelector(selectLoginError);

    const validateErrors = ()=>{
        const errors:errors = {};
        if(!username.trim()){
            errors.username = 'Username is required';
        }else if(username.length < 3){
            errors.username = 'Username should be at least 3 characters';
        }else if (!/^[A-Za-z]/.test(username)) {
            errors.username = 'Username should start with an alphabet';
        }

        if(!password.trim()){
            errors.password = 'Password is required';
        }else if(password.length < 8){
            errors.password = 'Password should be at least 8 characters';
        }
        return errors;
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validateErrors();
        if(Object.keys(newErrors).length > 0){
            setErrors(newErrors);
            return;
        }
        try {
            dispatch(SignInStart(username, password));
        } catch (err) {
            alert('Something went wrong');
        }
    }
    return (
        <div className={styles.loginContainer}>
            <div className={styles.logoDiv}>
                <img src="/logo.png" alt="" />
                <span>Taskie</span>
            </div>

            <div className={styles.mainDiv}>
                <div className={styles.contentDiv}>
                    <h1>Log in</h1>
                    {
                        error && (
                            <div className={styles.loginErrorDiv}>
                                <p>{error.response.data[0].msg}</p>
                            </div>
                        )
                    }
                    <form onSubmit={handleSubmit} className={styles.loginForm}>
                        <div className={styles.loginFormItem}>
                            <label>Username</label>
                            <input type="text" placeholder="username" required min={3} name='username' onChange={(e) => setFormFields({ ...formFields, username: e.target.value })} />
                            {
                                errors.username && <span className={styles.errorMessage} >{errors.username}</span>
                            }
                        </div>

                        <div className={styles.loginFormItem}>
                            <label>Password</label>
                            <input type="password" placeholder="Password" required min={3} name='password' onChange={(e) => setFormFields({ ...formFields, password: e.target.value })} />
                            {
                                errors.password && <span className={styles.errorMessage} >{errors.password}</span>
                            }
                        </div>
                        <button type='submit' className={styles.loginButton}>Log in</button>
                    </form>

                    <p className={styles.signupButton}>Don't have an account? <Link to='/register'>Sign up</Link></p>
                </div>
                <div className={styles.imgDiv}>
                    <img src="/image.png" alt="" />
                </div>
            </div>
            {/* <Notification/> */}
        </div>
    )
}

export default Login;