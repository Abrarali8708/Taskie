import styles from './navigation.module.css';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Home, Logout, PersonAdd, Settings } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import Sidebar from '../sidebar/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectisAdmin } from '../../redux/user/userSelector';
import { IoMenu } from "react-icons/io5";
import { motion } from 'framer-motion';

const variants = {
    opened: { opacity: 1, x: 0, y: 0 },
    closed: { opacity: 0, x: "-100%" },
}

const Navigation = () => {
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const isAdmin = useSelector(selectisAdmin);
    const [isOpen, setIsOpen] = useState(false);
    const [windowwidth,setWindowWidth] = useState(window.innerWidth);

    useEffect(()=>{
        const handleresize = ()=>setWindowWidth(window.innerWidth);
        window.addEventListener('resize',handleresize);
        return () => window.removeEventListener('resize',handleresize);
    },[])
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(null);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <div className={styles.navigationContainer}>
                <div className={styles.navbar}>
                    <IoMenu className={styles.menuButton} onClick={() => setIsOpen(prev => !prev)} />
                    <div className={styles.lhs}>
                        <img src="/logo.png" alt="logo" className={styles.logoImg} onClick={() => navigate('/')} />
                        <p>Taskie</p>
                    </div>
                    <div className={styles.rhs}>
                        {isAdmin && <Tooltip title="New Task">
                            <div className={styles.addIconDiv} onClick={() => navigate('/createTask')}>+</div>
                        </Tooltip>}
                        <Tooltip title="Help and Support">
                            <div className={styles.helpIconDiv}>?</div>
                        </Tooltip>
                        <div className={styles.profileDiv}>
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Tooltip title="Profile">
                                    <Avatar sx={{ width: 32, height: 32 }}>{currentUser?.username.charAt(0).toUpperCase()}</Avatar>
                                </Tooltip>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&::before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={handleClose}>
                                    <Avatar /> Profile
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <Avatar /> My account
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <PersonAdd fontSize="small" />
                                    </ListItemIcon>
                                    Add another account
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </div>
                <div className={styles.mainDiv}>
                    {
                        windowwidth > 768 ? (
                            <div className={styles.sidebarDiv}><Sidebar /></div>
                        ):(
                            isOpen && <motion.div transition={{ duration: 0.7 }} variants={variants} initial="closed" animate={isOpen ? "opened" : "closed"} className={styles.sidebarDiv}><Sidebar /></motion.div>
                        )
                    }
                    <div className={styles.outletDiv}><Outlet /></div>
                </div>
            </div>
            {/* <Notification /> */}
        </>
    )
}

export default Navigation;