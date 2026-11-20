// Фото — Unsplash (бесплатная лицензия). Статический импорт: хеш в имени, immutable-кэш и blur-заглушка.
import aurora from "@/assets/photos/aurora.jpg"
import auroraForest from "@/assets/photos/aurora-forest.jpg"
import campfire from "@/assets/photos/campfire.jpg"
import clouds from "@/assets/photos/clouds.jpg"
import dinner from "@/assets/photos/dinner.jpg"
import dunes from "@/assets/photos/dunes.jpg"
import dunesGold from "@/assets/photos/dunes-gold.jpg"
import forestTents from "@/assets/photos/forest-tents.jpg"
import guestAnna from "@/assets/photos/guest-anna.jpg"
import guestElena from "@/assets/photos/guest-elena.jpg"
import guestMark from "@/assets/photos/guest-mark.jpg"
import horse from "@/assets/photos/horse.jpg"
import lakeBoat from "@/assets/photos/lake-boat.jpg"
import lakeHouse from "@/assets/photos/lake-house.jpg"
import milkyway from "@/assets/photos/milkyway.jpg"
import mistTents from "@/assets/photos/mist-tents.jpg"
import mistyHills from "@/assets/photos/misty-hills.jpg"
import morningMug from "@/assets/photos/morning-mug.jpg"
import ocean from "@/assets/photos/ocean.jpg"
import oceanAerial from "@/assets/photos/ocean-aerial.jpg"
import summit from "@/assets/photos/summit.jpg"
import taigaCabin from "@/assets/photos/taiga-cabin.jpg"
import tentGlow from "@/assets/photos/tent-glow.jpg"
import tentInside from "@/assets/photos/tent-inside.jpg"
import tentLake from "@/assets/photos/tent-lake.jpg"
import tentStars from "@/assets/photos/tent-stars.jpg"
import tentSunset from "@/assets/photos/tent-sunset.jpg"
import tentView from "@/assets/photos/tent-view.jpg"
import treehouse from "@/assets/photos/treehouse.jpg"
import valley from "@/assets/photos/valley.jpg"
import waterfall from "@/assets/photos/waterfall.jpg"

export const photos = {
  aurora,
  auroraForest,
  campfire,
  clouds,
  dinner,
  dunes,
  dunesGold,
  forestTents,
  guestAnna,
  guestElena,
  guestMark,
  horse,
  lakeBoat,
  lakeHouse,
  milkyway,
  mistTents,
  mistyHills,
  morningMug,
  ocean,
  oceanAerial,
  summit,
  taigaCabin,
  tentGlow,
  tentInside,
  tentLake,
  tentStars,
  tentSunset,
  tentView,
  treehouse,
  valley,
  waterfall,
}

export type PhotoKey = keyof typeof photos
