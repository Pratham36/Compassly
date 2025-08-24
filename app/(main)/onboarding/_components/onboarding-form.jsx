"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadResume } from "@/actions/resume";
import { toast } from "sonner";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle file selection with size limit
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const MAX_SIZE_MB = 5; // temporary size limit (10MB)

    if (selectedFile && selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File too large! Max ${MAX_SIZE_MB}MB allowed.`);
      return;
    }

    if (selectedFile && selectedFile.type !== "application/pdf") {
      toast.error("Please upload a PDF file only.");
      return;
    }

    setFile(selectedFile);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please select a file first!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      let attempts = 0;
      let result;

      while (attempts < 3) {
        attempts++;
        result = await uploadResume(formData);

        if (result.success) break;

        if (result.error.includes("Too Many Requests")) {
          toast.info(`Server busy, retrying... (${attempts}/3)`);
          await new Promise((r) => setTimeout(r, attempts * 1000));
          continue;
        }

        throw new Error(result.error);
      }

      if (!result?.success) throw new Error(result.error);

      toast.success("Resume uploaded & analyzed successfully!");
      setIsOpen(false);

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh(); // optional, ensures latest data shows up
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90 p-4">
      <div className="bg-[#1e1e1e] text-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg p-6 relative">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">
          Upload Resume (PDF)
        </h2>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-8 cursor-pointer hover:bg-[#2a2a2a] transition text-center">
          <FileText size={40} className="text-gray-400 mb-2" />
          <span className="text-gray-400">
            {file ? file.name : "Click to select a PDF"}
          </span>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <Button onClick={handleUpload} disabled={!file || loading}>
            <Upload size={18} className="mr-2" />
            {loading ? "Uploading..." : "Upload & Analyze"}
          </Button>
        </div>
      </div>
    </div>
  );
}
