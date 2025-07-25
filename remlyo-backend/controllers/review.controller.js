import Remedy from "../models/remedy.model.js";
import Review from "../models/review.model.js";

const createReview = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviewExist = await Review.findOne({
      userId,
      remedyId: req.body.remedyId,
    });

    if (reviewExist) {
      return res
        .status(409)
        .json({ message: "Review already exist", exist: true, success: false });
    }
    const newReview = await Review.create({
      userId,
      isAnonymous: userId ? false : true,
      ...req.body,
    });

    // Update remedy's averageRating
    const allReviews = await Review.find({ remedyId: req.body.remedyId });
    const total = allReviews.length;
    const sum = allReviews.reduce(
      (acc, review) => acc + (review.overallRating || 0),
      0
    );
    const avg = total > 0 ? parseFloat((sum / total).toFixed(1)) : 0;
    await Remedy.findByIdAndUpdate(req.body.remedyId, {
      averageRating: avg,
      reviewCount: total,
    });

    res.status(201).json({
      message: "Review successfully created",
      averageRating: avg,
      reviewCount: total,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const getReviewRatingsByRemedyId = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await Review.find({ remedyId: id })
      .sort({ createdAt: -1 })
      .lean();

    if (reviews.length === 0) {
      return res.status(200).json({
        totalReviews: 0,
        averageRatings: {
          effectiveness: 0,
          easeOfUse: 0,
          sideEffects: 0,
          overall: 0,
        },
        reviews: [],
      });
    }

    // Calculate averages
    const total = reviews.length;
    const sum = {
      effectiveness: 0,
      easeOfUse: 0,
      sideEffects: 0,
      overall: 0,
    };

    reviews.forEach((review) => {
      sum.effectiveness += review.effectivenessRating;
      sum.easeOfUse += review.easeOfUseRating;
      sum.sideEffects += review.sideEffectsRating;
      sum.overall += review.overallRating;
    });

    const averageRatings = {
      effectiveness: parseFloat((sum.effectiveness / total).toFixed(1)),
      easeOfUse: parseFloat((sum.easeOfUse / total).toFixed(1)),
      sideEffects: parseFloat((sum.sideEffects / total).toFixed(1)),
      overall: parseFloat((sum.overall / total).toFixed(1)),
    };

    res.status(200).json({
      success: true,
      message: "Successfully fetched review ratings",
      totalReviews: total,
      averageRatings,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
      success: false,
    });
  }
};

export { createReview, getReviewRatingsByRemedyId };
