import React, { useState } from "react";
import Modal from "./Modal";
import FileUpload from "./FileUpload";
import { useAuth } from "../../contexts/AuthContext";
import { uploadFiles } from "../../api/uploadApi";
import Button from "./Button";
import { createReview } from "../../api/reviewApi";

const StarRating = ({ value, onChange, name }) => (
  <div className="flex items-center !py-1 justify-center space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={` text-4xl ${
          star <= value ? "text-yellow-400" : "text-gray-300"
        }`}
        onClick={() => onChange(star)}
        aria-label={`Rate ${star} stars for ${name}`}
      >
        ★
      </button>
    ))}
  </div>
);

const ReviewPopup = ({ isOpen, onClose, remedyId,setAverageRating}) => {
  const { authToken, user } = useAuth();
  const [reviewData, setReviewData] = useState({
    effectivenessRating: 0,
    easeOfUseRating: 0,
    sideEffectsRating: 0,
    verifiedPurchase: true,
    overallRating: 0,
    comment: "",
    images: [],
    remedyId,
    userId: user._id,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setSuccess(false);
      setReviewData({
        effectivenessRating: 0,
        easeOfUseRating: 0,
        sideEffectsRating: 0,
        overallRating: 0,
        verifiedPurchase: true,
        isAnonymous: false,
        comment: "",
        images: [],
        remedyId,
        userId: user._id,
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (field, value) => {
    setReviewData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files) => {
    setReviewData((prev) => ({
      ...prev,
      images: files.map((f) => ({ source: f.secure_url, type: f.mimetype })),
    }));
  };

  const validate = () => {
    const errors = {};
    if (!reviewData.effectivenessRating) {
      errors.effectivenessRating = "Effectiveness rating is required.";
    }
    if (!reviewData.easeOfUseRating) {
      errors.easeOfUseRating = "Ease of use rating is required.";
    }
    if (!reviewData.sideEffectsRating) {
      errors.sideEffectsRating = "Side effects rating is required.";
    }
    if (!reviewData.overallRating) {
      errors.overallRating = "Overall rating is required.";
    }
    if (!reviewData.comment.trim()) {
      errors.comment = "Comment is required.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (loading) return;
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setLoading(true);
      setErrors({});
      const res = await createReview(authToken, reviewData);
      if (res.success) {
        setSuccess(true);
        setAverageRating(res.averageRating,res.reviewCount);
      } else if (!res.success && res.exist) {
        setAlreadyReviewed(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClasses={"overflow-auto max-h-[85vh]   pr-0"}
      title={
        alreadyReviewed
          ? "Already Reviewed"
          : success
          ? "Thank You!"
          : "Rate this Remedy"
      }
    >
      <div className="space-y-4 relative w-full">
        {alreadyReviewed ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl mb-4 text-yellow-500">⚠️</div>
            <h2 className="text-2xl font-semibold mb-2">
              You've already reviewed this remedy
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Thank you! You can only submit one review per remedy.
              <br />
              If you want to update your review, please edit your existing one.
            </p>
            <Button color="brand" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl mb-4 text-green-500">🎉</div>
            <h2 className="text-2xl font-semibold mb-2">
              Thank you for your feedback!
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Your review helps others make better decisions and helps us
              improve our remedies.
            </p>
            <Button color="brand" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <form id="review-form" onSubmit={handleSubmit} aria-live="polite">
            <div>
              <label
                htmlFor="effectivenessRating-rating"
                className="block text-gray-600 text-sm font-medium"
              >
                Effectiveness
              </label>
              <StarRating
                value={reviewData.effectivenessRating}
                onChange={(val) => handleChange("effectivenessRating", val)}
                name="Effectiveness"
              />
              {errors.effectivenessRating && (
                <div className="text-red-500 text-sm">{errors.effectivenessRating}</div>
              )}
            </div>
            <div>
              <label
                htmlFor="easeofuse-rating"
                className="block text-gray-600 text-sm font-medium"
              >
                Ease of Use
              </label>
              <StarRating
                value={reviewData.easeOfUseRating}
                onChange={(val) => handleChange("easeOfUseRating", val)}
                name="Ease of Use"
              />
              {errors.easeOfUseRating && (
                <div className="text-red-500 text-sm">{errors.easeOfUseRating}</div>
              )}
            </div>
            <div>
              <label
                htmlFor="sideeffects-rating"
                className="block text-gray-600 text-sm font-medium"
              >
                Side Effects
              </label>
              <StarRating
                value={reviewData.sideEffectsRating}
                onChange={(val) => handleChange("sideEffectsRating", val)}
                name="Side Effects"
              />
              {errors.sideEffectsRating && (
                <div className="text-red-500 text-sm">{errors.sideEffectsRating}</div>
              )}
            </div>
            <div>
              <label
                htmlFor="overallRating-rating"
                className="block text-gray-600 text-sm font-medium"
              >
                Overall
              </label>
              <StarRating
                value={reviewData.overallRating}
                onChange={(val) => handleChange("overallRating", val)}
                name="Overall"
              />
              {errors.overallRating && (
                <div className="text-red-500 text-sm">{errors.overallRating}</div>
              )}
            </div>
            <div>
              <label
                htmlFor="review-comment"
                className="block text-gray-600 mb-2 text-sm font-medium"
              >
                Comment
              </label>
              <textarea
                id="review-comment"
                className="w-full border rounded p-2"
                maxLength={1000}
                value={reviewData.comment}
                onChange={(e) => handleChange("comment", e.target.value)}
                rows={4}
                placeholder="Share your experience..."
                aria-label="Comment"
                required
              />
              {errors.comment && (
                <div className="text-red-500 text-sm">{errors.comment}</div>
              )}
            </div>
            <div>
              <FileUpload
                variant={"compact"}
                labelClasses="text-sm"
                acceptedFileTypes={[
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                  "image/webp",
                ]}
                browseText="Select images"
                dropzoneText="Drag & drop or select images"
                label="Upload Images (optional)"
                multiple={true}
                onFileSelect={handleFileUpload}
                helperText="Supported file types: JPG, JPEG, WEBP, PNG. Max size: 2MB each."
              />
            </div>

            <div className="flex justify-end mt-4 px-4 space-x-2">
              <Button
                variant="outlined"
                disabled={loading}
                color="brand"
                onClick={onClose}
              >
                Close
              </Button>
              <Button color="brand" disabled={loading} type="submit">
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ReviewPopup;
