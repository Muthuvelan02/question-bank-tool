"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form"
import { PlusCircle, MinusCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Loader } from "@/components/ui/loader"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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

export default function EditQuestionBank({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register, control, handleSubmit, watch, setValue } = useForm<QuestionFormData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  })
  const [paramId, setParamId] = useState<string | null>(null)

  useEffect(() => {
    params.then(resolvedParams => {
      setParamId(resolvedParams.id)
    })
  }, [params])

  useEffect(() => {
    const fetchQuestionBank = async () => {
      const storedBanks = localStorage.getItem("questionBanks")
      if (storedBanks) {
        const banks = JSON.parse(storedBanks)
        const bank = banks.find((b: QuestionBank) => b.id === paramId)
        if (bank) {
          setValue("bankName", bank.name)
          setValue("subject", bank.subject)
          setValue("questions", bank.questions)
        }
      }
    }

    if (paramId) {
      fetchQuestionBank()
    }
  }, [paramId, setValue])

  const onSubmit: SubmitHandler<QuestionFormData> = async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedQuestionBank: QuestionBank = {
        id: paramId!,
        name: data.bankName,
        subject: data.subject,
        questionCount: data.questions.length,
        questions: data.questions,
      }

      const storedBanks = localStorage.getItem("questionBanks")
      if (storedBanks) {
        const banks = JSON.parse(storedBanks)
        const updatedBanks = banks.map((bank: QuestionBank) => (bank.id === paramId ? updatedQuestionBank : bank))
        localStorage.setItem("questionBanks", JSON.stringify(updatedBanks))
      }

      // Simulate a delay to show the loader (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast.success("Question bank updated successfully!", { autoClose: 3000 })
      router.push("/")
    } catch (err) {
      setError("Failed to update question bank. Please try again.")
      toast.error("Failed to update question bank. Please try again.", { autoClose: 3000 })
    } finally {
      setIsLoading(false)
    }
  }

  const addOptions = (index: number, numOptions: number) => {
    const options = watch(`questions.${index}.options`) || []
    for (let i = 0; i < numOptions; i++) {
      options.push("")
    }
    setValue(`questions.${index}.options`, options)
    toast.success(`${numOptions} options added successfully!`, { autoClose: 3000 })
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="bg-gray-800 text-white shadow-md rounded-lg"
        className="text-sm font-medium"
      />
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 flex items-center">
          <ArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
      </div>
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
                      <div key={optionIndex} className="flex items-center">
                        <input
                          {...register(`questions.${index}.options.${optionIndex}` as const)}
                          placeholder="Add Option"
                          className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const options = watch(`questions.${index}.options`) || []
                            options.splice(optionIndex, 1)
                            setValue(`questions.${index}.options`, options)
                            toast.success("Option removed successfully!", { autoClose: 500 })
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <div className="mt-2">
                      <label htmlFor={`addOptions.${index}`} className="block text-sm font-medium text-gray-300">
                        Add Options
                      </label>
                      <select
                        id={`addOptions.${index}`}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        onChange={(e) => addOptions(index, parseInt(e.target.value))}
                      >
                        <option value="">Select number of options</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    remove(index)
                    toast.success("Question removed successfully!", { autoClose: 500 })
                  }}
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
            onClick={() => {
              append({ id: Date.now().toString(), text: "", type: "Short Answer", marks: 1 })
              toast.success("Question added successfully!", { autoClose: 500 })
            }}
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