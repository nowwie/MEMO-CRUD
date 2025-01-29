"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function CreatePage() {
  const [formData, setFormData] = useState({Judul: "", Isi: ""});
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError]= useState<string | null>(null);

  const router = useRouter();

  const handleInputChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevData)=>({
      ...prevData, 
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async(e:React.FormEvent) => {
    e.preventDefault();

    if(!formData.Judul || !formData.Isi){
      setError("Please fill in all the fields");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/interpretations",{method: "POST", headers:{
        "Content-type":"application/json",
      },
      body : JSON.stringify(formData),
    });
    if(!response.ok){
      throw new Error("Failed to create memo.")
    }
    router.push("/");
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");

    }finally{
      setIsLoading(false);
    }
  };


    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Add New Memo</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="Judul"
              placeholder="Judul"
              value={formData.Judul}
              className="py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handleInputChange}
            />
            <textarea
              name="Isi"
              rows={5}
              placeholder="Isi"
              value={formData.Isi}
              className="py-2 px-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-full transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Adding...." : "Add Memo"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    );
  }
  