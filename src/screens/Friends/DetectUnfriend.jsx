import React from 'react';
import { App, Upload } from 'antd';
import { useTranslation } from 'react-i18next';

const { Dragger } = Upload;

export default function DetectUnfriend() {
    const { message } = App.useApp();
    const { t } = useTranslation();

    const props = {
        name: 'file',
        multiple: false,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <i className="fa-solid fa-inbox fa-3x"></i>
            </p>
            <p className="ant-upload-text">{t('Click or drag file to this area to upload')}</p>
            <p className="ant-upload-hint">
                {t(
                    'Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.'
                )}
            </p>
        </Dragger>
    );
}
