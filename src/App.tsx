import { useEffect, useState } from 'react';
import './App.css';
import { Button, Checkbox, Form, Input, Upload, message } from 'antd';
import { UploadOutlined, RedoOutlined, SearchOutlined, DownloadOutlined} from '@ant-design/icons';
import { BeatLoader, BounceLoader } from 'react-spinners';
import { useTimeout } from 'usehooks-ts';

import logo from './assets/logo.svg';
import bigLogo from './assets/big-logo.svg';
import closeBtn from './assets/closebtn.svg';
import tick from './assets/tick.svg';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

export enum ImageStatus {
  Uploading = "uploading",
  Uploaded = "uploaded",
  detecting = "detecting",
  Fake = "fake",
  Genuine = "genuine",
}

interface ImageFile {
  uid: string;
  name: string;
  status: 'done' | 'uploading' | 'error' | 'removed';
  response: string;
  linkProps: string;
  xhr: XMLHttpRequest | null;
}

function App() {

  const [isLogClicked, setIsLogClicked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState<ImageStatus>(ImageStatus.Uploading);
  const [file, setFile] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<ImageFile>();

  //remove later
  const [count, setCount] = useState(1);

  useTimeout(()=>{setIsLoading(false)}, 3000);

  const onFinish = () => {
    setIsLoggedIn(true);
  };

  const props = {
    name: 'file',
    action: '',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
        console.log("uploading");
      }
      //for now until backend is not done
      if (info.file.originFileObj) {
        setFile(URL.createObjectURL(info.file.originFileObj));
      }
      setSelectedValue(ImageStatus.Uploaded);
      setImageFile(info.file.originFileObj);
      console.log("uploaded file",info.file.originFileObj);
      message.success(`${info.file.name} file uploaded successfully`);


      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        if (info.file.originFileObj) {
          setFile(URL.createObjectURL(info.file.originFileObj));
        }
        setSelectedValue(ImageStatus.Uploaded);

      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  function removeImage(){
    setSelectedValue(ImageStatus.Uploading);
  }

  function detectImage(){
    setSelectedValue(ImageStatus.detecting);

    //for now remove later
    setTimeout(() => {
      setSelectedValue(count === 1 ? ImageStatus.Genuine : ImageStatus.Fake);
      setCount(count + 1);
    }, 1000);
  }

  function reset(){
    setSelectedValue(ImageStatus.Uploading);

  }

  return (
    <div className='container'>
      {isLoading && 
      <div className='loader'>
        <BounceLoader
          color="#13CBF0"
          size={80}
        />
      </div>}

      <div className='header'>
        <img className='logo' src={logo} alt='logo' />
        {!isLoggedIn && <a className=' login-btn montserrat-font'>Login</a>}
      </div>
      {!isLoggedIn ? 
      <>
        <div className='login-section'>
          <img className='big-logo' src={bigLogo} alt='logo' />
          <h1 className='login-section-heading montserrat-subrayada-bold'>Detecting Subtle Deepfakes in Celebrities Using Generalize Deep Learning</h1>
          {isLogClicked ? 
          <div>
            <Form
            name="basic"
            style={{ width: 300 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="horizontal"
            size='large'
          >
            <Form.Item<FieldType>
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Password"/>
            </Form.Item>

            <Form.Item >
              <Button className='btn primary-btn montserrat-font' htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          </div> :<>
          <p className='login-section-para montserrat-font'>Welcome ! sign in to get started,</p>
          <div className='login-btn-section'>
            <button className='btn primary-btn montserrat-font' onClick={()=>{setIsLogClicked(true)}}>Login</button>
            <button className='btn montserrat-font'>Sign up</button>
          </div>
          </>}
        </div>
        <p className='footer montserrat-font'>Copyright © Deepfake detector 2024. All rights reserved.</p>
      </>
      :
      <div className='middle-container'>
        <div className='middle-section'>
            <h1 className='mid-section-heading montserrat-font'>Welcome to Deep fake detector, your go-to tool for identifying deepfake content. Simply upload an image or video to uncover potential manipulations and ensure the authenticity of media.</h1>
            <div className="line"></div>
            <div className='upload-container'>
              { selectedValue === ImageStatus.Uploading && 
              <>
              <h2 className='mid-section-heading montserrat-font'>Upload an image to get started...</h2>
              <Upload
                listType="picture"
                showUploadList = {false}
                {...props}     
              >
                <Button icon={<UploadOutlined />} className="btn primary-btn action-btn montserrat-font" >Select File</Button>
              </Upload> 
              </>}

              { selectedValue === ImageStatus.Uploaded && 
              <>
                <div className="image-preview-container">
                  <div className="image-preview-image-container" >
                    {file && <img className="image-preview-image" src={file} alt="Selected Image"/>}
                    <p className='montserrat-font'>{imageFile?.name}</p>
                  </div>

                  <img src={closeBtn} alt="X" className='close-btn' onClick={()=>{removeImage()}} />

                </div>
                <Button icon={<SearchOutlined />} className="btn primary-btn action-btn montserrat-font" onClick={()=>{detectImage()}} >Detect Image</Button>
              </>
              }
              
              { selectedValue === ImageStatus.detecting && <>
                <p className='login-section-para montserrat-font'>Detecting image ...</p>
              <BeatLoader color="#123a42" />
              </>}

              { selectedValue === ImageStatus.Genuine && <>
                <div className='result-section'>
                  <h1 className='result-section-heading montserrat-font'>Image detected successfully ...</h1>
                  <h2 className='result-section-sub-heading montserrat-font'>System detects the image as,</h2>
                  <p className='result-section-genuine montserrat-font'>Genuine</p>
                  <img src={tick} alt='genuine'/>
                </div>
                <br/><br/>
                <Button icon={<RedoOutlined />} className="btn primary-btn action-btn montserrat-font" onClick={()=>{reset()}} >Try another Image</Button>
              </>}

              { selectedValue === ImageStatus.Fake && <>
                <div className='result-section'>
                  <h1 className='result-section-heading montserrat-font'>Image detected successfully ...</h1>
                  <h2 className='result-section-sub-heading montserrat-font'>System detects the image as,</h2>
                  <p className='result-section-genuine montserrat-font' style={{color:'#C11C1C'}}>Fake</p>
                  <br/>
                  <p>
                  Alert! Our analysis indicates that the uploaded content appears to be manipulated or altered, suggesting it may be a deepfake. Please exercise caution and verify the authenticity of this media to ensure its trustworthiness.
                  </p>
                </div>
                <br/>
                <Button icon={<DownloadOutlined />} className="btn primary-btn action-btn montserrat-font" onClick={()=>{reset()}} >Download results</Button>
                <br/>
                <Button icon={<RedoOutlined />} className="btn primary-btn action-btn montserrat-font" onClick={()=>{reset()}} >Try another Image</Button>
              </>}

            </div>
        </div>
      </div> 
      }
      
    </div>
  )
}

export default App
