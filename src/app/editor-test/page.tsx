"use client"

import { useState } from "react"
import { RichTextEditor } from "@/components/RichTextEditor"
import { Button } from "@/components/ui/button"

export default function TestEditorPage() {
  const [content, setContent] = useState("")

  const handleSave = () => {
    console.log("Сохраненный контент:", content)
    alert("Контент сохранен в консоли!")
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Тестирование редактора</h1>
          <Button onClick={handleSave}>Сохранить</Button>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <RichTextEditor initialContent={content} onChange={setContent} />
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Предпросмотр:</h2>
          <div 
            className="prose dark:prose-invert max-w-none bg-white/5 backdrop-blur-sm rounded-lg p-6"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  )
} 