import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../components/form/FormLayout";
import FormInput from "../components/form/FormInput";
import FormSelect from "../components/form/FormSelect";
import { generateHealthProfileQuestions, healthProfile } from "../api/userApi";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";

const HealthProfilePage = () => {
  const navigate = useNavigate();
  const { authToken, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Health Profile
    age: "",
    height: "",
    weight: "",
    sex: "",
    bloodType: "",
    located: "",
    ethnicity: "",
    birthplace: "",
    diet: "",
    chronicConditions: [""],
  });

  const [errors, setErrors] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [aiQuestions, setAiQuestions] = useState([]);
  const [expandedHealthProfile, setExpandedHealthProfile] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "select-multiple") {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({
        ...formData,
        [name]: selectedOptions,
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleChangeExpendedHealthProfileFields = (e) => {
    const { name, value } = e.target;
    setExpandedHealthProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear any existing errors for this field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields =
      currentStep === 1
        ? [
            "age",
            "height",
            "weight",
            "sex",
            "bloodType",
            "located",
            "ethnicity",
            "birthplace",
            "diet",
            "chronicConditions",
          ]
        : [];

    // Validate basic profile fields
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = field + " is required";
      }
    });

    // Validate AI-generated fields in step 2
    if (currentStep === 2) {
      aiQuestions.forEach((section) => {
        if (section.questions) {
          section.questions.forEach((question) => {
            if (!expandedHealthProfile[question.name]) {
              newErrors[question.name] = "This field is required";
            }
          });
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (currentStep === 1) {
        const res = await generateHealthProfileQuestions(formData, authToken);
        if (res?.data) {
          setAiQuestions(res.data);
          const initialExpandedState = {};
          const initialHealthProfileState = {};

          res.data.forEach((section) => {
            initialExpandedState[section.id] = true;
            if (section.questions) {
              section.questions.forEach((question) => {
                initialHealthProfileState[question.name] = "";
              });
            }
          });

          setExpandedSections(initialExpandedState);
          setExpandedHealthProfile(initialHealthProfileState);
          setCurrentStep(2);
        }
      } else {
        const completeProfileData = {
          ...formData,
          // aiGeneratedFields: expandedHealthProfile,// enable in future
        };
        const res = await healthProfile(completeProfileData, authToken);
        console.log(res);
        if (res.success) {
          console.log(user.accessLevel);
          const redirect =
            user.accessLevel !== "user" ? "/admin/dashboard" : "/dashboard";
          navigate(redirect, { replace: true });
        }
      }
    } catch (error) {
      console.error("Submission error:", error.message);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to submit form. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      navigate(-1);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/dashboard");
  };

  const renderBasicProfile = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      <FormSelect
        label="What's Your Age?"
        name="age"
        placeholder="Select your age"
        value={formData.age}
        onChange={handleChange}
        options={[...Array(100).keys()].map((a) => ({
          value: a + 1,
          label: `${a + 1}`,
        }))}
        error={errors.age}
      />

      <FormInput
        label="How Tall Are You?"
        name="height"
        placeholder="Height in cm"
        value={formData.height}
        onChange={handleChange}
        type="number"
        error={errors.height}
      />

      <FormInput
        label="What's Your Weight?"
        name="weight"
        placeholder="Weight in Kg"
        value={formData.weight}
        onChange={handleChange}
        type="number"
        error={errors.weight}
      />

      <FormSelect
        label="What's Your sex?"
        name="sex"
        placeholder="Select your sex"
        value={formData.sex}
        onChange={handleChange}
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "nonbinary", label: "Non-binary" },
          { value: "prefer_not", label: "Prefer not to disclose" },
        ]}
        error={errors.sex}
      />

      <FormSelect
        label="What's Your Blood Type?"
        name="bloodType"
        placeholder="Select your blood type"
        value={formData.bloodType}
        onChange={handleChange}
        options={[
          { value: "A+", label: "A+" },
          { value: "A-", label: "A-" },
          { value: "B+", label: "B+" },
          { value: "B-", label: "B-" },
          { value: "AB+", label: "AB+" },
          { value: "AB-", label: "AB-" },
          { value: "O+", label: "O+" },
          { value: "O-", label: "O-" },
          { value: "unknown", label: "Unknown" },
        ]}
        error={errors.bloodType}
      />

      <FormInput
        label="Where Are You Located?"
        name="located"
        placeholder="Enter your location"
        value={formData.located}
        onChange={handleChange}
        error={errors.located}
      />

      <FormSelect
        label="What's Your Racial or Ethnic Background?"
        name="ethnicity"
        placeholder="Select"
        value={formData.ethnicity}
        error={errors.ethnicity}
        onChange={handleChange}
        options={[
          { value: "asian", label: "Asian" },
          { value: "black", label: "Black / African descent" },
          { value: "hispanic", label: "Hispanic / Latino" },
          { value: "white", label: "White / Caucasian" },
          { value: "indigenous", label: "Indigenous / Native" },
          { value: "mixed", label: "Mixed" },
          { value: "prefer_not", label: "Prefer not to disclose" },
        ]}
      />

      <FormInput
        label="Where Were You Born?"
        name="birthplace"
        placeholder="Enter your place of birth"
        value={formData.birthplace}
        onChange={handleChange}
        error={errors.birthplace}
      />

      <FormSelect
        label="What's Your Typical Diet?"
        name="diet"
        placeholder="Select your diet"
        value={formData.diet}
        onChange={handleChange}
        error={errors.diet}
        options={[
          { value: "omnivore", label: "Omnivore" },
          { value: "vegetarian", label: "Vegetarian" },
          { value: "vegan", label: "Vegan" },
          { value: "pescatarian", label: "Pescatarian" },
          { value: "keto", label: "Keto / Low Carb" },
          { value: "other", label: "Other" },
          { value: "prefer_not", label: "Prefer not to disclose" },
        ]}
      />

      <FormSelect
        label="Do You Have Any Chronic condition?"
        name="chronicConditions"
        placeholder="Select a chronic condition"
        value={formData.chronicConditions}
        error={errors.chronicConditions}
        onChange={handleChange}
        multiple={true}
        options={[
          { value: "none", label: "None" },
          { value: "diabetes", label: "Diabetes" },
          { value: "hypertension", label: "Hypertension" },
          { value: "asthma", label: "Asthma" },
          { value: "arthritis", label: "Arthritis" },
          { value: "mental_health", label: "Mental Health" },
          { value: "autoimmune", label: "Autoimmune Disease" },
          { value: "other", label: "Other" },
          { value: "prefer_not", label: "Prefer not to disclose" },
        ]}
      />
    </div>
  );

  const renderExtendedProfile = () => (
    <div className="px-8 py-6 overflow-y-auto max-h-[60vh]">
      {aiQuestions.map((section, i) => (
        <div key={i} className="mb-6 border border-gray-200 rounded-lg">
          <div
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection(i)}
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {section.title}
              </h2>
              <p className="text-gray-600">{section.description}</p>
            </div>
            <button className="text-gray-500 text-2xl">
              {expandedSections[i] ? "−" : "+"}
            </button>
          </div>

          {expandedSections[i] && section.questions && (
            <div className="p-4 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {section.questions.map((question) => (
                  <FormSelect
                    key={question.id}
                    label={question.question}
                    name={question.name}
                    value={expandedHealthProfile[question.name] || ""}
                    onChange={handleChangeExpendedHealthProfileFields}
                    options={question.options}
                    error={errors[question.name]}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner heightClass="h-auto" />
        {/* <div className="text-center"> */}
        <h3 className="text-xl mt-4 font-semibold text-gray-800 mb-2">
          {currentStep === 1
            ? "Analyzing Your Health Profile..."
            : "Generating Personalized Questions..."}
        </h3>
        {/* </div> */}
      </div>
    );
  }

  return (
    <>
      <FormLayout
        title={
          currentStep === 1
            ? "Welcome to Remlyo Let's Build Your Health Profile"
            : "Dive Deeper with AI – Share More, Get Better Remedies!"
        }
        subtitle={
          currentStep === 1
            ? "Unlock Personalized Remedies with These Key Details! (Feel free to select 'Prefer Not to Disclose' for any field to keep it private.)"
            : "Optional AI-Driven Questions (50+ Dynamic Fields)\nTake your time, enhance wellness with personalized remedies every step!"
        }
        currentStep={currentStep}
        totalSteps={2}
        onNext={handleNext}
        onBack={handleBack}
        showBackButton={currentStep === 2}
      >
        {currentStep === 1 ? renderBasicProfile() : renderExtendedProfile()}
      </FormLayout>

      {/* Modal - Show when finish button clicked */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Complete Your Health Profile
              </h2>
              <p className="text-gray-600">
                Let's add one detail to personalize your remedies!
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How Much Sugar Do You Consume?
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green mb-4">
                <option disabled selected>
                  Select level
                </option>
                <option value="very_low">Very Low</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={closeModal}
                className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
              >
                Prefer Not to Say
              </button>
              <button
                onClick={closeModal}
                className="bg-brand-green text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Disable Prompts
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HealthProfilePage;
