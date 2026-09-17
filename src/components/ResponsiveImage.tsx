import { useState, type ImgHTMLAttributes } from 'react';
import { imageSrcSet, imageUrl, imageWidths, type ImagePreset } from '../lib/image';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  preset: ImagePreset;
};

export default function ResponsiveImage({ src, preset, sizes, loading = 'lazy', onError, ...props }: Props) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const useOriginal = failedSource === src;
  return (
    <picture>
      {!useOriginal && <source type="image/avif" srcSet={imageSrcSet(src, preset, 'avif')} sizes={sizes} />}
      {!useOriginal && <source type="image/webp" srcSet={imageSrcSet(src, preset, 'webp')} sizes={sizes} />}
      <img {...props} src={useOriginal ? src : imageUrl(src, imageWidths[preset][1], 'jpg')}
        srcSet={useOriginal ? undefined : imageSrcSet(src, preset, 'jpg')} sizes={sizes} loading={loading} decoding="async"
        ref={(element) => {
          // A cached failure can precede hydration and its error handler.
          if (!useOriginal && element?.complete && element.currentSrc && element.naturalWidth === 0) setFailedSource(src);
        }}
        onError={(event) => {
          if (!useOriginal) setFailedSource(src);
          else onError?.(event);
        }} />
    </picture>
  );
}
