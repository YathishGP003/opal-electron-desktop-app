import { SourceDeviceStateProps } from '@/hooks/use-media-sources';
import { useStudioSettings } from '@/hooks/use-studio-settings';
import Loader from '../Loader';
import { Headphones, Monitor, Settings2 } from 'lucide-react';

type Props = {
  state: SourceDeviceStateProps;
  user:
    | ({
        subscription: {
          plan: 'PRO' | 'FREE';
        } | null;
        studio: {
          id: string;
          screen: string | null;
          mic: string | null;
          preset: 'HD' | 'SD';
          camera: string | null;
          userId: string | null;
        } | null;
      } & {
        id: string;
        email: string;
        firstname: string;
        lastname: string;
        createdAt: Date;
        clerkid: string;
      })
    | null;
};

const MediaConfiguration = ({ state, user }: Props) => {
  const activeScreen = state.displays?.find(
    (display) => display.id === user?.studio?.screen
  );
  const activeAudio = state.audioInputs?.find(
    (mic) => mic.deviceId === user?.studio?.mic
  );

  const { isPending, onPreset, register } = useStudioSettings(
    user!.id,
    user?.studio?.screen || state.displays?.[0]?.id,
    user?.studio?.mic || state.audioInputs?.[0]?.deviceId,
    user?.studio?.preset,
    user?.subscription?.plan
  );

  return (
    <form className='flex flex-col h-full w-full relative gap-y-5'>
      {isPending && (
        <div className='fixed z-50 w-full top-0 left-0 right-0 bottom-0 rounded-2xl h-full bg-black/80 flex justify-center items-center'>
          <Loader />
        </div>
      )}
      <div className='flex gap-x-5 justify-center items-center'>
        <Monitor fill='#575655' color='#575655' size={36} />
        <select
          {...register('screen')}
          className='outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full'
        >
          {state.displays?.map((display, key) => (
            <option
              selected={activeScreen && activeScreen.id === display.id}
              key={key}
              value={display.id}
              className='bg-[#171717] cursor-pointer'
            >
              {display.name}
            </option>
          ))}
        </select>
      </div>
      <div className='flex gap-x-5 justify-center items-center'>
        <Headphones fill='#575655' color='#575655' size={36} />
        <select
          {...register('audio')}
          className='outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full'
        >
          {state.audioInputs?.map((mic, key) => (
            <option
              selected={activeAudio && activeAudio.deviceId === mic.deviceId}
              key={key}
              value={mic.deviceId}
              className='bg-[#171717] cursor-pointer'
            >
              {mic.label}
            </option>
          ))}
        </select>
      </div>
      <div className='flex gap-x-5 justify-center items-center'>
        <Settings2 fill='#575655' color='#575655' size={36} />
        <select
          {...register('preset')}
          className='outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full'
        >
          <option
            disabled={user?.subscription?.plan === 'FREE'}
            selected={onPreset === 'HD' || user?.studio?.preset === 'HD'}
            value='HD'
            className='bg-[#171717] cursor-pointer'
          >
            1080p
            {user?.subscription?.plan === 'FREE' && '(Upgrade to PRO plan)'}
          </option>
          <option
            value='SD'
            selected={onPreset === 'SD' || user?.studio?.preset === 'SD'}
            className='bg-[#171717] cursor-pointer'
          >
            720p
          </option>
        </select>
      </div>
    </form>
  );
};

export default MediaConfiguration;
