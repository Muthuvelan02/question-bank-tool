import { Loader2 } from "lucide-react"

export function Loader() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        <span className="text-gray-700">Loading...</span>
      </div>
    </div>
  )
}

