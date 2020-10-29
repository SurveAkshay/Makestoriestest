import React from 'react';


const ShowForm = ({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
        isSubmitting
    }) => {
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Your Name *" value=""/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Phone Number *" value=""/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Your Password *" value=""/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Confirm Password *" value=""/>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default ShowForm;
