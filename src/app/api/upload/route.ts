import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Создаем уникальное имя файла
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const filename = `${uniqueSuffix}-${file.name}`
    
    // Путь для сохранения файла
    const path = join(process.cwd(), 'public', 'uploads', filename)
    
    // Сохраняем файл
    await writeFile(path, buffer)
    
    // Возвращаем URL файла
    return NextResponse.json({ 
      url: `/uploads/${filename}`,
      message: 'File uploaded successfully' 
    })
    
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    )
  }
} 