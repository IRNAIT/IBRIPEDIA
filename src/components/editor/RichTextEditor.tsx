"use client"

import { useRef, useEffect, useState } from "react"
import { Toolbar } from "./Toolbar"
import { ImageHandler } from "./ImageHandler"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
      editorRef.current.style.direction = "ltr"
      editorRef.current.style.textAlign = "left"
    }
  }, [value])

  const { makeImageResizable, handleImageUpload } = ImageHandler({
    editorRef,
    onChange,
  })

  useEffect(() => {
    if (editorRef.current) {
      const images = editorRef.current.getElementsByTagName("img")
      Array.from(images).forEach(makeImageResizable)
    }
  }, [value, makeImageResizable])

  const handleEditorChange = () => {
    const content = editorRef.current?.innerHTML || ""
    const cleanContent = content.replace(/dir="rtl"/g, "").replace(/style="[^"]*text-align:\s*right[^"]*"/g, "")
    onChange(cleanContent)
  }

  const handleFormatClick = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    handleEditorChange()
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleLinkClick = () => {
    const url = prompt("Введите URL:")
    if (url) {
      handleFormatClick("createLink", url)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Toolbar
        onFormatClick={handleFormatClick}
        onImageClick={handleImageClick}
        onLinkClick={handleLinkClick}
      />
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary prose dark:prose-invert max-w-none"
        onInput={handleEditorChange}
        onBlur={handleEditorChange}
        onPaste={handlePaste}
        style={{ direction: "ltr", textAlign: "left" }}
        dir="ltr"
      />
    </div>
  )
} 