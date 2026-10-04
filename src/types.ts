export type TargetVideoQuality = '4k' | '2k' | '1080p';

export interface VideoSettings {
  quality: TargetVideoQuality;
  fpsBoost: boolean;
  hdrVivid: boolean;
  denoise: boolean;
  audioEnhance: boolean;
  sharpenLevel: number; // 1 to 10
}

export type TargetImageQuality = '4k' | '2k' | 'face_retouch' | 'unblur';

export interface ImageSettings {
  mode: TargetImageQuality;
  sharpness: number; // 0 to 100
  denoise: number; // 0 to 100
  contrastBoost: number; // 0 to 100
  vibranceBoost: number; // 0 to 100
  faceEnhance: boolean;
}

export interface VerificationState {
  discordVerified: boolean;
  tiktokVerified: boolean;
  botCaptchaVerified: boolean;
  isUnlocked: boolean;
  tiktokCountdown: number;
  isCountingDown: boolean;
  discordJoinClicked: boolean;
  tiktokFollowClicked: boolean;
  botKickedOut: boolean;
}
