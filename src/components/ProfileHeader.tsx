import { Avatar, Typography } from 'antd';
import useStore, { selectors } from '../store';
import PropTypes from 'prop-types';

const { Title, Text } = Typography;

export default function ProfileHeader({
  showName = true,
  showAvatar = true,
  avatarSize = 50,
  titleColor = 'white',
  textColor = '#eee',
  style = {},
}) {
  const profile = useStore(selectors.profile);

  return (
    <div style={{ ...styles.container, ...style }}>
      {showName && (
        <div style={styles.info}>
          <a href="https:/fb.com/me" target="_blank">
            <Title level={4} style={styles.name(titleColor)}>
              {profile?.name}
              {/* {profile?.alternateName && ` (${profile?.alternateName})`} */}
            </Title>
          </a>
          <Text style={styles.id(textColor)}>{profile?.uid}</Text>
        </div>
      )}
      {showAvatar && (
        <a href={profile?.avatar?.link} target="_blank">
          <Avatar src={profile?.avatar?.uri} size={avatarSize} />
        </a>
      )}
    </div>
  );
}

ProfileHeader.propTypes = {
  showName: PropTypes.bool,
  showAvatar: PropTypes.bool,
  avatarSize: PropTypes.number,
  titleColor: PropTypes.string,
  textColor: PropTypes.string,
  style: PropTypes.object,
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '16px',
  },
  name: color => ({
    margin: 0,
    textAlign: 'right',
    color: color,
  }),
  id: color => ({
    color: color,
    fontSize: '0.9em',
    textAlign: 'right',
  }),
};
