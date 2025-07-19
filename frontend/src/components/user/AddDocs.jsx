import React, { useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const AddDocs = ({ userId }) => {
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState('');

  const handleFileChange = info => {
    if (info.file.status === 'removed') {
      setFile(null);
    } else if (info.file.originFileObj) {
      setFile(info.file.originFileObj);
    }
  };

  const handleSubmit = async () => {
    if (!file || !docName) {
      message.error('Please provide a document name and select a file.');
      return;
    }
    const formData = new FormData();
    formData.append('document', file);
    formData.append('name', docName);
    formData.append('userId', userId);

    try {
      const res = await axios.post('http://localhost:8001/api/user/adddoc', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data.success) {
        message.success(res.data.message);
        setDocName('');
        setFile(null);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Document Name" required>
        <Input
          value={docName}
          onChange={e => setDocName(e.target.value)}
          placeholder="Enter document name"
        />
      </Form.Item>
      <Form.Item label="Upload Document" required>
        <Upload
          beforeUpload={() => false}
          onChange={handleFileChange}
          fileList={file ? [ { uid: '-1', name: file.name } ] : []}
          accept=".pdf,image/*"
          maxCount={1}
          onRemove={() => setFile(null)}
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Upload
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddDocs;