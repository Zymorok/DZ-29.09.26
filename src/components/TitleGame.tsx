import { StyleSheet, Text, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { ThemeColors, useTheme } from "@/context/ThemeContext"

interface TitleGameProps {
  title: string;
}

export function TitleGame({ title }: TitleGameProps) {


  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
  <View>
    <Text style={styles.title}>{title}</Text> 
    <View style={styles.icons}>
      <AntDesign name="alert" size={22} color="red" />
      <AntDesign name="amazon" size={22} color="green" />
      <AntDesign name="audio" size={22} color="red" />
      <AntDesign name="barcode" size={22} color="green" />
      <AntDesign name="bell" size={22} color="red" />
      <AntDesign name="car" size={22} color="green" />
    </View>
    
  </View>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  title: {
    color: colors.text,
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    textAlign: "center",
  },
  icons: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,
  }
});