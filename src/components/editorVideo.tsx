'use client';

import { useEffect, useRef } from 'react';
import type { Configuration } from '@cesdk/cesdk-js';

interface ComponentProps {
  config: Partial<Configuration>;
  onReady?: (editor: any) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

const Component = ({ config }: ComponentProps) => {
  const cesdkContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initEditor = async () => {
      const CreativeEditorSDK = (await import('@cesdk/cesdk-js')).default;
      
      if (cesdkContainer.current) {
        const configWithLicense: Partial<Configuration> = {
          ...config,
          license: process.env.NEXT_PUBLIC_LICENSE,
          baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.42.0/assets',
          callbacks: {
            onUpload: 'local' as const
          }
        };

        CreativeEditorSDK.create(cesdkContainer.current, configWithLicense).then(
          async (instance) => {
            instance.addDefaultAssetSources();
            instance.addDemoAssetSources({ sceneMode: 'Video' });
            
            // Create a video scene
            const scene = await instance.engine.scene.createVideo();
            
            // Create and set up the page
            const page = await instance.engine.block.create('page');
            await instance.engine.block.appendChild(scene, page);
            await instance.engine.block.setWidth(page, 1280);
            await instance.engine.block.setHeight(page, 720);
            await instance.engine.block.setDuration(page, 20);

            // Create first video
            const video1 = await instance.engine.block.create('graphic');
            await instance.engine.block.setShape(video1, await instance.engine.block.createShape('rect'));
            const videoFill1 = await instance.engine.block.createFill('video');
            await instance.engine.block.setString(
              videoFill1,
              'fill/video/fileURI',
              'https://cdn.img.ly/assets/demo/v2/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4'
            );
            await instance.engine.block.setFill(video1, videoFill1);

            // Create track and add video
            const track = await instance.engine.block.create('track');
            await instance.engine.block.appendChild(page, track);
            await instance.engine.block.appendChild(track, video1);
            await instance.engine.block.fillParent(track);
            await instance.engine.block.setDuration(video1, 15);

            // Optional: Add audio
            const audio = await instance.engine.block.create('audio');
            await instance.engine.block.appendChild(page, audio);
            await instance.engine.block.setString(
              audio,
              'audio/fileURI',
              'https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a'
            );
            await instance.engine.block.setVolume(audio, 0.7);
            await instance.engine.block.setTimeOffset(audio, 2);
            await instance.engine.block.setDuration(audio, 7);

            // Add export button
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export Video';
            exportButton.style.position = 'fixed';
            exportButton.style.bottom = '20px';
            exportButton.style.right = '20px';
            exportButton.style.zIndex = '1000';
            exportButton.style.padding = '10px 20px';
            exportButton.style.backgroundColor = '#007bff';
            exportButton.style.color = 'white';
            exportButton.style.border = 'none';
            exportButton.style.borderRadius = '5px';
            exportButton.style.cursor = 'pointer';
            cesdkContainer.current!.appendChild(exportButton);

            exportButton.onclick = async () => {
              const progressCallback = (renderedFrames: number, encodedFrames: number, totalFrames: number) => {
                console.log(
                  'Rendered', renderedFrames,
                  'frames and encoded', encodedFrames,
                  'frames out of', totalFrames
                );
              };

              const blob = await instance.engine.block.exportVideo(
                page,
                undefined,
                progressCallback,
                {}
              );

              const anchor = document.createElement('a');
              anchor.href = URL.createObjectURL(blob);
              anchor.download = 'exported-video.mp4';
              anchor.click();
            };
          }
        );
      }
    };

    initEditor();
  }, [config]);

  return (
    <div 
      ref={cesdkContainer} 
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default Component;