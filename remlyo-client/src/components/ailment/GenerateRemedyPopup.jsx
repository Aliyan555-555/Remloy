import React, { useState, useContext } from "react";
import Modal from "../common/Modal";
import LoadingSpinner from "../common/LoadingSpinner";
import Button from "../common/Button";
import { generateAIRemedy } from "../../api/remediesApi";
import { useAuth } from "../../contexts/AuthContext";

const GenerateRemedyPopup = ({ isOpen, onClose,ailmentId}) => {
  const [step, setStep] = useState(1);
  const [generateError, setGenerateError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedRemedy, setGeneratedRemedy] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const { authToken } = useAuth();

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
        const res = await generateAIRemedy(authToken,ailmentId, symptoms);
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
      {step === 2 && (
        generating ? (
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
            <Button variant="outlined" color="brand" onClick={handleBackStep}>
              Back
            </Button>
          </div>
        ) : generatedRemedy ? (
          <div className="py-4">
            <h3 className="text-xl font-semibold mb-2 text-brand-green">Your AI Remedy</h3>
            <div className="mb-4">
              <strong>Name:</strong> {generatedRemedy.name}<br />
              <strong>Description:</strong> <span dangerouslySetInnerHTML={{ __html: generatedRemedy.description }} /><br />
              <strong>Category:</strong> {generatedRemedy.category}<br />
              <strong>Type:</strong> {generatedRemedy.type}<br />
              <strong>Ingredients:</strong> {generatedRemedy.ingredients}<br />
              <strong>Instructions:</strong> <span dangerouslySetInnerHTML={{ __html: generatedRemedy.instructions }} /><br />
              <strong>Side Effects:</strong> <span dangerouslySetInnerHTML={{ __html: generatedRemedy.sideEffects }} /><br />
              <strong>How to Take It:</strong> <span dangerouslySetInnerHTML={{ __html: generatedRemedy.howToTakeIt }} /><br />
              <strong>Dosage & Usage:</strong> <span dangerouslySetInnerHTML={{ __html: generatedRemedy.dosageAndUsage }} /><br />
              <strong>Preparation Time:</strong> {generatedRemedy.preparationTime}<br />
              <strong>Equipments:</strong> <span dangerouslySetInnerHTML={{ __html: generatedRemedy.equipments }} /><br />
              <strong>Storage Instructions:</strong> <span dangerouslySetInnerHTML={{ __html: generatedRemedy.storageInstructions }} /><br />
              <strong>AI Confidence Score:</strong> {generatedRemedy.aiConfidenceScore}<br />
              {generatedRemedy.media?.source && (
                <div className="my-2">
                  <img src={generatedRemedy.media.source} alt="Remedy" className="max-h-40 rounded" />
                </div>
              )}
              {generatedRemedy.scientificReferences && generatedRemedy.scientificReferences.length > 0 && (
                <div className="mt-2">
                  <strong>Scientific References:</strong>
                  <ul className="list-disc ml-6">
                    {generatedRemedy.scientificReferences.map((ref, idx) => (
                      <li key={idx} dangerouslySetInnerHTML={{ __html: ref }} />
                    ))}
                  </ul>
                </div>
              )}
              {generatedRemedy.geographicRestrictions && generatedRemedy.geographicRestrictions.length > 0 && (
                <div className="mt-2">
                  <strong>Geographic Restrictions:</strong>
                  <ul className="list-disc ml-6">
                    {generatedRemedy.geographicRestrictions.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outlined" color="brand" onClick={handleReset}>
                Generate Another
              </Button>
              <Button variant="contained" color="brand" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : null
      )}
    </Modal>
  );
};

export default GenerateRemedyPopup;
