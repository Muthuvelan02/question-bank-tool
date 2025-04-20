"use client"

import { useState } from "react"
import { FileText, Download } from "lucide-react"

export default function ExportQuestions() {
  const [selectedFormat, setSelectedFormat] = useState<string>("pdf")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")

  const handleExport = () => {
    // Here you would typically generate the file and trigger a download
    console.log("Exporting questions:", {
      format: selectedFormat,
      subject: selectedSubject,
      difficulty: selectedDifficulty,
    })
    // For demonstration, we'll just show an alert
    alert(
      `Exporting ${selectedSubject} questions with ${selectedDifficulty} difficulty in ${selectedFormat.toUpperCase()} format`,
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Export Questions</h1>
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Export Options</h3>
            <p className="mt-1 text-sm text-gray-500">Select your preferred export format and filters.</p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form className="space-y-6">
              <div>
                <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                  Export Format
                </label>
                <select
                  id="format"
                  name="format"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                >
                  <option value="pdf">PDF</option>
                  <option value="word">Word</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="all">All Subjects</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="electronics">Electronics</option>
                  <option value="mechanical">Mechanical</option>
                  <option value="civil">Civil</option>
                </select>
              </div>
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Download className="mr-2 h-5 w-5" />
          Export Questions
        </button>
      </div>
    </div>
  )
}

