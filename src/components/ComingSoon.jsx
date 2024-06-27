import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

export default function ComingSoon({ name }) {
    const { t } = useTranslation();

    return <Result status="404" title={t(name)} subTitle={t('Coming Soon')} />;
}
