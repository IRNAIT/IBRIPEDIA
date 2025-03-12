'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Code,
  Quote,
  Minus,
  Plus,
  RotateCcw,
  Link as LinkIcon,
  X,
  MoveHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent = '',
  onChange,
  className,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [imageScale, setImageScale] = useState(1);
  const [showResizeControls, setShowResizeControls] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
      setupDragAndDrop();
    }
  }, [initialContent]);

  const setupDragAndDrop = () => {
    if (!editorRef.current) return;

    const makeImagesDraggable = () => {
      const images = editorRef.current?.getElementsByTagName('img');
      if (!images) return;

      Array.from(images).forEach(img => {
        if (!img.getAttribute('draggable')) {
          img.setAttribute('draggable', 'true');
          img.classList.add('editor-image');
          
          img.addEventListener('dragstart', handleDragStart);
          img.addEventListener('dragend', handleDragEnd);
        }
      });
    };

    makeImagesDraggable();

    // Наблюдатель за изменениями в редакторе
    const observer = new MutationObserver(() => {
      makeImagesDraggable();
    });

    observer.observe(editorRef.current, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  };

  const handleDragStart = (e: DragEvent) => {
    const target = e.target as HTMLImageElement;
    dragImageRef.current = target;
    setIsDragging(true);
    target.classList.add('dragging');
    
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', target.outerHTML);
    }
  };

  const handleDragEnd = (e: DragEvent) => {
    const target = e.target as HTMLImageElement;
    setIsDragging(false);
    target.classList.remove('dragging');
    dragImageRef.current = null;

    // Удаляем все индикаторы перетаскивания
    const allImages = editorRef.current?.getElementsByTagName('img');
    if (allImages) {
      Array.from(allImages).forEach(image => {
        image.classList.remove('drag-over', 'drag-over-bottom');
      });
    }
  };

  const handleEditorDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    const target = e.target as HTMLElement;
    
    // Удаляем предыдущие индикаторы
    const allImages = editorRef.current?.getElementsByTagName('img');
    if (allImages) {
      Array.from(allImages).forEach(image => {
        image.classList.remove('drag-over', 'drag-over-bottom');
      });
    }

    // Если навели на изображение, показываем индикатор
    if (target.tagName === 'IMG' && target !== dragImageRef.current) {
      const rect = target.getBoundingClientRect();
      const dropAfter = e.clientY > rect.top + rect.height / 2;
      
      if (dropAfter) {
        target.classList.add('drag-over-bottom');
      } else {
        target.classList.add('drag-over');
      }
    }
  };

  const handleEditorDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!editorRef.current || !dragImageRef.current) return;

    const target = e.target as HTMLElement;
    
    // Удаляем все индикаторы перетаскивания
    const allImages = editorRef.current.getElementsByTagName('img');
    Array.from(allImages).forEach(image => {
      image.classList.remove('drag-over', 'drag-over-bottom');
    });

    if (target.tagName === 'IMG' && target !== dragImageRef.current) {
      const rect = target.getBoundingClientRect();
      const dropAfter = e.clientY > rect.top + rect.height / 2;
      
      if (dropAfter) {
        target.parentNode?.insertBefore(dragImageRef.current, target.nextSibling);
      } else {
        target.parentNode?.insertBefore(dragImageRef.current, target);
      }
    } else {
      // Вставляем в позицию курсора
      const range = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (range) {
        range.insertNode(dragImageRef.current);
      }
    }

    handleChange();
  };

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleChange();
  };

  const handleChange = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const removeCodeFormatting = () => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    const range = selection.getRangeAt(0);
    const preElements = editorRef.current.getElementsByTagName('pre');
    
    for (let i = preElements.length - 1; i >= 0; i--) {
      const pre = preElements[i];
      const textContent = pre.textContent || '';
      const textNode = document.createTextNode(textContent);
      pre.parentNode?.replaceChild(textNode, pre);
    }
    
    handleChange();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const img = document.createElement('img');
      img.src = data.url;
      img.className = 'editor-image';
      img.style.maxWidth = '100%';
      img.dataset.scale = '1';

      img.onclick = () => {
        setSelectedImage(img);
        setShowResizeControls(true);
        setImageScale(parseFloat(img.dataset.scale || '1'));
      };

      editorRef.current?.focus();
      document.execCommand('insertHTML', false, img.outerHTML);
      handleChange();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleImageScale = (delta: number) => {
    if (!selectedImage) return;

    const newScale = Math.max(0.1, Math.min(2, imageScale + delta));
    setImageScale(newScale);
    
    // Получаем исходные размеры изображения
    const naturalWidth = selectedImage.naturalWidth;
    const naturalHeight = selectedImage.naturalHeight;
    
    // Устанавливаем новые размеры
    const newWidth = Math.round(naturalWidth * newScale);
    const newHeight = Math.round(naturalHeight * newScale);
    
    selectedImage.style.width = `${newWidth}px`;
    selectedImage.style.height = `${newHeight}px`;
    selectedImage.style.transform = 'none'; // Убираем transform scale
    selectedImage.dataset.scale = newScale.toString();
    
    handleChange();
  };

  const resetImageScale = () => {
    if (!selectedImage) return;
    
    setImageScale(1);
    selectedImage.style.width = '';
    selectedImage.style.height = '';
    selectedImage.style.transform = 'none';
    selectedImage.dataset.scale = '1';
    
    handleChange();
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleImageClick = (img: HTMLImageElement) => {
    // Удаляем класс selected у всех изображений
    const allImages = editorRef.current?.getElementsByTagName('img');
    if (allImages) {
      Array.from(allImages).forEach(image => {
        image.classList.remove('selected');
      });
    }

    // Добавляем класс selected к выбранному изображению
    img.classList.add('selected');
    setSelectedImage(img);
    setShowResizeControls(true);
    setImageScale(parseFloat(img.dataset.scale || '1'));
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      handleImageClick(target as HTMLImageElement);
    } else {
      // Снимаем выделение со всех изображений при клике вне изображения
      const allImages = editorRef.current?.getElementsByTagName('img');
      if (allImages) {
        Array.from(allImages).forEach(image => {
          image.classList.remove('selected');
        });
      }
      setSelectedImage(null);
      setShowResizeControls(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      <div className="flex flex-wrap gap-1 p-2 bg-card rounded-lg shadow-sm">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => execCommand('bold')}
            className="h-8 w-8"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => execCommand('italic')}
            className="h-8 w-8"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => execCommand('underline')}
            className="h-8 w-8"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => execCommand('justifyLeft')}
            className="h-8 w-8"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => execCommand('justifyCenter')}
            className="h-8 w-8"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => execCommand('justifyRight')}
            className="h-8 w-8"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => execCommand('insertUnorderedList')}
            className="h-8 w-8"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => execCommand('insertOrderedList')}
            className="h-8 w-8"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => execCommand('formatBlock', '<h1>')}
            className="h-8 w-8"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => execCommand('formatBlock', '<h2>')}
            className="h-8 w-8"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => execCommand('formatBlock', '<pre>')}
            className="h-8 w-8"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={removeCodeFormatting}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => execCommand('formatBlock', '<blockquote>')}
            className="h-8 w-8"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLink}
            className="h-8 w-8"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 w-8"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          {selectedImage && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Перетащите изображение в нужное место"
            >
              <MoveHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>

        {showResizeControls && (
          <div className="flex gap-1 ml-auto items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleImageScale(-0.1)}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm mx-2">{Math.round(imageScale * 100)}%</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleImageScale(0.1)}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetImageScale}
              className="h-8 w-8"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div
        ref={editorRef}
        className="min-h-[200px] p-4 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-ring"
        contentEditable
        onInput={handleChange}
        onBlur={handleChange}
        onClick={handleEditorClick}
        onDragOver={handleEditorDragOver}
        onDrop={handleEditorDrop}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}; 