import express from "express";
const router = express.Router();

// simple in-memory offers; you may want a DB collection
const offers = [
  {
    title: "HDFCFLY",
    id: "1",
    type: "fixed",
    value: 600,
    appliesTo: "all",
    expires: "2025-12-31",
  },
  {
    title: "WEEKEND10",
    id: "2",
    type: "percent",
    value: 10,
    appliesTo: "all",
    expires: "2025-12-31",
  },
];

router.get("/", (req, res) => res.json(offers));
router.get("/:code", (req, res) => {
  const found = offers.find(
    (o) => o.code.toUpperCase() === req.params.code.toUpperCase()
  );
  if (!found) return res.status(404).json({ message: "Offer not found" });
  res.json(found);
});

export default router;
