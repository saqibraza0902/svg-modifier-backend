import { Request, Response } from "express";
import { db } from "../app";
import { ISVGData } from "../utils/types";
export const get_svgs = async (req: Request, res: Response) => {
  try {
    let query = db.collection("Icons").orderBy("createdAt", "desc");
    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const upload_svgs = async (req: Request, res: Response) => {
  const icons = req.body.icons;

  if (!icons || icons.length === 0) {
    return res
      .status(400)
      .json({ error: "No icons to upload. Please add icon details." });
  }
  const hasIncompleteIcon = icons.some(
    (icon: ISVGData) => !icon.source || !icon.title || !icon.type
  );

  if (hasIncompleteIcon) {
    return res.status(400).json({
      error: "Please complete all fields for every icon before uploading.",
    });
  }

  try {
    const batch = db.batch();
    const iconsCollection = db.collection("Icons");

    for (const icon of icons) {
      if (icon.source === undefined) {
        throw new Error(
          `Icon with title "${icon.title}" has undefined source.`
        );
      }

      const iconRef = iconsCollection.doc();
      batch.set(iconRef, {
        title: icon.title || "",
        tags: (icon.tags || "").split(",").map((tag: any) => tag.trim()),
        source: icon.source,
        type: icon.type || "",
        createdAt: new Date(),
      });
    }

    await batch.commit();
    let query = db.collection("Icons").orderBy("createdAt", "desc");
    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ message: "All icons added successfully!", data });
  } catch (error) {
    console.error("Error uploading icons to Firestore", error);
    res
      .status(500)
      .json({ error: "An error occurred while uploading. Please try again." });
  }
};

export const update_icon = async (req: Request, res: Response) => {
  const iconId = req.params.id; // Get icon ID from request params
  const { title, tags, type } = req.body.editData; // Get updated data from request body

  if (!title || !tags || !type) {
    return res
      .status(400)
      .json({ error: "Please provide title, tags, and type." });
  }
  try {
    const iconDocRef = db.collection("Icons").doc(iconId);
    await iconDocRef.update({ title, tags, type });
    let query = db.collection("Icons").orderBy("createdAt", "desc");
    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json({ message: "Icon updated successfully!", data });
  } catch (error) {
    console.error("Error uploading icons to Firestore", error);
    res
      .status(500)
      .json({ error: "An error occurred while uploading. Please try again." });
  }
};

export const delete_icon = async (req: Request, res: Response) => {
  const iconId = req.params.id;
  try {
    const iconDocRef = db.collection("Icons").doc(iconId);
    await iconDocRef.delete();
    let query = db.collection("Icons").orderBy("createdAt", "desc");
    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json({ message: "Icon deleted successfully!", data });
  } catch (error) {
    console.error("Error uploading icons to Firestore", error);
    res
      .status(500)
      .json({ error: "An error occurred while uploading. Please try again." });
  }
};
