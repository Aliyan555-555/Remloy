import React, { useState, useContext } from "react";
import Modal from "../common/Modal";
import LoadingSpinner from "../common/LoadingSpinner";
import Button from "../common/Button";
import { generateAIRemedy } from "../../api/remediesApi";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const GenerateRemedyPopup = ({ isOpen, onClose, ailmentId }) => {
  const [step, setStep] = useState(1);
  const [generateError, setGenerateError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedRemedy, setGeneratedRemedy] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const handleBackStep = () => {
    setStep((prev) => prev - 1);
    setGenerateError("");
    setGenerating(false);
    setGeneratedRemedy(null);
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    setGenerateError("");
    if (step === 1) {
      setStep(2);
      setGenerating(true);
      try {
        const res = await generateAIRemedy(authToken, ailmentId, symptoms);
        if (res && res.success !== false && res.remedy) {
          setGeneratedRemedy(res.remedy);
          setGenerating(false);
        } else {
          setGenerateError(res.message || "Failed to generate remedy");
          setGenerating(false);
        }
      } catch (err) {
        setGenerateError(err?.message || "Server error");
        setGenerating(false);
      }
    }
  };

  const handleReset = () => {
    setStep(1);
    setSymptoms("");
    setGeneratedRemedy(null);
    setGenerateError("");
    setGenerating(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate AI Remedy"
      size="md"
    >
      {step === 1 && (
        <form onSubmit={handleNextStep}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="symptoms">
              Describe your symptoms and issues
            </label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green"
              placeholder="Describe your symptoms, issues, or anything relevant..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="submit" variant="contained" color="brand">
              Generate Remedy
            </Button>
          </div>
        </form>
      )}
      {step === 2 &&
        (generating ? (
          <div className="flex gap-4 flex-col items-center justify-center py-8">
            <LoadingSpinner heightClass="h-[100px]" />
            <p className="mt-4 text-gray-600">
              Generating your personalized remedy...
            </p>
            <Button variant="outlined" color="brand" onClick={handleBackStep}>
              Back
            </Button>
          </div>
        ) : generateError ? (
          <div className="flex flex-col items-center justify-center py-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
              />
            </svg>
            <h4 className="text-lg font-semibold mb-2">Server Error</h4>
            <p className="text-gray-600 mb-4">{generateError}</p>
            {generatedRemedy && (
              <Button
                variant="contained"
                color="brand"
                onClick={() => navigate(`/remedies/${generatedRemedy.type}/${generatedRemedy._id}`)}
                className="mb-2"
              >
                View Remedy
              </Button>
            )}
            <Button variant="outlined" color="brand" onClick={handleBackStep}>
              Back
            </Button>
          </div>
        ) : generatedRemedy ? (
          <div className="py-4 flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-500 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h4 className="text-lg font-semibold text-green-600 mb-2">Remedy generated successfully!</h4>
            <Button
              variant="contained"
              color="brand"
              onClick={() => navigate(`/remedies/${generatedRemedy.type}/${generatedRemedy._id}`)}
              className="mb-2"
            >
              View Remedy
            </Button>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outlined" color="brand" onClick={handleReset}>
                Generate Another
              </Button>
              <Button variant="contained" color="brand" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : null)}
    </Modal>
  );
};

export default GenerateRemedyPopup;
