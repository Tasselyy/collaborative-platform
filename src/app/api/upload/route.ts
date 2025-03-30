import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Sanitize the filename: any character that is not a-z, A-Z, 0-9, dot, dash, or underscore becomes _
  const fileName = file.name.replace(/[^a-z0-9.\-_]/gi, '_')

  // Define the upload directory path
  // process.cwd() returns the current working directory
  const uploadDir = path.join(process.cwd(), 'public', 'upload')
  const filePath = path.join(uploadDir, fileName)

  // Ensure the upload directory exists
  await mkdir(uploadDir, { recursive: true })

  // Write the file to public/upload/
  await writeFile(filePath, buffer)

  console.log(`✅ Saved to: ${filePath}`)

  return NextResponse.json({ success: true, path: `/upload/${fileName}` })
}
