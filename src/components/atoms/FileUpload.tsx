import { useState } from 'react'
import { UploadSimple, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  className?: string
}

export function FileUpload({ 
  accept, 
  multiple = false, 
  maxSize, 
  onFilesSelected, 
  disabled = false,
  className 
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      if (maxSize && file.size > maxSize) {
        return false
      }
      return true
    })

    setSelectedFiles(validFiles)
    onFilesSelected(validFiles)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onFilesSelected(newFiles)
  }

  return (
    <div className={cn('w-full', className)}>
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
          isDragging && 'border-primary bg-primary/5',
          !isDragging && 'border-border bg-muted/30 hover:bg-muted/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <UploadSimple className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Click to upload</span> or drag and drop
          </p>
          {accept && (
            <p className="text-xs text-muted-foreground">
              {accept.split(',').join(', ')}
            </p>
          )}
          {maxSize && (
            <p className="text-xs text-muted-foreground">
              Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB
            </p>
          )}
        </div>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
          className="hidden"
        />
      </label>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="ml-2 p-1 hover:bg-background rounded transition-colors"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
