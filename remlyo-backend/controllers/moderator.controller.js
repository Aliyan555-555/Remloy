import Comment from "../models/comment.model.js";



const getComments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      upvoteOrder
    } = req.query;

    const filter = {};

    // Search by content
    if (search) {
      filter.content = { $regex: search, $options: 'i' };
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Sorting logic
    const sort = {};
    if (upvoteOrder) {
      sort.upvoteCount = upvoteOrder === 'desc' ? -1 : 1;
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalComments = await Comment.countDocuments(filter);

    const comments = await Comment.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email profileImage'); // Correct population

    res.status(200).json({
      success: true,
      data: comments,
      filter,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalComments / parseInt(limit)),
        totalItems: totalComments,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
};

export {
  getComments
};

