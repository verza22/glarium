<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateTableBuilding extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('building', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 25);
            $table->string('image');
            $table->text('text');
        });

        DB::table('building')->insert(
            array(
                array(
                    'name'  => 'Town Hall',
                    'image' => 'https://s203-us.ikariam.gameforge.com/skin/img/city/townhall_l.png',
                    'text'  => 'At the heart of the town you can find the town hall through which the town grows and flourishes. The smart civil servants, who work here, love to give you information about your local population Every expansion of the town hall increases the maxium number of citizens in this town.'
                ),
                array(
                    'name'  => 'Academy',
                    'image' => 'https://s203-us.ikariam.gameforge.com/skin/img/city/academy_l.png',
                    'text'  => 'The academy is a sublime place full of knowledge which combines the old traditions with modern technology. The wisest heads of your town await entrance! Consider that every scientist needs his own laboratory which costs money. The larger the academy the more scientists you can employ at the same time.'
                ),
                array(
                    'name'  => 'Warehouse',
                    'image' => 'https://s203-us.ikariam.gameforge.com/skin/img/city/warehouse_l.png',
                    'text'  => 'A part of your supplies is protected at the warehouse. It keeps mean pillagers, rain, birds and other pests away. The warehouse keeper is also always well informed about your resource storage. Expanding your warehouse allows you to protect and store more supplies.'
                ),
                array(
                    'name'  => 'Barracks',
                    'image' => 'https://s203-us.ikariam.gameforge.com/skin/img/city/barracks_r.png',
                    'text'  => 'In the barracks the boisterous youth is instructed to become keen fighters. Your soldiers know how to handle swords, spears and catapults and are also able to lead the mightiest war machines safely over the field. The troops are trained faster when you expand your barracks.'
                ),
                array(
                    'name'  => 'Tavern',
                    'image' => 'https://s203-us.ikariam.gameforge.com/skin/img/city/taverne_l.png',
                    'text'  => 'After a day`s work, there is nothing more pleasant than a cool jug of wine. That`s why your citizens love to meet at the tavern. And when the last old songs have been sung at the end of the day, they set out, merry and cheerful, for home. Every expansion of your tavern allows you to serve more wine.'
                ),
                array(
                    'name'  => 'Carpenter',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/carpentering_l.png',
                    'text'  => 'Only the best lumber is used at the carpenter`s workshop. Therefore our handy craftsmen are able to build a solid framework and our houses don`t have to be repaired all the time. Every level of the carpenter`s workshop lowers your demand for building material by 1% of the basic value.'
                ),
                array(
                    'name'  => 'Optician',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/optician_l.png',
                    'text'  => 'Lenses and magnifying glasses don`t just help our scientists to see clearly and to find important papers on their desk, but they are also necessary in order to invent all those new technologies that make us so proud. The optician keeps everything we need carefully stored in boxes, so that less things get lost. The demand for crystal glass is reduced by 1% per building level.'
                ),
                array(
                    'name'  => 'Firework Test Area',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/fireworker_l.png',
                    'text'  => 'Constant tests with fireworks don`t just light up the skies but sometimes also the surrounding buildings. However our scientists can only optimize the demand for sulfur, when they keep testing new mixtures. The demand for sulfur in your town will be reduced by 1% for each building level.'
                ),
                array(
                    'name'  => 'Wine Press',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/vineyard_l.png',
                    'text'  => 'Only the purest wines mature in the deep and cool cellars of the town. And the cellar`s master makes sure nothing trickles away and all the wine can run down the throats of your citizens. The demand for wine in your town will be reduced by 1% for each building level.'
                ),
                array(
                    'name'  => 'Architect`s Office',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/architect_l.png',
                    'text'  => 'Angle, Compass and Yardstick: The architects` office provides everything you need for building straight walls and stable roofs. And a well-planned house needs a lot less marble than a skew one. The demand for marble in your town will be reduced by 1% for each building level.'
                ),
                array(
                    'name'  => 'Forester`s House',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/forester_l.png',
                    'text'  => 'The strong lumberjacks can chop down even the largest trees. But they also know that a forest must be cultivated and new trees planted so that we can continue to use only the best timber for our houses. The production of building material is increased by 2% for every level of expansion.'
                ),
                array(
                    'name'  => 'Glassblower',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/glassblowing_l.png',
                    'text'  => 'True masters of their art create sparkling pieces at the glassblower`s house. The blow tubes, glass and all sorts of other apparatuses are only understood by our scientists. And they are so nimble, that barely anything ever gets broken. Every level of expansion increases your production of crystal glass by 2%'
                ),
                array(
                    'name'  => 'Alchemist`s Tower',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/alchemist_l.png',
                    'text'  => 'When the wind blows west, a smell fills the streets around the tower and many a citizen doesn`t leave the house without a peg on their nose. Our alchemists work restlessly on finding the perfect mixture and ensuring that we can get even more sulfur out of the pit. For every level of the building your sulfur production is increased by 2%'
                ),
                array(
                    'name'  => 'Winegrower',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/winegrower_l.png',
                    'text'  => 'A winegrower only chooses the most sunny hills of the surrounding area to cover them with the comforting green of the vines. That`s how the vineyards produce full fruits that make for a much better harvest. Every level of the winegrower`s expansion increases your wine production by 2%'
                ),
                array(
                    'name'  => 'Stonemason',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/stonemason_l.png',
                    'text'  => 'A trained stonemason always quarries the right blocks of marble with his strong arms. Thus less is broken and our builders always have the material they need. For every level of expansion this building increases the marble production by 2%'
                ),
                array(
                    'name'  => 'Trading Port',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/port_r.png',
                    'text'  => 'The port is your gateway to the world. You can hire trade ships and get them ready for long journeys here. You can also receive precious goods from far away places. Larger ports can load ships faster. You can build another port that increases your loading speed as soon as you have researched the Dry-Dock.'
                ),
                array(
                    'name'  => 'Palace',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/palace_l.png',
                    'text'  => 'The palace is an excellent place to lead your empire into the future! It also provides a gorgeous view onto the sea. Every expansion of your capital`s palace allows you to set up a further colony.'
                ),
                array(
                    'name'  => 'Governor`s Residence',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/palaceColony_l.png',
                    'text'  => 'A governor in your colony guarantees, that all the daily administrative tasks are done properly. He also lowers the level of corruption in your colony. The governor`s residence can also be upgraded to a palace if you ever want to move your capital.'
                ),
                array(
                    'name'  => 'Town Wall',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/buildings/y100/wall.png',
                    'text'  => 'The town wall protects your citizens against your enemies and the sun. Beware! Enemies will try to tear holes into your wall or to climb over it. Every level increases the resistance of your town wall.'
                ),
                /*array(
                    'name'  => 'Embassy',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/embassy_l.png',
                    'text'  => 'The embassy is a busy place: diplomats from all over the world negotiate contracts here, forge treaties and found alliances. In order to get a larger alliance you need to upgrade your embassy. Every expansion level of your embassy increases your diplomacy points.'
                ),
                array(
                    'name'  => 'Hideout',
                    'image' => 'https://s35-us.ikariam.gameforge.com/skin/img/city/safehouse_l.png',
                    'text'  => 'A wise leader always has an eye on both his allies and his enemies. The hideout allows you to hire spies who are able to provide you with information from the inside of other towns. A larger hideout provides space for more spies.'
                )*/
            )
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('building');
        Schema::enableForeignKeyConstraints();
    }
}
