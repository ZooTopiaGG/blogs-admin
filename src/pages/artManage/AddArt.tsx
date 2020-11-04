import { Form, Card, Button, message } from 'antd';
import React, { FC, useCallback, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, Dispatch, history } from 'umi';
import { ConnectState } from '@/models/connect';
import ArtComponent from './components/ArtComponent';
import { testValue } from '@/utils/utils'

interface IProps {
  form: any;
  artInfo: any;
  artInfoLoading?: boolean;
  dispatch: Dispatch;
}

const AddClasses: FC<IProps> = (props) => {
  const { artInfo, artInfoLoading, dispatch } = props;
  const {
    location: {
      pathname,
      query: { id },
    },
  } = history;

  // 设置是否是编辑功能
  const isEdit = id && pathname === '/artManage/edit';

  /**
   * @description 获取文章信息
   */
  const getArtInfo = useCallback(() => {
    dispatch({
      type: 'artManage/getArticleByIdEffect',
      payload: id,
    });
  }, [id]);

  /**
   * @description 编辑状态时,获取班级信息
   */
  useEffect(() => {
    if (isEdit) {
      getArtInfo();
    }
  }, [getArtInfo, isEdit]);

  const [form] = Form.useForm();

  const onFinish = useCallback((values: any) => {
    if (isEdit) values.articleid = id;
    values.content = testValue(values.content);
    console.log(values);
    message.loading({ content: '提交中...', key: 'submitLoading' });
    try {
      // 
      new Promise((resolve, reject) => {
        dispatch({
          type: 'artManage/articleEffect',
          payload: {
            params: values,
            isEdit: isEdit,
            resolve,
            reject,
          },
        });
      })
        .then((data) => {
          message.success({ content: '操作成功', key: 'submitLoading' });
          goBack();
        })
        .catch((msg) => {
          message.error({ content: msg, key: 'submitLoading' });
        });
    } catch (error) {
      console.log(error)
      message.error({ content: '操作失败', key: 'submitLoading' });
    }
  }, [isEdit, id]);

  const goBack = () => {
    history.goBack();
  };

  return (
    <PageContainer>
      <Form
        form={form}
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ course: '体验课', regStatus: 1 }}
      >
        <ArtComponent form={form} artInfoLoading={artInfoLoading} artInfo={artInfo} isEdit={isEdit}/>
        <Card bordered={false} style={{ marginBottom: 20 }}>
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: 20 }} onClick={goBack}>
                返回上一级
              </Button>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </div>
          </Form.Item>
        </Card>
      </Form>
    </PageContainer>
  );
};

export default connect(({ artManage, loading }: ConnectState) => ({
  artInfo: artManage.artInfo,
  artInfoLoading: loading.effects['artManage/getArticleByIdEffect']
}))(AddClasses);
