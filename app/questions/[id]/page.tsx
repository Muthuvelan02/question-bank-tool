"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { jsPDF } from "jspdf"

interface Question {
  id: string
  text: string
  type: string
  marks: number
}

interface QuestionBank {
  id: string
  name: string
  subject: string
  questions: Question[]
}

export default function QuestionBankView({ params }: { params: { id: string } }) {
  const [questionBank, setQuestionBank] = useState<QuestionBank | null>(null)

  useEffect(() => {
    const fetchQuestionBank = async () => {
      const storedBanks = localStorage.getItem("questionBanks")
      if (storedBanks) {
        const banks = JSON.parse(storedBanks)
        const bank = banks.find((b: QuestionBank) => b.id === params.id)
        if (bank) {
          setQuestionBank(bank)
        }
      }
    }

    fetchQuestionBank()
  }, [params.id])

  const exportToPDF = () => {
    if (!questionBank) return

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

    if (questionBank.questions.length === 0) {
      doc.text("No questions in this bank.", margin, yPos)
    }

    doc.save(`${questionBank.name || "Unnamed Bank"}.pdf`)
  }

  if (!questionBank) {
    return <div className="text-center mt-8">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 flex items-center">
          <ArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
        <button
          onClick={exportToPDF}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Download className="mr-2 h-5 w-5" />
          Export as PDF
        </button>
      </div>
      <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-white">{questionBank.name}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-400">Subject: {questionBank.subject}</p>
        </div>
        <div className="border-t border-gray-700">
          <dl>
            {questionBank.questions.map((question, index) => (
              <div
                key={question.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
              >
                <dt className="text-sm font-medium text-gray-300">Question {index + 1}</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p>{question.text}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Type: {question.type} | Marks: {question.marks}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

