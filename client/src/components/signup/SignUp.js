import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import * as Yup from "yup";
import API from "../../axios";
import './signup.css';

const SignUp = () => {
    
    const [photoUrl,setPhotoUrl] = useState('');
    const [imgError,setImageError] = useState('');
    const [photoName,setPhotoName] = useState('Upload Profile Picture');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            swal("Already logged in redirecting to dashboard...", {
                buttons: false,
                timer: 2000,
            }).then(() => history.push('/dashboard')); 
        }
    },[]);

    let history = useHistory(); 
    const inputClassNames='form-control', labelClassNames='';
    const SUPPORTED_FORMATS = ["jpg", "jpeg", "png"];
    const initValues = {
        firstName:'',lastName:'',age:'',phone:'',email:'',address:'',photo:'',password:'',confirm_password:''
    }
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('Required')
            .test('alphabets', 'firstName must only contain alphabets', (value) => {
                return /^[A-Za-z ]+$/.test(value);
            }),
        lastName: Yup.string()
            .required('Required')
            .test('alphabets', 'lastName must only contain alphabets', (value) => {
                return /^[A-Za-z ]+$/.test(value);
            }),
        age: Yup.string()
            .required('Required')
            .test('number', 'Age must only contain Numbers', (value) => {
                return /^[0-9]+$/.test(value);
            })
            .test('number', 'Age Must be greater than or equal to 20', (value) => {
                return /^([2-9]\d|[0-9]\d{2,})$/.test(value);
            }),
        email: Yup.string().email('Invalid email').required('Required'),
        phone: Yup.string().required("Required")
            .test('number', 'Not a valid phone number', (value) => {
                return /^\d{10}$/.test(value);
            }),
        password: Yup.string().required("Required"),
        confirm_password: Yup.string().oneOf(
            [Yup.ref("password"), null],
            "Both password need to be the same"
        )
    });
    const handleImageChange = e => {
        // console.log(e.target.files[0]);
        let value = e.target.files[0].name;
        let ind = value.lastIndexOf('.');
        let ext = value.substring(ind+1);
        if(!SUPPORTED_FORMATS.includes(ext)) {
            setImageError('Only image file type is allowed!');
        } else {
            setImageError('');
            setPhotoUrl(e.target.files[0]);
            setPhotoName(value);
        }
    }

    const handleFormSubmit = async values => {
        const newUser = {...values, photo: photoUrl}
        // console.log(newUser)
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }
        try {
            let formData = new FormData();
            const {firstName, lastName,age,email,phone,address,photo, password} = newUser;
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('password', password);
            formData.append('age', parseInt(age));
            formData.append('email', email);
            formData.append('phone', phone);            
            formData.append('address', address);
            formData.append('photo', photo);

            const response = await API.post('user', formData, config);
            console.log('res in create user',response.data)

            if(response.status === 201) {
                swal("Success!", "Account created!", "success").then(() => {
                    history.push('/login');
                });
            }
        } catch(e) {
            // console.log(e.message);
            if(e.message === 'Request failed with status code 409'){
                swal("Error!", "Email already taken", "error");
            } else {
                swal("Error!", "Something went wrong", "error");
            }
        }
    }
    return (
        <>
            <div className="container mt-2 register-form">
                <div className="form">
                    <div className="note">
                        <h3 className="pt-3">Create Account</h3>
                        <p>Get started with your free account</p>
                    </div>

                    <div className="form-content">
                        <Formik 
                        initialValues={initValues} 
                        validationSchema={validationSchema} 
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            handleFormSubmit(values);
                            setSubmitting(false);
                            // resetForm();
                            setPhotoUrl('');
                            setPhotoName('');
                        }}
                        >
                        {({ errors, touched, isSubmitting }) => (
                        <Form autoComplete="none" >
                            <div className="form-row">
                            <div className="form-group col-md-6">
                                <label className={labelClassNames} htmlFor="firstName">FirstName</label>
                                <Field autoComplete="none" className={inputClassNames} name="firstName" id="firstName" />
                                {touched.firstName && errors.firstName ? <p className="text-danger" >{errors.firstName}</p> : null}
                            </div>
                            <div className="form-group col-md-6">
                                <label className={labelClassNames} htmlFor="lastName">LastName</label>
                                <Field autoComplete="none" className={inputClassNames} name="lastName" id="lastName" />
                                {touched.lastName && errors.lastName ? <p className="text-danger" >{errors.lastName}</p> : null}
                            </div>
                            <div className="form-group col-md-6">
                                <label className={labelClassNames} htmlFor="age">Age</label>
                                <Field autoComplete="none"  className={inputClassNames} name="age" id="age" />
                                {touched.age && errors.age ? <p className="text-danger" >{errors.age}</p> : null}
                            </div>
                            <div className="form-group col-md-6">
                                <label className={labelClassNames} htmlFor="phone">Phone</label>
                                <Field autoComplete="none"  className={inputClassNames} name="phone" id="phone" />
                                {touched.phone && errors.phone ? <p className="text-danger" >{errors.phone}</p> : null}
                            </div>
                            <div className="form-group col-md-6">
                                <label className={labelClassNames} htmlFor="password">Password</label>
                                <Field autoComplete="none" type="password" className={inputClassNames} name="password" id="password" />
                                {touched.password && errors.password ? <p className="text-danger" >{errors.password}</p> : null}
                            </div>
                            <div className="form-group col-md-6">
                                <label className={labelClassNames} htmlFor="confirm_password">Confirm Password</label>
                                <Field autoComplete="none" type="password" className={inputClassNames} name="confirm_password" id="confirm_password" />
                                {touched.confirm_password && errors.confirm_password ? <p className="text-danger" >{errors.confirm_password}</p> : null}
                            </div>
                            <div className="form-group col-md-12">
                                <label className={labelClassNames} htmlFor="email">Email</label>
                                <Field autoComplete="none"  className={inputClassNames} name="email" id="email" />
                                {touched.email && errors.email ? <p className="text-danger" >{errors.email}</p> : null}
                            </div>
                            <div className="form-group col-md-12">
                                <label className={labelClassNames} htmlFor="address">Address</label>
                                <Field autoComplete="none" className={inputClassNames} name="address" id="address" component="textarea" rows="4" cols="50"  />
                            </div>
                            <div className="custom-file form-group col-md-6">
                                <Field name="photo" id="photo" type="file" accept="image/*" onChange={handleImageChange}  />
                                <label className="custom-file-label" htmlFor="photo">{photoName}</label>
                                {photoUrl ? <p className="imgViewContainer mt-2 mb-3"><a className={labelClassNames  + " select-style"} target="_blank" href={URL.createObjectURL(photoUrl)} title="View Photo">View</a></p> : null}
                                {imgError ? <p className="text-danger" >{imgError}</p> : null}
                            </div>
                            <div className="col-md-12 mt-3">
                                <button 
                                type="submit"
                                disabled={isSubmitting || Object.keys(errors).length > 0 || !(imgError === "")}
                                className="btn btn-primary mr-3">
                                    SignUp
                                </button>
                                <span className="text-center"><Link to='/login'>Already a member?</Link></span>
                            </div>
                            </div>
                        </Form>
                        )}
                    </Formik>
                    </div>
                </div>
            </div>            
        </>
    )
}

export default SignUp;
