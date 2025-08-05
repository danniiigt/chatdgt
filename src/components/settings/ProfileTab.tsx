"use client";

import { useState, useEffect } from "react";
import { useTranslate } from "@tolgee/react";
import { useUser } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoaderCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import { randomColor } from "@/lib/constants";

export const ProfileTab = () => {
  // Third party hooks
  const { t } = useTranslate();
  const user = useUser();

  // State
  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || ""
  );
  const [avatarUrl, setAvatarUrl] = useState(
    user?.user_metadata?.avatar_url || ""
  );

  // Effects
  useEffect(
    function syncUserMetadata() {
      if (user?.user_metadata) {
        setFullName(user.user_metadata.full_name || "");
        setAvatarUrl(user.user_metadata.avatar_url || "");
      }
    },
    [user?.user_metadata]
  );

  // Data fetching
  const updateProfileMutation = useMutation({
    mutationFn: async (data: {
      full_name: string | null;
      avatar_url: string | null;
    }) => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el perfil");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success(
        t("settings.profile.save-success", "Perfil actualizado correctamente")
      );
    },
    onError: (error: Error) => {
      console.error("Error updating profile:", error);
      toast.error(
        t("settings.profile.save-error", "Error al actualizar el perfil")
      );
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al subir el avatar");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setAvatarUrl(data.avatarUrl);
      toast.success(
        t(
          "settings.profile.avatar-upload-success",
          "Avatar subido correctamente"
        )
      );
    },
    onError: (error: Error) => {
      console.error("Error uploading avatar:", error);
      toast.error(
        t("settings.profile.avatar-upload-error", "Error al subir el avatar")
      );
    },
  });

  // Helpers / Functions
  const handleSaveProfile = () => {
    if (!user) return;

    updateProfileMutation.mutate({
      full_name: fullName || null,
      avatar_url: avatarUrl || null,
    });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    uploadAvatarMutation.mutate(file);
  };

  // Constants
  const userInitials = fullName
    ? fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <Card className="shadow-none border-none py-0">
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl} alt={fullName || "Avatar"} />
            <AvatarFallback
              style={{
                backgroundColor: randomColor,
              }}
              className="text-white text-lg"
            >
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {t("settings.profile.change-avatar", "Cambiar Avatar")}
                </span>
              </Button>
            </Label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {t("settings.profile.avatar-help", "JPG, PNG. Máximo 300KB.")}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">
              {t("settings.profile.email", "Correo Electrónico")}
            </Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              {t(
                "settings.profile.email-help",
                "El correo electrónico no se puede cambiar"
              )}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullName">
              {t("settings.profile.full-name", "Nombre")}
            </Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t(
                "settings.profile.full-name-placeholder",
                "Ingresa tu nombre"
              )}
            />
          </div>
        </div>

        <Button
          onClick={handleSaveProfile}
          disabled={
            updateProfileMutation.isPending || uploadAvatarMutation.isPending
          }
        >
          {updateProfileMutation.isPending || uploadAvatarMutation.isPending ? (
            <>
              {t("chat.edit.saving", "Guardando")}
              <LoaderCircle className="size-4 animate-spin" />
            </>
          ) : (
            t("settings.profile.save", "Guardar Cambios")
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
