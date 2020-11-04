import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Upload, message, Radio } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Editor from '@/components/Editor';
import { upload, defaultCover } from '@/services/common';
import { testValue } from '@/utils/utils';
import styles from './ArtComponent.less';
import classname from 'classnames';

const ArtComponent = (props: any) => {
  const { form, artInfoLoading, artInfo, isEdit } = props;
  const [editorState, setEditorState] = useState<any>('');

  const handleEditorChange = (es: any) => {
    setEditorState(es);
  };

  const [imageUrl, setImageUrl] = useState('');

  /**
   * @description 当为编辑时 初始化表单
   */
  useEffect(() => {
    if (isEdit && artInfo) {
      form.setFieldsValue({
        title: artInfo.title,
        desc: artInfo.desc,
        smallimg: artInfo.smallimg,
        type: artInfo.type,
        columntype: artInfo.columntype,
        content: artInfo.content
      });
      setEditorState(artInfo.content);
      setImageUrl(artInfo.smallimg);
    }
  }, [artInfo, isEdit]);

  const onFinalUrl = (url: any) => {
    form.setFieldsValue({
      smallimg: url
    });
    setImageUrl(url);
  };

  const [coverList, setCoverList] = useState([]);

  useEffect(() => {
    defaultCover().then(res => {
      console.log(res);
      if (res.isSuc) {
        setCoverList(res.result);
      }
    });
  }, []);

  return (
    <Card bordered={false} style={{ marginBottom: 20 }} loading={artInfoLoading}>
      <Form.Item
        name="title"
        label="文章标题"
        rules={[
          {
            required: true,
            message: '必填'
          }
        ]}
      >
        <Input placeholder="请输入文章标题" />
      </Form.Item>
      <Form.Item
        name="desc"
        label="文章描述"
        rules={[
          {
            required: true,
            message: '必填'
          }
        ]}
      >
        <Input.TextArea placeholder="请输入文章描述" rows={6} />
      </Form.Item>
      <Form.Item
        name="smallimg"
        label="上传封面"
        rules={[
          {
            required: true,
            message: '必传'
          }
        ]}
      >
        <CustomUpload imageUrl={imageUrl} onFinalUrl={onFinalUrl} coverList={coverList} />
      </Form.Item>
      <Form.Item
        name="columntype"
        label="文章类型"
        rules={[
          {
            required: true,
            message: '必填'
          }
        ]}
      >
        <Radio.Group>
          <Radio value={1}>技术集</Radio>
          <Radio value={0}>文章集</Radio>
          <Radio value={2}>刷题集</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="type"
        label="是否原创"
        rules={[
          {
            required: true,
            message: '必填'
          }
        ]}
      >
        <Radio.Group>
          <Radio value={0}>是</Radio>
          <Radio value={1}>否</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="content"
        validateFirst
        rules={[
          {
            required: true,
            message: '必填'
          },
          {
            required: true,
            validator: (_, value) =>
              !testValue(value) ? Promise.reject('请输入正文内容') : Promise.resolve()
          }
        ]}
      >
        <Editor
          contentStyle={{ height: 600 }}
          editorState={editorState}
          onChange={handleEditorChange}
        />
      </Form.Item>
    </Card>
  );
};

const CustomUpload = (props: any) => {
  const { imageUrl, onFinalUrl, coverList } = props;
  const [loading, setLoading] = useState(false);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const customRequest = (file: any) => {
    console.log(file);
    setLoading(true);
    upload(file.file)
      .then((res: any) => {
        setLoading(false);
        onFinalUrl(res.imgUrl);
      })
      .catch(e => {
        setLoading(false);
        console.log(e);
      });
  };

  const handleCoverClick = (item: any) => {
    onFinalUrl(item.url);
  };
  return (
    <>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        customRequest={customRequest}
        beforeUpload={beforeUpload}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{ maxHeight: 102, maxWidth: 102, objectFit: 'contain' }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
      <div className={classname(styles.flex, styles['flex-align-center'], styles['flex-wrap'])}>
        {coverList.map((item: any) => {
          return (
            <span
              className={classname(styles.span)}
              key={item.id}
              onClick={() => handleCoverClick(item)}
            >
              {item && item.url && (
                <img
                  src={item.url}
                  alt=""
                  style={{ maxWidth: 200, maxHeight: 128, objectFit: 'contain' }}
                />
              )}
            </span>
          );
        })}
      </div>
    </>
  );
};

export default ArtComponent;
