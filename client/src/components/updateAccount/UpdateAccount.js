import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import * as Yup from "yup";
import API from "../../axios";
import './acc.css';

const UpdateAccount = () => {
    const initValues = {
        firstName:'',lastName:'',age:'',phone:'',email:'',address:'',photo:''
    }
    const [currentUser,setUser] = useState(initValues);
    const [userToken,setToken] = useState('');
    const [photoUrl,setPhotoUrl] = useState('');
    const [imgError,setImageError] = useState('');
    const [photoName,setPhotoName] = useState('Upload Profile Picture');
    
    let history = useHistory();
    const inputClassNames='form-control', labelClassNames='';
    const SUPPORTED_FORMATS = ["jpg", "jpeg", "png"];
    
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
            })
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) {
            swal("Please log in Redirecting...", {
                buttons: false,
                timer: 3000,
            }).then(() => history.push('/login')); 
        } else {
            const user = JSON.parse(localStorage.getItem('user'));
            delete user.__v;
            delete user._id;
            console.log(user)
            setUser(user);
            setToken(token);
            if(user.photo) {
                setPhotoUrl(user.photo);
                let name = user.photo.substring(user.photo.lastIndexOf('/') + 1);
                setPhotoName(name);
            }
        }
    },[]);


    const handleImageChange = e => {
        console.log(e.target.files[0]);
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
        console.log('hi')
        const updatedUser = {...values, photo: photoUrl}
        // console.log(updatedUser)
        const config = {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'content-type': 'multipart/form-data'
            }
        }
        try {
            let formData = new FormData();
            const {firstName, lastName,age,email,phone,address,photo} = updatedUser;
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('age', parseInt(age));
            formData.append('email', email);
            formData.append('phone', phone);            
            formData.append('address', address);
            formData.append('photo', photo);

            const response = await API.patch('user/me', formData, config);
            console.log('res in create user',response.data)
            delete response.data.__v;
            delete response.data._id;

            if(response.status === 200) {
                localStorage.removeItem('user');
                localStorage.setItem('user',JSON.stringify(response.data));
                setTimeout(() => {
                    swal("Success!", "Account Updated!", "success").then(() => history.push('/dashboard'));
                }, 0);
                
            }
        } catch(e) {
            swal("Error!", "Something went wrong", "error");
        }
    }

    return (
        <>
            {userToken ? (
                <div className="container mt-2 register-form">
                <div className="form">
                    <div className="form-content">
                        <Formik
                            initialValues={currentUser} 
                            validationSchema={validationSchema} 
                            onSubmit={(values, { setSubmitting }) => {
                                console.log('hi')
                                handleFormSubmit(values);
                                setSubmitting(false);
                            }}
                        >
                        {({ errors, touched, isSubmitting }) => (
                        <Form autoComplete="none">
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
                                <Field name="photo" value="" id="photo" type="file" accept="image/*" onChange={handleImageChange}  />
                                <label className="custom-file-label" htmlFor="photo">{photoName}</label>
                                {photoUrl ? (
                                    <p className="imgViewContainer mt-2 mb-3">
                                        {
                                            JSON.stringify(photoUrl).indexOf('/static') ? (
                                            <a className={labelClassNames} target="_blank" href={photoUrl} title="View Photo">View</a>
                                            ) : (<a className={labelClassNames} target="_blank" href={photoUrl} title="View Photo">View me</a>)
                                        }
                                    </p>) : null}
                                {imgError ? <p className="text-danger" >{imgError}</p> : null}
                            </div>
                            </div>
                            <div className="col-md-12 mt-3 pl-0">
                                <button 
                                type="submit"
                                disabled={isSubmitting || (Object.keys(errors).length) > 0 || !(imgError === "")}
                                className="btn btn-primary mr-4">
                                    Save
                                </button>
                                <span className="text-gray-500"><Link to='/dashboard'>Cancel</Link></span>
                            </div>
                        </Form>
                        )}
                    </Formik>
                    </div>
                </div>
            </div>
            ) : null}
            
        </>
    )
}

export default UpdateAccount;