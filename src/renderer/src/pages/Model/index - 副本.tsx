import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'

import { debounce } from '@src/renderer/src/utils'
import LegacyRender from './Legacy'
import CurrentRender from './Current'
import Toolbar from './Toolbar'
import Tips, { TipsType } from './Tips'
import { useDispatch, useSelector } from 'react-redux'
import zhTips from './tips/zh.json'
import enTips from './tips/en.json'
import { Dispatch, RootState } from '../../store'

interface ITips {
  mouseover: Mouseover[]
  click: Mouseover[]
}

interface Season {
  date: string
  text: string
}

interface Mouseover {
  selector: string
  text: string[]
}

const Wrapper = styled.div<{ border: boolean }>`
  ${(props) => (props.border ? 'border: 2px dashed #ccc;' : 'padding: 2px;')}
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`

const RenderWrapper = styled.div`
  margin-top: 20px;
`

const getCavSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight - 20,
  }
}

const Model = () => {
  const {
    modelPath: originModelPath,
    resizable,
    useGhProxy,
    language,
    showTool,
  } = useSelector((state: RootState) => ({
    ...state.config,
    ...state.win,
  }))

  const modelPath =
    useGhProxy && originModelPath.startsWith('http')
      ? `https://ghproxy.com/${originModelPath}`
      : originModelPath

  const dispatch = useDispatch<Dispatch>()

  const [tips, setTips] = useState<TipsType>({
    text: '',
    priority: -1,
    timeout: 0,
  })

  const [cavSize, setCavSize] =
    useState<{ width: number; height: number }>(getCavSize)

  const [msgContent, setMsgContent] = useState('')
  useEffect(() => {
    ;(window as any).setSwitchTool = dispatch.win.setSwitchTool
    ;(window as any).setLanguage = dispatch.win.setLanguage
    ;(window as any).nextModel = dispatch.config.nextModel
    ;(window as any).prevModel = dispatch.config.prevModel
  }, [])

  useEffect(() => {
    const handleDragOver = (evt: DragEvent): void => {
      evt.preventDefault()
    }
    const handleDrop = async (evt: DragEvent) => {
      evt.preventDefault()

      const files = evt.dataTransfer?.files

      if (!files) {
        return
      }

      const paths = []
      for (let i = 0; i < files.length; i++) {
        const result = await window.bridge.getModels(files[i])
        paths.push(...result)
      }

      console.log('modelList: ', paths)

      if (paths.length > 0) {
        const models = paths.map((p) => `file://${p}`)

        dispatch.config.setModelList(models)
        dispatch.config.setModelPath(models[0])
      }
    }

    document.body.addEventListener('dragover', handleDragOver)
    document.body.addEventListener('drop', handleDrop)

    return () => {
      document.body.removeEventListener('dragover', handleDragOver)
      document.body.removeEventListener('drop', handleDrop)
    }
  }, [])

  useLayoutEffect(() => {
    const resizeCanvas = debounce(() => {
      setCavSize(getCavSize())
    })

    window.addEventListener('resize', resizeCanvas, false)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  useEffect(() => {
    const handleBlur = () => {
      if (resizable) {
        dispatch.win.setResizable(false)
      }
    }

    window.addEventListener('blur', handleBlur)
    return () => {
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  const isMoc3 = modelPath.endsWith('.model3.json')

  const Render = isMoc3 ? CurrentRender : LegacyRender

  const handleMessageChange = (nextTips: TipsType) => {
    setTips(nextTips)
  }

  const handleMouseOver: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const tips = tipJSONs.mouseover.find((item) =>
      (event.target as any).matches(item.selector),
    )

    if (!tips) {
      return
    }

    let text = Array.isArray(tips.text)
      ? tips.text[Math.floor(Math.random() * tips.text.length)]
      : tips.text
    text = text.replace('{text}', (event.target as HTMLDivElement).innerText)
    // 请求接口获取消息内容并渲染出来
    // useEffect(() => {
    const fetchMsg = async () => {
      try {
        const response = await axios.get('http://otaku.facemind.wiki:5001/trends_config/')
        // setMsgContent(response.data[0]['game'])
        // console.log(response.data[0]['game'])
        text =response.data[0]['game']+"vvvv"
        handleMessageChange({
          text,
          timeout: 4000,
          priority: 8,
        })
      } catch (error) {
        setMsgContent("nihaonnnsddfssfsn")
        // console.error('Error fetching message content:', error)
      }
    }

    //   fetchMsg()
    // }, [])
    // text =text+"vvvv"
    // handleMessageChange({
    //   text,
    //   timeout: 4000,
    //   priority: 8,
    // })
  }

  const handleClick: React.MouseEventHandler<HTMLDivElement> = async (event) => {
    const tips = tipJSONs.click.find((item) =>
      (event.target as any).matches(item.selector),
    )

    if (!tips) {
      return
    }
    let text = '===='; // 定义局部变量 text
    const fetchMsg = async () => {
      try {
        const response = await axios.get('http://otaku.facemind.wiki:5001/trends_config/')
        let randomIndex = Math.floor(Math.random() * 4) + 5; // 生成一个随机数，范围是5到8
        text = response.data[randomIndex]['gs_id'] + "vadadavvv"
        console.log("tstsss"+text)
      } catch (error) {
        // console.error('Error fetching message content:', error)
      }
    }
  
    await fetchMsg(); // 调用 fetchMsg 函数并等待其执行完成
  
    // let text = Array.isArray(tips.text)
    //   ? tips.text[Math.floor(Math.random() * tips.text.length)]
    //   : tips.text
    // text = text.replace('{text}', (event.target as HTMLDivElement).innerText)
    text = "nisngisgosjgosjoi"
    text += 'fsfs'
    handleMessageChange({
      text,
      timeout: 4000,
      priority: 8,
    })
  }

  const tipJSONs = language === 'en' ? enTips : zhTips

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchAudio = async () => {
      const response = await fetch('https://nijigen.com.cn/api/dialogue/new_trends/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'guanli': 'feier' // 替换为实际的请求头参数值
        },
        body: JSON.stringify({
          prefix: '弘远', // 替换为实际的prefix参数值
          gs_id: 2100, // 替换为实际的gs_id参数值
          bot: '钟离', // 替换为实际的bot参数值
          trend_tag: '<query>' // 替换为实际的trend_tag参数值
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        if (data.code === 200 && data.data && data.data.body_oss_url) {
          const audioResponse = await fetch(data.data.body_oss_url);
          const arrayBuffer = await audioResponse.arrayBuffer();
          const audioBlob = new Blob([arrayBuffer], { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          audioRef.current.src = audioUrl;
          // audioRef.current.play();
        }
      }
    };

    const intervalId = setInterval(fetchAudio, 10000); // 每5秒发起一次请求并播放音频
    return () => clearInterval(intervalId); // 清除定时器
  }, []);
  return (
    <div>
      <audio ref={audioRef} autoPlay />
    </div>
  );
  return (
    <Wrapper
      border={resizable}
      onMouseOver={isMoc3 ? undefined : handleMouseOver}
      onClick={isMoc3 ? undefined : handleClick}
    >
      <Tips {...tips}>2222</Tips>
      {showTool && <Toolbar onShowMessage={handleMessageChange}>sfsfs</Toolbar>}
      <RenderWrapper>
        <Render {...cavSize} modelPath={modelPath}></Render>
      </RenderWrapper>
      <span>ninihhhhhhhhhhhhhhhhhhh</span> {/* 渲染消息内容 */}
      <audio ref={audioRef} controls autoPlay />
    </Wrapper>
  )
}

export default Model
