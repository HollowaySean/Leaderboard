import React, { useRef } from 'react'

export default function GroupList(props) {

    // Set ref hooks
    const messageRef = useRef([]);

    fetch(props.API_ROUTE + '/users/groups', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userID : props.userID
        })
      }).then((res) => {

        console.log(res)
  
        // Handle HTTP status codes
        switch(res.status) {
          case 200:
            res.json()
            .then((body) => console.log(body));
            break;
          default:
            console.log('Unknown HTTP response: ' + res.status);
        }
      })
      .catch((req, error) => {
  
        console.log(error);
        console.log(req);

        // Catch HTTP errors
        messageRef.current.innerHTML = 'Error obtaining user groups.';
      });

    return (
        <div>
            {props.userID}
            <p ref={messageRef}></p>
        </div>
    )
}
