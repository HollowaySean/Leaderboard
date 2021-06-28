import React, { useRef } from 'react'

export default function GroupList(props) {

    // Set ref hooks
    const messageRef = useRef([]);

    fetch(props.API_ROUTE + '/users/groups?userID=8')
    .then((res) => {

        console.log(res)
  
        // Handle HTTP status codes
        switch(res.status) {
          case 200:
            res.json()
            .then((body) => {
                messageRef.current.innerHTML = body.groupID;
            });
            break;
          default:
            console.log('Unknown HTTP response: ' + res.status);
        }
      })
      .catch((error) => {

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
