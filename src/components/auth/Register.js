import React from 'react'
import './Auth.css'

import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
// import { color } from '../../color/color';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import api from '../../api/API';
import icon from './res/logo.png'

import EmailComp from '../components/EmailComp';
import PasswordComp from '../components/PasswordComp';
import NameCom from '../components/NameCom'
import Header from '../components/Header'

const NavLogin = () => {
    const navigate = useNavigate();
    const switchToReg = () => {
        navigate('/login')
    }
    return (
        <p onClick={switchToReg}
            style={{
                cursor: 'pointer',
                textDecoration: 'underline',
            }}>{
                "Already have an account? Login"
            }
        </p>
    )
}



function Register() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const navigate = useNavigate();
    const cookies = new Cookies();


    React.useEffect(() => {
        const access_token = cookies.get('access_token');
        if (access_token) {
            const decode = jwtDecode(access_token);
            console.log(decode);
            const d = new Date();
            if (decode.exp < d.getMilliseconds()) {
                cookies.remove('access_token');
            } else {
                navigate('/');
                window.location.reload();
            }
        } else {
            console.log("No refresh token");
        }
    }, []);

    const switchToLogin = ()=>{
        navigate('/login')
    }

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (email === '' || password === '' || name === '') {
            setError('Please fill all the fields');
            setLoading(false);
            return;
        } else {
            api.post('/register', {
                name: name,
                email: email.toLowerCase(),
                password: password
            }).then(res => {
                console.log(res.data);
                if (res.status < 300) {
                    navigate('/auth');
                    window.location.reload();
                } else {
                    setError("Probably duplicate email!");
                    setLoading(false);
                }
            }).catch(err => {
                console.log(err);
                setError("Proabably duplicate email!");
                setLoading(false);
            })
        }
    }

    return (
        <div className='auth'>
            <div className='auth-container'>

                <Header/>
                {/*Login and Register Form*/}
                <div className='auth-login'>
                    <div className='auth-login-container'>

                        <form
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <div>
                                <h2>Sign Up</h2>
                                {
                                    error !== '' &&
                                    <p style={{
                                        color: 'red',
                                        justifyContent: "center",
                                        fontSize: "15px"
                                    }}>{error}</p>
                                }
                            </div>
                            <NameCom value={name} onChange={(e) => setName(e.target.value)}/>
                            <EmailComp value={email} onChange={(e) => setEmail(e.target.value)} />
                            <PasswordComp value={password} onChange={(e) => setPassword(e.target.value)} />
                            <div className='formBtn'>
                                <Button
                                    style={{
                                        backgroundColor: 'violet',
                                        color: 'white'
                                    }}
                                    variant='contained'
                                    type='submit'>
                                    {loading ? "Registering..." : "Register"}
                                </Button>
                            </div>
                        </form>
                        <NavLogin/>
                    </div>
                </div>

            </div>
        </div >
    )
}

export default Register