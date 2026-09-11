export type CakeId = "midnight-chocolate" | "strawberry-blush" | "vanilla-gold";

export interface MemoryPhoto {
  id: string;
  fileName: string;
  url: string;
}

export interface MusicTrack {
  fileName: string;
  url: string;
}

export interface BirthdayFormData {
  theirName: string;
  yourName: string;
  turningAge: string;
  birthday: string;
  cake: CakeId | null;
  reasons: string[];
  memories: MemoryPhoto[];
  letter: string;
  music: MusicTrack | null;
}
