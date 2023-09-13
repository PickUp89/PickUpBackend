// user read (query one user), update and delete account
import e, { Request, Response } from "express";
import Post from "../models/Post";

// GET posts by id
const getPostById = async (req: Request, res: Response) => {
  try {
    const id: string = String(req.query.id);
    // query the user with the email
    const foundPost = await Post.findOne({
      where: { id: id },
    });

    // if user is not found in the database
    if (!foundPost) {
      return res.status(404).json("Cannot find user with the provided email");
    }

    return res.status(200).json(foundPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
// GET posts by userId
const getPostByUserId = async (req: Request, res: Response) => {
  try {
    const userId: string = String(req.query.userId);
    const postCount: number = parseInt(req.query.postCount as string);

    // Check if postCount is a valid positive integer
    if (isNaN(postCount) || postCount <= 0) {
      return res
        .status(400)
        .json({
          error: "Invalid postCount value. It should be a positive integer.",
        });
    }

    const foundPosts = await Post.findAll({
      where: { creatorId: userId },
      limit: postCount, // Limit the number of posts returned based on postCount
    });

    // if user is not found in the database
    if (!foundPosts || foundPosts.length === 0) {
      return res
        .status(404)
        .json({ error: "Cannot find posts for the provided userId." });
    }

    return res.status(200).json(foundPosts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// POST create new post
const createNewPost = async (req: Request, res: Response) => {
  try {
    const { title, description, creatorId, location, eventDate, eventType } =
      req.body;

    console.log('payload', {
        title,
        description,
        creatorId,
        location,
        eventDate,
        eventType,
    })

    const newPost = await Post.create({
        title,
        description,
        creatorId,
        location,
        eventDate,
        eventType,
    });
    if (!newPost) {
      throw new Error(`Error with server! Cannot create user!`);
    }
    return res.status(201);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};

// DELETE post
const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
  
    const foundPost = await Post.findOne({
      where: {id : id},
    })

    if(!foundPost) {
        return res.status(404).json({ message: `Post doesnt exists`});
    }

    // delete the user's account
    await foundPost.destroy();
    return res.status(201);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};

// UPDATE POST:
const updatePost = async (req: Request, res: Response) => {
  try {
      const {id} = req.body;
      const fieldsToUpdate = req?.body?.fieldsToUpdate;

      // query the user with the email
      let foundPost = await Post.findOne({
          where: { id: id },
      });

      // if user is not found in the database
      if(!foundPost) {
          return res.status(404).json("Cannot find user with the provided email");
      }
      
      Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key in foundPost) {
              // @ts-ignore
              foundPost[key] = value;
          }
      });

      foundPost.save();
      
      return res.status(201).json(foundPost);

  } catch(err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
  }
}

export { getPostById, getPostByUserId, createNewPost, deletePost, updatePost};