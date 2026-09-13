export type RsvpStatus = "ATTENDING" | "DECLINED";

export interface Rsvp {
  /** Random ID generated in the guest's browser (localStorage) — NOT a secret,
   *  just lets one visitor edit their own response and prevents accidental
   *  duplicates from the same device. */
  guestId: string;
  /** The name the guest typed in themselves. */
  name: string;
  status: RsvpStatus;
  notes: string;
  respondedAt: string; // ISO timestamp
}

export interface Photo {
  id: string;
  /** filename inside /public/uploads/full */
  filename: string;
  /** filename inside /public/uploads/thumbs */
  thumbFilename: string;
  caption: string;
  uploaderGuestId: string | null;
  uploaderName: string | null;
  width: number;
  height: number;
  sizeBytes: number;
  createdAt: string; // ISO timestamp
}
