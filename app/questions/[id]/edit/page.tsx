"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form"
import { PlusCircle, MinusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Loader } from "@/components/ui/loader"

interface QuestionFormData {
  bankName: string
  subject: string
  questions: {
    id: string
    text: string
    type: "MCQ" | "Short Answer" | "Long Answer" | "True/False"
    marks: number
    options?: string[]
  }[]
}

interface QuestionBank {
  id: string
  name: string
  subject: string
  questionCount: number
  questions: {
    id: string
    text: string
    type: "MCQ" | "Short Answer" | "Long Answer" | "True/False"
    marks: number
  }[]
}

export default function EditQuestionBank({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register, control, handleSubmit, watch, setValue } = useForm<QuestionFormData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  })

  useEffect(() => {
    const fetchQuestionBank = async () => {
      const storedBanks = localStorage.getItem("questionBanks")
      if (storedBanks) {
        const banks = JSON.parse(storedBanks)
        const bank = banks.find((b: QuestionBank) => b.id === params.id)
        if (bank) {
          setValue("bankName", bank.name || "")
          setValue("subject", bank.subject || "")
          setValue("questions", bank.questions || [])
        }
      }
    }

    fetchQuestionBank()
  }, [params.id, setValue])

  const onSubmit: SubmitHandler<QuestionFormData> = async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedQuestionBank: QuestionBank = {
        id: params.id,
        name: data.bankName,
        subject: data.subject,
        questionCount: data.questions.length,
        questions: data.questions,
      }

      const storedBanks = localStorage.getItem("questionBanks")
      if (storedBanks) {
        const banks = JSON.parse(storedBanks)
        const updatedBanks = banks.map((bank: QuestionBank) => (bank.id === params.id ? updatedQuestionBank : bank))
        localStorage.setItem("questionBanks", JSON.stringify(updatedBanks))
      }

      // Simulate a delay to show the loader (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push("/")
    } catch (err) {
      setError("Failed to update question bank. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white mb-6">Edit Question Bank</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6 bg-gray-800 p-6 rounded-lg shadow">
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-300">
              Question Bank Name
            </label>
            <input
              type="text"
              id="bankName"
              {...register("bankName", { required: true })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              {...register("subject", { required: true })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-gray-800 p-6 rounded-lg shadow">
              <div className="mb-4">
                <label htmlFor={`questions.${index}.text`} className="block text-sm font-medium text-gray-300">
                  Question Text
                </label>
                <textarea
                  {...register(`questions.${index}.text` as const, { required: true })}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`questions.${index}.type`} className="block text-sm font-medium text-gray-300">
                    Question Type
                  </label>
                  <select
                    {...register(`questions.${index}.type` as const)}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="MCQ">Multiple Choice</option>
                    <option value="Short Answer">Short Answer</option>
                    <option value="Long Answer">Long Answer</option>
                    <option value="True/False">True/False</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`questions.${index}.marks`} className="block text-sm font-medium text-gray-300">
                    Marks
                  </label>
                  <input
                    type="number"
                    {...register(`questions.${index}.marks` as const, { required: true, min: 1 })}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              {watch(`questions.${index}.type`) === "MCQ" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300">Options</label>
                  <div className="mt-2 space-y-2">
                    {field.options?.map((option, optionIndex) => (
                      <input
                        key={optionIndex}
                        {...register(`questions.${index}.options.${optionIndex}` as const)}
                        className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const options = watch(`questions.${index}.options`) || []
                        options.push("")
                        register(`questions.${index}.options.${options.length - 1}` as const)
                      }}
                      className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-200 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Add Option
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-200 bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <MinusCircle className="h-5 w-5 mr-2" />
                  Remove Question
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ id: Date.now().toString(), text: "", type: "Short Answer", marks: 1 })}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Question
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Question Bank"}
          </button>
        </div>
      </form>
      {isLoading && <Loader />}
    </div>
  )
}

