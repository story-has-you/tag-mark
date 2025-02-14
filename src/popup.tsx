import React from "react"

const Popup: React.FC = () => {
  React.useEffect(() => {
    // 在点击图标时打开新标签页
    chrome.tabs.create({
      url: chrome.runtime.getURL("tabs/main-page.html")
    })
    window.close() // 关闭 popup
  }, [])

  return null // 不需要渲染任何内容
}

Popup.displayName = "Popup"

export default Popup
