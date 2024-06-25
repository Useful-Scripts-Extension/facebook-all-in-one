import { useState } from 'react';
import { Modal, Upload } from 'antd';
import PropTypes from 'prop-types';

const { Dragger } = Upload;

UploadModal.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    hint: PropTypes.string,
    renderButton: PropTypes.func,
    onSubmit: PropTypes.func,
    accept: PropTypes.string,
    keepFileList: PropTypes.bool,
};

export default function UploadModal({
    title = 'Upload file',
    text = 'Click or drag file to this area to upload',
    hint = 'Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.',
    renderButton = () => {},
    onSubmit = () => {},
    accept = '.json, .csv',
    keepFileList = false,
}) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [fileData, setFileData] = useState(null);
    const [fileList, setFileList] = useState([]);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        onSubmit(fileData);
        setOpen(false);

        if (!keepFileList) {
            setFileList([]);
            setFileData(null);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleFile = file => {
        setConfirmLoading(true);
        setFileList([file]);

        const reader = new FileReader();
        reader.onload = e => {
            setConfirmLoading(false);
            setFileData(e.target.result);
        };
        reader.readAsText(file);

        // Prevent upload
        return false;
    };

    return (
        <>
            {renderButton?.({ showModal })}
            <Modal
                title={title}
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                closeIcon={null}
            >
                <Dragger
                    accept={accept}
                    beforeUpload={handleFile}
                    maxCount={1}
                    fileList={fileList}
                    onRemove={() => setFileList([])}
                >
                    <p className="ant-upload-drag-icon">
                        <i className="fa-solid fa-inbox fa-3x"></i>
                    </p>
                    <p className="ant-upload-text">{text}</p>
                    <p className="ant-upload-hint">{hint}</p>
                </Dragger>
            </Modal>
        </>
    );
}
