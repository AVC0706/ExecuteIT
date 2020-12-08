import React, {useEffect} from 'react';

const Callback = () => {
    useEffect(() => {
        // get the URL parameters which will include the auth token
        const params = window.location.search;
        if (window.opener) {
            // send them to the opening window
            window.opener.postMessage(params);
            // close the popup
            window.close();
        }
    },[]);
    return(
        <div>
            <h2>Redirecting Please wait...</h2>
        </div>
    )
}

export default Callback