/** braft-editor编辑器 */
import React, { FC, useState } from 'react';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/code-highlighter.css';
import BraftEditor from 'braft-editor';
import 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import CodeHighlighter from 'braft-extensions/dist/code-highlighter';
import { upload } from '@/services/common';
// import { cosUploadFile } from '@/utils/cosUploadFile';

interface EditorProps {
  onChange?: (value: any) => void;
  onSave?: (value: any) => void;
  editorState: any;
  contentStyle?: any;
  className?: any;
}
// 需要用到的组件
// const controls = [
//   'bold',
//   'italic',
//   'underline',
//   'text-color',
//   'separator',
//   'link',
//   'separator',
//   'media'
// ];

// 可支持的代码语法
const options = {
  syntaxs: [
    {
      name: 'Javascript',
      syntax: 'javascript'
    },
    {
      name: 'Python',
      syntax: 'python'
    },
  ]
};
BraftEditor.use(CodeHighlighter(options));

const Editor: FC<EditorProps> = props => {
  /**
   * @param {} onChange 监听编辑器输入变化，并传给子组件
   * @param {} onSave 保存编辑器内容，并传给子组件
   * @param {} editorState 编辑器内容对象
   * @param {} contentStyle 编辑器样式
   */
  const { onChange, onSave, editorState, contentStyle, className } = props;

  const [state, setState] = useState(
    typeof editorState === 'string'
      ? BraftEditor.createEditorState(editorState)
      : BraftEditor.createEditorState(null)
  );

  /* 编辑器输入变化监听 */
  const handleEditorChange = (es: any) => {
    onChange && onChange(es);
    setState(es);
  };
  // const submitContent = async () => {
  //   // 在编辑器获得焦点时按下ctrl+s会执行此方法
  //       // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
  //       // const htmlContent = editorState.toHTML()
  //       // const result = await saveEditorContent(htmlContent)
  // }
  /* 预览富文本编辑器内容 */
  // const buildPreviewHtml = () => {
  //   return `
  //     <!Doctype html>
  //     <html>
  //       <head>
  //         <title>Preview Content</title>
  //         <style>
  //           html,body{
  //             height: 100%;
  //             margin: 0;
  //             padding: 0;
  //             overflow: auto;
  //             background-color: #f1f2f3;
  //           }
  //           .container{
  //             box-sizing: border-box;
  //             width: 1000px;
  //             max-width: 100%;
  //             min-height: 100%;
  //             margin: 0 auto;
  //             padding: 30px 20px;
  //             overflow: hidden;
  //             background-color: #fff;
  //             border-right: solid 1px #eee;
  //             border-left: solid 1px #eee;
  //           }
  //           .container img,
  //           .container audio,
  //           .container video{
  //             max-width: 100%;
  //             height: auto;
  //           }
  //           .container p{
  //             white-space: pre-wrap;
  //             min-height: 1em;
  //           }
  //           .container pre{
  //             padding: 15px;
  //             background-color: #f1f1f1;
  //             border-radius: 5px;
  //           }
  //           .container blockquote{
  //             margin: 0;
  //             padding: 15px;
  //             background-color: #f1f1f1;
  //             border-left: 3px solid #d1d1d1;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="container">${
  //           typeof editorState === 'string' ? editorState : editorState.toHTML()
  //         }</div>
  //       </body>
  //     </html>
  //   `;
  // };

  /* 编辑器预览按钮点击 */
  // const onPreview = () => {
  //   if ((window as any).previewWindow) {
  //     (window as any).previewWindow.close();
  //   }

  //   (window as any).previewWindow = (window as any).open();
  //   (window as any).previewWindow.document.write(buildPreviewHtml());
  //   (window as any).previewWindow.document.close();
  // };

  // 预览功能
  // const extendControls = [
  //   {
  //     key: 'custom-button',
  //     type: 'button',
  //     text: '预览',
  //     onClick: onPreview
  //   }
  // ];

  /* 自定义上传图片 */
  const customUploadFn = (param: any) => {
    upload(param.file)
      .then((res: any) => {
        if (res.imgUrl) {
          param.success({
            url: res.imgUrl
            // meta: {
            //   id: ,
            //   title: res.name,
            //   alt: res.name
            //   // loop: true, // 指定音视频是否循环播放
            //   // autoPlay: true, // 指定音视频是否自动播放
            //   // controls: true, // 指定音视频是否显示控制栏
            //   // poster: 'http://xxx/xx.png', // 指定视频播放器的封面
            // }
          });
        } else {
          param.error({
            msg: '服务器繁忙，请稍后再试！'
          });
        }
      })
      .catch(e => {
        param.error({
          msg: '服务器繁忙，请稍后再试！'
        });
      });
  };
  return (
    <div
      className={`custom-editor ${className}`}
      style={{ border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: 4 }}
    >
      <BraftEditor
        className="my-editor"
        placeholder="请输入正文内容"
        // controls={controls}
        value={state}
        // extendControls={extendControls}
        contentStyle={contentStyle ? { height: 400, ...contentStyle } : { height: 400 }}
        onChange={handleEditorChange}
        onSave={onSave}
        media={{ uploadFn: customUploadFn }}
      />
    </div>
  );
};

export default Editor;
