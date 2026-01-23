import { MenuItem, UserMenuContext } from "@/types/sideMenu";
import { useRouter } from "expo-router";
import { useMemo } from "react";

export function useSideMenu(
  context: UserMenuContext,
  handleSignOut: () => void
) {
  const router = useRouter();

  const navigation = {
    home: () => router.push("/"),
    profile: () => router.push("/(userProfile)/profile"),
    invites: () => router.push("/(userProfile)/invites"),
    settings: () => router.push("/(userProfile)/settings"),
  };

  const menuItems = useMemo<MenuItem[]>(() => {
    const base = {
      home: {
        id: "home",
        label: "Início",
        icon: "home-outline" as const,
        onPress: navigation.home,
      },
      profile: {
        id: "profile",
        label: "Meu Perfil",
        icon: "person-outline" as const,
        onPress: navigation.profile,
      },
      invites: {
        id: "invites",
        label: "Convites",
        icon: "mail-outline" as const,
        onPress: navigation.invites,
      },
      settings: {
        id: "settings",
        label: "Painel de Controle",
        icon: "settings-outline" as const,
        onPress: navigation.settings,
      },
    };

    switch (context) {
      case "home":
        return [base.home, base.profile, base.invites];

      case "profile":
        return [base.home, base.invites, base.settings];

      case "invite":
        return [base.home, base.profile, base.invites];

      default:
        return [];
    }
  }, [
    context,
    navigation.home,
    navigation.profile,
    navigation.invites,
    navigation.settings,
  ]);

  const footerItems = useMemo<MenuItem[]>(
    () => [
      {
        id: "logout",
        label: "Sair",
        icon: "log-out-outline" as const,
        onPress: handleSignOut,
        danger: true,
      },
    ],
    [handleSignOut]
  );

  return { menuItems, footerItems };
}
