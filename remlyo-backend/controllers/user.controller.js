import UserProfile from "../models/user_profile.model.js";
import generateHealthQuestions from "../services/healthQuestion.service.js";
import { userHealthProfileValidation } from "../validations/user.validations.js";
import User from "./../models/user.model.js";

const userHealthProfile = async (req, res) => {
  try {
    const { error } = userHealthProfileValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const userId = req.user.id;
    const profileData = req.body;

    const existingProfile = await UserProfile.findOne({ userId });

    const updatedProfile = existingProfile
      ? await UserProfile.findOneAndUpdate(
          { userId },
          { $set: { ...profileData, lastUpdated: new Date() } },
          { new: true, runValidators: true }
        )
      : await UserProfile.create({ userId, ...profileData });

    return res.status(200).json({
      success: true,
      message: existingProfile
        ? "Profile updated successfully"
        : "Profile created successfully",
      data: updatedProfile,
    });
  } catch (err) {
    console.error("User Profile Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getUserHealthQuestionBaseOnHealthProfile = async (req, res) => {
  try {
    const { error } = userHealthProfileValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error,
      });
    }

    const healthQuestions = await generateHealthQuestions(req.body);

    return res.status(200).json({
      success: true,
      message: "Health questions generated successfully",
      data: healthQuestions,
    });
  } catch (error) {
    console.error("Health Questions Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const healthProfileStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfileExist = await UserProfile.findOne({ userId });

    if (!userProfileExist) {
      return res.status(400).json({
        message: "profile not exist",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      message: "profile exist",
      profile: userProfileExist,
    });
  } catch (error) {
    console.error("Error checking health profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check health profile status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const saveRemedy = async (req, res) => {
  try {
    const userId = req.user.id;
    const type = req.query.type || "favorite";
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Remedy ID is required",
        success: false,
      });
    }

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if already saved
    const index = userData.saveRemedies.findIndex(
      (item) => item.remedy.toString() === id && item.type === type
    );
    if (index !== -1) {
      // If already saved, remove it (toggle off)
      userData.saveRemedies.splice(index, 1);
      await userData.save();
      return res.status(200).json({
        message: "Remedy removed successfully",
        success: true,
        data: userData.saveRemedies,
      });
    }

    // If not saved, add it
    userData.saveRemedies.push({
      type,
      remedy: id,
    });
    await userData.save();
    const populatedUser = await User.findById(userId).populate(
      "saveRemedies.remedy"
    );

    return res.status(200).json({
      message: "Remedy saved successfully",
      success: true,
      data: populatedUser.saveRemedies,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

export {
  userHealthProfile,
  getUserHealthQuestionBaseOnHealthProfile,
  healthProfileStatus,
  saveRemedy,
};
