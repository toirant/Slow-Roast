/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Editorial, recognizable continent SVG paths
 * ViewBox: 0 0 760 380
 * Projection: Equirectangular (Lng -175 to 185, Lat -60 to 80)
 *
 * Geographical calibration anchors:
 * - Guatemala: (178, 178)
 * - Colombia: (208, 212)
 * - Ethiopia (Horn of Africa): (450, 201)
 * - Equator: y = 217.1
 * - Tropic of Cancer: y = 153.4
 * - Tropic of Capricorn: y = 280.9
 */

export interface ContinentPath {
  id: string;
  name: string;
  d: string;
}

export const CONTINENT_PATHS: ContinentPath[] = [
  // North America (Alaska, Hudson Bay, Canada, USA, Mexico, Baja, Florida, Central America to Panama)
  {
    id: 'north-america',
    name: 'North America',
    d: `M 34,76
        L 52,62 L 78,56 L 98,48 L 134,44 L 158,38 L 176,46 L 192,42 L 208,52
        L 220,68 L 216,84 L 198,92 L 182,88 L 174,102 L 186,112 L 202,122
        L 194,136 L 186,146 L 178,154 L 168,162 L 178,176 L 192,192 L 204,206
        L 198,212 L 184,200 L 174,184 L 162,176 L 152,166 L 140,164 L 132,174
        L 124,182 L 118,172 L 126,158 L 112,154 L 98,160 L 84,152 L 74,136
        L 62,124 L 48,114 L 38,98 Z
        M 188,142 L 196,152 L 190,162 L 184,156 Z
        M 132,32 L 150,22 L 168,26 L 176,38 L 158,44 L 142,40 Z`,
  },
  // South America (Colombia northwest shoulder, Venezuela, Brazil east bulge, Andes taper down to Cape Horn)
  {
    id: 'south-america',
    name: 'South America',
    d: `M 202,210
        L 214,204 L 230,206 L 246,212 L 264,222 L 278,236 L 286,252 L 284,272
        L 274,290 L 260,312 L 246,332 L 234,352 L 222,368 L 214,374 L 210,366
        L 212,348 L 208,328 L 204,306 L 198,284 L 192,260 L 194,240 L 198,222 Z`,
  },
  // Europe (Iberia, France, British Isles, Scandinavia, Italy, Greece, Eastern Europe)
  {
    id: 'europe',
    name: 'Europe',
    d: `M 334,80
        L 348,68 L 364,58 L 382,56 L 396,66 L 406,80 L 404,96 L 392,106
        L 380,118 L 372,126 L 362,132 L 350,136 L 338,138 L 328,128 L 332,112
        L 336,98 Z
        M 354,42 L 366,34 L 378,38 L 382,50 L 370,54 L 358,48 Z
        M 324,104 L 332,96 L 338,102 L 332,112 Z`,
  },
  // Africa (Morocco/Gibraltar, Mediterranean coast, Horn of Africa/Ethiopia, West African bulge, South Africa, Madagascar)
  {
    id: 'africa',
    name: 'Africa',
    d: `M 328,150
        L 348,144 L 374,144 L 402,150 L 424,160 L 444,174 L 458,190 L 466,204
        L 456,218 L 448,232 L 438,252 L 430,274 L 422,298 L 412,320 L 398,342
        L 384,358 L 370,366 L 358,358 L 352,340 L 346,318 L 338,296 L 328,276
        L 316,258 L 302,244 L 290,230 L 286,212 L 294,196 L 308,184 L 318,168 Z
        M 452,292 L 460,286 L 466,296 L 462,314 L 456,328 L 448,318 Z`,
  },
  // Asia & India (Middle East, Central Asia, Siberia, India, China, Indochina)
  {
    id: 'asia',
    name: 'Asia',
    d: `M 412,74
        L 438,64 L 474,56 L 520,54 L 568,60 L 618,66 L 662,82 L 696,102
        L 712,120 L 702,140 L 684,156 L 664,172 L 648,190 L 634,212 L 618,232
        L 600,246 L 588,238 L 576,224 L 562,208 L 546,194 L 530,182 L 512,176
        L 492,178 L 474,172 L 456,162 L 442,150 L 428,136 L 420,116 L 414,94 Z
        M 478,198 L 494,194 L 508,206 L 506,226 L 498,248 L 484,268 L 472,274
        L 466,260 L 468,240 L 472,218 Z
        M 588,242 L 598,256 L 606,274 L 602,290 L 594,304 L 586,310 L 582,298
        L 586,282 L 588,262 Z`,
  },
  // Maritime Southeast Asia (Sumatra, Java, Borneo, Philippines, New Guinea - prime Coffee Belt islands)
  {
    id: 'southeast-asia-islands',
    name: 'Coffee Belt Islands',
    d: `M 584,316 L 598,312 L 614,318 L 608,324 L 592,324 Z
        M 618,326 L 634,324 L 652,328 L 642,334 L 624,332 Z
        M 610,288 L 622,284 L 626,296 L 618,302 Z
        M 660,320 L 676,318 L 686,326 L 674,330 Z`,
  },
  // Australia & New Zealand
  {
    id: 'australia',
    name: 'Australia',
    d: `M 636,312
        L 654,304 L 678,306 L 702,316 L 718,330 L 724,348 L 718,366 L 702,378
        L 680,384 L 660,382 L 644,372 L 634,354 L 630,336 Z
        M 728,370 L 736,364 L 740,374 L 732,382 Z`,
  },
];

/**
 * Standard geographical graticule lines (Equator, Tropics, Prime Meridian)
 */
export const GRATICULES = [
  { id: 'equator', name: 'Equator (0°)', y: 217.1, isEquator: true },
  { id: 'tropic-cancer', name: 'Tropic of Cancer (23.5° N)', y: 153.4, isTropic: true },
  { id: 'tropic-capricorn', name: 'Tropic of Capricorn (23.5° S)', y: 280.9, isTropic: true },
];
