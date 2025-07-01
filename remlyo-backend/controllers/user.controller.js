import UserProfile from "../models/user_profile.model.js";
import generateHealthQuestions from "../services/healthQuestion.service.js";
import User from "./../models/user.model.js";
import PaymentHistory from "../models/payment_history.model.js";
import PaymentMethod from "../models/payment_method.model.js";
import UserSubscription from "../models/user_subscription.js";
import Remedy from "../models/remedy.model.js";

const userHealthProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    const existingProfile = await UserProfile.findOne({ userId });

    const updatedProfile = existingProfile
      ? await UserProfile.findOneAndUpdate(
        { userId },
        {
          $set: { ...profileData, lastUpdated: new Date() },
          $inc: { __v: 1 },
        },
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
        isAdded: false,
        success: true,
        data: {
          type,
          remedy: id,
        },
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
      isAdded: true,
      data: populatedUser.saveRemedies.find(
        (s) => s.type == type && s.remedy._id == id
      ),
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const query = { userId };
    const total = await PaymentHistory.countDocuments(query);
    const history = await PaymentHistory.find(query)
      .populate({
        path: "subscriptionId",
        model: UserSubscription,
        select:
          "plan startDate endDate status paymentStatus monthlyPrice billingCycle",
        populate: { path: "plan", select: "name price type" },
      })

      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      message: "Payment history fetched successfully",
      history: history,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
      error: error.message,
    });
  }
};

const getPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id;
    const methods = await PaymentMethod.find({ userId })
      .select(
        "provider lastFourDigits cardholderName expiryDate isDefault billingAddress addedAt"
      )
      .sort({ isDefault: -1, addedAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Payment methods fetched successfully",
      methods,
    });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment methods",
      error: error.message,
    });
  }
};

const deleteSavedRemedy = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Remove the remedy with matching id and type
    const initialLength = user.saveRemedies.length;
    user.saveRemedies = user.saveRemedies.filter(
      (r) => !(r.type === type && r.remedy.toString() === id)
    );
    if (user.saveRemedies.length === initialLength) {
      return res.status(404).json({
        message: "Saved remedy not found",
        success: false,
      });
    }
    await user.save();
    const populatedUser = await User.findById(userId).populate(
      "saveRemedies.remedy"
    );
    return res.status(200).json({
      message: "Saved remedy deleted successfully",
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

const addPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethodId, cardholderName, billingAddress, isDefault } = req.body;
    if (!paymentMethodId || !cardholderName || !billingAddress) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Retrieve payment method details from Stripe
    const paymentMethod = await import("../config/stripe.config.js").then(m => m.default.paymentMethods.retrieve(paymentMethodId));
    if (!paymentMethod || paymentMethod.object !== "payment_method") {
      return res.status(400).json({ success: false, message: "Invalid payment method." });
    }

    // Prevent duplicate storage
    const lastFour = paymentMethod.card.last4;
    const provider = paymentMethod.card.brand;
    const expiryDate = new Date(paymentMethod.card.exp_year, paymentMethod.card.exp_month - 1);
    const existing = await PaymentMethod.findOne({ userId, lastFourDigits: lastFour, provider });
    if (existing) {
      return res.status(409).json({ success: false, message: "Payment method already exists." });
    }

    // If isDefault, unset other defaults
    if (isDefault) {
      await PaymentMethod.updateMany({ userId }, { $set: { isDefault: false } });
    }

    // Store billing address as a string for now
    const billingAddressStr = typeof billingAddress === 'string' ? billingAddress : JSON.stringify(billingAddress);

    const newMethod = await PaymentMethod.create({
      userId,
      tokenizedCard: paymentMethodId,
      provider,
      lastFourDigits: lastFour,
      expiryDate,
      isDefault: !!isDefault,
      billingAddress: billingAddressStr,
      cardholderName,
    });

    return res.status(201).json({ success: true, message: "Payment method added.", method: newMethod });
  } catch (error) {
    console.error("Error adding payment method:", error);
    return res.status(500).json({ success: false, message: "Failed to add payment method.", error: error.message });
  }
};

const removePaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethodId } = req.params;
    const method = await PaymentMethod.findOne({ _id: paymentMethodId, userId });
    if (!method) {
      return res.status(404).json({ success: false, message: "Payment method not found." });
    }
    const wasDefault = method.isDefault;
    await method.deleteOne();
    // If deleted method was default, set another as default
    if (wasDefault) {
      const another = await PaymentMethod.findOne({ userId });
      if (another) {
        another.isDefault = true;
        await another.save();
      }
    }
    return res.status(200).json({ success: true, message: "Payment method removed." });
  } catch (error) {
    console.error("Error removing payment method:", error);
    return res.status(500).json({ success: false, message: "Failed to remove payment method.", error: error.message });
  }
};

const updatePaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethodId } = req.params;
    const { cardholderName, billingAddress, isDefault } = req.body;
    const method = await PaymentMethod.findOne({ _id: paymentMethodId, userId });
    if (!method) {
      return res.status(404).json({ success: false, message: "Payment method not found." });
    }
    if (cardholderName) method.cardholderName = cardholderName;
    if (billingAddress) method.billingAddress = typeof billingAddress === 'string' ? billingAddress : JSON.stringify(billingAddress);
    if (typeof isDefault === 'boolean') {
      if (isDefault) {
        await PaymentMethod.updateMany({ userId }, { $set: { isDefault: false } });
        method.isDefault = true;
      } else {
        method.isDefault = false;
      }
    }
    await method.save();
    return res.status(200).json({ success: true, message: "Payment method updated.", method });
  } catch (error) {
    console.error("Error updating payment method:", error);
    return res.status(500).json({ success: false, message: "Failed to update payment method.", error: error.message });
  }
};

const getUserRemedies = async (req, res) => {
  try {
    const userId = req.user.id;
    let { page = 1, limit = 10, type, category, search, sort = "-createdAt" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // Build filter
    const filter = { createdBy: userId };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const total = await Remedy.countDocuments(filter);
    const remedies = await Remedy.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Remedies fetched successfully",
      remedies,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching user remedies:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch remedies",
      error: error.message,
    });
  }
};

export {
  userHealthProfile,
  getUserHealthQuestionBaseOnHealthProfile,
  healthProfileStatus,
  saveRemedy,
  getPaymentHistory,
  getPaymentMethods,
  deleteSavedRemedy,
  addPaymentMethod,
  removePaymentMethod,
  updatePaymentMethod,
  getUserRemedies,
};
