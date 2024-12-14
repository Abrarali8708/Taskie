import { FormEvent, useEffect, useState } from 'react';
import styles from './register.module.css';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { selectLoginError } from '../../redux/user/userSelector';
import { selectCompanyNames } from '../../redux/data/dataSelector';
import { useDispatch } from 'react-redux';
import { fetchCompanyStart } from '../../redux/data/dataActions';
import { SignUpStart } from '../../redux/user/userActions';

type defaultFieldstype = {
    username: string;
    password: string;
    isAdmin: boolean;
    company: string;
}

const adminDefaultFields: defaultFieldstype = {
    username: '',
    password: '',
    isAdmin: true,
    company: ''
}

const userDefaultFields: defaultFieldstype = {
    username: '',
    password: '',
    isAdmin: false,
    company: ''
}

type errors = {
    admin: {
        username?: string,
        password?: string,
        company?: string
    }
    user: {
        username?: string,
        password?: string,
        company?: string
    }
}

const validateErrors = (formField: defaultFieldstype, type: 'admin' | 'user') => {
    const errors: errors = {admin:{},user:{}};
    if (!formField.username.trim()) {
        errors[type].username = 'Username is required';
    } else if (formField.username.length < 3) {
        errors[type].username = 'Username should be at least 3 characters';
    } else if (!/^[A-Za-z]/.test(formField.username)) {
        errors[type].username = 'Username should start with an alphabet';
    }

    if (!formField.password.trim()) {
        errors[type].password = 'Password is required';
    } else if (formField.password.length < 8) {
        errors[type].password = 'Password should be at least 8 characters';
    }

    if (!formField.company.trim()) {
        errors[type].company = 'Company name is required';
    } else if (formField.company.length < 3) {
        errors[type].company = 'Company name should be at least 3 characters';
    } else if (!/^[A-Za-z]/.test(formField.company)) {
        errors[type].company = 'company bame should start with an alphabet';
    }
    return errors;
}


const Register = () => {
    const [adminFormFields, setAdminFormFields] = useState<defaultFieldstype>(adminDefaultFields);
    const [userFormFields, setUserFormFields] = useState<defaultFieldstype>(userDefaultFields);
    const [errors, setErrors] = useState<errors>({admin:{},user:{}});
    const [signupAdmin, setSignupAdmin] = useState<boolean>(false);
    const error:any = useSelector(selectLoginError);
    const companyNames = useSelector(selectCompanyNames);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(fetchCompanyStart());
    },[dispatch])


    const userhandleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validateErrors(userFormFields,'user');
        if (Object.keys(newErrors.user).length > 0 || Object.keys(errors.user).length > 0 ) {
            setErrors(newErrors);
            return;
        }
        console.log(userFormFields);
        try {
            const {username,password,isAdmin,company} = userFormFields;
            setSignupAdmin(false);
            dispatch(SignUpStart(username,password,isAdmin,company))
        } catch (err) {
            console.log(err);
        }
    }

    const adminhandleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validateErrors(adminFormFields,'admin');
        if (Object.keys(newErrors.admin).length > 0 || Object.keys(errors.admin).length > 0) {
            setErrors(newErrors);
            return;
        }
        console.log(adminFormFields);
        try {
            const {username,password,isAdmin,company} = adminFormFields;
            setSignupAdmin(true);
            dispatch(SignUpStart(username,password,isAdmin,company))
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={styles.registerContainer}>
            <div className={styles.logoDiv}>
                <img src="/logo.png" alt="" />
                <span>Taskie</span>
            </div>
            <div className={styles.mainDiv}>
                <div className={styles.RegisterDiv}>
                    <h1>Admin Signup</h1>
                    {
                        signupAdmin && error && (
                            <div className={styles.loginErrorDiv}>
                                <p>{error.response.data[0].msg}</p>
                            </div>
                        )
                    }
                    <form onSubmit={adminhandleSubmit} className={styles.loginForm}>
                        <div className={styles.loginFormItem}>
                            <label>Username</label>
                            <input type="text" placeholder="username" required min={3} name='username' onChange={(e) => setAdminFormFields({ ...adminFormFields, username: e.target.value })} />
                            {
                                errors.admin.username && <span className={styles.errorMessage} >{errors.admin.username}</span>
                            }
                        </div>

                        <div className={styles.loginFormItem}>
                            <label>Password</label>
                            <input type="password" placeholder="Password" required min={3} name='password' onChange={(e) => setAdminFormFields({ ...adminFormFields, password: e.target.value })} />
                            {
                                errors.admin.password && <span className={styles.errorMessage} >{errors.admin.password}</span>
                            }
                        </div>

                        <div className={styles.loginFormItem}>
                            <label>Company</label>
                            <input type="text" placeholder="Company" required min={3} name='company' onChange={(e) => setAdminFormFields({ ...adminFormFields, company: e.target.value })} />
                            {
                                errors.admin.company && <span className={styles.errorMessage} >{errors.admin.company}</span>
                            }
                        </div>
                        <button type='submit' className={styles.loginButton}>Sign up</button>
                    </form>
                    <p className={styles.signupButton}>Already have an account, <Link to='/login'>Log in</Link></p>
                </div>
                <div className={styles.separator}/>
                <div className={styles.RegisterDiv}>
                    <h1>User Signup</h1>
                    {
                        !signupAdmin && error && (
                            <div className={styles.loginErrorDiv}>
                                <p>{error.response.data[0].msg}</p>
                            </div>
                        )
                    }
                    <form onSubmit={userhandleSubmit} className={styles.loginForm}>
                        <div className={styles.loginFormItem}>
                            <label>Username</label>
                            <input type="text" placeholder="username" required min={3} name='username' onChange={(e) => setUserFormFields({ ...userFormFields, username: e.target.value })} />
                            {
                                errors.user.username && <span className={styles.errorMessage} >{errors.user.username}</span>
                            }
                        </div>

                        <div className={styles.loginFormItem}>
                            <label>Password</label>
                            <input type="password" placeholder="Password" required min={3} name='password' onChange={(e) => setUserFormFields({ ...userFormFields, password: e.target.value })} />
                            {
                                errors.user.password && <span className={styles.errorMessage} >{errors.user.password}</span>
                            }
                        </div>

                        <div className={styles.loginFormItem}>
                            <label>Company</label>
                            <Select options={companyNames.map(company => ({ value: company.companyName, label: company.companyName }))} onChange={(e) => setUserFormFields({ ...userFormFields, company: e?.value || '' })} />
                                {
                                    errors.user.company && <span className={styles.errorMessage} >{errors.user.company}</span>
                                }
                        </div>
                        <button type='submit' className={styles.loginButton}>Sign up</button>
                    </form>
                    <p className={styles.signupButton}>Already have an account, <Link to='/login'>Log in</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Register;