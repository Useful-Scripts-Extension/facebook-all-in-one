import { useEffect } from 'react';
import { getAllFriends } from '../../utils/facebook';
import useStore, { selectors } from '../../store';

export default function Friends() {
  const profile = useStore(selectors.profile);

  useEffect(() => {
    getAllFriends({ myUid: profile?.uid }).then(console.log);
  }, [profile]);

  return <div>Friends</div>;
}
