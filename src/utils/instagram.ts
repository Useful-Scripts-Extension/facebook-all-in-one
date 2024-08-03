import { fetchExtension } from './extension';
import { IEntityAbout, TargetType } from './facebook';

export async function getInstaUserInfo(username): Promise<IEntityAbout | null> {
    let res = await fetchExtension(
        'https://www.instagram.com/web/search/topsearch/?query=' + username
    );
    let json = JSON.parse(res);
    if (json.status != 'ok') throw Error('Server response error');
    const user = json?.users?.find(_ => _.user.username === username)?.user;
    if (!user) throw Error('Instagram user not found');

    return {
        avatar: user?.profile_pic_url,
        id: user?.id,
        name: user?.full_name || user?.username,
        type: TargetType.IGUser,
        url: `https://www.instagram.com/${user?.username}`,
        raw: json,
    };
}
