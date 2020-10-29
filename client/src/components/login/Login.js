import React, { useEffect, useState } from 'react';

import { Formik, Form, Field } from 'formik';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import * as Yup from "yup";
import API from "../../axios";

const Login = () => {
    const initValues = {email:'',password:''};
    
    const [isRevealPassword, setIsRevealPassword] = useState(false);
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().required("Required")
    });
    const labelClassNames = '',inputClassNames='form-control';
    let history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            swal("Already logged in redirecting to dashboard", {
                buttons: false,
                timer: 2000,
            }).then(() => history.push('/dashboard')); 
        }
    },[]);

    const togglePassword = () => {
        setIsRevealPassword(!isRevealPassword);
    }

    const handleFormSubmit = async values => {
        const {email, password} = values;
        try {
            const response = await API.post('user/login', {email,password});
            if(response.status === 200) {
                localStorage.setItem('user',JSON.stringify(response.data.user));
                localStorage.setItem('token',response.data.token);
                history.push('/dashboard');
            }
        } catch(e) {
            // console.log(e)
            swal("Error!", "Something went wrong", "error");
        }
    }
    return (
        <>
            <div style={{'width':'40%'}} className="card mx-auto container mt-5 px-0">
                <div className="card-header">
                    Log in
                </div>
                <div className="card-body">   
                    <Formik 
                    initialValues={initValues} 
                    validationSchema={validationSchema} 
                    onSubmit={(values, { setSubmitting, resetForm}) => {
                        handleFormSubmit(values);
                        setSubmitting(false);
                        resetForm();
                    }}
                    >   
                        {({ errors, touched, isSubmitting }) => (
                        <Form autoComplete="none">
                            <div className="form-group">
                                <label className={labelClassNames} htmlFor="email">Email</label>
                                <Field autoComplete="none" className={inputClassNames} name="email" id="email" />
                                {touched.email && errors.email ? <p className="text-danger" >{errors.email}</p> : null}
                            </div>
                            <div className="form-group position-relative">
                                <label className={labelClassNames} htmlFor="password">Password</label>
                                <Field autoComplete="none" type={isRevealPassword ? "text" : "password"} className={inputClassNames} name="password" id="password" />
                                <span style={{'right':'0','top':'32px'}} type="button" className="btn btn-secondary position-absolute" onClick={togglePassword}>{isRevealPassword ? "Hide" : "Show"}</span>
                                {touched.password && errors.password ? <p className="text-danger" >{errors.password}</p> : null}
                            </div>
                            <div className="col-md-12 mt-3">
                                <button
                                type="submit"
                                disabled={isSubmitting || Object.keys(errors).length > 0}
                                className="btn btn-primary mr-3">
                                    {isSubmitting ? 'Logging in' : 'Log in'}
                                </button>
                                <span className="text-center"><Link to='/'>New user?</Link></span>
                            </div>
                        </Form>)}
                    </Formik>
                </div>
            </div>
        </>
    )
}

export default Login
