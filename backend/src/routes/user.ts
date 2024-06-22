import express from "express";
import { UserModel } from "../models/User";
import { Types } from "mongoose";
import { CommunityModel } from "../models/Community";

const userRouter = express.Router();

const validateId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

/**
 * @route GET /user/:id
 * @param {string} id - User ID
 * @returns {User} - User object with experiencePoints field
 */
userRouter.get("/:id", async (req, res) => {
  const user = await UserModel.findById(req.params.id).select(
    "+experiencePoints"
  );
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  res.send(user);
});

/**
 * @route GET /user
 * @returns {Array} - Array of User objects
 * @note Adds the virtual field of totalExperience to the user.
 * @hint You might want to use a similar aggregate in your leaderboard code.
 */
userRouter.get("/", async (_, res) => {
  const users = await UserModel.aggregate([
    {
      $unwind: "$experiencePoints",
    },
    {
      $group: {
        _id: "$_id",
        email: { $first: "$email" },
        profilePicture: { $first: "$profilePicture" },
        totalExperience: { $sum: "$experiencePoints.points" },
      },
    },
  ]);
  res.send(users);
});

/**
 * @route POST /user/:userId/join/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description Joins a community
 */
userRouter.post("/:userId/join/:communityId", async (req, res) => {
  const { userId, communityId } = req.params;
  try {
    if (!validateId(userId) || !validateId(communityId)) {
      res.status(400).send("Invalid user ID or community ID");
			return
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
			return
    }
    const community = await CommunityModel.findById(communityId);
    if (!community) {
      res.status(404).send("Community not found");
			return
    }

    user.community = community._id;
		await user.save();
		res.status(200).send("Successfully joined the community");
  } catch (error: unknown) {
    res.status(500).send("Internal server error");
  }
});

/**
 * @route DELETE /user/:userId/leave/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description leaves a community
 */
userRouter.delete("/:userId/leave/:communityId", async (req, res) => {
  const { userId, communityId } = req.params;
  try {
    if (!validateId(userId) || !validateId(communityId)) {
      res.status(400).send("Invalid user ID or community ID");
			return
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
			return
    }

    user.community = null;
		await user.save();
		res.status(204).send();
  } catch (error: unknown) {
    res.status(500).send("Internal server error");
  }
});

export { userRouter };
