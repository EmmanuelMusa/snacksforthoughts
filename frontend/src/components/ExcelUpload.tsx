import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X, Download } from 'lucide-react'
import * as XLSX from 'xlsx'

interface ExcelUploadProps {
    onDataProcessed: (data: any[]) => void
    onError: (error: string) => void
    acceptedTypes?: string[]
    maxSize?: number // in MB
}

interface ProcessedData {
    headers: string[]
    rows: any[]
    totalRows: number
    fileName: string
}

export default function ExcelUpload({
    onDataProcessed,
    onError,
    acceptedTypes = ['.xlsx', '.xls', '.csv'],
    maxSize = 10
}: ExcelUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processedData, setProcessedData] = useState<ProcessedData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (file: File) => {
        if (!file) return

        // Validate file type
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
        if (!acceptedTypes.includes(fileExtension)) {
            const errorMsg = `Invalid file type. Please upload ${acceptedTypes.join(', ')} files.`
            setError(errorMsg)
            onError(errorMsg)
            return
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            const errorMsg = `File size exceeds ${maxSize}MB limit.`
            setError(errorMsg)
            onError(errorMsg)
            return
        }

        processFile(file)
    }

    const processFile = async (file: File) => {
        setIsProcessing(true)
        setError(null)

        try {
            const data = await readExcelFile(file)
            const processed = processExcelData(data, file.name)

            setProcessedData(processed)
            onDataProcessed(processed.rows)
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to process file'
            setError(errorMsg)
            onError(errorMsg)
        } finally {
            setIsProcessing(false)
        }
    }

    const readExcelFile = (file: File): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = (e) => {
                try {
                    const data = e.target?.result
                    const workbook = XLSX.read(data, { type: 'binary' })
                    const sheetName = workbook.SheetNames[0]
                    const worksheet = workbook.Sheets[sheetName]
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
                    resolve(jsonData)
                } catch (error) {
                    reject(new Error('Failed to read Excel file'))
                }
            }

            reader.onerror = () => reject(new Error('Failed to read file'))
            reader.readAsBinaryString(file)
        })
    }

    const processExcelData = (data: any[], fileName: string): ProcessedData => {
        if (!data || data.length === 0) {
            throw new Error('File is empty or invalid')
        }

        const headers = data[0] as string[]
        const rows = data.slice(1).filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))

        return {
            headers,
            rows,
            totalRows: rows.length,
            fileName
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            handleFileSelect(files[0])
        }
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFileSelect(files[0])
        }
    }

    const clearData = () => {
        setProcessedData(null)
        setError(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const downloadTemplate = () => {
        const templateData = [
            ['School Name', 'State', 'LGA', 'Ward', 'Address', 'Phone', 'Email', 'Student Count', 'Principal Name', 'School Type'],
            ['Example Primary School', 'Lagos', 'Ikeja', 'Ikeja Ward', '123 Education St', '+234 800 123', 'school@example.com', '150', 'John Doe', 'Primary']
        ]

        const ws = XLSX.utils.aoa_to_sheet(templateData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Schools Template')
        XLSX.writeFile(wb, 'schools_template.xlsx')
    }

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : processedData
                            ? 'border-green-500 bg-green-50'
                            : error
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {isProcessing ? (
                        <div className="space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-lg font-medium text-gray-700">Processing file...</p>
                        </div>
                    ) : processedData ? (
                        <div className="space-y-4">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                            <div>
                                <p className="text-lg font-medium text-green-700">File processed successfully!</p>
                                <p className="text-sm text-green-600">{processedData.fileName}</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="space-y-4">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                            <div>
                                <p className="text-lg font-medium text-red-700">Error processing file</p>
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                            <div>
                                <p className="text-lg font-medium text-gray-700">
                                    Drop your Excel file here, or{' '}
                                    <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                                        browse
                                    </span>
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Supports {acceptedTypes.join(', ')} files up to {maxSize}MB
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Template Download */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Need a template?</span>
                </div>
                <button
                    onClick={downloadTemplate}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                </button>
            </div>

            {/* Processed Data Preview */}
            {processedData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Data Preview</h3>
                        <button
                            onClick={clearData}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-blue-700">File Name</p>
                            <p className="text-lg font-bold text-blue-900">{processedData.fileName}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-green-700">Total Rows</p>
                            <p className="text-lg font-bold text-green-900">{processedData.totalRows}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-purple-700">Columns</p>
                            <p className="text-lg font-bold text-purple-900">{processedData.headers.length}</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-orange-700">Status</p>
                            <p className="text-lg font-bold text-orange-900">Ready</p>
                        </div>
                    </div>

                    {/* Headers */}
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Columns Detected:</h4>
                        <div className="flex flex-wrap gap-2">
                            {processedData.headers.map((header, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                >
                                    {header}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Sample Data */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {processedData.headers.slice(0, 6).map((header, index) => (
                                        <th
                                            key={index}
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                    {processedData.headers.length > 6 && (
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ...
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {processedData.rows.slice(0, 5).map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.slice(0, 6).map((cell, cellIndex) => (
                                            <td
                                                key={cellIndex}
                                                className="px-4 py-3 text-sm text-gray-900"
                                            >
                                                {cell || '-'}
                                            </td>
                                        ))}
                                        {processedData.headers.length > 6 && (
                                            <td className="px-4 py-3 text-sm text-gray-500">...</td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {processedData.rows.length > 5 && (
                        <p className="text-sm text-gray-500 mt-2">
                            Showing first 5 rows of {processedData.totalRows} total rows
                        </p>
                    )}
                </motion.div>
            )}
        </div>
    )
}
