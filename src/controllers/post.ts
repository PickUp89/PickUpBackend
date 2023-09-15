// user read (query one user), update and delete account
import e, { Request, Response } from "express";
import Post from "../models/Post";
import { INTEGER, IntegerDataType } from "sequelize";
import { calculateDistance } from "../utils/calculateDistance";
import getLongLat from "../utils/addressToLatLong";

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

// GET RECOMMENDATION POSTS WITHIN X KM
const getPostByLocation = async(req: Request, res: Response) => {
  // try to get the location from the request body
  try {
    const longitude : number = Number(req.query.longitude);
    const latitude : number = Number(req.query.latitude);

    // query all the posts
    const allPost = await Post.findAll({
      attributes: ['location'], 
    });
    
    const listLocationObj: Location[] = allPost.map((allPost) => allPost.location);

    // create a hashmap with key = distance, value = all the locations within "key" km
    const locationTable = new Map<number, Location[]>();

    // get all the posts 
    listLocationObj.forEach((location) => {
      // calculate the distance based on the longtitude and latitude
      // 
      //@ts-ignore
      const distance: number = calculateDistance(location.latitude, location.longitude, latitude, longitude);

      // Define the distance range (0-10, 10-20, etc.)
      const distanceRange = Math.floor(distance/10) * 10;

      // Get the existing locations in this distance range, or create an empty array
      const existingLocations = locationTable.get(distanceRange) || [];

      // Add the current location to the array
      existingLocations.push(location);

      // Update the locationTable with the new array
      locationTable.set(distanceRange, existingLocations);
    });

    // send back the response to the client
    // Convert the Map to an array of key-value pairs
    const mapArray = Array.from(locationTable.entries());
    
    // Serialize the array to JSON
    const json = JSON.stringify(mapArray);

    return res.status(200).json(json);
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: err.message })
  }
};

// POST create new post
const createNewPost = async (req: Request, res: Response) => {
  try {
    const { title, description, creatorId, location, eventDate, eventType } =
      req.body;

    const longLat = await getLongLat(location);

    if (!longLat) {
        throw new Error(`Cant convert location to latitude and longitude`); 
    }
    
    console.log('payload', {
        title,
        description,
        creatorId,
        location: {...longLat, address: location},
        eventDate,
        eventType,
    });

    const newPost = await Post.create({
        title,
        description,
        creatorId,
        location: {...longLat, address: location},
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

export { getPostById, getPostByUserId, createNewPost, deletePost, updatePost, getPostByLocation };