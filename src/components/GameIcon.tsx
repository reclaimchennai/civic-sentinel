import {
  Shield, Swords, Landmark, Crown, Star, Sparkles,
  Sunrise, CheckCheck, Map, Brush, CircleAlert, Handshake, CloudRain,
  Footprints, TrendingUp, Coins, Flame, Megaphone,
  Flag, Bird, Zap, Gem, Compass,
  Cat, Waves, TowerControl,
  Clover, Package,
  Construction, Trash2, Droplet, ParkingCircle, Lightbulb, Ban,
  Gift, Medal,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Shield,
  Swords,
  Landmark,
  Crown,
  Star,
  Sparkles,
  Sunrise,
  CheckCheck,
  Map,
  Brush,
  CircleAlert,
  Handshake,
  CloudRain,
  Footprints,
  TrendingUp,
  Coins,
  Flame,
  Megaphone,
  Flag,
  Bird,
  Zap,
  Gem,
  Compass,
  Cat,
  Waves,
  TowerControl,
  Clover,
  Package,
  Construction,
  Trash2,
  Droplet,
  ParkingCircle,
  Lightbulb,
  Ban,
  Gift,
  Medal,
};

const SIZES = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-10 h-10",
} as const;

const CONTAINER_SIZES = {
  xs: "w-5 h-5",
  sm: "w-7 h-7",
  md: "w-9 h-9",
  lg: "w-11 h-11",
  xl: "w-14 h-14",
  "2xl": "w-18 h-18",
} as const;

const COLORS: Record<string, { text: string; bg: string; glow: string }> = {
  zinc: { text: "text-zinc-400", bg: "bg-zinc-800", glow: "shadow-zinc-500/30" },
  blue: { text: "text-blue-400", bg: "bg-blue-900/30", glow: "shadow-blue-500/30" },
  green: { text: "text-green-400", bg: "bg-green-900/30", glow: "shadow-green-500/30" },
  purple: { text: "text-purple-400", bg: "bg-purple-900/30", glow: "shadow-purple-500/30" },
  yellow: { text: "text-yellow-400", bg: "bg-yellow-900/30", glow: "shadow-yellow-500/40" },
  red: { text: "text-red-400", bg: "bg-red-900/30", glow: "shadow-red-500/30" },
  orange: { text: "text-orange-400", bg: "bg-orange-900/30", glow: "shadow-orange-500/30" },
  indigo: { text: "text-indigo-400", bg: "bg-indigo-900/30", glow: "shadow-indigo-500/30" },
  amber: { text: "text-amber-400", bg: "bg-amber-900/30", glow: "shadow-amber-500/30" },
  cyan: { text: "text-cyan-400", bg: "bg-cyan-900/30", glow: "shadow-cyan-500/30" },
};

type GameIconSize = keyof typeof SIZES;
type GameIconVariant = "plain" | "badge" | "glow";

interface GameIconProps {
  name: string;
  size?: GameIconSize;
  variant?: GameIconVariant;
  color?: string;
  className?: string;
}

export default function GameIcon({
  name,
  size = "md",
  variant = "plain",
  color = "zinc",
  className,
}: GameIconProps) {
  const IconComponent = ICON_MAP[name] || Sparkles;
  const colorScheme = COLORS[color];

  // If color is a raw Tailwind class (e.g. "text-purple-400"), use it directly
  const textColor = colorScheme ? colorScheme.text : color;

  if (variant === "plain") {
    return (
      <IconComponent
        className={cn(SIZES[size], textColor, className)}
      />
    );
  }

  const bgColor = colorScheme?.bg || "bg-zinc-800";
  const glowColor = colorScheme?.glow || "";

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center flex-shrink-0",
        CONTAINER_SIZES[size],
        bgColor,
        variant === "glow" && `shadow-lg ${glowColor}`,
        className,
      )}
    >
      <IconComponent className={cn(SIZES[size], textColor)} />
    </div>
  );
}
