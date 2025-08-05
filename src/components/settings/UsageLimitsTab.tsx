"use client";

import { useTranslate } from "@tolgee/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Zap,
  Calendar,
  Crown,
  TrendingUp,
  Clock,
} from "lucide-react";

export const UsageLimitsTab = () => {
  // Third party hooks
  const { t } = useTranslate();

  // Constants (Mock data)
  const currentPlan = "free";
  const usageStats = {
    messages: { used: 127, limit: 500 },
    tokens: { used: 15750, limit: 50000 },
    chats: { used: 8, limit: 25 },
  };

  const resetDate = new Date();
  resetDate.setDate(resetDate.getDate() + 12);

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: t("settings.usage.plans.free.period", "mes"),
      limits: {
        messages: 500,
        tokens: 50000,
        chats: 25,
      },
      features: [
        t("settings.usage.plans.free.feature1", "Acceso a modelos básicos"),
        t("settings.usage.plans.free.feature2", "Historial limitado"),
        t("settings.usage.plans.free.feature3", "Soporte por email"),
      ],
      current: true,
    },
    {
      name: "Pro",
      price: "$19",
      period: t("settings.usage.plans.pro.period", "mes"),
      limits: {
        messages: 5000,
        tokens: 500000,
        chats: 100,
      },
      features: [
        t("settings.usage.plans.pro.feature1", "Acceso a todos los modelos"),
        t("settings.usage.plans.pro.feature2", "Historial ilimitado"),
        t("settings.usage.plans.pro.feature3", "Respuestas más rápidas"),
        t("settings.usage.plans.pro.feature4", "Soporte prioritario"),
      ],
      current: false,
    },
  ];

  // Helpers / Functions
  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(num);
  };

  return (
    <div className="space-y-6">
      {/* Current Usage */}
      <Card className="shadow-none border-none py-0">
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {/* Messages Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {t("settings.usage.messages", "Mensajes")}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatNumber(usageStats.messages.used)} /{" "}
                  {formatNumber(usageStats.messages.limit)}
                </span>
              </div>
              <Progress
                value={getUsagePercentage(
                  usageStats.messages.used,
                  usageStats.messages.limit
                )}
                className="h-2"
              />
            </div>

            {/* Tokens Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {t("settings.usage.tokens", "Tokens")}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatNumber(usageStats.tokens.used)} /{" "}
                  {formatNumber(usageStats.tokens.limit)}
                </span>
              </div>
              <Progress
                value={getUsagePercentage(
                  usageStats.tokens.used,
                  usageStats.tokens.limit
                )}
                className="h-2"
              />
            </div>

            {/* Chats Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {t("settings.usage.chats", "Chats Activos")}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatNumber(usageStats.chats.used)} /{" "}
                  {formatNumber(usageStats.chats.limit)}
                </span>
              </div>
              <Progress
                value={getUsagePercentage(
                  usageStats.chats.used,
                  usageStats.chats.limit
                )}
                className="h-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {t("settings.usage.reset-info", "Los límites se reinician el")}{" "}
              <strong>{resetDate.toLocaleDateString("es-ES")}</strong>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card className="shadow-none border-none py-0">
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-4 border rounded-lg ${
                  plan.current ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                {plan.current && (
                  <Badge className="absolute -top-2 left-4" variant="default">
                    {t("settings.usage.plans.current", "Plan Actual")}
                  </Badge>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      {t("settings.usage.plans.limits", "Límites:")}
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>
                        {formatNumber(plan.limits.messages)}{" "}
                        {t("settings.usage.messages", "mensajes")}
                      </li>
                      <li>
                        {formatNumber(plan.limits.tokens)}{" "}
                        {t("settings.usage.tokens", "tokens")}
                      </li>
                      <li>
                        {formatNumber(plan.limits.chats)}{" "}
                        {t("settings.usage.chats", "chats activos")}
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      {t("settings.usage.plans.features", "Características:")}
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="h-1 w-1 bg-current rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant={plan.current ? "secondary" : "default"}
                    className="w-full"
                    disabled={plan.current}
                  >
                    {plan.current
                      ? t("settings.usage.plans.current-plan", "Plan Actual")
                      : t("settings.usage.plans.upgrade", "Actualizar Plan")}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>{t("settings.usage.note.title", "Nota:")}</strong>{" "}
              {t(
                "settings.usage.note.description",
                "Esta sección está en desarrollo. Próximamente podrás gestionar tu suscripción y ver estadísticas detalladas de uso."
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
