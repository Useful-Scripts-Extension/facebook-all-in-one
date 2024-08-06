import React, { useCallback } from 'react';
import { List, Image } from 'antd';
import Collection from '../../components/Collection';
import { IEntityAbout } from '../../utils/facebook';
import { getInstaHighlightMedias, getInstaHighlights, IGHighlight } from '../../utils/instagram';
import { limitString } from '../../utils/helper';

export default function IGHighlights({
    target,
    onOpenHighlight,
}: {
    readonly target: IEntityAbout | null;
    readonly onOpenHighlight?: (highlight: IGHighlight) => void;
}) {
    const fetchNext = useCallback(
        async (currentData: IGHighlight[] = []) => {
            if (!target?.id) return;

            // TODO: verify if this api has paging?
            if (currentData.length) return [];
            const res = await getInstaHighlights(target.id);
            return res;
        },
        [target]
    );

    const renderItem = useCallback((item: IGHighlight) => {
        return (
            <List.Item>
                <Image
                    src={item.cover}
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover', borderRadius: '50%', cursor: 'pointer' }}
                    preview={false}
                    onClick={() => {
                        onOpenHighlight?.(item);
                    }}
                />
                <a
                    href={'https://www.instagram.com/stories/highlights/' + item.id.split(':')[1]}
                    target="_blank"
                    style={{
                        display: 'block',
                        wordWrap: 'break-word',
                        maxWidth: 100,
                        padding: 5,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: '1em',
                    }}
                    title={item.title}
                >
                    {limitString(item.title, 30)}
                </a>
            </List.Item>
        );
    }, []);

    const downloadItem = useCallback(async (item: IGHighlight, index: number) => {
        const medias = await getInstaHighlightMedias(item.id);
        return medias.map(m => {
            const hasVideo = !!m.video;
            return {
                url: hasVideo ? m.video : m.image,
                name: m.id + (hasVideo ? '.mp4' : '.jpg'),
            };
        });
    }, []);

    return (
        <Collection
            collectionName={target?.igName + ' - IG Highlights'}
            fetchNext={fetchNext}
            renderItem={renderItem}
            downloadItem={downloadItem}
            rowKey={item => item.id}
        />
    );
}
