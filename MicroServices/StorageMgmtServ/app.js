const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { Storage } = require("./models/StorageSchema");
const mongoose = require("./config/db");
const axios = require("axios");
require("dotenv").config();
app.use(bodyParser.json());
app.use(cors());

app.post("/events", async (req, res) => {
  console.log("Event Received:", req.body.type);
  const { type, data } = req.body;

  if (type === "UserCreated") {
    try {
      const { userId } = data;
      const storage = await Storage.findOne({ userId });
      if (!storage) {
        const initialStorage = new Storage({
          userId,
          totalStorage: 10000,
          UsedStorage: 0,
          FreeStorage: 10000,
        });

        await initialStorage.save();
        console.log("storage Added");
      }
    } catch (error) {
      console.error("Error handling UserCreated event:", error.message);
    }
  }

  if (type === "ImageRemoved") {
    try {
      const { userId, imageId, imageSize } = data;
      const storage = await Storage.findOne({ userId });

      if (!storage) {
        console.error("Storage not found for User:", userId);
        return res.status(404).send("Storage not found");
      }

      storage.UsedStorage -= imageSize;
      storage.FreeStorage += imageSize;

      await storage.save();
      try{
        await axios.post(`${process.env.EVENT_SERV}/events`, {
          type: "StorageUpdated",
          data: {
            userId,
            storageDetails: {
              UsedStorage: storage.UsedStorage,
              FreeStorage: storage.FreeStorage,
              TotalStorage: storage.totalStorage,
            },
          },
        });
      }catch(error){
        console.log(error)
      }
      console.log("Storage updated for ImageRemoved event:", userId);
    } catch (error) {
      console.error("Error handling ImageRemoved event:", error.message);
    }
  }

  if (type === "ImagesAdded") {
    try {
      const { userId, imagesEv } = data;
      const storage = await Storage.findOne({ userId });

      if (!storage) {
        console.error("Storage not found for User:", userId);
        return res.status(404).send("Storage not found");
      }
      const totalAddedSize = imagesEv.reduce(
        (total, image) => total + image.size,
        0
      );
      console.log(totalAddedSize)
      storage.UsedStorage += totalAddedSize;
      storage.FreeStorage -= totalAddedSize;

      await storage.save();
      try{
        await axios.post(`${process.env.EVENT_SERV}/events`, {
          type: "StorageUpdated",
          data: {
            userId,
            storageDetails: {
              UsedStorage: storage.UsedStorage,
              FreeStorage: storage.FreeStorage,
              TotalStorage: storage.totalStorage,
            },
          },
        });
      }catch(error){
        console.log(error)
      }
      console.log("Storage updated for ImagesAdded event:", userId);
    } catch (error) {
      console.error("Error handling ImagesAdded event:", error.message);
    }
  }

  res.send({});
});

const port = process.env.PORT || 4001;

app.listen(port, () =>
  console.log(`Storage service Server up and running on port ${port}`)
);
