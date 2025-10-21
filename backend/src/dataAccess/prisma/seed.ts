import { PrismaClient } from './generated/client'
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient()

async function main() {

    //insert building
    const countBuilding = await prisma.building.count();
    if (countBuilding === 0) {
        await prisma.building.createMany({
            data: [
                {
                    name: 'Town Hall',
                    image: '/city/townhall_l.png',
                    text: 'At the heart of the town you can find the town hall through which the town grows and flourishes. The smart civil servants, who work here, love to give you information about your local population Every expansion of the town hall increases the maxium number of citizens in this town.'
                },
                {
                    name: 'Academy',
                    image: '/city/academy_l.png',
                    text: 'The academy is a sublime place full of knowledge which combines the old traditions with modern technology. The wisest heads of your town await entrance! Consider that every scientist needs his own laboratory which costs money. The larger the academy the more scientists you can employ at the same time.'
                },
                {
                    name: 'Warehouse',
                    image: '/city/warehouse_l.png',
                    text: 'A part of your supplies is protected at the warehouse. It keeps mean pillagers, rain, birds and other pests away. The warehouse keeper is also always well informed about your resource storage. Expanding your warehouse allows you to protect and store more supplies.'
                },
                {
                    name: 'Barracks',
                    image: '/city/barracks_r.png',
                    text: 'In the barracks the boisterous youth is instructed to become keen fighters. Your soldiers know how to handle swords, spears and catapults and are also able to lead the mightiest war machines safely over the field. The troops are trained faster when you expand your barracks.'
                },
                {
                    name: 'Tavern',
                    image: '/city/taverne_l.png',
                    text: 'After a day`s work, there is nothing more pleasant than a cool jug of wine. That`s why your citizens love to meet at the tavern. And when the last old songs have been sung at the end of the day, they set out, merry and cheerful, for home. Every expansion of your tavern allows you to serve more wine.'
                },
                {
                    name: 'Carpenter',
                    image: '/city/carpentering_l.png',
                    text: 'Only the best lumber is used at the carpenter`s workshop. Therefore our handy craftsmen are able to build a solid framework and our houses don`t have to be repaired all the time. Every level of the carpenter`s workshop lowers your demand for building material by 1% of the basic value.'
                },
                {
                    name: 'Optician',
                    image: '/city/optician_l.png',
                    text: 'Lenses and magnifying glasses don`t just help our scientists to see clearly and to find important papers on their desk, but they are also necessary in order to invent all those new technologies that make us so proud. The optician keeps everything we need carefully stored in boxes, so that less things get lost. The demand for crystal glass is reduced by 1% per building level.'
                },
                {
                    name: 'Firework Test Area',
                    image: '/city/fireworker_l.png',
                    text: 'Constant tests with fireworks don`t just light up the skies but sometimes also the surrounding buildings. However our scientists can only optimize the demand for sulfur, when they keep testing new mixtures. The demand for sulfur in your town will be reduced by 1% for each building level.'
                },
                {
                    name: 'Wine Press',
                    image: '/city/vineyard_l.png',
                    text: 'Only the purest wines mature in the deep and cool cellars of the town. And the cellar`s master makes sure nothing trickles away and all the wine can run down the throats of your citizens. The demand for wine in your town will be reduced by 1% for each building level.'
                },
                {
                    name: 'Architect`s Office',
                    image: '/city/architect_l.png',
                    text: 'Angle, Compass and Yardstick: The architects` office provides everything you need for building straight walls and stable roofs. And a well-planned house needs a lot less marble than a skew one. The demand for marble in your town will be reduced by 1% for each building level.'
                },
                {
                    name: 'Forester`s House',
                    image: '/city/forester_l.png',
                    text: 'The strong lumberjacks can chop down even the largest trees. But they also know that a forest must be cultivated and new trees planted so that we can continue to use only the best timber for our houses. The production of building material is increased by 2% for every level of expansion.'
                },
                {
                    name: 'Glassblower',
                    image: '/city/glassblowing_l.png',
                    text: 'True masters of their art create sparkling pieces at the glassblower`s house. The blow tubes, glass and all sorts of other apparatuses are only understood by our scientists. And they are so nimble, that barely anything ever gets broken. Every level of expansion increases your production of crystal glass by 2%'
                },
                {
                    name: 'Alchemist`s Tower',
                    image: '/city/alchemist_l.png',
                    text: 'When the wind blows west, a smell fills the streets around the tower and many a citizen doesn`t leave the house without a peg on their nose. Our alchemists work restlessly on finding the perfect mixture and ensuring that we can get even more sulfur out of the pit. For every level of the building your sulfur production is increased by 2%'
                },
                {
                    name: 'Winegrower',
                    image: '/city/winegrower_l.png',
                    text: 'A winegrower only chooses the most sunny hills of the surrounding area to cover them with the comforting green of the vines. That`s how the vineyards produce full fruits that make for a much better harvest. Every level of the winegrower`s expansion increases your wine production by 2%'
                },
                {
                    name: 'Stonemason',
                    image: '/city/stonemason_l.png',
                    text: 'A trained stonemason always quarries the right blocks of marble with his strong arms. Thus less is broken and our builders always have the material they need. For every level of expansion this building increases the marble production by 2%'
                },
                {
                    name: 'Trading Port',
                    image: '/city/port_r.png',
                    text: 'The port is your gateway to the world. You can hire trade ships and get them ready for long journeys here. You can also receive precious goods from far away places. Larger ports can load ships faster. You can build another port that increases your loading speed as soon as you have researched the Dry-Dock.'
                },
                {
                    name: 'Palace',
                    image: '/city/palace_l.png',
                    text: 'The palace is an excellent place to lead your empire into the future! It also provides a gorgeous view onto the sea. Every expansion of your capital`s palace allows you to set up a further colony.'
                },
                {
                    name: 'Governor`s Residence',
                    image: '/city/palaceColony_l.png',
                    text: 'A governor in your colony guarantees, that all the daily administrative tasks are done properly. He also lowers the level of corruption in your colony. The governor`s residence can also be upgraded to a palace if you ever want to move your capital.'
                },
                {
                    name: 'Town Wall',
                    image: '/city/wall.png',
                    text: 'The town wall protects your citizens against your enemies and the sun. Beware! Enemies will try to tear holes into your wall or to climb over it. Every level increases the resistance of your town wall.'
                }
            ]
        });
    }

    //insert building levels
    const countBuildingLevel = await prisma.buildingLevel.count();
    if (countBuildingLevel === 0) {
        await prisma.buildingLevel.createMany({
            data: [
                { buildingId: 1, level: 1, wood: 120, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 1, level: 2, wood: 158, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 1, level: 3, wood: 335, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 1, level: 4, wood: 623, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 1, level: 5, wood: 923, wine: 0, marble: 285, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 1, level: 6, wood: 1390, wine: 0, marble: 551, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 1, level: 7, wood: 2015, wine: 0, marble: 936, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 1, level: 8, wood: 2706, wine: 0, marble: 1411, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 1, level: 9, wood: 3661, wine: 0, marble: 2091, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 2, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 2, level: 1, wood: 64, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 8 },
                { buildingId: 2, level: 2, wood: 68, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 2, level: 3, wood: 115, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 2, level: 4, wood: 263, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 2, level: 5, wood: 382, wine: 0, marble: 0, glass: 225, sulfur: 0, time: 5 },
                { buildingId: 2, level: 6, wood: 626, wine: 0, marble: 0, glass: 428, sulfur: 0, time: 5 },
                { buildingId: 2, level: 7, wood: 982, wine: 0, marble: 0, glass: 744, sulfur: 0, time: 5 },
                { buildingId: 2, level: 8, wood: 1330, wine: 0, marble: 0, glass: 1089, sulfur: 0, time: 5 },
                { buildingId: 2, level: 9, wood: 2004, wine: 0, marble: 0, glass: 1748, sulfur: 0, time: 5 },
                { buildingId: 3, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 3, level: 1, wood: 160, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 3, level: 2, wood: 288, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 3, level: 3, wood: 442, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 3, level: 4, wood: 626, wine: 0, marble: 96, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 3, level: 5, wood: 847, wine: 0, marble: 211, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 3, level: 6, wood: 1113, wine: 0, marble: 349, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 3, level: 7, wood: 1431, wine: 0, marble: 515, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 3, level: 8, wood: 1813, wine: 0, marble: 714, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 3, level: 9, wood: 2272, wine: 0, marble: 953, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 4, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 4, level: 1, wood: 49, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 4, level: 2, wood: 114, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 4, level: 3, wood: 195, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 4, level: 4, wood: 296, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 4, level: 5, wood: 420, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 4, level: 6, wood: 574, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 4, level: 7, wood: 766, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 4, level: 8, wood: 1003, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 4, level: 9, wood: 1297, wine: 0, marble: 953, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 5, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 5, level: 1, wood: 101, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 5, level: 2, wood: 222, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 5, level: 3, wood: 367, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 5, level: 4, wood: 541, wine: 0, marble: 94, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 5, level: 5, wood: 750, wine: 0, marble: 122, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 5, level: 6, wood: 1001, wine: 0, marble: 158, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 5, level: 7, wood: 1302, wine: 0, marble: 206, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 5, level: 8, wood: 1663, wine: 0, marble: 267, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 5, level: 9, wood: 2097, wine: 0, marble: 953, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 6, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 6, level: 1, wood: 63, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 6, level: 2, wood: 122, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 6, level: 3, wood: 192, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 6, level: 4, wood: 274, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 6, level: 5, wood: 372, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 6, level: 6, wood: 486, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 6, level: 7, wood: 620, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 6, level: 8, wood: 777, wine: 0, marble: 359, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 6, level: 9, wood: 962, wine: 0, marble: 444, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 7, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 7, level: 1, wood: 119, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 7, level: 2, wood: 188, wine: 0, marble: 35, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 7, level: 3, wood: 269, wine: 0, marble: 96, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 7, level: 4, wood: 362, wine: 0, marble: 167, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 7, level: 5, wood: 471, wine: 0, marble: 249, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 7, level: 6, wood: 597, wine: 0, marble: 345, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 7, level: 7, wood: 742, wine: 0, marble: 455, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 7, level: 8, wood: 912, wine: 0, marble: 584, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 7, level: 9, wood: 1108, wine: 0, marble: 733, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 8, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 8, level: 1, wood: 273, wine: 0, marble: 135, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 8, level: 2, wood: 353, wine: 0, marble: 212, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 8, level: 3, wood: 445, wine: 0, marble: 302, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 8, level: 4, wood: 551, wine: 0, marble: 405, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 8, level: 5, wood: 673, wine: 0, marble: 526, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 8, level: 6, wood: 813, wine: 0, marble: 665, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 8, level: 7, wood: 974, wine: 0, marble: 827, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 8, level: 8, wood: 1159, wine: 0, marble: 1015, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 8, level: 9, wood: 1373, wine: 0, marble: 1233, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 9, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 9, level: 1, wood: 339, wine: 0, marble: 123, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 9, level: 2, wood: 423, wine: 0, marble: 198, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 9, level: 3, wood: 520, wine: 0, marble: 285, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 9, level: 4, wood: 631, wine: 0, marble: 387, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 9, level: 5, wood: 758, wine: 0, marble: 504, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 9, level: 6, wood: 905, wine: 0, marble: 640, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 9, level: 7, wood: 1074, wine: 0, marble: 798, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 9, level: 8, wood: 1269, wine: 0, marble: 981, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 9, level: 9, wood: 1492, wine: 0, marble: 1194, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 10, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 10, level: 1, wood: 185, wine: 0, marble: 106, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 10, level: 2, wood: 291, wine: 0, marble: 160, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 10, level: 3, wood: 413, wine: 0, marble: 222, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 10, level: 4, wood: 555, wine: 0, marble: 295, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 10, level: 5, wood: 720, wine: 0, marble: 379, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 10, level: 6, wood: 911, wine: 0, marble: 475, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 10, level: 7, wood: 1133, wine: 0, marble: 587, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 10, level: 8, wood: 1390, wine: 0, marble: 716, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 10, level: 9, wood: 1686, wine: 0, marble: 865, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 11, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 11, level: 1, wood: 250, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 11, level: 2, wood: 430, wine: 0, marble: 104, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 11, level: 3, wood: 664, wine: 0, marble: 237, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 11, level: 4, wood: 968, wine: 0, marble: 410, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 11, level: 5, wood: 1364, wine: 0, marble: 635, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 11, level: 6, wood: 1878, wine: 0, marble: 928, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 11, level: 7, wood: 2546, wine: 0, marble: 1309, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 11, level: 8, wood: 3415, wine: 0, marble: 1803, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 11, level: 9, wood: 4544, wine: 0, marble: 2446, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 12, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 12, level: 1, wood: 274, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 12, level: 2, wood: 467, wine: 0, marble: 116, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 12, level: 3, wood: 718, wine: 0, marble: 255, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 12, level: 4, wood: 1045, wine: 0, marble: 436, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 12, level: 5, wood: 1469, wine: 0, marble: 671, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 12, level: 6, wood: 2021, wine: 0, marble: 977, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 12, level: 7, wood: 2738, wine: 0, marble: 1375, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 12, level: 8, wood: 3671, wine: 0, marble: 1892, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 12, level: 9, wood: 4883, wine: 0, marble: 2564, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 13, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 13, level: 1, wood: 274, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 13, level: 2, wood: 467, wine: 0, marble: 116, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 13, level: 3, wood: 718, wine: 0, marble: 255, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 13, level: 4, wood: 1045, wine: 0, marble: 436, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 13, level: 5, wood: 1469, wine: 0, marble: 671, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 13, level: 6, wood: 2021, wine: 0, marble: 977, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 13, level: 7, wood: 2738, wine: 0, marble: 1375, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 13, level: 8, wood: 3671, wine: 0, marble: 1892, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 13, level: 9, wood: 4883, wine: 0, marble: 2564, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 14, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 14, level: 1, wood: 274, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 14, level: 2, wood: 467, wine: 0, marble: 116, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 14, level: 3, wood: 718, wine: 0, marble: 255, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 14, level: 4, wood: 1045, wine: 0, marble: 436, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 14, level: 5, wood: 1469, wine: 0, marble: 671, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 14, level: 6, wood: 2021, wine: 0, marble: 977, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 14, level: 7, wood: 2738, wine: 0, marble: 1375, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 14, level: 8, wood: 3671, wine: 0, marble: 1892, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 14, level: 9, wood: 4883, wine: 0, marble: 2564, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 15, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 15, level: 1, wood: 274, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 15, level: 2, wood: 467, wine: 0, marble: 116, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 15, level: 3, wood: 718, wine: 0, marble: 255, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 15, level: 4, wood: 1045, wine: 0, marble: 436, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 15, level: 5, wood: 1469, wine: 0, marble: 671, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 15, level: 6, wood: 2021, wine: 0, marble: 977, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 15, level: 7, wood: 2738, wine: 0, marble: 1375, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 15, level: 8, wood: 3671, wine: 0, marble: 1892, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 15, level: 9, wood: 4883, wine: 0, marble: 2564, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 16, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 16, level: 1, wood: 60, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 16, level: 2, wood: 150, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 16, level: 3, wood: 274, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 16, level: 4, wood: 429, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 16, level: 5, wood: 637, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 16, level: 6, wood: 894, wine: 0, marble: 176, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 16, level: 7, wood: 1207, wine: 0, marble: 326, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 16, level: 8, wood: 1645, wine: 0, marble: 540, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 16, level: 9, wood: 2106, wine: 0, marble: 791, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 17, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 17, level: 1, wood: 712, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 17, level: 2, wood: 5824, wine: 0, marble: 1434, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 17, level: 3, wood: 16048, wine: 0, marble: 4546, glass: 0, sulfur: 3089, time: 5 },
                { buildingId: 17, level: 4, wood: 36496, wine: 10898, marble: 10770, glass: 0, sulfur: 10301, time: 5 },
                { buildingId: 17, level: 5, wood: 77392, wine: 22110, marble: 23218, glass: 21188, sulfur: 24725, time: 5 },
                { buildingId: 17, level: 6, wood: 159184, wine: 44534, marble: 48114, glass: 42400, sulfur: 53573, time: 5 },
                { buildingId: 17, level: 7, wood: 322768, wine: 89382, marble: 97906, glass: 84824, sulfur: 111269, time: 5 },
                { buildingId: 17, level: 8, wood: 649936, wine: 179078, marble: 197490, glass: 169672, sulfur: 226661, time: 5 },
                { buildingId: 17, level: 9, wood: 1304272, wine: 358470, marble: 396658, glass: 339368, sulfur: 457445, time: 5 },
                { buildingId: 18, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 18, level: 1, wood: 712, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 18, level: 2, wood: 5824, wine: 0, marble: 1434, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 18, level: 3, wood: 16048, wine: 0, marble: 4546, glass: 0, sulfur: 3089, time: 5 },
                { buildingId: 18, level: 4, wood: 36496, wine: 10898, marble: 10770, glass: 0, sulfur: 10301, time: 5 },
                { buildingId: 18, level: 5, wood: 77392, wine: 22110, marble: 23218, glass: 21188, sulfur: 24725, time: 5 },
                { buildingId: 18, level: 6, wood: 159184, wine: 44534, marble: 48114, glass: 42400, sulfur: 53573, time: 5 },
                { buildingId: 18, level: 7, wood: 322768, wine: 89382, marble: 97906, glass: 84824, sulfur: 111269, time: 5 },
                { buildingId: 18, level: 8, wood: 649936, wine: 179078, marble: 197490, glass: 169672, sulfur: 226661, time: 5 },
                { buildingId: 18, level: 9, wood: 1304272, wine: 358470, marble: 396658, glass: 339368, sulfur: 457445, time: 5 },
                { buildingId: 19, level: 0, wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 0 },
                { buildingId: 19, level: 1, wood: 274, wine: 0, marble: 0, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 19, level: 2, wood: 467, wine: 0, marble: 116, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 19, level: 3, wood: 718, wine: 0, marble: 255, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 19, level: 4, wood: 1045, wine: 0, marble: 436, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 19, level: 5, wood: 1469, wine: 0, marble: 671, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 19, level: 6, wood: 2021, wine: 0, marble: 977, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 19, level: 7, wood: 2738, wine: 0, marble: 1375, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 19, level: 8, wood: 3671, wine: 0, marble: 1892, glass: 0, sulfur: 0, time: 5 },
                { buildingId: 19, level: 9, wood: 4883, wine: 0, marble: 2564, glass: 0, sulfur: 0, time: 5 }
            ]
        });
    }

    //insert forest
    const forest = await prisma.forest.count();
    if (forest === 0) {
        await prisma.forest.createMany({
            data: [
            { level: 1, workers: 45, wood: 0, time: 0 },
            { level: 2, workers: 57, wood: 394, time: 60 },
            { level: 3, workers: 75, wood: 992, time: 80 },
            { level: 4, workers: 96, wood: 1732, time: 120 },
            { level: 5, workers: 120, wood: 2788, time: 150 },
            { level: 6, workers: 144, wood: 3783, time: 180 },
            { level: 7, workers: 171, wood: 5632, time: 210 },
            { level: 8, workers: 201, wood: 8139, time: 240 },
            { level: 9, workers: 231, wood: 10452, time: 270 },
            ]
        });
    }

    //insert mines
    const mines = await prisma.mine.count();
    if (mines === 0) {
        await prisma.mine.createMany({
            data: [
            { level: 1, workers: 50, wood: 0, time: 0 },
            { level: 2, workers: 57, wood: 394, time: 60 },
            { level: 3, workers: 75, wood: 992, time: 80 },
            { level: 4, workers: 96, wood: 1732, time: 120 },
            { level: 5, workers: 120, wood: 2788, time: 150 },
            { level: 6, workers: 144, wood: 3783, time: 180 },
            { level: 7, workers: 171, wood: 5632, time: 210 },
            { level: 8, workers: 201, wood: 8139, time: 240 },
            { level: 9, workers: 231, wood: 10452, time: 270 },
            ],
        });
    }

    //insert island sectors
    const islandSector = await prisma.islandSector.count();
    if (islandSector === 0) {
        const data = Array.from({ length: 105 }).map(() => ({
            name: faker.word.noun() + " Island",
        }));
        await prisma.islandSector.createMany({ data });
    }

    //insert island
    const islands = await prisma.island.count();
    if(islands === 0){
        const islandsData = generateIslandMap();
        const islands: any[] = [];
    
        for (let y = 0; y < 100; y++) {
            for (let x = 0; x < 100; x++) {
                if (islandsData[x][y].type === 'i') {
                    islands.push({
                        x: x,
                        y: y,
                        name: faker.person.lastName(),
                        type: islandsData[x][y].resource,
                        forestId: 1,
                        mineId: 1,
                        donatedForest: 0,
                        donatedMine: 0,
                        islandSectorId: islandsData[x][y].sector
                    });
                }
            }
        }
    
        // Sort
        islands.sort((a, b) => {
            let retval = a.islandSectorId - b.islandSectorId;
            if (retval === 0) {
                retval = a.x - b.x;
                if (retval === 0) {
                retval = a.y - b.y;
                }
            }
            return retval;
        });
    
        // insert
        await prisma.island.createMany({
            data: islands
        });
    }

    //insert units
    const unitCount = await prisma.unit.count();
    if (unitCount === 0) {
        await prisma.unit.createMany({
            data: [
            {
                name: 'Swordsmen',
                image: '',
                text: 'Swordsmen are a slow defensive unit with heavy armor. They are effective in defense against several units. They are not recommended when attacking and should be used purely as a defensive units. They are strongest against ranged units such as slingers.',
                population: 1,
                size: 3,
                wood: 150,
                wine: 0,
                glass: 0,
                sulfur: 0,
                time: 10,
                barrackLevel: 1,
                gold: 2,
                attack: 5,
                attackType: 1,
                defenseBlunt: 14,
                defenseSharp: 8,
                defenseDistance: 30,
            },
            {
                name: 'Slinger',
                image: '',
                text: 'Slingers are a cheap offensive unit. They are pretty fast and, in large numbers, are very strong attackers. In defense they are much less useful. They are best against hoplites and other slingers.',
                population: 1,
                size: 3,
                wood: 70,
                wine: 0,
                glass: 0,
                sulfur: 80,
                time: 10,
                barrackLevel: 5,
                gold: 3,
                attack: 23,
                attackType: 3,
                defenseBlunt: 7,
                defenseSharp: 8,
                defenseDistance: 2,
            },
            {
                name: 'Archer',
                image: '',
                text: 'Archers have a relatively good speed and can carry a large amount of booty. However they are not good in attack, but are an essential part of a good defence. They are best used against hoplies and chariots.',
                population: 1,
                size: 3,
                wood: 100,
                wine: 0,
                glass: 0,
                sulfur: 50,
                time: 10,
                barrackLevel: 9,
                gold: 3,
                attack: 8,
                attackType: 3,
                defenseBlunt: 7,
                defenseSharp: 25,
                defenseDistance: 13,
            },
            {
                name: 'Hoplite',
                image: '',
                text: 'Hoplites are a slow unit with sharp weapons. They are good in attack and reasonable in defence. Often hoplites are said to be a slow version of chariots , but they are slightly cheaper and cost less population in proportion to their attacking force.',
                population: 1,
                size: 3,
                wood: 100,
                wine: 0,
                glass: 0,
                sulfur: 100,
                time: 10,
                barrackLevel: 13,
                gold: 4,
                attack: 16,
                attackType: 2,
                defenseBlunt: 18,
                defenseSharp: 12,
                defenseDistance: 7,
            },
            {
                name: 'Horsemen',
                image: '',
                text: 'Horsemen are very strong attacking units with high speed and a large carrying capacity for resources. They are quite expensive and have a very poor defence. They are best used against Swordsmen.',
                population: 3,
                size: 3,
                wood: 230,
                wine: 120,
                glass: 0,
                sulfur: 350,
                time: 10,
                barrackLevel: 16,
                gold: 9,
                attack: 60,
                attackType: 1,
                defenseBlunt: 18,
                defenseSharp: 1,
                defenseDistance: 24,
            },
            {
                name: 'Chariot',
                image: '',
                text: 'Chariots are a fast, strong unit. They are both powerful attackers and strong defenders. You can use Zeus power "Divine Sign" to get chariots. They are expensive, but effective. Best used against Archers and Horsemen when attacking.',
                population: 4,
                size: 3,
                wood: 300,
                wine: 200,
                glass: 0,
                sulfur: 450,
                time: 10,
                barrackLevel: 18,
                gold: 12,
                attack: 56,
                attackType: 2,
                defenseBlunt: 30,
                defenseSharp: 30,
                defenseDistance: 30,
            },
            ],
        });
    }

    //insert researchCategory
    const researchCategory = await prisma.researchCategory.count();
    if (researchCategory === 0) {
        await prisma.researchCategory.createMany({
            data: [
            { name: 'Seafaring' },
            { name: 'Economy' },
            { name: 'Science' },
            { name: 'Military' }
            ],
        });
    }

    //insert research
    const research = await prisma.research.count();
    if (research === 0) {
        await prisma.research.createMany({
            data: [
                {
                    researchCategoryId: 1,
                    level: 1,
                    cost: 8,
                    name: 'Carpentry',
                    text: 'Our islands forests provide us with excellent building material so that we can create strong woodwork for the roofs of our buildings. But to ensure that this is the case, lumber must be carefully selected and handled properly! A carpenter in our town would take care of this and would use up a lot less building material!'
                },
                {
                    researchCategoryId: 2,
                    level: 1,
                    cost: 12,
                    name: 'Conservation',
                    text: 'We have learned how to store and protect our resources in the long term from wind and weather. Additionally a part of our resources is safe from pirates and other villains, who might want to steal from us!'
                },
                {
                    researchCategoryId: 2,
                    level: 2,
                    cost: 24,
                    name: 'Pulley',
                    text: 'A brilliant idea: A rope that is pulled over a roll gives a simple man the strength of Hercules. So now our workers can lift up huge blocks of stone on their own and construct our buildings even faster!'
                },
                {
                    researchCategoryId: 2,
                    level: 3,
                    cost: 56,
                    name: 'Wealth',
                    text: 'The earth is full of valuable treasures! We have learned how to mine sulphur and crystal and how to chisel marble off rocks. We are also growing wonderful vines on the fertile land on our hills which produce delicious wine! A new era of prosperity will dawn on us when we start using these treasures. We can then sell goods at a trading post and buy what we need from foreign traders.'
                },
                {
                    researchCategoryId: 2,
                    level: 4,
                    cost: 220,
                    name: 'Wine culture',
                    text: 'A happy population needs festivals in which they can spend hours revelling and drinking our fantastic free-flowing wine. Dionysus loves seeing us enjoying what he has given us!'
                },
                {
                    researchCategoryId: 2,
                    level: 5,
                    cost: 990,
                    name: 'Improved resource gathering',
                    text: 'Some time has passed since we learned how to use the treasures of our island for our own needs. We should now educate our workers and let every forest, quarry or vineyard, every sulphur pit or crystal mine be administered by men who are not only strong but also skilful. This way we will gather even more income and our civilization will get richer than ever!'
                },
                {
                    researchCategoryId: 2,
                    level: 6,
                    cost: 2236,
                    name: 'Geometry',
                    text: 'Right angles, triangles, circles – a few bright minds can calculate how we can construct our buildings even better and more beautifully. And soon our towns will serve as examples to the whole world!'
                },
                {
                    researchCategoryId: 2,
                    level: 7,
                    cost: 3672,
                    name: 'Architecture',
                    text: 'A good house can withstand the harshest elements. It can withstand them even better when a clever mind takes care of it with a lot of drawings and a little mathematics before hand, so that all the walls are straight and the roof is tight. Thanks to angles and compasses our buildings will be much more stable and well protected from the rain. An architects office would spare us a lot of marble, just think about the savings we could make in constructing a new building!'
                },
                {
                    researchCategoryId: 2,
                    level: 8,
                    cost: 7200,
                    name: 'Holiday',
                    text: 'A worker who has had a good rest is much more eager to work than an exhausted one. Thats why every citizen should have one day off per week. This will make all our citizens happier!'
                },
                {
                    researchCategoryId: 2,
                    level: 9,
                    cost: 25632,
                    name: 'Spirit Level',
                    text: 'Water is always even. We should use this knowledge so that our buildings become even, too! Our town will become even more beautiful and we will use less stone and wood for constructing our buildings!'
                },
                {
                    researchCategoryId: 2,
                    level: 10,
                    cost: 48000,
                    name: 'Wine Press',
                    text: 'What an event those annual wine fêtes are! The whole town is there when the best grapes in town are stomped into wine and when the liquid gold splashes around, the kids have the most fun! With a wine press though, handled by an experienced winemaker, we would lose much less. The winemaker could also organise proper storage that allows us to let the wine age and mature well!'
                },
                {
                    researchCategoryId: 3,
                    level: 1,
                    cost: 24,
                    name: 'Well Digging',
                    text: 'Eureka! A well in our settlement! Now we dont have to wait for it to rain all the time. Our citizens will be much better off and the fields wont have to stay dry for very long!'
                },
                {
                    researchCategoryId: 3,
                    level: 2,
                    cost: 24,
                    name: 'Paper',
                    text: 'We have found a better way to archive our knowledge! Now we have scriptures made from the papyrus plant, so we don`t have to chisel our words into the heavy stones anymore in order to fill our library!'
                },
                {
                    researchCategoryId: 3,
                    level: 3,
                    cost: 2652,
                    name: 'Ink',
                    text: 'Nature gives us everything we need to write: The birds give us their feathers and eight-armed fish out of the sea provide us with their black ink! Now we can write down our ideas even more easily!'
                },
                {
                    researchCategoryId: 3,
                    level: 4,
                    cost: 21360,
                    name: 'Optics',
                    text: 'When our scientists invent new things, many a glass can break. Or it gets lost in the infinite vastness of our laboratories, as keeping them tidy isnt really the primal virtue of the academy. If an optician would take care of not only the quality, but also that all the lenses and glasses are put back where they belong, we would use far less crystal glass!'
                },
                {
                    researchCategoryId: 3,
                    level: 5,
                    cost: 31968,
                    name: 'Mechanical Pen',
                    text: 'A brilliant little apparatus: A smart inventor has managed to teach writing to a machine. Now we can copy our scriptures easily and our academies can quickly exchange their ideas with each other!'
                },
                {
                    researchCategoryId: 3,
                    level: 6,
                    cost: 144720,
                    name: 'Letter Chute',
                    text: 'A marvel: We can now shoot scrolls through pipes, so that they reach our scientists even faster! This saves us long errands and we have to pay less gold for our scientists!'
                },
                {
                    researchCategoryId: 4,
                    level: 1,
                    cost: 24,
                    name: 'Maps',
                    text: 'These long marches over the hills and through the swamps mean that our material will wear out very fast. If we write down, how our soldiers can travel over land without always getting stuck in the undergrowth or sinking into the mud, the soldiers will have to mend their uniforms a lot less often.'
                },
                {
                    researchCategoryId: 4,
                    level: 2,
                    cost: 336,
                    name: 'Professional Army',
                    text: 'Chasing away pirates, barbarians and other villains will be much easier with some professional soldiers! It might be more expensive than just making our citizens into soldiers in the event of war, but in exchange our troops will be able to handle sword, spear and shield much better!'
                },
                {
                    researchCategoryId: 4,
                    level: 3,
                    cost: 1032,
                    name: 'Siege',
                    text: 'With a rams head made of metal and the strength of ten men we can even tear down town walls. Now it will be easy for our soldiers to conquer other towns!'
                },
                {
                    researchCategoryId: 4,
                    level: 4,
                    cost: 2236,
                    name: 'Code of Honor',
                    text: 'Our soldiers are proud of serving their unit and their island kingdom. They are even taking better care of their uniforms, so that we dont have to mend and repair them as often.'
                },
                {
                    researchCategoryId: 4,
                    level: 5,
                    cost: 3264,
                    name: 'Ballistics',
                    text: 'Now we know how to shoot arrows at our enemies. We should start right now to train our soldiers with these skills, so we can have archers joining our army in battle soon!'
                },
                {
                    researchCategoryId: 4,
                    level: 6,
                    cost: 7020,
                    name: 'Law of the Lever',
                    text: 'With this technology we can unleash powers that can even let huge rocks fly through the air! And if the rocks are large enough, they can even tear down town walls!'
                },
                {
                    researchCategoryId: 4,
                    level: 7,
                    cost: 7020,
                    name: 'Pyrotechnics',
                    text: 'Sulphur is a really is a work of the devil! And with every new mixture, we can get even more impact from this precious resource. A safe practice ground would allow our blasters to test their inventions, without including the surrounding buildings as involuntary targets into their experiments.'
                },
                {
                    researchCategoryId: 4,
                    level: 8,
                    cost: 25632,
                    name: 'Logistics',
                    text: 'Our soldiers can fight much better if they dont have to drag that much. And their equipment will last much longer on the long marches, so we wont have to mend it that often.'
                },
                {
                    researchCategoryId: 4,
                    level: 9,
                    cost: 38400,
                    name: 'Gunpowder',
                    text: 'This black mixture from the alchemists kitchen can spark a fire with a loud bang and do truly devilish things! Now we can fill iron pipes with this powder to shoot heavy cannon balls through the air.'
                },
                {
                    researchCategoryId: 4,
                    level: 10,
                    cost: 106560,
                    name: 'Robotics',
                    text: 'Our scientists have built a mechanical giant with muscles made of metal and a steaming heart! Only the keenest and most skilled soldiers can steer such a colossus, but it will strike fear into everyone on the battlefield!'
                },
                {
                    researchCategoryId: 4,
                    level: 11,
                    cost: 209040,
                    name: 'Cannon Casting',
                    text: 'Our iron is getting heavier and harder: now we can even build barrels through which we can fire huge cannon balls at our enemies! If we can even fire bombs from a long distance our enemies and their town walls will tremble in fear!'
                },
                {
                    researchCategoryId: 1,
                    level: 2,
                    cost: 336,
                    name: 'Expansion',
                    text: 'There is a lot more than just an ocean out there! More islands await being discovered. We are not alone! We can gain ground on one of the newly discovered islands, tap new resources and get to know other nations! Our clerks are eager to administer even more, our traders ready to travel to new lands!'
                }
            ]
        });
    }

    //insert researchBuilding
    const researchBuilding = await prisma.researchBuilding.count();
    if (researchBuilding === 0) {
        await prisma.researchBuilding.createMany({
            data: [
            { buildingId: 3, researchId: 2 },
            { buildingId: 5, researchId: 5 },
            { buildingId: 6, researchId: 1 },
            { buildingId: 7, researchId: 15 },
            { buildingId: 8, researchId: 24 },
            { buildingId: 9, researchId: 11 },
            { buildingId: 10, researchId: 8 },
            { buildingId: 11, researchId: 6 },
            { buildingId: 12, researchId: 6 },
            { buildingId: 13, researchId: 6 },
            { buildingId: 14, researchId: 6 },
            { buildingId: 15, researchId: 6 },
            { buildingId: 17, researchId: 29 },
            { buildingId: 18, researchId: 29 }
            ]
        });
    }

     //insert movementType
    const movementType = await prisma.movementType.count();
    if (movementType === 0) {
        await prisma.movementType.createMany({
            data: [
            { name: 'transport_resource' },
            { name: 'ground_attack' },
            { name: 'ground_defense' },
            { name: 'colonize' }
            ]
        });
    }
}

function generateIslandMap() {
    const map: any[][] = [];
    for (let x = 0; x < 100; x++) {
      map[x] = [];
      for (let y = 0; y < 100; y++) {
        map[x][y] = {
            type: Math.random() < 0.5 ? 'i' : 'o', // 'i' = island, 'o' = sea
            resource: Math.floor(Math.random() * 4) + 1, // random resource
            sector: Math.floor(Math.random() * 10) + 1, // random sector between 1 and 10
        };
      }
    }
    return map;
}

main()
  .then(() => {
    console.log('Seed ejecutado con éxito')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })