import express from "express";
import { CommunityModel } from "../models/Community";

const communityRouter = express.Router();

/**
 * @route GET /community/:id
 * @param {string} id - Community ID
 * @returns {Community} - Community object
 */
communityRouter.get("/:id", async (req, res) => {
	const community = await CommunityModel.findById(req.params.id).lean();
	if (!community) {
		return res.status(404).send({ message: "Community not found" });
	}
	res.send(community);
});

/**
 * @route GET /community
 * @returns {Array} - Array of Community objects
 */
communityRouter.get("/", async (_, res) => {
	try {
		const communities = await CommunityModel.aggregate([
				{
						$lookup: {
								from: 'users',
								localField: '_id',
								foreignField: 'community',
								as: 'users'
						}
				},
				{
						$addFields: {
								userCount: { $size: '$users' },
								totalExperiencePoints: {
										$sum: {
												$map: {
														input: '$users',
														as: 'user',
														in: { $sum: '$$user.experiencePoints.points' }
												}
										}
								}
						}
				},
				{
						$sort: { totalExperiencePoints: -1 }
				},
				{
					$project: {
							users: 0
					}
			}
		]).exec();

		res.send(communities);
} catch (error) {
		res.status(500).send({ error: 'Internal Server Error' });
}
});

export {
    communityRouter
}
