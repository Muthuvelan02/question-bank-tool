"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Database, FileText, Download, Eye, Search, Edit, Trash2 } from "lucide-react"
import { jsPDF } from "jspdf"

interface QuestionBank {
  id: string
  name: string
  questionCount: number
  subject: string
  questions: Array<{
    id: string
    text: string
    type: string
    marks: number
  }>
}

export default function Dashboard() {
  const router = useRouter()
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestionBanks = async () => {
      const storedBanks = localStorage.getItem("questionBanks")
      if (storedBanks) {
        setQuestionBanks(JSON.parse(storedBanks))
      } else {
        const mockData: QuestionBank[] = [
          {
            id: "1",
            name: "Computer Science Midterm",
            questionCount: 3,
            subject: "Computer Science",
            questions: [
              { id: "1", text: "What is a binary tree?", type: "Short Answer", marks: 5 },
              { id: "2", text: "Explain the concept of recursion.", type: "Long Answer", marks: 10 },
              { id: "3", text: "What is the time complexity of quicksort?", type: "MCQ", marks: 3 },
            ],
          },
          {
            id: "2",
            name: "Electronics Basics",
            questionCount: 2,
            subject: "Electronics",
            questions: [
              { id: "1", text: "What is Ohm's Law?", type: "Short Answer", marks: 5 },
              { id: "2", text: "Explain the working principle of a transistor.", type: "Long Answer", marks: 10 },
            ],
          },
          {
            id: "3",
            name: "Theoretical Computer Science Quiz",
            questionCount: 3,
            subject: "Theoretical Computer Science",
            questions: [
              { id: "1", text: "Define the Chomsky hierarchy.", type: "Short Answer", marks: 5 },
              { id: "2", text: "Explain the difference between P and NP problems.", type: "Long Answer", marks: 10 },
              { id: "3", text: "What is a Turing machine?", type: "Short Answer", marks: 5 },
            ],
          },
        ]
        setQuestionBanks(mockData)
        localStorage.setItem("questionBanks", JSON.stringify(mockData))
      }
    }

    fetchQuestionBanks()
  }, [])

  const filteredQuestionBanks = questionBanks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const exportToPDF = (questionBank: QuestionBank) => {
    const doc = new jsPDF()

    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    const margin = 20
    let yPos = margin

    const addHeader = () => {
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text(questionBank.name, pageWidth / 2, yPos, { align: "center" })
      yPos += 10
      doc.setFontSize(12)
      doc.text(`Subject: ${questionBank.subject}`, margin, yPos)
      yPos += 7
      doc.text(`Total Questions: ${questionBank.questions.length}`, margin, yPos)
      yPos += 10
      doc.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 10
    }

    const addFooter = (pageNumber: number) => {
      doc.setFontSize(10)
      doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: "center" })
    }

    let pageNumber = 1
    addHeader()
    addFooter(pageNumber)

    questionBank.questions.forEach((question, index) => {
      if (yPos > pageHeight - 40) {
        doc.addPage()
        pageNumber++
        yPos = margin
        addHeader()
        addFooter(pageNumber)
      }

      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      const questionText = `Question ${index + 1}: ${question.text}`
      const lines = doc.splitTextToSize(questionText, pageWidth - 2 * margin)
      doc.text(lines, margin, yPos)
      yPos += lines.length * 7

      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(`Type: ${question.type} | Marks: ${question.marks}`, margin + 5, yPos)
      yPos += 15
    })

    doc.save(`${questionBank.name}.pdf`)
  }

  const deleteQuestionBank = (id: string) => {
    const updatedBanks = questionBanks.filter((bank) => bank.id !== id)
    setQuestionBanks(updatedBanks)
    localStorage.setItem("questionBanks", JSON.stringify(updatedBanks))
    setDeleteConfirmation(null)
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white mb-6">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <DashboardCard
          title="Total Question Banks"
          value={questionBanks.length.toString()}
          icon={<Database className="h-6 w-6 text-blue-400" />}
        />
        <DashboardCard
          title="Total Questions"
          value={questionBanks.reduce((sum, bank) => sum + bank.questionCount, 0).toString()}
          icon={<FileText className="h-6 w-6 text-green-400" />}
        />
        <DashboardCard
          title="Subjects Covered"
          value={new Set(questionBanks.map((bank) => bank.subject)).size.toString()}
          icon={<Database className="h-6 w-6 text-purple-400" />}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={() => router.push("/questions/new")}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New Question Bank
        </button>
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by title or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Your Question Banks</h2>
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-700">
            {filteredQuestionBanks.map((bank) => (
              <li key={bank.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-indigo-400 truncate">{bank.name}</h3>
                      <p className="mt-1 text-sm text-gray-400">
                        {bank.questionCount} questions | Subject: {bank.subject}
                      </p>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0 flex space-x-2">
                    <button
                      onClick={() => exportToPDF(bank)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-200 bg-indigo-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export PDF
                    </button>
                    <button
                      onClick={() => router.push(`/questions/view/${bank.id}`)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/questions/edit/${bank.id}`)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation(bank.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
                {deleteConfirmation === bank.id && (
                  <div className="px-4 py-3 bg-gray-700 sm:px-6">
                    <p className="text-sm text-white mb-2">Are you sure you want to delete this question bank?</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setDeleteConfirmation(null)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => deleteQuestionBank(bank.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function DashboardCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-400 truncate">{title}</dt>
              <dd className="text-3xl font-semibold text-white">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

