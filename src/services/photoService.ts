import { createPhoto, findPhotos, findPhotoById, deletePhotoById, aggregate, countPhotos } from "../repositories/photoRepository";
import { Types } from "mongoose";

function buildFilter({ date, startDate, endDate, north, south, east, west, userId }: { date?: string, startDate?: string, endDate?: string, north?: string, south?: string, east?: string, west?: string, userId?: string }) {
  const filter: any = {};
  if (date) {
    const d = new Date(date);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    filter.capturedAt = { $gte: d, $lt: next };
  }
  if (startDate || endDate) {
    filter.capturedAt = filter.capturedAt || {};
    if (startDate) filter.capturedAt.$gte = new Date(startDate);
    if (endDate) filter.capturedAt.$lte = new Date(endDate);
  }
  if (north && south && east && west) {
    filter.latitude = { $lte: Number(north), $gte: Number(south) };
    filter.longitude = { $lte: Number(east), $gte: Number(west) };
  }
  if (userId) filter.userId = userId;
  return filter;
}

export async function addPhoto(data: any) {
  return createPhoto(data);
}

export async function listPhotos(query: any) {
  console.log("query", query);
  console.log("🔄 Photo service called - testing nodemon restart");
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 15);
  const skip = (page - 1) * limit;
  const filter = buildFilter(query);
  const [items, total] = await Promise.all([
    findPhotos(filter, { capturedAt: -1 }, skip, limit),
    countPhotos(filter),
  ]);
  return { items, page, limit, total, pages: Math.ceil(total / limit) };
}

export async function getPhoto(id: string) {
  return findPhotoById(id);
}

export async function removePhoto(id: string) {
  return deletePhotoById(id);
}

export async function daysWithPhotos() {
  const agg = await aggregate([
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$capturedAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  return agg.map((x) => ({ date: x._id, count: x.count }));
}

export async function stats() {
  const items = await findPhotos({}, { capturedAt: -1 });
  const totalPhotos = items.length;
  const firstPhotoAt = totalPhotos ? items[items.length - 1].capturedAt : null;
  const lastPhotoAt = totalPhotos ? items[0].capturedAt : null;
  return { totalPhotos, firstPhotoAt, lastPhotoAt };
}

