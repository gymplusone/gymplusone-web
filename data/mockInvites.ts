import type { ImageSourcePropType } from "react-native";

const GYM_1 = require("@/assets/images/gym/2149278038.jpg");
const GYM_2 = require("@/assets/images/gym/2150165238.jpg");
const GYM_3 = require("@/assets/images/gym/2150975460.jpg");
const GYM_4 = require("@/assets/images/gym/2150399983.jpg");
const GYM_5 = require("@/assets/images/gym/2151450148.jpg");
const GYM_6 = require("@/assets/images/gym/9310.jpg");

const IMAGES = [GYM_1, GYM_2, GYM_3, GYM_4, GYM_5, GYM_6] as const;

export interface InviteProfile {
  id: string;
  name: string;
  age: number;
  /** Distance for display, e.g. "25 km Away" */
  distanceLabel: string;
  image: ImageSourcePropType;
}

export const MOCK_INVITES: InviteProfile[] = [
  {
    id: "1",
    name: "Sarah",
    age: 26,
    distanceLabel: "25 km Away",
    image: IMAGES[0],
  },
  {
    id: "2",
    name: "Emma",
    age: 24,
    distanceLabel: "12 km Away",
    image: IMAGES[1],
  },
  {
    id: "3",
    name: "Maya",
    age: 28,
    distanceLabel: "8 km Away",
    image: IMAGES[2],
  },
  {
    id: "4",
    name: "Jordan",
    age: 25,
    distanceLabel: "31 km Away",
    image: IMAGES[3],
  },
  {
    id: "5",
    name: "Riley",
    age: 27,
    distanceLabel: "5 km Away",
    image: IMAGES[4],
  },
  {
    id: "6",
    name: "Taylor",
    age: 23,
    distanceLabel: "18 km Away",
    image: IMAGES[5],
  },
];
