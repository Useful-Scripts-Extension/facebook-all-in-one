import { useEffect } from 'react';
import { fetchGraphQl } from '../../utils/facebook';

export default function Friends() {
    useEffect(() => {
        let uid = '100004848287494';
        fetchGraphQl({
            variables: {
                scale: 1.5,
                sectionToken: btoa('app_section:'.concat(uid, ':2356318349')),
                userID: uid,
            },
            doc_id: '7974021265948902',
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return <div>Friends</div>;
}
