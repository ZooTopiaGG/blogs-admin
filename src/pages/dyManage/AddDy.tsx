import React, { useCallback, useState } from 'react';
import { Input, Button, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { writeDynamic } from '@/services/dyManage';
import { history } from 'umi';

const AddDy = () => {
  const [value, setValue] = useState('');
  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  const goBack = () => {
    history.goBack();
  };

  const submit = useCallback(() => {
    writeDynamic({ content: value })
      .then(res => {
        if (res.isSuc) {
          message.success(res.message);
          goBack();
        } else {
          message.error(res.message);
        }
      })
      .catch(e => {
        console.log(e);
      });
  }, [value]);
  return (
    <PageContainer>
      <Input.TextArea value={value} onChange={handleChange} rows={4} />
      <Button type="primary" style={{ marginTop: 20, float: 'right' }} onClick={submit}>提交</Button>
    </PageContainer>
  );
};

export default AddDy;
