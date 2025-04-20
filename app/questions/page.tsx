import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"

const questions = [
  {
    id: 1,
    text: "What is the time complexity of quicksort?",
    subject: "Computer Science",
    difficulty: "Medium",
    marks: 5,
  },
  {
    id: 2,
    text: "Explain the concept of polymorphism in OOP.",
    subject: "Computer Science",
    difficulty: "Easy",
    marks: 3,
  },
  {
    id: 3,
    text: "What is the difference between HTTP and HTTPS?",
    subject: "Computer Science",
    difficulty: "Easy",
    marks: 2,
  },
]

export default function QuestionList() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Questions</h1>
      <div className="flex justify-between mb-4">
        <Link
          href="/questions/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Question
        </Link>
        <Link
          href="/questions/export"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Export Questions
        </Link>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {questions.map((question) => (
            <li key={question.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">{question.text}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {question.subject}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">Difficulty: {question.difficulty}</p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      Marks: {question.marks}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <Link
                      href={`/questions/${question.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

