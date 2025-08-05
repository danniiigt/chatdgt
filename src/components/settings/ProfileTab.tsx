"use client";

import { useState, useEffect } from "react";
import { useTranslate } from "@tolgee/react";
import { useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoaderCircle, Upload } from "lucide-react";
import { createClientSupabase } from "@/lib/supabase/supabase";
import { toast } from "sonner";

export const ProfileTab = () => {
  // Third party hooks
  const { t } = useTranslate();
  const user = useUser();
  const supabase = createClientSupabase();

  // State
  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || ""
  );
  const [avatarUrl, setAvatarUrl] = useState(
    user?.user_metadata?.avatar_url || ""
  );

  const [isLoading, setIsLoading] = useState(false);

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

  // Helpers / Functions
  const handleSaveProfile = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email!,
        full_name: fullName || null,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      const { error: userError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName || null,
          avatar_url: avatarUrl || null,
        },
      });

      if (userError) throw userError;

      // Refrescar la sesión para obtener los datos actualizados
      await supabase.auth.refreshSession();

      toast.success(
        t("settings.profile.save-success", "Perfil actualizado correctamente")
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        t("settings.profile.save-error", "Error al actualizar el perfil")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsLoading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Actualizar el perfil en la tabla profiles
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email!,
        full_name: fullName || null,
        avatar_url: data.publicUrl,
        updated_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      // Actualizar user_metadata en Auth
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          avatar_url: data.publicUrl,
        },
      });

      if (userError) throw userError;

      // Refrescar la sesión para obtener los datos actualizados
      await supabase.auth.refreshSession();

      setAvatarUrl(data.publicUrl);
      toast.success(
        t(
          "settings.profile.avatar-upload-success",
          "Avatar subido correctamente"
        )
      );
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error(
        t("settings.profile.avatar-upload-error", "Error al subir el avatar")
      );
    } finally {
      setIsLoading(false);
    }
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
            <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
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

        <Button onClick={handleSaveProfile} disabled={isLoading}>
          {isLoading ? (
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
