import { z } from "zod";
import express from "express";
import cors from "cors";
import path from "path";
import { connect } from "mongoose";
import { User } from "./models";
import "dotenv/config";
import { AddressInfo } from "net";

// connet to MongoDB
connect(process.env.MONGO_URI as string);

type exerciseType = {
  date: Date;
  duration: number;
  description: string;
};

// setup express
const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// handle requests
app.get("/", (_req, res) => {
  res.sendFile("/views/index.html", { root: path.join(__dirname, "..") });
});

app
  .route("/api/users")
  .post((req, res) => {
    const username = req.body.username;
    const newUser = new User({ username });
    newUser
      .save()
      .then((data) => {
        res.json({ username, _id: data._id });
      })
      .catch((e) =>
        res.json(
          e.code == 11000
            ? { error: "username is already taken" }
            : { error: e },
        ),
      );
  })
  .get(async (_req, res) => {
    const users = await User.find().select("username");
    res.json(users);
  });

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { description, duration, date } = req.body;
  const exercise: exerciseType = {
    description,
    duration: Number(duration),
    date: date ? new Date(date) : new Date(),
  };
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params._id },
      { $push: { log: exercise } },
      {
        runValidators: true,
        new: true,
      },
    )
      .select("-__v -log")
      .lean()
      .exec();

    res.json({
      ...user,
      ...exercise,
      date: exercise.date.toDateString(),
    });
  } catch (e) {
    res.json(e);
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    const { from, to, limit } = req.query;
    if (
      (from ? !z.coerce.date().safeParse(from).success : false) ||
      (to ? !z.coerce.date().safeParse(to).success : false)
    ) {
      return res.json({ error: "Invalid date format." });
    }

    if (from && to && from > to) {
      return res.json({ error: "'from' date must be before 'to' date." });
    }

    if (limit && !z.coerce.number().int().safeParse(limit.toString()).success) {
      return res.json({ error: "'limit' parameter can only be an integer." });
    }

    const user = await User.findById(req.params._id, "-__v").lean().exec();

    const log = user?.log
      .slice(limit ? -Number(limit) : 0)
      .filter(({ date }: exerciseType) => {
        const isodate = date.toISOString().split("T")[0];
        if (from && to) return isodate >= from && isodate <= to;
        else if (from) return isodate >= from;
        else if (to) return isodate <= to;
        else return true; // return all if user doesn't specify quries
      })
      .map(({ date, duration, description }: exerciseType) => {
        return {
          duration,
          description,
          date: date.toDateString(),
        };
      });

    res.json({ ...user, log, count: log ? log.length : 0 });
  } catch (e) {
    console.error(e);
    res.json({ error: e });
  }
});

const server = app.listen(process.env.PORT || 3000, () => {
  const { port } = server.address() as AddressInfo;
  console.log("Your app is listening on port " + port);
});

export default app;
