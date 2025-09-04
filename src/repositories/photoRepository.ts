import Photo from "../models/Photo";

export async function createPhoto(data: any) {
  return Photo.create(data);
}

export async function findPhotos(filter: any = {}, sort: any = { capturedAt: -1 }, skip = 0, limit = 0) {
  return Photo.find(filter).sort(sort).skip(skip).limit(limit);
}

export async function findPhotoById(id: string) {
  return Photo.findById(id);
}

export async function deletePhotoById(id: string) {
  return Photo.findByIdAndDelete(id);
}

export async function aggregate(pipeline: any[]) {
  return Photo.aggregate(pipeline);
}

export async function countPhotos(filter: any = {}) {
  return Photo.countDocuments(filter);
}

