"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, Check, AlertTriangle } from "lucide-react"

export default function ImportQuestions() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    setError(null)
    // Here you would typically parse the CSV/Excel file
    // For this example, we'll just simulate a preview
    setPreview([
      { id: 1, text: "What is the capital of France?", type: "MCQ", subject: "Geography" },
      { id: 2, text: "Explain the process of photosynthesis.", type: "Long Answer", subject: "Biology" },
    ])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  })

  const handleImport = () => {
    // Here you would typically send the file to your backend
    console.log("Importing file:", file)
    // Simulating success
    setError(null)
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Import Questions</h1>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <div
          className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
          {...getRootProps()}
        >
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" {...getInputProps()} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">CSV or Excel files only</p>
          </div>
        </div>
      </div>
      {file && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">File selected: {file.name}</p>
        </div>
      )}
      {preview && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Preview</h2>
          <div className="mt-4 flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Question
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Subject
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {preview.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.text}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.subject}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-8">
        <button
          onClick={handleImport}
          disabled={!file}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="mr-2 h-5 w-5" />
          Import Questions
        </button>
      </div>
    </div>
  )
}

