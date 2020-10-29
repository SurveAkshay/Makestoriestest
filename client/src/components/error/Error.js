import React from 'react'

const Error = () => {
    return (
        <div className="mx-auto text-center">
            <img alt="Page not found" src={window.location.origin + '/404-error-page-found.jpg'} className="img img-responsive" />
        </div>
    )
}

export default Error;