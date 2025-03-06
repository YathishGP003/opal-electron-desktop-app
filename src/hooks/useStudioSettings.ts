import { updateStudioSettingsSchema } from "@/schemas/studio-setting.schema";
import { useZodForm } from "./useZodForm";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateStudioSettings } from "@/lib/utils";
import { toast } from "sonner";

export const useStudioSettings = (
  id: string,
  screen?: string | null,
  audio?: string | null,
  preset?: "HD" | "SD",
  plan?: "PRO" | "FREE"
) => {
  const [onPreset, setPreset] = useState<"HD" | "SD" | undefined>();
  const { register, watch } = useZodForm(updateStudioSettingsSchema, {
    screen: screen!,
    audio: audio!,
    preset: preset!,
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-studio"],
    mutationFn: (data: {
      screen: string;
      id: string;
      audio: string;
      preset: "HD" | "SD";
    }) => updateStudioSettings(data.id, data.screen, data.audio, data.preset),
    onSuccess: (data) => {
      return toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      });
    },
  });

  useEffect(() => {
    if (screen && audio && preset) {
      window.ipcRenderer.send('media-sources', {
        screen,
        id: id,
        audio,
        preset,
        plan,
      });
    }
  }, []);

  useEffect(() => {
    const subscribe = watch((values) => {
      setPreset(values.preset);
      mutate({
        screen: values.screen!,
        id,
        audio: values.audio!,
        preset: values.preset!,
      });
      window.ipcRenderer.send('media-sources', {
        screen: values.screen,
        id,
        audio: values.audio,
        preset: values.preset,
        plan,
      });
    });
    return () => subscribe.unsubscribe();
  }, [watch]);

  return { register, isPending, onPreset };
};
