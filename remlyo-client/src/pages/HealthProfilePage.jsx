import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../components/form/FormLayout";
import FormInput from "../components/form/FormInput";
import FormSelect from "../components/form/FormSelect";
import { generateHealthProfileQuestions, healthProfile } from "../api/userApi";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useUserFlow } from "../contexts/UserFlowContext";
import { UserFlowStatus } from "../constants";

const INITIAL_FORM_DATA = {
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
};

const HealthProfilePage = () => {
  const navigate = useNavigate();
  const { authToken, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { checkUserFlow, setFlowStatus } = useUserFlow();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [aiQuestions, setAiQuestions] = useState([]);
  const [expandedHealthProfile, setExpandedHealthProfile] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      if (type === "select-multiple") {
        const selectedOptions = Array.from(
          e.target.selectedOptions,
          (option) => option.value
        );
        return { ...prev, [name]: selectedOptions };
      }
      if (type === "checkbox") {
        return { ...prev, [name]: checked };
      }
      return { ...prev, [name]: value };
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleChangeExpendedHealthProfileFields = useCallback((e) => {
    const { name, value } = e.target;
    setExpandedHealthProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const toggleSection = useCallback((sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  const validateForm = useCallback(() => {
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
      if (
        !formData[field] ||
        (Array.isArray(formData[field]) && formData[field].length === 0)
      ) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    // Validate numeric fields
    if (formData.height && (isNaN(formData.height) || formData.height <= 0)) {
      newErrors.height = "Please enter a valid height";
    }
    if (formData.weight && (isNaN(formData.weight) || formData.weight <= 0)) {
      newErrors.weight = "Please enter a valid weight";
    }

    // Validate AI-generated fields in step 2
    if (currentStep > 1) {
      // aiQuestions.forEach((section) => {
      const section = aiQuestions[currentStep - 2];
      if (section.questions) {
        section.questions.forEach((question) => {
          if (!expandedHealthProfile[question.name]) {
            newErrors[question.name] = "This field is required";
          }
        });
      }
      // });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, formData, aiQuestions, expandedHealthProfile]);

  const handleNext = async () => {
    console.log("submit calling", errors);
    if (!validateForm()) return;
    console.log("validator");
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
      } else if (currentStep === 6) {
        // Transform AI questions and answers into the required format
        const formattedQuestions = [];
        aiQuestions.forEach(section => {
          if (section.questions) {
            section.questions.forEach(q => {
              formattedQuestions.push({
                category: section.title,
                question: q.question,
                options: q.options ? q.options.map(opt => opt.label) : [],
                answer: expandedHealthProfile[q.name] || ""
              });
            });
          }
        });
        const completeProfileData = {
          ...formData,
          aiQuestionUserAnswers: formattedQuestions,
        };
        const redirect =
          user.accessLevel !== "user" ? "/admin/dashboard" : "/dashboard";
        const res = await healthProfile(completeProfileData, authToken);
        if (res.success) {
          setFlowStatus(UserFlowStatus.COMPLETE);
          // checkUserFlow().then(() => navigate(redirect, { replace: true }))
          await checkUserFlow();
          navigate(redirect);
        }
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to submit form. Please try again.",
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

  const renderExtendedProfile = (index) => {
    // console.log(i);
    const section = aiQuestions[index];
    return (
      <div className="px-8 py-6 overflow-y-auto max-h-[60vh]">
        {/* {aiQuestions.map((section, index) => ( */}
        <div
          key={section.id}
          className="mb-6 border border-gray-200 rounded-lg"
        >
          <div
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection(section.id)}
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {section.title}
              </h2>
              <p className="text-gray-600">{section.description}</p>
            </div>
            <button className="text-gray-500 text-2xl">
              {expandedSections[section.id] ? "−" : "+"}
            </button>
          </div>

          {expandedSections[section.id] && section.questions && (
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
        {/* ))} */}
      </div>
    );
  };
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner heightClass="h-auto" />
        <h3 className="text-xl mt-4 font-semibold text-gray-800 mb-2">
          {currentStep === 1
            ? "Analyzing Your Health Profile..."
            : "Generating Personalized Questions..."}
        </h3>
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
        totalSteps={6}
        onNext={handleNext}
        onBack={handleBack}
        showBackButton={currentStep > 1}
      >
        {currentStep === 1
          ? renderBasicProfile()
          : renderExtendedProfile(currentStep - 2)}
      </FormLayout>

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
                <option value="" disabled>
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
