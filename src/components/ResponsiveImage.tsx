import type { ImgHTMLAttributes } from 'react';
import { imageSrcSet, imageUrl, imageWidths, type ImagePreset } from '../lib/image';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  preset: ImagePreset;
};

export default function ResponsiveImage({ src, preset, sizes, loading = 'lazy', ...props }: Props) {
  return (
    <picture>
      <source type="image/avif" srcSet={imageSrcSet(src, preset, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={imageSrcSet(src, preset, 'webp')} sizes={sizes} />
      <img {...props} src={imageUrl(src, imageWidths[preset][1], 'jpg')}
        srcSet={imageSrcSet(src, preset, 'jpg')} sizes={sizes} loading={loading} decoding="async" />
    </picture>
  );
}
