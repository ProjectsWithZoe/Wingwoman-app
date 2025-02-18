import express from "express";
import { VercelRequest, VercelResponse } from "@vercel/node";

const app = express();

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from Express on Vercel!" });
});

export default function handler(req, res) {
  return app(req, res);
}
