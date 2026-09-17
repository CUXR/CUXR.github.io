export const imageWidths = {
  photo: [480, 960, 1600, 2560],
  portrait: [240, 480, 711],
  packet: [480, 960, 1500],
} as const;

export type ImagePreset = keyof typeof imageWidths;
export type ImageFormat = 'avif' | 'webp' | 'jpg';

export function imageUrl(src: string, width: number, format: ImageFormat): string {
  return `/optimized${src.replace(/\.[^.]+$/, '')}-${width}.${format}`;
}

export function imageSrcSet(src: string, preset: ImagePreset, format: ImageFormat): string {
  return imageWidths[preset].map((width) => `${imageUrl(src, width, format)} ${width}w`).join(', ');
}
