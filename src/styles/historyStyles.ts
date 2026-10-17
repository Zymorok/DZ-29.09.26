import { StyleSheet } from "react-native";
import { ThemeColors } from "@/context/ThemeContext";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      letterSpacing: 0.5,
      color: colors.text,
    },
    clearBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    clearBtnText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.danger,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 30,
      gap: 12,
    },
    card: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 6,
      shadowOpacity: 0.08,
      elevation: 3,
    },
    cardLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      flex: 1,
    },
    resultBadge: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceHighlight,
    },
    resultBadgeX: {
      backgroundColor: colors.surfaceHighlight,
    },
    resultBadgeO: {
      backgroundColor: colors.surfaceHighlight,
    },
    resultBadgeDraw: {
      backgroundColor: colors.surfaceHighlight,
    },
    badgeText: {
      fontSize: 22,
      fontWeight: "900",
    },
    badgeTextX: {
      color: colors.xMark,
    },
    badgeTextO: {
      color: colors.oMark,
    },
    badgeTextDraw: {
      color: colors.draw,
    },
    cardInfo: {
      gap: 2,
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    resultTime: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textMuted,
    },
    cardRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    deleteItemBtn: {
      padding: 4,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 30,
      gap: 8,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginTop: 10,
      color: colors.text,
    },
    emptySubtitle: {
      fontSize: 14,
      textAlign: "center",
      fontWeight: "500",
      color: colors.textMuted,
    },
  });