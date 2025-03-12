import { Button } from "@/components/ui/button"
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
} from "lucide-react"

interface ToolbarProps {
  onFormatClick: (command: string, value?: string) => void
  onImageClick: () => void
  onLinkClick: () => void
}

export function Toolbar({ onFormatClick, onImageClick, onLinkClick }: ToolbarProps) {
  const tools = [
    {
      group: "headings",
      items: [
        { icon: <Heading1 className="h-4 w-4" />, command: "formatBlock", value: "<h1>", title: "Заголовок 1" },
        { icon: <Heading2 className="h-4 w-4" />, command: "formatBlock", value: "<h2>", title: "Заголовок 2" },
        { icon: <Heading3 className="h-4 w-4" />, command: "formatBlock", value: "<h3>", title: "Заголовок 3" },
      ],
    },
    {
      group: "formatting",
      items: [
        { icon: <Bold className="h-4 w-4" />, command: "bold", title: "Жирный" },
        { icon: <Italic className="h-4 w-4" />, command: "italic", title: "Курсив" },
        { icon: <Underline className="h-4 w-4" />, command: "underline", title: "Подчеркнутый" },
      ],
    },
    {
      group: "lists",
      items: [
        { icon: <List className="h-4 w-4" />, command: "insertUnorderedList", title: "Маркированный список" },
        { icon: <ListOrdered className="h-4 w-4" />, command: "insertOrderedList", title: "Нумерованный список" },
      ],
    },
    {
      group: "alignment",
      items: [
        { icon: <AlignLeft className="h-4 w-4" />, command: "justifyLeft", title: "По левому краю" },
        { icon: <AlignCenter className="h-4 w-4" />, command: "justifyCenter", title: "По центру" },
        { icon: <AlignRight className="h-4 w-4" />, command: "justifyRight", title: "По правому краю" },
      ],
    },
    {
      group: "insert",
      items: [
        { icon: <LinkIcon className="h-4 w-4" />, command: "createLink", title: "Вставить ссылку", onClick: onLinkClick },
        { icon: <ImageIcon className="h-4 w-4" />, command: "insertImage", title: "Загрузить изображение", onClick: onImageClick },
      ],
    },
    {
      group: "blocks",
      items: [
        { icon: <Code className="h-4 w-4" />, command: "formatBlock", value: "<pre>", title: "Код" },
        { icon: <Code className="h-4 w-4 line-through" />, command: "formatBlock", value: "<p>", title: "Обычный текст" },
        { icon: <Quote className="h-4 w-4" />, command: "formatBlock", value: "<blockquote>", title: "Цитата" },
      ],
    },
  ]

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tools.map((group) => (
        <div
          key={group.group}
          className="flex gap-2 p-2 bg-black/50 backdrop-blur-sm rounded-lg"
        >
          {group.items.map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => item.onClick ? item.onClick() : onFormatClick(item.command, item.value)}
              title={item.title}
            >
              {item.icon}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )
} 