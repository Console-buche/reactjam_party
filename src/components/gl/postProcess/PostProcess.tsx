import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from '@react-three/postprocessing';

export const PostProcess = () => {
  return (
    <EffectComposer disableNormalPass multisampling={4}>
      <Bloom mipmapBlur luminanceThreshold={1} />
      <ToneMapping
        adaptive
        resolution={256}
        middleGrey={0.5}
        maxLuminance={16.0}
        minLuminance={0}
        averageLuminance={4}
        adaptationRate={10}
      />
    </EffectComposer>
  );
};
