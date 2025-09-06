import { Pressable, Text } from "react-native";

export default function CardButton({
  label,
  color,
  onPress,
}: {
  label: string;
  color?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: color || "white",
        borderRadius: 12,
        paddingVertical: 28,
        margin: 6,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
}
