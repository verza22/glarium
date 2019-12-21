<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateResearchTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('research', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('research_category_id');
            $table->integer('level');
            $table->integer('cost');
            $table->string('name');
            $table->text('text');

            $table->foreign('research_category_id')->references('id')->on('research_category');
        });

        DB::table('research')->insert(
            array(
                array(
                    'research_category_id'  => 1,
                    'level' => 1,
                    'cost'  => 8,
                    'name'  => 'Carpentry',
                    'text'  => 'Our islands forests provide us with excellent building material so that we can create strong woodwork for the roofs of our buildings. But to ensure that this is the case, lumber must be carefully selected and handled properly! A carpenter in our town would take care of this and would use up a lot less building material!'
                ),
                array(
                    'research_category_id'  => 2,
                    'level' => 1,
                    'cost'  => 12,
                    'name'  => 'Conservation',
                    'text'  => 'We have learned how to store and protect our resources in the long term from wind and weather. Additionally a part of our resources is safe from pirates and other villains, who might want to steal from us!'
                ),
                array(
                    'research_category_id'  => 2,
                    'level' => 2,
                    'cost'  => 24,
                    'name'  => 'Pulley',
                    'text'  => 'A brilliant idea: A rope that is pulled over a roll gives a simple man the strength of Hercules. So now our workers can lift up huge blocks of stone on their own and construct our buildings even faster!'
                ),
                array(
                    'research_category_id'  => 2,
                    'level' => 3,
                    'cost'  => 56,
                    'name'  => 'Wealth',
                    'text'  => 'The earth is full of valuable treasures! We have learned how to mine sulphur and crystal and how to chisel marble off rocks. We are also growing wonderful vines on the fertile land on our hills which produce delicious wine! A new era of prosperity will dawn on us when we start using these treasures. We can then sell goods at a trading post and buy what we need from foreign traders.'
                ),
                array(
                    'research_category_id'  => 2,
                    'level' => 4,
                    'cost'  => 220,
                    'name'  => 'Wine culture',
                    'text'  => 'A happy population needs festivals in which they can spend hours revelling and drinking our fantastic free-flowing wine. Dionysus loves seeing us enjoying what he has given us!'
                ),
                array(
                    'research_category_id'  => 2,
                    'level' => 5,
                    'cost'  => 990,
                    'name'  => 'Improved resource gathering',
                    'text'  => 'Some time has passed since we learned how to use the treasures of our island for our own needs. We should now educate our workers and let every forest, quarry or vineyard, every sulphur pit or crystal mine be administered by men who are not only strong but also skilful. This way we will gather even more income and our civilization will get richer than ever!'
                ),
                array(
                    'research_category_id'  => 2,
                    'level' => 6,
                    'cost'  => 2236,
                    'name'  => 'Geometry',
                    'text'  => 'Right angles, triangles, circles – a few bright minds can calculate how we can construct our buildings even better and more beautifully. And soon our towns will serve as examples to the whole world!'
                ),
                array(
                    'research_category_id'  => 2,
                    'level' => 7,
                    'cost'  => 3672,
                    'name'  => 'Architecture',
                    'text'  => 'A good house can withstand the harshest elements. It can withstand them even better when a clever mind takes care of it with a lot of drawings and a little mathematics before hand, so that all the walls are straight and the roof is tight. Thanks to angles and compasses our buildings will be much more stable and well protected from the rain. An architects office would spare us a lot of marble, just think about the savings we could make in constructing a new building!'
                ),
                array(
                    'research_category_id'  => 2,
                    'level' => 8,
                    'cost'  => 7200,
                    'name'  => 'Holiday',
                    'text'  => 'A worker who has had a good rest is much more eager to work than an exhausted one. Thats why every citizen should have one day off per week. This will make all our citizens happier!'
                ),
                array(
                    'research_category_id'  => 2,
                    'level' => 9,
                    'cost'  => 25632,
                    'name'  => 'Spirit Level',
                    'text'  => 'Water is always even. We should use this knowledge so that our buildings become even, too! Our town will become even more beautiful and we will use less stone and wood for constructing our buildings!'
                ),
                array(
                    'research_category_id'  => 2,
                    'level' => 10,
                    'cost'  => 48000,
                    'name'  => 'Wine Press',
                    'text'  => 'What an event those annual wine fêtes are! The whole town is there when the best grapes in town are stomped into wine and when the liquid gold splashes around, the kids have the most fun! With a wine press though, handled by an experienced winemaker, we would lose much less. The winemaker could also organise proper storage that allows us to let the wine age and mature well!'
                ),
                array(
                    'research_category_id'  => 3,
                    'level' => 1,
                    'cost'  => 24,
                    'name'  => 'Well Digging',
                    'text'  => 'Eureka! A well in our settlement! Now we dont have to wait for it to rain all the time. Our citizens will be much better off and the fields wont have to stay dry for very long!'
                ),
                array(
                    'research_category_id'  => 3,
                    'level' => 2,
                    'cost'  => 24,
                    'name'  => 'Paper',
                    'text'  => 'We have found a better way to archive our knowledge! Now we have scriptures made from the papyrus plant, so we don`t have to chisel our words into the heavy stones anymore in order to fill our library!'
                ),
                array(
                    'research_category_id'  => 3,
                    'level' => 3,
                    'cost'  => 2652,
                    'name'  => 'Ink',
                    'text'  => 'Nature gives us everything we need to write: The birds give us their feathers and eight-armed fish out of the sea provide us with their black ink! Now we can write down our ideas even more easily!'
                ),
                array(
                    'research_category_id'  => 3,
                    'level' => 4,
                    'cost'  => 21360,
                    'name'  => 'Optics',
                    'text'  => 'When our scientists invent new things, many a glass can break. Or it gets lost in the infinite vastness of our laboratories, as keeping them tidy isnt really the primal virtue of the academy. If an optician would take care of not only the quality, but also that all the lenses and glasses are put back where they belong, we would use far less crystal glass!'
                ),
                array(
                    'research_category_id'  => 3,
                    'level' => 5,
                    'cost'  => 31968,
                    'name'  => 'Mechanical Pen',
                    'text'  => 'A brilliant little apparatus: A smart inventor has managed to teach writing to a machine. Now we can copy our scriptures easily and our academies can quickly exchange their ideas with each other!'
                ),
                array(
                    'research_category_id'  => 3,
                    'level' => 6,
                    'cost'  => 144720,
                    'name'  => 'Letter Chute',
                    'text'  => 'A marvel: We can now shoot scrolls through pipes, so that they reach our scientists even faster! This saves us long errands and we have to pay less gold for our scientists!'
                ),
                array(
                    'research_category_id'  => 4,
                    'level' => 1,
                    'cost'  => 24,
                    'name'  => 'Maps',
                    'text'  => 'These long marches over the hills and through the swamps mean that our material will wear out very fast. If we write down, how our soldiers can travel over land without always getting stuck in the undergrowth or sinking into the mud, the soldiers will have to mend their uniforms a lot less often.'
                ),
                array(
                    'research_category_id'  => 4,
                    'level' => 2,
                    'cost'  => 336,
                    'name'  => 'Professional Army',
                    'text'  => 'Chasing away pirates, barbarians and other villains will be much easier with some professional soldiers! It might be more expensive than just making our citizens into soldiers in the event of war, but in exchange our troops will be able to handle sword, spear and shield much better!'
                ),
                array(
                    'research_category_id'  => 4,
                    'level' => 3,
                    'cost'  => 1032,
                    'name'  => 'Siege',
                    'text'  => 'With a rams head made of metal and the strength of ten men we can even tear down town walls. Now it will be easy for our soldiers to conquer other towns!'
                ),
                array(
                    'research_category_id'  => 4,
                    'level' => 4,
                    'cost'  => 2236,
                    'name'  => 'Code of Honor',
                    'text'  => 'Our soldiers are proud of serving their unit and their island kingdom. They are even taking better care of their uniforms, so that we dont have to mend and repair them as often.'
                ),
                array(
                    'research_category_id'  => 4,
                    'level' => 5,
                    'cost'  => 3264,
                    'name'  => 'Ballistics',
                    'text'  => 'Now we know how to shoot arrows at our enemies. We should start right now to train our soldiers with these skills, so we can have archers joining our army in battle soon!'
                ),
                array(
                    'research_category_id'  => 4,
                    'level' => 6,
                    'cost'  => 7020,
                    'name'  => 'Law of the Lever',
                    'text'  => 'With this technology we can unleash powers that can even let huge rocks fly through the air! And if the rocks are large enough, they can even tear down town walls!'
                ),
                array(
                    'research_category_id'  => 4,
                    'level' => 7,
                    'cost'  => 7020,
                    'name'  => 'Pyrotechnics',
                    'text'  => 'Sulphur is a really is a work of the devil! And with every new mixture, we can get even more impact from this precious resource. A safe practice ground would allow our blasters to test their inventions, without including the surrounding buildings as involuntary targets into their experiments.'
                ),
                array(
                    'research_category_id'  => 4,
                    'level' => 8,
                    'cost'  => 25632,
                    'name'  => 'Logistics',
                    'text'  => 'Our soldiers can fight much better if they dont have to drag that much. And their equipment will last much longer on the long marches, so we wont have to mend it that often.'
                ),
                array(
                    'research_category_id'  => 4,
                    'level' => 9,
                    'cost'  => 38400,
                    'name'  => 'Gunpowder',
                    'text'  => 'This black mixture from the alchemists kitchen can spark a fire with a loud bang and do truly devilish things! Now we can fill iron pipes with this powder to shoot heavy cannon balls through the air.'
                ),
                array(
                    'research_category_id'  => 4,
                    'level' => 10,
                    'cost'  => 106560,
                    'name'  => 'Robotics',
                    'text'  => 'Our scientists have built a mechanical giant with muscles made of metal and a steaming heart! Only the keenest and most skilled soldiers can steer such a colossus, but it will strike fear into everyone on the battlefield!'
                ),
                array(
                    'research_category_id'  => 4,
                    'level' => 11,
                    'cost'  => 209040,
                    'name'  => 'Cannon Casting',
                    'text'  => 'Our iron is getting heavier and harder: now we can even build barrels through which we can fire huge cannon balls at our enemies! If we can even fire bombs from a long distance our enemies and their town walls will tremble in fear!'
                ),
                array(
                    'research_category_id'  => 1,
                    'level' => 2,
                    'cost'  => 336,
                    'name'  => 'Expansion',
                    'text'  => 'There is a lot more than just an ocean out there! More islands await being discovered. We are not alone! We can gain ground on one of the newly discovered islands, tap new resources and get to know other nations! Our clerks are eager to administer even more, our traders ready to travel to new lands!'
                )
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
        Schema::dropIfExists('research');
        Schema::enableForeignKeyConstraints();
    }
}
